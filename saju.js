// 천간 (天干)
const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

// 지지 (地支)
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 오행 (五行)
const FIVE_ELEMENTS = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수',
    '자': '수', '축': '토', '인': '목', '묘': '목',
    '진': '토', '사': '화', '오': '화', '미': '토',
    '신': '금', '유': '금', '술': '토', '해': '수'
};

// 십신 (十神) - 일간 기준 다른 천간과의 관계
const TEN_GODS = {
    '같은오행': '비견',
    '생하는오행': '식신',
    '생성되는오행': '정인',
    '극하는오행': '정관',
    '극당하는오행': '정재'
};

// 오행 속성
const ELEMENT_PROPERTIES = {
    '목': {
        name: '木 (나무)',
        color: 'element-wood',
        trait: '성장과 발전, 창의성, 유연성',
        strength: '봄',
        weakness: '가을'
    },
    '화': {
        name: '火 (불)',
        color: 'element-fire',
        trait: '열정과 활력, 표현력, 적극성',
        strength: '여름',
        weakness: '겨울'
    },
    '토': {
        name: '土 (흙)',
        color: 'element-earth',
        trait: '안정과 신뢰, 포용력, 중재능력',
        strength: '환절기',
        weakness: '봄'
    },
    '금': {
        name: '金 (쇠)',
        color: 'element-metal',
        trait: '결단력과 의지, 원칙, 정확성',
        strength: '가을',
        weakness: '여름'
    },
    '수': {
        name: '水 (물)',
        color: 'element-water',
        trait: '지혜와 사고력, 적응력, 유연성',
        strength: '겨울',
        weakness: '봄'
    }
};

class SajuCalculator {
    constructor(year, month, day, hour) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
    }

    // 년주 계산
    calculateYearPillar() {
        const offset = 4; // 서기 4년이 갑자년
        const yearIndex = (this.year - offset) % 60;
        const stemIndex = yearIndex % 10;
        const branchIndex = yearIndex % 12;

        return {
            stem: HEAVENLY_STEMS[stemIndex],
            branch: EARTHLY_BRANCHES[branchIndex],
            element: FIVE_ELEMENTS[HEAVENLY_STEMS[stemIndex]]
        };
    }

    // 월주 계산 (간단화된 버전)
    calculateMonthPillar() {
        const yearStemIndex = (this.year - 4) % 10;
        const monthStemBase = yearStemIndex * 2 + 2;
        const monthIndex = this.month - 1;
        const stemIndex = (monthStemBase + monthIndex) % 10;
        const branchIndex = (monthIndex + 2) % 12;

        return {
            stem: HEAVENLY_STEMS[stemIndex],
            branch: EARTHLY_BRANCHES[branchIndex],
            element: FIVE_ELEMENTS[HEAVENLY_STEMS[stemIndex]]
        };
    }

    // 일주 계산 (간단화된 버전)
    calculateDayPillar() {
        const baseDate = new Date(1900, 0, 1); // 기준일
        const targetDate = new Date(this.year, this.month - 1, this.day);
        const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

        // 1900년 1월 1일이 경인일
        const baseDayIndex = 26; // 경인
        const dayIndex = (baseDayIndex + diffDays) % 60;
        const stemIndex = dayIndex % 10;
        const branchIndex = dayIndex % 12;

        return {
            stem: HEAVENLY_STEMS[stemIndex],
            branch: EARTHLY_BRANCHES[branchIndex],
            element: FIVE_ELEMENTS[HEAVENLY_STEMS[stemIndex]]
        };
    }

    // 시주 계산
    calculateHourPillar() {
        const dayStemIndex = (this.year - 4) % 10;
        const hourStemBase = dayStemIndex * 2;
        const stemIndex = (hourStemBase + this.hour) % 10;

        return {
            stem: HEAVENLY_STEMS[stemIndex],
            branch: EARTHLY_BRANCHES[this.hour],
            element: FIVE_ELEMENTS[HEAVENLY_STEMS[stemIndex]]
        };
    }

    // 사주 전체 계산
    calculateSaju() {
        const yearPillar = this.calculateYearPillar();
        const monthPillar = this.calculateMonthPillar();
        const dayPillar = this.calculateDayPillar();
        const hourPillar = this.calculateHourPillar();

        return {
            year: yearPillar,
            month: monthPillar,
            day: dayPillar,
            hour: hourPillar,
            dayMaster: dayPillar.stem // 일간 (본인의 핵심)
        };
    }

    // 오행 분석
    analyzeElements(saju) {
        const elements = {
            '목': 0,
            '화': 0,
            '토': 0,
            '금': 0,
            '수': 0
        };

        // 천간 오행
        elements[saju.year.element] += 1.5;
        elements[saju.month.element] += 1.5;
        elements[saju.day.element] += 2; // 일간은 가중치 높게
        elements[saju.hour.element] += 1.5;

        // 지지 오행
        elements[FIVE_ELEMENTS[saju.year.branch]] += 1;
        elements[FIVE_ELEMENTS[saju.month.branch]] += 1;
        elements[FIVE_ELEMENTS[saju.day.branch]] += 1;
        elements[FIVE_ELEMENTS[saju.hour.branch]] += 1;

        return elements;
    }

    // 강한 오행 찾기
    findStrongElements(elementCount) {
        const sorted = Object.entries(elementCount).sort((a, b) => b[1] - a[1]);
        return {
            strongest: sorted[0][0],
            weakest: sorted[sorted.length - 1][0],
            distribution: sorted
        };
    }

    // 오행 상생상극 관계
    getElementRelation(element1, element2) {
        const relations = {
            '목': { generates: '화', controls: '토', generatedBy: '수', controlledBy: '금' },
            '화': { generates: '토', controls: '금', generatedBy: '목', controlledBy: '수' },
            '토': { generates: '금', controls: '수', generatedBy: '화', controlledBy: '목' },
            '금': { generates: '수', controls: '목', generatedBy: '토', controlledBy: '화' },
            '수': { generates: '목', controls: '화', generatedBy: '금', controlledBy: '토' }
        };

        if (element1 === element2) return 'same';
        if (relations[element1].generates === element2) return 'generates';
        if (relations[element1].controls === element2) return 'controls';
        if (relations[element1].generatedBy === element2) return 'generatedBy';
        if (relations[element1].controlledBy === element2) return 'controlledBy';
        return 'neutral';
    }

    // 성격 및 특성 분석
    analyzeCharacteristics(saju, elementAnalysis) {
        const characteristics = [];
        const dayMaster = saju.dayMaster;
        const dayElement = FIVE_ELEMENTS[dayMaster];

        // 일간(본인) 기본 성격
        const dayMasterTraits = {
            '갑': '큰 나무처럼 곧고 정직하며, 리더십이 있고 개척정신이 강합니다.',
            '을': '화초처럼 섬세하고 부드러우며, 적응력이 좋고 배려심이 깊습니다.',
            '병': '태양처럼 밝고 열정적이며, 표현력이 풍부하고 사교적입니다.',
            '정': '촛불처럼 따뜻하고 차분하며, 예술적 감각과 세심함이 있습니다.',
            '무': '산처럼 든든하고 신뢰감이 있으며, 포용력과 인내심이 강합니다.',
            '기': '밭처럼 온화하고 헌신적이며, 실용적이고 꼼꼼합니다.',
            '경': '쇠처럼 강인하고 결단력이 있으며, 원칙적이고 정의로움을 추구합니다.',
            '신': '보석처럼 섬세하고 품격이 있으며, 미적 감각과 완벽주의 성향이 있습니다.',
            '임': '바다처럼 넓고 깊으며, 지혜롭고 포용력이 있습니다.',
            '계': '빗물처럼 순수하고 유연하며, 직관력과 감수성이 뛰어납니다.'
        };

        characteristics.push({
            title: '본인의 핵심 성향',
            description: `${dayMaster}(${ELEMENT_PROPERTIES[dayElement].name}) - ${dayMasterTraits[dayMaster]}`
        });

        // 오행 균형 분석
        const { strongest, weakest } = elementAnalysis;

        if (strongest !== dayElement) {
            characteristics.push({
                title: '강한 기운',
                description: `${ELEMENT_PROPERTIES[strongest].name} 기운이 강합니다. ${ELEMENT_PROPERTIES[strongest].trait}이 두드러집니다.`
            });
        }

        characteristics.push({
            title: '부족한 기운',
            description: `${ELEMENT_PROPERTIES[weakest].name} 기운이 부족합니다. ${ELEMENT_PROPERTIES[weakest].trait}을 보완하면 좋습니다.`
        });

        // 계절과의 관계
        const seasonalAnalysis = this.analyzeSeason(this.month, dayElement);
        if (seasonalAnalysis) {
            characteristics.push({
                title: '계절과의 조화',
                description: seasonalAnalysis
            });
        }

        return characteristics;
    }

    // 계절 분석
    analyzeSeason(month, element) {
        const seasons = {
            '봄': [3, 4, 5],
            '여름': [6, 7, 8],
            '가을': [9, 10, 11],
            '겨울': [12, 1, 2]
        };

        let currentSeason = '';
        for (const [season, months] of Object.entries(seasons)) {
            if (months.includes(month)) {
                currentSeason = season;
                break;
            }
        }

        const elementProps = ELEMENT_PROPERTIES[element];
        if (elementProps.strength === currentSeason) {
            return `${currentSeason}에 태어나 본인의 오행이 강한 시기입니다. 에너지가 넘치고 적극적입니다.`;
        } else if (elementProps.weakness === currentSeason) {
            return `${currentSeason}에 태어나 본인의 오행이 약한 시기입니다. 신중하고 내면의 성장을 중시합니다.`;
        }
        return `${currentSeason}에 태어나 균형잡힌 에너지를 가지고 있습니다.`;
    }
}
