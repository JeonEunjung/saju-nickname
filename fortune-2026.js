// 2026년 병오년(丙午年) 운세 분석
class Fortune2026 {
    constructor(saju, elementCount, elementAnalysis) {
        this.saju = saju;
        this.elementCount = elementCount;
        this.elementAnalysis = elementAnalysis;

        // 2026년은 병오년 - 강한 火 기운
        this.year2026 = {
            stem: '丙',      // 병 - 양화
            branch: '午',    // 오 - 양화
            element: '화',   // 火
            intensity: 'strong' // 강한 火 기운
        };
    }

    // 2026년 전체 운세 분석
    analyze() {
        return {
            yearInfo: this.getYearInfo(),
            elementImpact: this.analyzeElementImpact(),
            fortune: this.analyzeFortune(),
            recommendations: this.getRecommendations(),
            monthlyFortune: this.getMonthlyFortune()
        };
    }

    // 2026년 기본 정보
    getYearInfo() {
        return {
            title: '2026년 병오년(丙午年)',
            emoji: '🔥',
            description: '강렬한 불의 기운이 가득한 한 해입니다. 열정과 에너지가 넘치는 시기로, 적극적인 행동과 변화가 권장됩니다.',
            element: '화(火)',
            keywords: ['열정', '변화', '성장', '활력', '도전']
        };
    }

    // 오행 영향 분석
    analyzeElementImpact() {
        const userElements = this.elementCount;
        const impacts = [];

        // 火가 많은 사람
        if (userElements['화'] >= 3) {
            impacts.push({
                type: 'warning',
                icon: '⚠️',
                title: '火 기운 과다 주의',
                description: '2026년의 강한 火 기운이 본인의 火와 합쳐져 지나치게 강해질 수 있습니다. 감정 조절과 휴식이 중요합니다.',
                advice: '충동적인 결정을 피하고, 차분함을 유지하세요. 물가에서의 활동이 도움이 됩니다.'
            });
        }

        // 火가 적은 사람 (1개 이하)
        if (userElements['화'] <= 1) {
            impacts.push({
                type: 'positive',
                icon: '✨',
                title: '火 기운 보충',
                description: '2026년의 火 기운이 부족한 열정과 에너지를 보충해줍니다. 적극적으로 새로운 도전을 시작하기 좋은 해입니다.',
                advice: '평소보다 적극적으로 행동하고, 새로운 프로젝트나 관계를 시작하세요.'
            });
        }

        // 金이 많은 사람 (火克金)
        if (userElements['금'] >= 2.5) {
            impacts.push({
                type: 'caution',
                icon: '🔨',
                title: '金 기운 약화',
                description: '火가 金을 녹이는 상극 관계입니다. 金의 기운(차분함, 완벽주의)이 약해질 수 있습니다.',
                advice: '완벽함보다는 실행력에 집중하고, 융통성을 발휘하세요. 스트레스 관리가 중요합니다.'
            });
        }

        // 水가 많은 사람 (水克火)
        if (userElements['수'] >= 2.5) {
            impacts.push({
                type: 'balanced',
                icon: '⚖️',
                title: '水火 균형',
                description: '水와 火가 균형을 이루는 해입니다. 차분함과 열정이 조화를 이룰 수 있습니다.',
                advice: '이성과 감성의 균형을 유지하면서 목표를 추진하세요.'
            });
        }

        // 木이 많은 사람 (木生火)
        if (userElements['목'] >= 2.5) {
            impacts.push({
                type: 'very-positive',
                icon: '🌟',
                title: '木生火 - 대길',
                description: '木이 火를 돕는 상생 관계입니다. 모든 일이 순조롭게 진행되고 성장이 가속화됩니다.',
                advice: '성장과 확장에 집중하세요. 투자, 학습, 새로운 사업 등 모두 좋습니다.'
            });
        }

        // 土가 많은 사람 (火生土)
        if (userElements['토'] >= 2.5) {
            impacts.push({
                type: 'positive',
                icon: '🏔️',
                title: '火生土 - 안정적 성장',
                description: '火가 土를 돕는 상생 관계입니다. 안정적으로 에너지를 받아들이며 성장할 수 있습니다.',
                advice: '기반을 다지고 장기적인 계획을 실행하세요. 부동산, 저축 등이 유리합니다.'
            });
        }

        // 기본 영향 (위의 조건에 해당하지 않는 경우)
        if (impacts.length === 0) {
            impacts.push({
                type: 'neutral',
                icon: '🌈',
                title: '조화로운 해',
                description: '2026년의 火 기운이 오행 균형을 이루며 긍정적으로 작용합니다.',
                advice: '평소대로 꾸준히 노력하되, 새로운 기회에 열린 마음을 가지세요.'
            });
        }

        return impacts;
    }

    // 종합 운세
    analyzeFortune() {
        const strongElements = this.elementAnalysis?.strong || [];
        const weakElements = this.elementAnalysis?.weak || [];

        return {
            overall: this.getOverallFortune(),
            career: this.getCareerFortune(strongElements),
            wealth: this.getWealthFortune(strongElements),
            relationship: this.getRelationshipFortune(strongElements),
            health: this.getHealthFortune(strongElements, weakElements)
        };
    }

    // 전체 운세
    getOverallFortune() {
        const fireCount = this.elementCount['화'];
        let score = 75; // 기본 점수
        let description = '';

        if (fireCount >= 3) {
            score = 70;
            description = '열정이 넘치는 한 해지만, 지나친 열기를 조절하는 것이 중요합니다. 충동적인 결정을 피하고 신중하게 행동하세요.';
        } else if (fireCount <= 1) {
            score = 85;
            description = '부족했던 에너지와 열정이 보충되는 좋은 해입니다. 적극적으로 기회를 잡고 새로운 도전을 시작하세요.';
        } else {
            score = 80;
            description = '균형잡힌 火 기운으로 안정적이면서도 활력있는 한 해가 될 것입니다. 계획한 일들을 차근차근 실행하세요.';
        }

        return { score, description };
    }

    // 사업/학업 운세
    getCareerFortune(strongElements) {
        let score = 75;
        let description = '';
        let tips = [];

        if (strongElements.includes('목')) {
            score = 90;
            description = '木生火로 창의력과 성장성이 극대화됩니다. 새로운 프로젝트, 창업, 이직 등 큰 변화를 시도하기 좋습니다.';
            tips = ['새로운 분야 도전', '창의적 프로젝트 시작', '리더십 발휘'];
        } else if (strongElements.includes('금')) {
            score = 65;
            description = '火克金으로 완벽주의가 약해질 수 있습니다. 디테일보다는 실행력에 집중하고, 팀워크를 활용하세요.';
            tips = ['완벽함 추구 자제', '실행력 중시', '협업 강화'];
        } else if (strongElements.includes('수')) {
            score = 70;
            description = '水火의 균형으로 이성적 판단과 열정적 실행이 조화를 이룹니다. 신중하되 과감하게 추진하세요.';
            tips = ['균형잡힌 의사결정', '계획적 실행', '리스크 관리'];
        } else {
            score = 80;
            description = '火의 적극성과 추진력이 더해져 하던 일이 탄력을 받습니다. 망설이지 말고 앞으로 나아가세요.';
            tips = ['적극적 추진', '새로운 기회 포착', '네트워킹 강화'];
        }

        return { score, description, tips };
    }

    // 재물 운세
    getWealthFortune(strongElements) {
        let score = 70;
        let description = '';
        let tips = [];

        if (strongElements.includes('목')) {
            score = 85;
            description = '木生火로 재물 운이 상승합니다. 투자나 사업 확장에 좋은 시기입니다.';
            tips = ['성장성 높은 투자', '사업 확장', '수입원 다각화'];
        } else if (strongElements.includes('토')) {
            score = 80;
            description = '火生土로 안정적으로 재물이 쌓입니다. 저축과 부동산 투자가 유리합니다.';
            tips = ['장기 저축', '부동산 관심', '안정적 투자'];
        } else if (strongElements.includes('금')) {
            score = 65;
            description = '火克金으로 지출이 늘어날 수 있습니다. 충동구매를 조심하고 예산 관리를 철저히 하세요.';
            tips = ['예산 관리 강화', '충동구매 자제', '보수적 재무 운영'];
        } else {
            score = 75;
            description = '평균적인 재물 운입니다. 꾸준한 노력으로 수입을 안정적으로 유지할 수 있습니다.';
            tips = ['꾸준한 저축', '위험한 투자 회피', '수입 관리'];
        }

        return { score, description, tips };
    }

    // 대인관계 운세
    getRelationshipFortune(strongElements) {
        let score = 80;
        let description = '';
        let tips = [];

        const fireCount = this.elementCount['화'];

        if (fireCount >= 3) {
            score = 70;
            description = '火 기운이 강해져 다소 감정적이거나 충동적일 수 있습니다. 상대방의 입장을 먼저 생각하는 여유를 가지세요.';
            tips = ['경청하기', '감정 조절', '여유롭게 대화하기'];
        } else if (fireCount <= 1) {
            score = 85;
            description = '평소보다 활발하고 적극적으로 사람들과 어울릴 수 있습니다. 새로운 인연을 만들기 좋은 해입니다.';
            tips = ['적극적 소통', '새로운 모임 참여', '친구 만들기'];
        } else {
            score = 80;
            description = '균형잡힌 대인관계를 유지할 수 있습니다. 진심어린 소통으로 관계를 깊게 만드세요.';
            tips = ['진솔한 대화', '정기적 연락', '신뢰 구축'];
        }

        return { score, description, tips };
    }

    // 건강 운세
    getHealthFortune(strongElements, weakElements) {
        let score = 75;
        let description = '';
        let tips = [];

        const fireCount = this.elementCount['화'];

        if (fireCount >= 3) {
            score = 65;
            description = '火 과다로 열성 질환에 주의가 필요합니다. 심장, 혈압, 피부 등을 체크하세요.';
            tips = ['충분한 수면', '스트레스 관리', '정기 검진', '시원한 음식 섭취'];
        } else if (weakElements.includes('수')) {
            score = 70;
            description = '水가 약한데 火가 강해지면 수분 부족이나 신장 계통에 주의하세요.';
            tips = ['물 많이 마시기', '과로 피하기', '규칙적인 생활'];
        } else {
            score = 80;
            description = '활력이 넘치는 한 해입니다. 이 에너지를 건강한 운동으로 소화하세요.';
            tips = ['규칙적 운동', '균형잡힌 식사', '야외 활동'];
        }

        return { score, description, tips };
    }

    // 추천 행동
    getRecommendations() {
        const fireCount = this.elementCount['화'];
        const strongElements = this.elementAnalysis?.strong || [];

        const doList = [];
        const dontList = [];

        // 해야 할 것
        if (fireCount <= 1) {
            doList.push('🎯 새로운 도전과 프로젝트 시작하기');
            doList.push('🌟 적극적으로 기회 잡기');
            doList.push('🤝 새로운 사람들과 네트워킹');
        }

        if (strongElements.includes('목')) {
            doList.push('🚀 사업 확장이나 투자 고려');
            doList.push('📚 새로운 분야 공부 시작');
        }

        if (strongElements.includes('토')) {
            doList.push('🏠 부동산 관련 계획 추진');
            doList.push('💰 장기 저축이나 투자');
        }

        doList.push('🔥 열정적으로 목표 추진하기');
        doList.push('💪 건강한 운동으로 에너지 소화');

        // 조심할 것
        if (fireCount >= 3) {
            dontList.push('⚠️ 충동적인 결정 피하기');
            dontList.push('😤 감정적인 대응 자제');
            dontList.push('🔥 과로와 번아웃 주의');
        }

        if (strongElements.includes('금')) {
            dontList.push('🎯 완벽주의에 집착하지 않기');
            dontList.push('💢 스트레스 쌓지 않기');
        }

        dontList.push('🌙 충분한 휴식 소홀히 하지 않기');
        dontList.push('🍀 주변 사람들과의 소통 소홀히 하지 않기');

        return { doList, dontList };
    }

    // 월별 간단 운세
    getMonthlyFortune() {
        const fireCount = this.elementCount['화'];

        return [
            {
                month: '1-2월',
                season: '봄 시작',
                element: '木',
                fortune: fireCount <= 2 ? '🌱 새로운 시작에 좋은 시기' : '🌱 계획을 차분히 세우세요',
                score: fireCount <= 2 ? 85 : 75
            },
            {
                month: '3-4월',
                season: '봄',
                element: '木',
                fortune: '🌸 성장과 발전의 에너지가 강함',
                score: 85
            },
            {
                month: '5-6월',
                season: '여름 시작',
                element: '火',
                fortune: fireCount >= 3 ? '☀️ 열기가 강해 휴식 필요' : '☀️ 활력이 최고조',
                score: fireCount >= 3 ? 70 : 90
            },
            {
                month: '7-8월',
                season: '여름',
                element: '火',
                fortune: fireCount >= 3 ? '🔥 감정 조절과 건강 관리 중요' : '🔥 열정적으로 추진하기 좋은 때',
                score: fireCount >= 3 ? 65 : 85
            },
            {
                month: '9-10월',
                season: '가을',
                element: '金',
                fortune: '🍂 차분히 정리하고 수확하는 시기',
                score: 80
            },
            {
                month: '11-12월',
                season: '겨울',
                element: '水',
                fortune: '❄️ 휴식과 재충전으로 다음을 준비',
                score: 75
            }
        ];
    }
}
