require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 허용
app.use(cors());
app.use(express.json());

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

// 정적 파일 제공
app.use(express.static(__dirname));

// API 프록시 엔드포인트 - Rate Limiting 적용
app.get('/api/saju', apiLimiter, async (req, res) => {
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

        // 보안: 로그 비활성화 (원하면 주석 해제)
        // console.log('API 호출:', url);

        const response = await fetch(url);
        const text = await response.text();

        // console.log('API 응답:', text);

        // XML 또는 JSON 응답 처리
        try {
            const data = JSON.parse(text);
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
