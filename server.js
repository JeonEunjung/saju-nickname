require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정 - 특정 도메인만 허용 (프로덕션에서는 실제 도메인으로 변경)
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',  // Vite 개발 서버
    'https://saju-nickname.vercel.app',
    'https://*.vercel.app'  // Vercel preview 배포
];

app.use(cors({
    origin: function(origin, callback) {
        // origin이 없는 경우(같은 도메인) 또는 허용 목록에 있는 경우 허용
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

app.use(express.json({ limit: '10kb' })); // JSON 페이로드 크기 제한

// Rate Limiting - API 남용 방지
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1분
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10, // 1분당 최대 10회
    message: {
        error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
        retryAfter: '1분'
    },
    standardHeaders: true, // RateLimit-* 헤더 반환
    legacyHeaders: false, // X-RateLimit-* 헤더 비활성화
    // IP 기반 + User Agent 기반 제한
    keyGenerator: (req) => {
        return `${req.ip}_${req.get('User-Agent')}`;
    }
});

// 전역 Rate Limiting (더 관대한 제한)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 15분당 최대 100회
    message: {
        error: '너무 많은 요청이 감지되었습니다. 15분 후 다시 시도해주세요.'
    }
});

app.use(generalLimiter);

// 글로벌 API 호출 카운터 (메모리 기반 - 프로덕션에서는 Redis 사용 권장)
let globalApiCallCount = 0;
let globalCounterResetTime = Date.now() + 60000; // 1분마다 리셋

// 글로벌 쿼터 체크 미들웨어
const globalQuotaCheck = (req, res, next) => {
    const now = Date.now();

    // 1분 경과 시 카운터 리셋
    if (now > globalCounterResetTime) {
        globalApiCallCount = 0;
        globalCounterResetTime = now + 60000;
    }

    // 1분당 최대 50회 글로벌 제한 (모든 IP 합산)
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

// 간단한 메모리 캐시 (프로덕션에서는 Redis 사용 권장)
const apiCache = new Map();
const CACHE_TTL = 3600000; // 1시간

// 정적 파일 제공
app.use(express.static(__dirname));

// API 프록시 엔드포인트 - Rate Limiting + Global Quota + Caching 적용
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
        // 캐시 히트 - 헤더 추가
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

            // 캐시 크기 제한 (최대 1000개 항목)
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

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 사주 부캐명 서버가 http://localhost:${PORT} 에서 실행 중입니다!`);
});
