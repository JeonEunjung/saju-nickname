# Vercel 환경변수 설정 가이드

## 🔐 보안 중요 사항
API 키가 GitHub에 노출되지 않도록 Vercel에서 환경변수를 직접 설정해야 합니다.

## 📋 설정 방법

### 1. Vercel 대시보드 접속
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. `saju-nickname` 프로젝트 선택

### 2. 환경변수 추가
1. **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 선택
3. 다음 환경변수들을 추가:

#### 필수 환경변수

| Name | Value | Environment | 설명 |
|------|-------|-------------|------|
| `KASI_API_KEY` | `015d8edde7d39a3d92155a2da9ded3b775c57bd46f573188cad317905292f5ca` | Production, Preview, Development | 한국천문연구원 API 키 |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Production, Preview, Development | Rate Limit 시간 윈도우 (1분) |
| `RATE_LIMIT_MAX_REQUESTS` | `10` | Production, Preview, Development | IP당 1분 최대 요청 수 |
| `GLOBAL_API_LIMIT` | `50` | Production, Preview, Development | 전체 서버 1분당 최대 API 호출 |

### 3. 환경변수 입력 상세

각 환경변수를 추가할 때:

1. **Name** 필드에 변수명 입력 (예: `KASI_API_KEY`)
2. **Value** 필드에 값 입력
3. **Environment** 선택:
   - ✅ Production (필수)
   - ✅ Preview (권장)
   - ✅ Development (권장)
4. **Add** 버튼 클릭

### 4. 재배포

환경변수 설정 후:
1. **Deployments** 탭으로 이동
2. 최신 배포를 찾아 **⋯** (메뉴) 클릭
3. **Redeploy** 선택
4. 환경변수가 적용된 새 배포 완료 대기

## ✅ 설정 확인

배포 완료 후 브라우저 콘솔에서 확인:
- API 호출이 정상 작동하는지 확인
- Rate limiting이 작동하는지 확인 (1분에 10회 이상 요청 시 제한 메시지 확인)

## 🚨 주의사항

1. **절대 GitHub에 .env 파일을 커밋하지 마세요**
   - `.gitignore`에 `.env`가 포함되어 있는지 확인

2. **API 키 노출 시 즉시 재발급**
   - 한국천문연구원 공공데이터포털에서 키 재발급

3. **Rate Limiting 설정**
   - 기본: 1분당 10회, 15분당 100회
   - 필요시 `RATE_LIMIT_MAX_REQUESTS` 값 조정 가능

## 🔄 환경변수 업데이트

환경변수 값을 변경해야 할 경우:
1. Vercel Dashboard > Settings > Environment Variables
2. 해당 변수의 **Edit** 버튼 클릭
3. 새 값 입력 후 저장
4. 재배포 실행
