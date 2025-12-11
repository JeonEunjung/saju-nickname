// 개선된 부캐명 생성기 - 다양성 극대화 버전
class ImprovedNicknameGenerator {
    constructor(saju, elementAnalysis, characteristics, birthInfo, stylePreferences = null) {
        this.saju = saju;
        this.elementAnalysis = elementAnalysis;
        this.characteristics = characteristics;
        this.birthInfo = birthInfo; // { year, month, day, hour }
        this.dayMaster = saju.dayMaster;
        this.dayElement = FIVE_ELEMENTS[this.dayMaster];
        this.stylePreferences = stylePreferences; // 선택된 스타일들

        // 생년월일 기반 시드 생성 (스타일 선택도 시드에 반영)
        let seed = generateSeedFromBirthdate(
            birthInfo.year,
            birthInfo.month,
            birthInfo.day,
            birthInfo.hour || 12
        );

        // 스타일이 선택되었으면 시드에 반영
        if (stylePreferences && stylePreferences.size > 0) {
            const styleString = Array.from(stylePreferences).sort().join('');
            for (let i = 0; i < styleString.length; i++) {
                seed += styleString.charCodeAt(i);
            }
        }

        this.random = new SeededRandom(seed);

        // 이미 생성된 별명 추적 (중복 방지)
        this.generatedNicknames = new Set();
    }

    // 중복되지 않은 랜덤 선택 (스타일 우선순위 적용)
    pickRandomUnique(array, avoidList = []) {
        let available = array.filter(item => !avoidList.includes(item));

        // 스타일이 선택되어 있으면 우선순위 적용
        if (this.stylePreferences && this.stylePreferences.size > 0) {
            const styleMatched = available.filter(item => this.matchesStyleKeywords(item));
            if (styleMatched.length > 0) {
                // 95% 확률로 스타일 매칭되는 키워드 선택 (키워드 확장으로 더 강하게 적용)
                if (this.random.next() < 0.95) {
                    available = styleMatched;
                }
            }
        }

        if (available.length === 0) return this.random.choice(array);
        return this.random.choice(available);
    }

    // 텍스트가 선택된 스타일 키워드와 매칭되는지 확인
    matchesStyleKeywords(text) {
        if (!this.stylePreferences || this.stylePreferences.size === 0) {
            return true;
        }

        // 스타일 필터의 키워드 가져오기
        const styleFilter = new StyleFilter();

        // 스타일이 1개면 OR 로직 (기존)
        if (this.stylePreferences.size === 1) {
            for (const styleKey of this.stylePreferences) {
                const style = styleFilter.styleCategories[styleKey];
                if (!style) continue;

                for (const keyword of style.keywords) {
                    if (text.includes(keyword)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // 스타일이 2개 이상이면 점수 기반 매칭
        let matchCount = 0;
        for (const styleKey of this.stylePreferences) {
            const style = styleFilter.styleCategories[styleKey];
            if (!style) continue;

            for (const keyword of style.keywords) {
                if (text.includes(keyword)) {
                    matchCount++;
                    break; // 스타일당 한 번만 카운트
                }
            }
        }

        // 선택한 스타일 중 최소 50% 이상 매칭되면 통과
        const threshold = Math.ceil(this.stylePreferences.size * 0.5);
        return matchCount >= threshold;
    }

    // 15가지 다양한 조합 템플릿
    generateNicknameTemplates(element, isWeak = false) {
        const keywords = ENHANCED_KEYWORDS[element];
        const masterKeywords = ENHANCED_DAYMASTER_KEYWORDS[this.dayMaster];
        const templates = [];

        // 1. 형용사 + 명사
        templates.push(() => {
            const adj = this.pickRandomUnique(keywords.adjectives);
            const noun = this.pickRandomUnique(keywords.nouns);
            return `${adj}${noun}`;
        });

        // 2. 접두사 + 일간특성
        templates.push(() => {
            const prefix = this.pickRandomUnique(keywords.prefixes);
            const trait = this.pickRandomUnique(masterKeywords.titles);
            return `${prefix}${trait}`;
        });

        // 3. 명사 + 접미사
        templates.push(() => {
            const noun = this.pickRandomUnique(keywords.nouns);
            const suffix = this.pickRandomUnique(keywords.suffixes);
            return `${noun}${suffix}`;
        });

        // 4. 형용사 + 일간특성
        templates.push(() => {
            const adj = this.pickRandomUnique(keywords.adjectives);
            const title = this.pickRandomUnique(masterKeywords.titles);
            return `${adj}${title}`;
        });

        // 5. 접두사 + 명사
        templates.push(() => {
            const prefix = this.pickRandomUnique(keywords.prefixes);
            const noun = this.pickRandomUnique(keywords.nouns);
            return `${prefix}${noun}`;
        });

        // 6. 자연물 + 특성
        templates.push(() => {
            const nature = this.pickRandomUnique(keywords.nature);
            const style = this.pickRandomUnique(masterKeywords.styles);
            return `${nature}${style}`;
        });

        // 7. 동물 명칭
        templates.push(() => {
            const animal = this.pickRandomUnique(keywords.animals);
            return animal;
        });

        // 8. 일간특성 + 명사
        templates.push(() => {
            const trait = this.pickRandomUnique(masterKeywords.traits);
            const noun = this.pickRandomUnique(keywords.nouns);
            return `${trait}${noun}`;
        });

        // 9. 추상개념 + 접미사
        templates.push(() => {
            const concept = this.pickRandomUnique(keywords.concepts);
            const suffix = this.pickRandomUnique(keywords.suffixes);
            return `${concept}${suffix}`;
        });

        // 10. 형용사 + 자연물
        templates.push(() => {
            const adj = this.pickRandomUnique(keywords.adjectives);
            const nature = this.pickRandomUnique(keywords.nature);
            return `${adj}${nature}`;
        });

        // 11. 한자 이름 (성 + 명)
        templates.push(() => {
            const surname = this.pickRandomUnique(keywords.hanja.성);
            const givenName = this.pickRandomUnique(keywords.hanja.명);

            const hanjaToKorean = {
                '木': '목', '林': '림', '森': '삼', '柳': '류', '松': '송', '梅': '매', '竹': '죽', '楓': '풍', '柏': '백', '槐': '괴',
                '翠': '취', '靑': '청', '綠': '록', '葉': '엽', '枝': '지', '春': '춘', '東': '동', '生': '생', '榮': '영', '華': '화', '茂': '무', '蘭': '란', '芝': '지',
                '火': '화', '炎': '염', '焰': '염', '赤': '적', '陽': '양', '明': '명', '星': '성', '光': '광', '煥': '환', '燦': '찬', '曜': '요', '熱': '열',
                '輝': '휘', '曜': '요', '晶': '정', '亮': '량', '紅': '홍', '朱': '주', '丹': '단', '日': '일', '耀': '요',
                '土': '토', '地': '지', '山': '산', '岳': '악', '岩': '암', '石': '석', '田': '전', '坤': '곤', '厚': '후',
                '中': '중', '央': '앙', '黃': '황', '金': '금', '豊': '풍', '富': '부', '安': '안', '寧': '녕', '固': '고', '平': '평', '和': '화',
                '金': '금', '銀': '은', '鐵': '철', '玉': '옥', '珍': '진', '寶': '보', '錫': '석', '鋼': '강', '劍': '검', '鉞': '월',
                '白': '백', '淸': '청', '貞': '정', '義': '의', '烈': '열', '勇': '용', '剛': '강', '強': '강', '正': '정', '直': '직',
                '水': '수', '江': '강', '河': '하', '海': '해', '湖': '호', '泉': '천', '淵': '연', '波': '파', '洋': '양', '溪': '계',
                '洪': '홍', '深': '심', '玄': '현', '黑': '흑', '北': '북', '冬': '동', '智': '지', '慧': '혜', '哲': '철', '賢': '현', '潤': '윤'
            };

            const koreanName = `${hanjaToKorean[surname] || ''}${hanjaToKorean[givenName] || ''}`;
            return `${koreanName}(${surname}${givenName})`;
        });

        // 12. 동물 + 특성
        templates.push(() => {
            const animal = this.pickRandomUnique(keywords.animals);
            const trait = this.pickRandomUnique(masterKeywords.traits);
            return `${trait}${animal}`;
        });

        // 13. 형용사 + 추상개념
        templates.push(() => {
            const adj = this.pickRandomUnique(keywords.adjectives);
            const concept = this.pickRandomUnique(keywords.concepts);
            return `${adj}${concept}`;
        });

        // 14. 일간 + 명사 + 접미사
        templates.push(() => {
            const noun = this.pickRandomUnique(keywords.nouns);
            const suffix = this.pickRandomUnique(keywords.suffixes);
            return `${this.dayMaster}${noun}${suffix}`;
        });

        // 15. 자연물 단독 (보석/동물명)
        templates.push(() => {
            return this.random.randint(0, 1) === 0
                ? this.pickRandomUnique(keywords.nature)
                : this.pickRandomUnique(keywords.animals);
        });

        // 16. 이중 형용사 + 명사
        templates.push(() => {
            const adj1 = this.pickRandomUnique(keywords.adjectives);
            const adj2 = this.pickRandomUnique(keywords.adjectives, [adj1]);
            const noun = this.pickRandomUnique(keywords.nouns);
            // 두 형용사 중 하나만 사용 (너무 길어지는 것 방지)
            return `${adj1}${noun}`;
        });

        // 17. 스타일 + 접미사
        templates.push(() => {
            const style = this.pickRandomUnique(masterKeywords.styles);
            const suffix = this.pickRandomUnique(keywords.suffixes);
            return `${style}${suffix}`;
        });

        // 18. 명사 + 일간 + 접미사
        templates.push(() => {
            const noun = this.pickRandomUnique(keywords.nouns);
            return `${noun}${this.dayMaster}`;
        });

        return templates;
    }

    // 중복되지 않는 별명 생성
    generateUniqueNickname(element, isWeak = false, maxAttempts = 50) {
        const templates = this.generateNicknameTemplates(element, isWeak);

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const template = this.random.choice(templates);
            const nickname = template();

            // 중복 체크
            if (!this.generatedNicknames.has(nickname)) {
                this.generatedNicknames.add(nickname);
                return nickname;
            }
        }

        // 최대 시도 후에도 중복이면 타임스탬프 추가
        const template = this.random.choice(templates);
        let nickname = template();
        let counter = 1;
        while (this.generatedNicknames.has(nickname)) {
            nickname = template();
            counter++;
            if (counter > 10) break;
        }
        this.generatedNicknames.add(nickname);
        return nickname;
    }

    // 강점 극대화형 부캐명 생성 (5개)
    generateEnhanceNicknames() {
        const nicknames = [];
        const element = this.dayElement;
        const keywords = ENHANCED_KEYWORDS[element];

        // 5개의 서로 다른 스타일 별명 생성
        const styles = [
            { name: '형용사형', reason: '당신의 핵심 특성을 잘 나타냅니다' },
            { name: '한자명', reason: '동양적이면서도 강력한 느낌입니다' },
            { name: '자연물형', reason: '자연의 힘을 담았습니다' },
            { name: '특성강조형', reason: '당신의 강점을 극대화합니다' },
            { name: '조화형', reason: '일간 특성과 완벽한 조화입니다' }
        ];

        for (let i = 0; i < 5; i++) {
            nicknames.push({
                name: this.generateUniqueNickname(element, false),
                style: styles[i].name,
                reason: styles[i].reason
            });
        }

        return nicknames;
    }

    // 균형/보완형 부캐명 생성 (5개)
    generateBalanceNicknames() {
        const nicknames = [];
        const weakElement = this.elementAnalysis.weakest;
        const weakName = ELEMENT_PROPERTIES[weakElement].name;

        const styles = [
            { name: '보완형', reason: `부족한 ${weakName} 기운을 채워줍니다` },
            { name: '한자명', reason: `${weakName} 기운을 우아하게 보완합니다` },
            { name: '자연물형', reason: '자연의 조화로 균형을 맞춥니다' },
            { name: '조화형', reason: '본성과 부족한 기운의 완벽한 조화입니다' },
            { name: '균형형', reason: '오행의 밸런스를 완성합니다' }
        ];

        for (let i = 0; i < 5; i++) {
            nicknames.push({
                name: this.generateUniqueNickname(weakElement, true),
                style: styles[i].name,
                reason: styles[i].reason
            });
        }

        return nicknames;
    }

    // 메인 부캐명 생성
    generateMainNickname(type) {
        if (type === 'enhance') {
            return this.generateUniqueNickname(this.dayElement, false);
        } else {
            const weakElement = this.elementAnalysis.weakest;
            return this.generateUniqueNickname(weakElement, true);
        }
    }

    // 설명 생성
    generateDescription(type) {
        if (type === 'enhance') {
            const elementName = ELEMENT_PROPERTIES[this.dayElement].name;
            const trait = ELEMENT_PROPERTIES[this.dayElement].trait;
            return `당신의 강력한 ${elementName} 기운을 극대화합니다! ${trait}을 마음껏 발휘하세요.`;
        } else {
            const weakElement = this.elementAnalysis.weakest;
            const weakName = ELEMENT_PROPERTIES[weakElement].name;
            const weakTrait = ELEMENT_PROPERTIES[weakElement].trait;
            return `부족한 ${weakName} 기운을 채워 완벽한 밸런스로! ${weakTrait}을 보완합니다.`;
        }
    }

    // 최종 생성
    generate(type) {
        const mainNickname = this.generateMainNickname(type);
        const alternatives = type === 'enhance'
            ? this.generateEnhanceNicknames()
            : this.generateBalanceNicknames();

        // 메인 닉네임이 대체 목록에 있다면 제거
        const filteredAlternatives = alternatives.filter(alt => alt.name !== mainNickname);

        // 필터링 후 4개 미만이면 추가 생성
        while (filteredAlternatives.length < 5) {
            const element = type === 'enhance' ? this.dayElement : this.elementAnalysis.weakest;
            const newNickname = this.generateUniqueNickname(element, type !== 'enhance');

            if (!filteredAlternatives.some(alt => alt.name === newNickname) && newNickname !== mainNickname) {
                filteredAlternatives.push({
                    name: newNickname,
                    style: '특별형',
                    reason: type === 'enhance'
                        ? '당신만의 독특한 매력을 담았습니다'
                        : '균형잡힌 에너지를 선사합니다'
                });
            }
        }

        return {
            type: type,
            main: {
                name: mainNickname,
                description: this.generateDescription(type)
            },
            alternatives: filteredAlternatives.slice(0, 5)
        };
    }

    // 전체 패키지 생성 (강점형 + 보완형)
    generateFullPackage() {
        return {
            enhance: this.generate('enhance'),
            balance: this.generate('balance')
        };
    }
}

// 기존 생성기와 호환되는 래퍼 함수
function generateImprovedNicknames(saju, elementAnalysis, characteristics, birthInfo) {
    const generator = new ImprovedNicknameGenerator(saju, elementAnalysis, characteristics, birthInfo);
    return generator.generateFullPackage();
}
