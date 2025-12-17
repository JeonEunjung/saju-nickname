// 애니 캐릭터 매칭 시스템
class AnimeCharacterMatcher {
    constructor() {
        this.characters = null;
        this.loadCharacters();
    }

    // 캐릭터 데이터 로드
    async loadCharacters() {
        try {
            const response = await fetch('anime-characters.json');
            const data = await response.json();
            this.characters = data.characters;
        } catch (error) {
            console.error('캐릭터 데이터 로드 실패:', error);
            this.characters = [];
        }
    }

    // 사주 데이터로부터 특성 추출
    extractSajuTraits(sajuData, elementCount) {
        const traits = {
            element: null,           // 주요 오행
            secondaryElement: null,  // 보조 오행
            personality: [],         // 성격 키워드
            keywords: []            // 매칭 키워드
        };

        // 일간 오행
        const dayMasterElement = FIVE_ELEMENTS[sajuData.dayMaster];
        traits.element = this.convertElement(dayMasterElement);

        // 가장 많은 오행 찾기 (일간 제외)
        let maxCount = 0;
        let secondaryEl = null;
        for (const [element, count] of Object.entries(elementCount)) {
            if (element !== dayMasterElement && count > maxCount) {
                maxCount = count;
                secondaryEl = element;
            }
        }
        traits.secondaryElement = this.convertElement(secondaryEl);

        // 오행별 성격 특성
        const elementPersonality = {
            '木': {
                traits: ['성장형', '끈기', '헌신적', '순수', '성실'],
                keywords: ['성장', '봄', '나무', '푸름', '발전']
            },
            '火': {
                traits: ['열정적', '밝음', '적극적', '활발', '에너지'],
                keywords: ['열정', '태양', '밝음', '활력', '도전']
            },
            '土': {
                traits: ['온화', '안정', '헌신', '평범', '가정적'],
                keywords: ['안정', '평화', '땅', '온화', '신뢰']
            },
            '金': {
                traits: ['강함', '완벽주의', '냉정', '책임감', '정의감'],
                keywords: ['강철', '칼', '명예', '정의', '완벽']
            },
            '水': {
                traits: ['지적', '냉정', '섬세', '전략적', '지혜'],
                keywords: ['물', '지혜', '냉정', '유연', '흐름']
            }
        };

        if (elementPersonality[traits.element]) {
            traits.personality.push(...elementPersonality[traits.element].traits);
            traits.keywords.push(...elementPersonality[traits.element].keywords);
        }

        // 보조 오행도 추가 (가중치 낮음)
        if (traits.secondaryElement && elementPersonality[traits.secondaryElement]) {
            traits.personality.push(elementPersonality[traits.secondaryElement].traits[0]);
            traits.keywords.push(elementPersonality[traits.secondaryElement].keywords[0]);
        }

        // 오행 개수로 성격 유추
        if (elementCount['화'] >= 3) {
            traits.personality.push('열혈', '적극적', '밝음');
            traits.keywords.push('열정', '불꽃', '태양');
        }
        if (elementCount['수'] >= 3) {
            traits.personality.push('침착', '지적', '차분');
            traits.keywords.push('물', '지혜', '냉정');
        }
        if (elementCount['목'] >= 3) {
            traits.personality.push('성장욕구', '인내', '끈기');
            traits.keywords.push('성장', '나무', '봄');
        }
        if (elementCount['금'] >= 3) {
            traits.personality.push('강인함', '정의감', '책임감');
            traits.keywords.push('강철', '정의', '칼');
        }
        if (elementCount['토'] >= 3) {
            traits.personality.push('안정추구', '헌신', '온화');
            traits.keywords.push('안정', '땅', '평화');
        }

        // 오행이 균형잡힌 경우
        const maxEl = Math.max(...Object.values(elementCount));
        const minEl = Math.min(...Object.values(elementCount));
        if (maxEl - minEl <= 1) {
            traits.personality.push('균형', '조화', '다재다능');
            traits.keywords.push('균형', '조화', '중용');
        }

        // 오행이 극단적인 경우
        if (maxEl >= 4) {
            traits.personality.push('강렬', '극단적', '집중');
        }

        return traits;
    }

    // 한글 오행 → 한자 오행 변환
    convertElement(element) {
        const map = {
            '목': '木',
            '화': '火',
            '토': '土',
            '금': '金',
            '수': '水'
        };
        return map[element] || '木';
    }

    // 캐릭터 매칭 점수 계산
    calculateMatchScore(character, sajuTraits) {
        let score = 0;

        // 1. 오행 일치 (최대 40점)
        if (character.element === sajuTraits.element) {
            score += 40;
        } else if (character.element === sajuTraits.secondaryElement) {
            score += 20;
        }

        // 2. 성격 특성 일치 (최대 30점)
        let traitMatches = 0;
        for (const trait of sajuTraits.personality) {
            if (character.traits.some(t => t.includes(trait) || trait.includes(t))) {
                traitMatches++;
            }
        }
        score += Math.min(traitMatches * 5, 30);

        // 3. 키워드 일치 (최대 30점)
        let keywordMatches = 0;
        for (const keyword of sajuTraits.keywords) {
            if (character.keywords.some(k => k.includes(keyword) || keyword.includes(k))) {
                keywordMatches++;
            }
        }
        score += Math.min(keywordMatches * 5, 30);

        return score;
    }

    // 최적의 캐릭터 찾기
    findBestMatch(sajuData, elementCount) {
        if (!this.characters || this.characters.length === 0) {
            console.error('캐릭터 데이터가 없습니다');
            return null;
        }

        const sajuTraits = this.extractSajuTraits(sajuData, elementCount);

        // 1단계: 오행 필터링 (주요 오행과 일치하는 캐릭터만 선택)
        let filteredCharacters = this.characters.filter(
            character => character.element === sajuTraits.element
        );

        // 주요 오행에 맞는 캐릭터가 없으면 보조 오행 사용
        if (filteredCharacters.length === 0 && sajuTraits.secondaryElement) {
            filteredCharacters = this.characters.filter(
                character => character.element === sajuTraits.secondaryElement
            );
        }

        // 그래도 없으면 모든 캐릭터 사용 (fallback)
        if (filteredCharacters.length === 0) {
            filteredCharacters = this.characters;
        }

        // 2단계: 필터링된 캐릭터들에 대해 매칭 점수 계산
        const scoredCharacters = filteredCharacters.map(character => ({
            character,
            score: this.calculateMatchScore(character, sajuTraits)
        }));

        // 점수순 정렬
        scoredCharacters.sort((a, b) => b.score - a.score);

        // 상위 3개 반환 (옵션)
        const topMatches = scoredCharacters.slice(0, 3);

        return {
            bestMatch: topMatches[0].character,
            matchScore: topMatches[0].score,
            alternatives: topMatches.slice(1).map(m => m.character),
            sajuTraits: sajuTraits
        };
    }

    // 매칭 이유 생성
    generateMatchReason(character, sajuTraits) {
        const reasons = [];

        // 오행 매칭
        if (character.element === sajuTraits.element) {
            const elementName = {
                '木': '목(木)',
                '火': '화(火)',
                '土': '토(土)',
                '金': '금(金)',
                '水': '수(水)'
            }[character.element];
            reasons.push(`같은 ${elementName} 기운을 공유합니다`);
        }

        // 성격 특성 매칭
        const matchedTraits = character.traits.filter(ct =>
            sajuTraits.personality.some(st => ct.includes(st) || st.includes(ct))
        );
        if (matchedTraits.length > 0) {
            reasons.push(`${matchedTraits.slice(0, 2).join(', ')} 같은 성격을 가졌습니다`);
        }

        // 키워드 매칭
        const matchedKeywords = character.keywords.filter(ck =>
            sajuTraits.keywords.some(sk => ck.includes(sk) || sk.includes(ck))
        );
        if (matchedKeywords.length > 0) {
            reasons.push(`${matchedKeywords.slice(0, 2).join('과 ')}를 중요하게 생각합니다`);
        }

        return reasons.length > 0
            ? reasons.join(', ') + '.'
            : character.description;
    }
}

// 전역 인스턴스 생성
const animeCharacterMatcher = new AnimeCharacterMatcher();

// 매칭 결과를 HTML로 변환
function generateAnimeCharacterHTML(matchResult) {
    if (!matchResult) {
        return '';
    }

    const character = matchResult.bestMatch;
    const matchReason = animeCharacterMatcher.generateMatchReason(character, matchResult.sajuTraits);

    return `
        <div class="anime-character-section">
            <div class="anime-character-title">
                <span class="anime-character-emoji">🎭</span>
                <h3>나랑 가장 닮은 애니 캐릭터</h3>
            </div>

            <div class="anime-character-card">
                <div class="anime-character-header">
                    <div class="anime-character-info">
                        <div class="anime-character-name">${character.name}</div>
                        <div class="anime-character-anime">${character.anime}</div>
                        <div class="anime-character-element">
                            <span class="element-badge">${character.element}</span>
                        </div>
                    </div>
                    <div class="anime-character-score">
                        <div class="match-score">${matchResult.matchScore}점</div>
                        <div class="match-label">매칭도</div>
                    </div>
                </div>

                <div class="anime-character-description">
                    ${character.description}
                </div>

                <div class="anime-character-reason">
                    <div class="reason-title">💫 왜 이 캐릭터일까요?</div>
                    <div class="reason-text">${matchReason}</div>
                </div>

                <div class="anime-character-traits">
                    <div class="traits-title">🎯 공통 특성</div>
                    <div class="traits-list">
                        ${character.traits.slice(0, 5).map(trait =>
                            `<span class="trait-badge">${trait}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="anime-character-keywords">
                    ${character.keywords.slice(0, 5).map(keyword =>
                        `<span class="keyword-tag">#${keyword}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
}
