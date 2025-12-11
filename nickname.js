// 부캐명 생성기
class NicknameGenerator {
    constructor(saju, elementAnalysis, characteristics) {
        this.saju = saju;
        this.elementAnalysis = elementAnalysis;
        this.characteristics = characteristics;
        this.dayMaster = saju.dayMaster;
        this.dayElement = FIVE_ELEMENTS[this.dayMaster];
    }

    // 오행별 키워드
    getElementKeywords(element) {
        const keywords = {
            '목': {
                positive: ['푸른', '생명', '성장', '봄빛', '신록', '청춘', '나무', '숲', '새싹', '가지'],
                traits: ['창의적', '발전하는', '유연한', '성장하는', '생동감있는'],
                colors: ['초록', '청록', '연두'],
                nature: ['나무', '꽃', '잎', '숲', '정원', '가지', '뿌리', '새싹'],
                abstract: ['봄', '아침', '동쪽', '바람', '희망']
            },
            '화': {
                positive: ['불꽃', '태양', '여름', '열정', '빛나는', '찬란한', '화려한', '붉은', '밝은'],
                traits: ['열정적', '활발한', '표현력있는', '적극적', '빛나는'],
                colors: ['빨강', '주황', '금빛'],
                nature: ['해', '불', '별', '번개', '용'],
                abstract: ['여름', '정오', '남쪽', '빛', '에너지']
            },
            '토': {
                positive: ['대지', '황금', '중심', '신뢰', '안정', '포근한', '든든한', '넉넉한'],
                traits: ['안정적', '신뢰할수있는', '포용력있는', '중재하는', '든든한'],
                colors: ['황금', '갈색', '베이지'],
                nature: ['산', '들판', '흙', '바위', '대지'],
                abstract: ['환절기', '중심', '중앙', '평화', '조화']
            },
            '금': {
                positive: ['은빛', '강철', '날카로운', '빛나는', '귀한', '정교한', '예리한'],
                traits: ['결단력있는', '강인한', '원칙적인', '정확한', '날카로운'],
                colors: ['은빛', '백금', '회색'],
                nature: ['금속', '보석', '검', '방패', '거울'],
                abstract: ['가을', '저녁', '서쪽', '바람', '정의']
            },
            '수': {
                positive: ['물결', '바다', '지혜', '흐르는', '깊은', '맑은', '넓은', '투명한'],
                traits: ['지혜로운', '사려깊은', '적응력있는', '유연한', '깊이있는'],
                colors: ['푸른', '남색', '검은'],
                nature: ['물', '바다', '강', '호수', '구름', '빗물'],
                abstract: ['겨울', '밤', '북쪽', '달', '지혜']
            }
        };
        return keywords[element] || keywords['목'];
    }

    // 일간별 특성 키워드
    getDayMasterKeywords(dayMaster) {
        const masterKeywords = {
            '갑': ['거목', '대장', '선구자', '개척자', '리더', '큰나무', '숲의왕'],
            '을': ['화초', '섬세한', '부드러운', '우아한', '배려자', '예술가', '치유자'],
            '병': ['태양', '빛', '열정왕', '밝은빛', '에너지', '스타', '불꽃'],
            '정': ['촛불', '예술', '섬세한빛', '달빛', '따뜻한', '창작자', '감성가'],
            '무': ['산', '대지', '신뢰자', '포용자', '든든한', '중심', '바위'],
            '기': ['밭', '헌신자', '실용가', '세심한', '온화한', '정성', '수확'],
            '경': ['강철', '검', '의협심', '정의', '결단자', '전사', '수호자'],
            '신': ['보석', '예술', '완벽주의자', '품격', '세련된', '진주', '다이아'],
            '임': ['바다', '지혜자', '철학자', '포용', '깊은물', '현자', '대해'],
            '계': ['빗물', '순수', '감성', '직관자', '맑은물', '이슬', '영감']
        };
        return masterKeywords[dayMaster] || ['신비로운'];
    }

    // 부족한 오행을 보완하는 키워드
    getComplementaryKeywords(element) {
        return this.getElementKeywords(element);
    }

    // 메인 부캐명 생성 (특성 강조형)
    generateMainNickname() {
        const dayKeywords = this.getDayMasterKeywords(this.dayMaster);
        const elementKeywords = this.getElementKeywords(this.dayElement);

        const templates = [
            `${this.pickRandom(elementKeywords.positive)}${this.pickRandom(dayKeywords)}`,
            `${this.pickRandom(elementKeywords.traits)}${this.pickRandom(elementKeywords.nature)}`,
            `${this.pickRandom(elementKeywords.colors)}${this.pickRandom(dayKeywords)}`,
            `${this.pickRandom(dayKeywords)}의${this.pickRandom(elementKeywords.abstract)}`
        ];

        return this.pickRandom(templates);
    }

    // 보완형 부캐명 생성 (부족한 오행 보완)
    generateComplementaryNickname() {
        const weakElement = this.elementAnalysis.weakest;
        const weakKeywords = this.getComplementaryKeywords(weakElement);

        const templates = [
            `${this.pickRandom(weakKeywords.positive)}${this.pickRandom(weakKeywords.nature)}`,
            `${this.pickRandom(weakKeywords.colors)}${this.pickRandom(weakKeywords.abstract)}`,
            `${this.pickRandom(weakKeywords.traits)}${this.dayMaster}`
        ];

        return this.pickRandom(templates);
    }

    // 조화형 부캐명 생성
    generateHarmoniousNickname() {
        const strongElement = this.elementAnalysis.strongest;
        const strongKeywords = this.getElementKeywords(strongElement);
        const dayKeywords = this.getDayMasterKeywords(this.dayMaster);

        return `${this.pickRandom(strongKeywords.nature)}과${this.pickRandom(dayKeywords)}`;
    }

    // 랜덤 선택 헬퍼
    pickRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 부캐명 설명 생성
    generateDescription(nickname, type) {
        const descriptions = {
            'main': `당신의 사주에서 가장 두드러진 ${this.dayMaster}(${ELEMENT_PROPERTIES[this.dayElement].name})의 특성을 잘 표현한 부캐명입니다. ${ELEMENT_PROPERTIES[this.dayElement].trait}을 나타냅니다.`,
            'complementary': `부족한 ${ELEMENT_PROPERTIES[this.elementAnalysis.weakest].name} 기운을 보완해주는 부캐명입니다. 이 부캐명을 사용하면 ${ELEMENT_PROPERTIES[this.elementAnalysis.weakest].trait}을 기를 수 있습니다.`,
            'harmonious': `당신의 강한 ${ELEMENT_PROPERTIES[this.elementAnalysis.strongest].name} 기운과 본래의 성향이 조화를 이룬 부캐명입니다. 가장 자연스럽고 편안한 이름입니다.`
        };
        return descriptions[type] || descriptions['main'];
    }

    // 전체 부캐명 패키지 생성
    generateNicknamePackage() {
        const mainNickname = this.generateMainNickname();
        const alternatives = [];

        // 특성 강조형 3개
        for (let i = 0; i < 2; i++) {
            const nickname = this.generateMainNickname();
            if (nickname !== mainNickname) {
                alternatives.push({
                    name: nickname,
                    type: '특성 강조형',
                    reason: `당신의 핵심 특성인 ${ELEMENT_PROPERTIES[this.dayElement].trait}을 표현합니다.`
                });
            }
        }

        // 보완형 2개
        for (let i = 0; i < 2; i++) {
            alternatives.push({
                name: this.generateComplementaryNickname(),
                type: '기운 보완형',
                reason: `부족한 ${ELEMENT_PROPERTIES[this.elementAnalysis.weakest].name} 기운을 보완하여 균형을 맞춥니다.`
            });
        }

        // 조화형 1개
        alternatives.push({
            name: this.generateHarmoniousNickname(),
            type: '조화형',
            reason: `당신의 강점과 본성이 자연스럽게 어우러진 이름입니다.`
        });

        return {
            main: {
                name: mainNickname,
                description: this.generateDescription(mainNickname, 'main')
            },
            alternatives: alternatives
        };
    }

    // 성별에 따른 부캐명 조정
    adjustForGender(nickname, gender) {
        if (gender === 'female') {
            const feminineEndings = ['양', '희', '미', '빛', '별', '꽃'];
            const lastChar = nickname.slice(-1);
            if (!feminineEndings.includes(lastChar) && Math.random() > 0.5) {
                return nickname + this.pickRandom(['빛', '별', '']);
            }
        } else if (gender === 'male') {
            const masculineEndings = ['왕', '검', '룡', '호'];
            if (Math.random() > 0.7) {
                return nickname + this.pickRandom(['', '', '']); // 대부분 그대로
            }
        }
        return nickname;
    }

    // 최종 부캐명 생성 (성별 고려)
    generate(gender) {
        let nicknamePackage = this.generateNicknamePackage();

        // 성별에 따라 조정
        nicknamePackage.main.name = this.adjustForGender(nicknamePackage.main.name, gender);
        nicknamePackage.alternatives = nicknamePackage.alternatives.map(alt => ({
            ...alt,
            name: this.adjustForGender(alt.name, gender)
        }));

        return nicknamePackage;
    }
}

// 부캐명 추가 옵션 생성기
class NicknameVariationGenerator {
    static addPrefix(nickname) {
        const prefixes = ['빛나는', '신비로운', '전설의', '영원한', '찬란한', '위대한'];
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${nickname}`;
    }

    static addSuffix(nickname) {
        const suffixes = ['님', '왕', '마스터', '전문가', '달인'];
        return `${nickname}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }

    static toEnglishStyle(nickname, element) {
        const elementEnglish = {
            '목': 'Wood',
            '화': 'Fire',
            '토': 'Earth',
            '금': 'Metal',
            '수': 'Water'
        };
        return `${elementEnglish[element]}${nickname}`;
    }
}
