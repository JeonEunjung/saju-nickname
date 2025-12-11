// 스타일 필터 시스템
class StyleFilter {
    constructor() {
        // 스타일 카테고리 정의
        this.styleCategories = {
            // 분위기/톤
            funny: {
                name: '😂 웃김',
                emoji: '😂',
                keywords: ['밈', '재미', '유머', '개그', '웃', '장난', '익살', '코믹', '개그맨'],
                weight: 1.0
            },
            emotional: {
                name: '💝 감성',
                emoji: '💝',
                keywords: ['감성', '서정', '낭만', '따뜻', '포근', '온화', '부드러운', '달빛', '이슬', '시인', '감동'],
                weight: 1.0
            },
            cool: {
                name: '😎 쿨/시크',
                emoji: '😎',
                keywords: ['쿨', '시크', '세련', '멋진', '에메랄드', '사파이어', '루비', '다이아', '플래티넘', '백금', '은빛', '크롬', '실버', 'Silver', 'Platinum'],
                weight: 1.0
            },
            traditional: {
                name: '🎨 고풍/전통',
                emoji: '🎨',
                keywords: ['한자', '고전', '전통', '우아', '(', ')', '林', '森', '木', '火', '炎', '土', '山', '金', '水', '江', '林', '森'],
                weight: 1.0
            },

            // 스타일
            strong: {
                name: '⚔️ 강함',
                emoji: '⚔️',
                keywords: ['강', '용', '검', '전사', '왕', '제', '호', '룡', '무사', '리더', '대장', '보스', 'Boss',
                           '수호자', '지기', '신', '제왕', '황제', '칼', '도', '창', '갑옷', '방패',
                           '격', '맹', '굳', '결단', '의리', '정의', '용기', '강철', '쇠', '철', '불굴',
                           '화룡', '적룡', '청룡', '백호', '주작', '현무', '사자', '호랑이', '매', '독수리',
                           'Lord', 'King', 'Commander', 'Warrior', 'Master', '드래곤', 'Dragon'],
                weight: 1.0
            },
            cute: {
                name: '🌸 귀여움',
                emoji: '🌸',
                keywords: ['꽃', '이슬', '작은', '귀여운', '새싹', '봄', '별', '요정', '나비', '벚꽃', '진주',
                           '순수', '맑은', '투명', '고운', '연한', '부드러운', '푸르른', '싱그러운',
                           '청순', '수줍', '사랑스러운', '깜찍', '예쁜', '앙증', '아기',
                           '토끼', '새', '잠자리', '민들레', '클로버', '장미', '백합',
                           'Fairy', 'Angel', 'Flower', 'Blossom', '천사', '요정'],
                weight: 1.0
            },
            game: {
                name: '🎮 게임/판타지',
                emoji: '🎮',
                keywords: ['마스터', '로드', '킹', 'King', 'Lord', '마법사', '엘프',
                           'Master', 'Wizard', 'Mage', 'Knight', 'Paladin', 'Ranger', 'Sage',
                           '기사', '성기사', '궁수', '암살자', '힐러', '탱커',
                           '레전드', 'Legend', '영웅', 'Hero', 'Champion', '전설',
                           '파이어', 'Fire', '아이스', 'Ice', '썬더', 'Thunder',
                           '다크', 'Dark', '라이트', 'Light', '섀도우', 'Shadow'],
                weight: 1.0
            },
            wise: {
                name: '📚 지적/현자',
                emoji: '📚',
                keywords: ['현자', '지혜', '철학', '사색', '멘토', '어른', '통찰',
                           '깊은', '심오', '현명', '슬기', '지식', '학자', '스승',
                           '조용', '차분', '침착', '고요', '잔잔', '담담',
                           '깊이', '심연', '심해', '바다', '대양', '호수',
                           'Sage', 'Wise', 'Deep', 'Ocean', 'Scholar', 'Mentor'],
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
