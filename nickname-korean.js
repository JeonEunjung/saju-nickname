// 한국풍 부캐명 생성기 (영어 제거, 한자명 추가)
class KoreanNicknameGenerator {
    constructor(saju, elementAnalysis, characteristics, gender) {
        this.saju = saju;
        this.elementAnalysis = elementAnalysis;
        this.characteristics = characteristics;
        this.gender = gender;
        this.dayMaster = saju.dayMaster;
        this.dayElement = FIVE_ELEMENTS[this.dayMaster];
    }

    // 오행별 한국풍 키워드
    getKoreanKeywords(element) {
        const keywords = {
            '목': {
                adjective: ['푸른', '푸르른', '파란', '맑은', '싱그러운', '초록한'],
                noun: ['나무', '숲', '잎', '가지', '새싹', '풀'],
                hanja: {
                    성: ['林', '森', '木', '柳', '松', '梅'],
                    명: ['木', '林', '森', '翠', '靑', '綠', '柳', '松', '竹']
                }
            },
            '화': {
                adjective: ['붉은', '빛나는', '뜨거운', '화려한', '찬란한', '밝은'],
                noun: ['불', '빛', '태양', '별', '화염', '불꽃'],
                hanja: {
                    성: ['赤', '炎', '火', '陽', '明', '星'],
                    명: ['火', '炎', '焰', '光', '明', '煥', '燦', '曜', '熱']
                }
            },
            '토': {
                adjective: ['든든한', '넉넉한', '황금빛', '따뜻한', '포근한', '깊은'],
                noun: ['흙', '땅', '산', '바위', '대지', '돌'],
                hanja: {
                    성: ['土', '山', '石', '岩', '田', '地'],
                    명: ['土', '地', '山', '岳', '岩', '石', '田', '坤', '厚']
                }
            },
            '금': {
                adjective: ['은빛', '단단한', '맑은', '예리한', '날카로운', '차가운'],
                noun: ['쇠', '금속', '칼', '은', '옥', '보석'],
                hanja: {
                    성: ['金', '銀', '鐵', '玉', '珍', '寶'],
                    명: ['金', '銀', '鐵', '玉', '珍', '錫', '鋼', '劍', '寶']
                }
            },
            '수': {
                adjective: ['깊은', '흐르는', '맑은', '푸른', '투명한', '고요한'],
                noun: ['물', '바다', '강', '이슬', '구름', '파도'],
                hanja: {
                    성: ['水', '江', '河', '海', '湖', '泉'],
                    명: ['水', '江', '河', '海', '淸', '洋', '泉', '潤', '波']
                }
            }
        };
        return keywords[element] || keywords['목'];
    }

    // 일간별 특성 키워드
    getDayMasterTraits(dayMaster) {
        const traits = {
            '갑': { style: '굳센', suffix: '목', hanja: '甲', meaning: '큰 나무' },
            '을': { style: '부드러운', suffix: '초', hanja: '乙', meaning: '화초' },
            '병': { style: '밝은', suffix: '화', hanja: '丙', meaning: '태양' },
            '정': { style: '따뜻한', suffix: '불', hanja: '丁', meaning: '촛불' },
            '무': { style: '든든한', suffix: '산', hanja: '戊', meaning: '큰 산' },
            '기': { style: '온화한', suffix: '밭', hanja: '己', meaning: '밭흙' },
            '경': { style: '날카로운', suffix: '금', hanja: '庚', meaning: '쇠' },
            '신': { style: '빛나는', suffix: '보석', hanja: '辛', meaning: '보석' },
            '임': { style: '깊은', suffix: '바다', hanja: '壬', meaning: '큰 바다' },
            '계': { style: '맑은', suffix: '물', hanja: '癸', meaning: '샘물' }
        };
        return traits[dayMaster] || traits['갑'];
    }

    // 한자 이름 생성 (성 + 이름)
    generateHanjaName(element) {
        const keywords = this.getKoreanKeywords(element);
        const surname = this.pickRandom(keywords.hanja.성);
        const givenName1 = this.pickRandom(keywords.hanja.명);
        const givenName2 = this.pickRandom(keywords.hanja.명);

        // 한자 -> 한글 변환 (간단한 매핑)
        const hanjaToKorean = {
            '木': '목', '林': '림', '森': '삼', '柳': '류', '松': '송', '梅': '매', '翠': '취', '靑': '청', '綠': '록', '竹': '죽',
            '火': '화', '炎': '염', '焰': '염', '赤': '적', '陽': '양', '明': '명', '星': '성', '光': '광', '煥': '환', '燦': '찬', '曜': '요', '熱': '열',
            '土': '토', '地': '지', '山': '산', '岳': '악', '岩': '암', '石': '석', '田': '전', '坤': '곤', '厚': '후',
            '金': '금', '銀': '은', '鐵': '철', '玉': '옥', '珍': '진', '寶': '보', '錫': '석', '鋼': '강', '劍': '검',
            '水': '수', '江': '강', '河': '하', '海': '해', '湖': '호', '泉': '천', '淸': '청', '洋': '양', '潤': '윤', '波': '파'
        };

        const koreanName = `${hanjaToKorean[surname] || ''}${hanjaToKorean[givenName1] || ''}${hanjaToKorean[givenName2] || ''}`;

        return {
            korean: koreanName,
            hanja: `${surname}${givenName1}${givenName2}`
        };
    }

    // 형용사 + 명사 스타일
    generateAdjectiveNoun(element) {
        const keywords = this.getKoreanKeywords(element);
        const adj = this.pickRandom(keywords.adjective);
        const noun = this.pickRandom(keywords.noun);
        return `${adj}${noun}`;
    }

    // 특성 + 명사 스타일
    generateTraitNoun(element) {
        const keywords = this.getKoreanKeywords(element);
        const trait = this.getDayMasterTraits(this.dayMaster);
        const noun = this.pickRandom(keywords.noun);
        return `${trait.style}${noun}`;
    }

    // 일간 특성 기반
    generateDayMasterStyle() {
        const trait = this.getDayMasterTraits(this.dayMaster);
        const keywords = this.getKoreanKeywords(this.dayElement);
        const adj = this.pickRandom(keywords.adjective);
        return `${adj}${trait.suffix}`;
    }

    // 강점 극대화형 부캐명
    generateEnhanceNicknames() {
        const nicknames = [];

        // 1. 한자 이름 (한국어-한자 페어)
        const hanjaName1 = this.generateHanjaName(this.dayElement);
        nicknames.push({
            name: `${hanjaName1.korean} (${hanjaName1.hanja})`,
            style: '한자명',
            reason: '당신의 강한 기운을 한자 이름으로 표현했습니다'
        });

        // 2. 형용사 + 명사
        nicknames.push({
            name: this.generateAdjectiveNoun(this.dayElement),
            style: '형용사형',
            reason: '당신의 핵심 특성을 잘 나타냅니다'
        });

        // 3. 특성 + 명사
        nicknames.push({
            name: this.generateTraitNoun(this.dayElement),
            style: '특성형',
            reason: '당신의 일간 특성을 강조합니다'
        });

        // 4. 일간 스타일
        nicknames.push({
            name: this.generateDayMasterStyle(),
            style: '일간형',
            reason: '당신의 본성을 표현합니다'
        });

        // 5. 또 다른 한자 이름
        const hanjaName2 = this.generateHanjaName(this.dayElement);
        nicknames.push({
            name: `${hanjaName2.korean} (${hanjaName2.hanja})`,
            style: '한자명',
            reason: '고풍스러우면서도 강력한 느낌입니다'
        });

        return nicknames;
    }

    // 균형/보완형 부캐명
    generateBalanceNicknames() {
        const weakElement = this.elementAnalysis.weakest;
        const nicknames = [];

        // 1. 한자 이름 (부족한 오행)
        const hanjaName1 = this.generateHanjaName(weakElement);
        nicknames.push({
            name: `${hanjaName1.korean} (${hanjaName1.hanja})`,
            style: '한자명',
            reason: `부족한 ${ELEMENT_PROPERTIES[weakElement].name} 기운을 채워줍니다`
        });

        // 2. 형용사 + 명사
        nicknames.push({
            name: this.generateAdjectiveNoun(weakElement),
            style: '형용사형',
            reason: '부족한 기운을 보완합니다'
        });

        // 3. 특성 + 명사
        nicknames.push({
            name: this.generateTraitNoun(weakElement),
            style: '특성형',
            reason: '균형을 맞춰줍니다'
        });

        // 4. 일간 + 부족한 오행
        const weakKeywords = this.getKoreanKeywords(weakElement);
        const trait = this.getDayMasterTraits(this.dayMaster);
        nicknames.push({
            name: `${trait.style}${this.pickRandom(weakKeywords.noun)}`,
            style: '조화형',
            reason: '본성과 부족한 기운의 조화입니다'
        });

        // 5. 또 다른 한자 이름
        const hanjaName2 = this.generateHanjaName(weakElement);
        nicknames.push({
            name: `${hanjaName2.korean} (${hanjaName2.hanja})`,
            style: '한자명',
            reason: '부족한 면을 우아하게 채웁니다'
        });

        return nicknames;
    }

    // 메인 부캐명 생성
    generateMainNickname(type) {
        if (type === 'enhance') {
            return this.generateAdjectiveNoun(this.dayElement);
        } else {
            const weakElement = this.elementAnalysis.weakest;
            return this.generateAdjectiveNoun(weakElement);
        }
    }

    // 설명 생성
    generateDescription(type) {
        if (type === 'enhance') {
            return `당신의 강력한 ${ELEMENT_PROPERTIES[this.dayElement].name} 기운을 살립니다!`;
        } else {
            const weakElement = this.elementAnalysis.weakest;
            return `부족한 ${ELEMENT_PROPERTIES[weakElement].name} 기운을 채워 균형을 맞춥니다!`;
        }
    }

    // 랜덤 선택
    pickRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 최종 생성
    generate(type) {
        const mainNickname = this.generateMainNickname(type);
        const alternatives = type === 'enhance'
            ? this.generateEnhanceNicknames()
            : this.generateBalanceNicknames();

        return {
            type: type,
            main: {
                name: mainNickname,
                description: this.generateDescription(type)
            },
            alternatives: alternatives
        };
    }
}
