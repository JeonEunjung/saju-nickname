require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');

const app = express();

// CORS 설정 - 특정 도메인만 허용
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://saju-nickname.vercel.app',
    'https://*.vercel.app'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.some(allowed => {
            if (allowed.includes('*')) {
                const regex = new RegExp(allowed.replace('*', '.*'));
                return regex.test(origin);
            }
            return allowed === origin;
        })) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy: 허용되지 않은 도메인입니다.'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '10kb' }));

// Rate Limiting - API 남용 방지
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
    message: {
        error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
        retryAfter: '1분'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return `${req.ip}_${req.get('User-Agent')}`;
    }
});

// 전역 Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: '너무 많은 요청이 감지되었습니다. 15분 후 다시 시도해주세요.'
    }
});

app.use(generalLimiter);

// 글로벌 API 호출 카운터 (Vercel 서버리스 환경에서는 제한적)
let globalApiCallCount = 0;
let globalCounterResetTime = Date.now() + 60000;

const globalQuotaCheck = (req, res, next) => {
    const now = Date.now();
    if (now > globalCounterResetTime) {
        globalApiCallCount = 0;
        globalCounterResetTime = now + 60000;
    }

    const GLOBAL_MAX_PER_MINUTE = parseInt(process.env.GLOBAL_API_LIMIT) || 50;
    if (globalApiCallCount >= GLOBAL_MAX_PER_MINUTE) {
        return res.status(429).json({
            error: '서버가 현재 과부하 상태입니다. 잠시 후 다시 시도해주세요.',
            retryAfter: Math.ceil((globalCounterResetTime - now) / 1000)
        });
    }

    globalApiCallCount++;
    next();
};

// 메모리 캐시 (Vercel 서버리스에서는 콜드 스타트마다 리셋됨)
const apiCache = new Map();
const CACHE_TTL = 3600000; // 1시간

// API 프록시 엔드포인트 - 모든 보안 조치 적용
app.get('/api/saju', apiLimiter, globalQuotaCheck, async (req, res) => {
    const { year, month, day } = req.query;

    // 입력 유효성 검사
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);

    if (!year || !month || !day ||
        isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum) ||
        yearNum < 1900 || yearNum > 2100 ||
        monthNum < 1 || monthNum > 12 ||
        dayNum < 1 || dayNum > 31) {
        return res.status(400).json({
            error: '올바른 날짜를 입력해주세요.'
        });
    }

    // 캐시 키 생성
    const cacheKey = `${year}-${month}-${day}`;

    // 캐시 확인
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        res.set('X-Cache', 'HIT');
        return res.json(cached.data);
    }

    // 환경변수에서 API 키 로드
    const API_KEY = process.env.KASI_API_KEY;

    if (!API_KEY) {
        console.error('❌ KASI_API_KEY가 설정되지 않았습니다.');
        return res.status(500).json({
            error: '서버 설정 오류입니다. 관리자에게 문의하세요.'
        });
    }

    try {
        const url = `http://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo?serviceKey=${API_KEY}&solYear=${year}&solMonth=${month}&solDay=${day}&_type=json`;

        const response = await fetch(url);
        const text = await response.text();

        // XML 또는 JSON 응답 처리
        try {
            const data = JSON.parse(text);

            // 캐시에 저장
            apiCache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            // 캐시 크기 제한
            if (apiCache.size > 1000) {
                const firstKey = apiCache.keys().next().value;
                apiCache.delete(firstKey);
            }

            res.set('X-Cache', 'MISS');
            res.json(data);
        } catch (e) {
            // XML 응답인 경우
            res.set('Content-Type', 'application/xml');
            res.send(text);
        }
    } catch (error) {
        console.error('API 프록시 오류:', error);
        res.status(500).json({ error: '사주 정보를 가져오는데 실패했습니다.' });
    }
});

module.exports = app;
