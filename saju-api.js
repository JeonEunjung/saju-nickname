// 한국천문연구원 API 호출 클래스 (서버 프록시 사용)
class KASIAPIClient {
    constructor() {
        // 프록시 서버를 통해 API 호출 - API 키는 서버에서 관리
        this.proxyURL = '/api/saju';
    }

    // 양력 날짜로 음력 및 간지 정보 조회 (프록시 서버 사용)
    async getSolarToLunar(year, month, day) {
        const params = new URLSearchParams({
            year: year,
            month: String(month).padStart(2, '0'),
            day: String(day).padStart(2, '0')
        });

        try {
            const response = await fetch(`${this.proxyURL}?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API 응답 데이터:', data);

            // API 응답 구조 확인
            if (data.response && data.response.body && data.response.body.items) {
                const item = data.response.body.items.item;
                // 배열인 경우 첫 번째 항목 반환
                return Array.isArray(item) ? item[0] : item;
            }
            throw new Error('API 응답 형식이 올바르지 않습니다.');
        } catch (error) {
            console.error('KASI API 호출 오류:', error);
            throw error;
        }
    }

    // 간지 문자열 파싱 (예: "갑자(甲子)" 또는 "갑자" -> {stem: "갑", branch: "자"})
    parseGanji(ganjiStr) {
        if (!ganjiStr) {
            return { stem: '', branch: '' };
        }

        // 괄호가 있으면 제거 (예: "계묘(癸卯)" -> "계묘")
        const cleanStr = ganjiStr.split('(')[0].trim();

        if (cleanStr.length < 2) {
            return { stem: '', branch: '' };
        }

        return {
            stem: cleanStr[0],
            branch: cleanStr[1]
        };
    }
}

// 개선된 사주 계산기 (API 기반)
class SajuCalculatorAPI extends SajuCalculator {
    constructor(year, month, day, hour) {
        super(year, month, day, hour);
        this.apiClient = new KASIAPIClient(); // API 키는 서버에서 관리
    }

    // API를 사용한 사주 계산
    async calculateSajuWithAPI() {
        try {
            // API로 음력 및 간지 정보 가져오기
            const lunarData = await this.apiClient.getSolarToLunar(this.year, this.month, this.day);

            // 년주 - API에서 세차(년간지) 가져오기
            const yearGanji = this.apiClient.parseGanji(lunarData.lunSecha);
            const yearPillar = {
                stem: yearGanji.stem,
                branch: yearGanji.branch,
                element: FIVE_ELEMENTS[yearGanji.stem]
            };

            // 월주 - API에서 월간지 가져오기
            const monthGanji = this.apiClient.parseGanji(lunarData.lunWolgeon);
            const monthPillar = {
                stem: monthGanji.stem,
                branch: monthGanji.branch,
                element: FIVE_ELEMENTS[monthGanji.stem]
            };

            // 일주 - API에서 일진(일간지) 가져오기
            const dayGanji = this.apiClient.parseGanji(lunarData.lunIljin);
            const dayPillar = {
                stem: dayGanji.stem,
                branch: dayGanji.branch,
                element: FIVE_ELEMENTS[dayGanji.stem]
            };

            // 시주 - 기존 계산 방식 사용 (API에서 제공하지 않음)
            const hourPillar = this.calculateHourPillarFromDay(dayGanji.stem);

            return {
                year: yearPillar,
                month: monthPillar,
                day: dayPillar,
                hour: hourPillar,
                dayMaster: dayPillar.stem,
                lunarDate: {
                    year: lunarData.lunYear,
                    month: lunarData.lunMonth,
                    day: lunarData.lunDay,
                    isLeapMonth: lunarData.lunLeapmonth === '윤'
                }
            };
        } catch (error) {
            console.error('API를 사용한 사주 계산 실패, 기본 계산으로 전환:', error);
            // API 실패 시 기존 계산 방식으로 폴백
            return this.calculateSaju();
        }
    }

    // 일간을 기준으로 시주 계산
    calculateHourPillarFromDay(dayStem) {
        const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);
        const hourStemBase = dayStemIndex * 2;
        const stemIndex = (hourStemBase + this.hour) % 10;

        return {
            stem: HEAVENLY_STEMS[stemIndex],
            branch: EARTHLY_BRANCHES[this.hour],
            element: FIVE_ELEMENTS[HEAVENLY_STEMS[stemIndex]]
        };
    }
}
