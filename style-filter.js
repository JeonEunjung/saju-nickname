// 스타일 필터 시스템
class StyleFilter {
    constructor() {
        // 스타일 카테고리 정의
        this.styleCategories = {
            // 분위기/톤
            funny: {
                name: '😂 웃김',
                emoji: '😂',
                keywords: ['밈', '재미', '유머', '개그'],
                weight: 1.0
            },
            emotional: {
                name: '💝 감성',
                emoji: '💝',
                keywords: ['감성', '서정', '낭만', '따뜻'],
                weight: 1.0
            },
            cool: {
                name: '😎 쿨/시크',
                emoji: '😎',
                keywords: ['쿨', '시크', '세련', '멋진'],
                weight: 1.0
            },
            traditional: {
                name: '🎨 고풍/전통',
                emoji: '🎨',
                keywords: ['한자', '고전', '전통', '우아'],
                weight: 1.0
            },

            // 스타일
            strong: {
                name: '⚔️ 강함',
                emoji: '⚔️',
                keywords: ['강', '용', '검', '전사', '왕', '제', '호', '룡', '무사'],
                weight: 1.0
            },
            cute: {
                name: '🌸 귀여움',
                emoji: '🌸',
                keywords: ['꽃', '이슬', '작은', '귀여운', '새싹', '봄', '별', '요정'],
                weight: 1.0
            },
            game: {
                name: '🎮 게임/판타지',
                emoji: '🎮',
                keywords: ['마스터', '로드', '킹', 'King', 'Lord', '마법사', '엘프'],
                weight: 1.0
            },
            wise: {
                name: '📚 지적/현자',
                emoji: '📚',
                keywords: ['현자', '지혜', '철학', '사색', '멘토', '어른', '통찰'],
                weight: 1.0
            }
        };

        // 길이 필터
        this.lengthFilters = {
            short: { name: '짧게 (2-4자)', min: 2, max: 4 },
            medium: { name: '보통 (5-7자)', min: 5, max: 7 },
            long: { name: '길게 (8자+)', min: 8, max: 100 }
        };

        this.selectedStyles = new Set();
        this.selectedLength = null;
    }

    // 스타일 추가
    addStyle(styleKey) {
        this.selectedStyles.add(styleKey);
    }

    // 스타일 제거
    removeStyle(styleKey) {
        this.selectedStyles.delete(styleKey);
    }

    // 스타일 토글
    toggleStyle(styleKey) {
        if (this.selectedStyles.has(styleKey)) {
            this.removeStyle(styleKey);
        } else {
            this.addStyle(styleKey);
        }
    }

    // 길이 필터 설정
    setLength(lengthKey) {
        this.selectedLength = lengthKey;
    }

    // 모든 필터 초기화
    clearAll() {
        this.selectedStyles.clear();
        this.selectedLength = null;
    }

    // 별명이 선택된 스타일과 매칭되는지 확인
    matchesStyle(nickname) {
        // 스타일 필터가 없으면 모두 통과
        if (this.selectedStyles.size === 0) {
            return true;
        }

        // 선택된 스타일 중 하나라도 매칭되면 통과
        for (const styleKey of this.selectedStyles) {
            const style = this.styleCategories[styleKey];
            if (!style) continue;

            // 키워드 중 하나라도 별명에 포함되어 있으면 매칭
            for (const keyword of style.keywords) {
                if (nickname.includes(keyword)) {
                    return true;
                }
            }
        }

        return false;
    }

    // 별명이 길이 필터와 매칭되는지 확인
    matchesLength(nickname) {
        if (!this.selectedLength) {
            return true;
        }

        const filter = this.lengthFilters[this.selectedLength];
        if (!filter) return true;

        // 한자 제거하고 순수 한글 길이만 측정
        const cleanName = nickname.replace(/\([^)]*\)/g, '').trim();
        const length = cleanName.length;

        return length >= filter.min && length <= filter.max;
    }

    // 별명이 모든 필터를 통과하는지 확인
    matches(nickname) {
        return this.matchesStyle(nickname) && this.matchesLength(nickname);
    }

    // 별명 목록을 필터링
    filterNicknames(nicknames) {
        // 필터가 하나도 없으면 원본 반환
        if (this.selectedStyles.size === 0 && !this.selectedLength) {
            return nicknames;
        }

        return nicknames.filter(nickname => {
            const name = typeof nickname === 'string' ? nickname : nickname.name;
            return this.matches(name);
        });
    }

    // 필터에 맞는 별명 점수 계산 (가중치 적용)
    scoreNickname(nickname) {
        let score = 0;

        // 스타일 매칭 점수
        for (const styleKey of this.selectedStyles) {
            const style = this.styleCategories[styleKey];
            if (!style) continue;

            for (const keyword of style.keywords) {
                if (nickname.includes(keyword)) {
                    score += style.weight;
                    break; // 스타일당 한 번만 점수 부여
                }
            }
        }

        // 길이 매칭 점수
        if (this.matchesLength(nickname)) {
            score += 0.5;
        }

        return score;
    }

    // 별명 목록을 점수순으로 정렬
    sortByScore(nicknames) {
        return nicknames.map(nickname => {
            const name = typeof nickname === 'string' ? nickname : nickname.name;
            return {
                ...nickname,
                score: this.scoreNickname(name)
            };
        }).sort((a, b) => b.score - a.score);
    }
}

// 키워드에 스타일 태그 자동 부여
function tagKeywordsWithStyle(keywords) {
    const styleFilter = new StyleFilter();
    const tagged = {};

    for (const [element, data] of Object.entries(keywords)) {
        tagged[element] = {};

        for (const [category, items] of Object.entries(data)) {
            if (!Array.isArray(items)) continue;

            tagged[element][category] = items.map(item => {
                const styles = [];

                // 각 스타일 카테고리와 매칭 확인
                for (const [styleKey, styleData] of Object.entries(styleFilter.styleCategories)) {
                    for (const keyword of styleData.keywords) {
                        if (item.includes(keyword)) {
                            styles.push(styleKey);
                            break;
                        }
                    }
                }

                return {
                    text: item,
                    styles: styles
                };
            });
        }
    }

    return tagged;
}
