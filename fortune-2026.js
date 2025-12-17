// 2026년 운세 생성 함수 (전역)
function generateFortune2026(sajuData, birthData) {
    const fortune2026 = new Fortune2026(
        sajuData,
        sajuData.elementCount,
        sajuData.elementAnalysis
    );
    const fortuneResult = fortune2026.analyze();
    return generateFortuneHTML(fortuneResult);
}

// HTML 생성 함수
function generateFortuneHTML(fortuneResult) {
    let html = '';

    // 연도 정보
    const yearInfo = fortuneResult.yearInfo;
    html += `
        <div class="fortune-year-info">
            <span class="year-emoji">${yearInfo.emoji}</span>
            <div class="year-title">${yearInfo.title}</div>
            <div class="year-description">${yearInfo.description}</div>
            <div class="year-keywords">
                ${yearInfo.keywords.map(keyword => `<span class="year-keyword">${keyword}</span>`).join('')}
            </div>
        </div>
    `;

    // 오행 영향
    if (fortuneResult.elementImpact && fortuneResult.elementImpact.length > 0) {
        html += '<div class="fortune-element-impacts">';
        fortuneResult.elementImpact.forEach(impact => {
            html += `
                <div class="fortune-impact-item ${impact.type}">
                    <div class="fortune-impact-header">
                        <span class="fortune-impact-icon">${impact.icon}</span>
                        <span class="fortune-impact-title">${impact.title}</span>
                    </div>
                    <div class="fortune-impact-description">${impact.description}</div>
                    <div class="fortune-impact-advice">${impact.advice}</div>
                </div>
            `;
        });
        html += '</div>';
    }

    // 운세 카테고리
    const fortune = fortuneResult.fortune;
    html += '<div class="fortune-categories">';

    // 종합 운세
    html += `
        <div class="fortune-category">
            <div class="fortune-category-header">
                <span class="fortune-category-title">🔮 종합 운세</span>
                <div class="fortune-score">
                    <div class="fortune-score-bar">
                        <div class="fortune-score-fill" style="width: ${fortune.overall.score}%"></div>
                    </div>
                    <span class="fortune-score-value">${fortune.overall.score}</span>
                </div>
            </div>
            <div class="fortune-category-description">${fortune.overall.description}</div>
        </div>
    `;

    // 사업/학업 운세
    html += `
        <div class="fortune-category">
            <div class="fortune-category-header">
                <span class="fortune-category-title">💼 사업/학업 운세</span>
                <div class="fortune-score">
                    <div class="fortune-score-bar">
                        <div class="fortune-score-fill" style="width: ${fortune.career.score}%"></div>
                    </div>
                    <span class="fortune-score-value">${fortune.career.score}</span>
                </div>
            </div>
            <div class="fortune-category-description">${fortune.career.description}</div>
            <div class="fortune-category-tips">
                ${fortune.career.tips.map(tip => `<div class="fortune-tip">${tip}</div>`).join('')}
            </div>
        </div>
    `;

    // 재물 운세
    html += `
        <div class="fortune-category">
            <div class="fortune-category-header">
                <span class="fortune-category-title">💰 재물 운세</span>
                <div class="fortune-score">
                    <div class="fortune-score-bar">
                        <div class="fortune-score-fill" style="width: ${fortune.wealth.score}%"></div>
                    </div>
                    <span class="fortune-score-value">${fortune.wealth.score}</span>
                </div>
            </div>
            <div class="fortune-category-description">${fortune.wealth.description}</div>
            <div class="fortune-category-tips">
                ${fortune.wealth.tips.map(tip => `<div class="fortune-tip">${tip}</div>`).join('')}
            </div>
        </div>
    `;

    // 대인관계 운세
    html += `
        <div class="fortune-category">
            <div class="fortune-category-header">
                <span class="fortune-category-title">🤝 대인관계 운세</span>
                <div class="fortune-score">
                    <div class="fortune-score-bar">
                        <div class="fortune-score-fill" style="width: ${fortune.relationship.score}%"></div>
                    </div>
                    <span class="fortune-score-value">${fortune.relationship.score}</span>
                </div>
            </div>
            <div class="fortune-category-description">${fortune.relationship.description}</div>
            <div class="fortune-category-tips">
                ${fortune.relationship.tips.map(tip => `<div class="fortune-tip">${tip}</div>`).join('')}
            </div>
        </div>
    `;

    // 건강 운세
    html += `
        <div class="fortune-category">
            <div class="fortune-category-header">
                <span class="fortune-category-title">🏥 건강 운세</span>
                <div class="fortune-score">
                    <div class="fortune-score-bar">
                        <div class="fortune-score-fill" style="width: ${fortune.health.score}%"></div>
                    </div>
                    <span class="fortune-score-value">${fortune.health.score}</span>
                </div>
            </div>
            <div class="fortune-category-description">${fortune.health.description}</div>
            <div class="fortune-category-tips">
                ${fortune.health.tips.map(tip => `<div class="fortune-tip">${tip}</div>`).join('')}
            </div>
        </div>
    `;

    html += '</div>';

    // 추천 사항
    const recommendations = fortuneResult.recommendations;
    html += `
        <div class="fortune-recommendations">
            <div class="fortune-recommendation-box do-list">
                <div class="fortune-recommendation-title">✅ 이렇게 하세요</div>
                <div class="fortune-recommendation-list">
                    ${recommendations.doList.map(item => `<div class="fortune-recommendation-item">${item}</div>`).join('')}
                </div>
            </div>
            <div class="fortune-recommendation-box dont-list">
                <div class="fortune-recommendation-title">⚠️ 조심하세요</div>
                <div class="fortune-recommendation-list">
                    ${recommendations.dontList.map(item => `<div class="fortune-recommendation-item">${item}</div>`).join('')}
                </div>
            </div>
        </div>
    `;

    // 월별 운세
    const monthlyFortune = fortuneResult.monthlyFortune;
    html += `
        <div class="fortune-monthly">
            <div class="fortune-monthly-title">📅 월별 운세</div>
            <div class="fortune-monthly-grid">
                ${monthlyFortune.map(month => `
                    <div class="fortune-month-item">
                        <div class="fortune-month-header">
                            <span class="fortune-month-name">${month.month}</span>
                            <span class="fortune-month-score">${month.score}점</span>
                        </div>
                        <div class="fortune-month-season">${month.season} (${month.element})</div>
                        <div class="fortune-month-fortune">${month.fortune}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    return html;
}

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

        // 일간(본인) 추출
        this.dayMaster = saju.dayMaster;

        // 일간별 2026년 十神 관계 정의
        this.tenGodRelation = this.getTenGodRelation();
    }

    // 일간과 2026년(丙午 - 火火)의 십신 관계 계산
    getTenGodRelation() {
        const dayMasterElement = FIVE_ELEMENTS[this.dayMaster];
        const yearElement = '화'; // 2026년은 丙午 모두 火

        // 십신 관계 맵
        const relations = {
            '목': {
                '화': {
                    name: '식상(食傷)',
                    type: 'expression',
                    meaning: '표현력, 창작력, 설기(洩氣)',
                    icon: '🎨',
                    positive: ['창의력 발휘', '표현력 극대화', '재능 개화'],
                    negative: ['에너지 소모', '말 조심', '과도한 활동'],
                    score: 75
                }
            },
            '화': {
                '화': {
                    name: '비겁(比劫)',
                    type: 'competition',
                    meaning: '경쟁자, 동료, 형제',
                    icon: '🤝',
                    positive: ['협력 기회', '동료 지원', '네트워킹'],
                    negative: ['경쟁 심화', '재물 분산', '독립심 필요'],
                    score: 70
                }
            },
            '토': {
                '화': {
                    name: '인성(印星)',
                    type: 'support',
                    meaning: '학문, 명예, 도움',
                    icon: '📚',
                    positive: ['학업 운 상승', '귀인 도움', '안정과 성장'],
                    negative: ['의존성 주의', '수동적 태도'],
                    score: 85
                }
            },
            '금': {
                '화': {
                    name: '관살(官殺)',
                    type: 'pressure',
                    meaning: '압박, 도전, 규율',
                    icon: '⚔️',
                    positive: ['책임감 향상', '성장 기회', '극복할 목표'],
                    negative: ['스트레스', '압박감', '건강 주의'],
                    score: 65
                }
            },
            '수': {
                '화': {
                    name: '재성(財星)',
                    type: 'wealth',
                    meaning: '재물, 기회, 여유',
                    icon: '💰',
                    positive: ['재물운 상승', '기회 확대', '투자 적기'],
                    negative: ['욕심 조심', '과소비 주의'],
                    score: 88
                }
            }
        };

        return relations[dayMasterElement]?.[yearElement] || null;
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
        return {
            overall: this.getOverallFortune(),
            career: this.getCareerFortune(),
            wealth: this.getWealthFortune(),
            relationship: this.getRelationshipFortune(),
            health: this.getHealthFortune()
        };
    }

    // 전체 운세
    getOverallFortune() {
        const relation = this.tenGodRelation;
        let score = 75;
        let description = '';

        if (!relation) {
            description = '2026년은 새로운 변화와 기회의 해입니다. 적극적으로 행동하며 긍정적인 마음가짐을 유지하세요.';
            return { score, description };
        }

        // 십신 관계에 따른 기본 점수
        score = relation.score;

        // 십신별 종합 운세 설명
        switch (relation.type) {
            case 'expression': // 식상 - 木일간
                description = `2026년은 ${relation.name}의 해로 창의력과 표현력이 극대화됩니다. 재능을 마음껏 발휘할 수 있는 좋은 시기이나, 에너지 소모가 클 수 있으니 적절한 휴식이 필요합니다. 자신의 아이디어를 적극 표현하되, 말과 행동에 신중함을 더하세요.`;
                break;
            case 'competition': // 비겁 - 火일간
                description = `2026년은 ${relation.name}의 해로 동료, 친구, 경쟁자들과의 관계가 중요해집니다. 협력하면 큰 힘이 되지만, 과도한 경쟁은 에너지를 소모시킵니다. 독립적으로 행동하되 필요할 때는 협력하는 지혜가 필요한 해입니다.`;
                break;
            case 'support': // 인성 - 土일간
                description = `2026년은 ${relation.name}의 해로 배움과 성장의 기회가 많습니다. 귀인의 도움을 받기 쉽고, 새로운 지식과 기술을 습득하기 좋은 시기입니다. 안정적으로 성장할 수 있는 매우 좋은 해이니 적극적으로 학습하고 발전하세요.`;
                break;
            case 'pressure': // 관살 - 金일간
                description = `2026년은 ${relation.name}의 해로 도전과 압박이 많을 수 있습니다. 책임감이 커지고 극복해야 할 과제들이 있지만, 이를 통해 크게 성장할 수 있습니다. 스트레스 관리를 잘하고 건강에 유의하며, 압박을 성장의 기회로 만드세요.`;
                break;
            case 'wealth': // 재성 - 水일간
                description = `2026년은 ${relation.name}의 해로 재물운이 매우 좋습니다. 수입 증대, 투자 기회, 사업 확장 등 재정적 기회가 많이 찾아옵니다. 욕심을 부리지 말고 계획적으로 관리한다면 큰 성과를 거둘 수 있는 최고의 해입니다.`;
                break;
        }

        return { score, description };
    }

    // 사업/학업 운세
    getCareerFortune() {
        const relation = this.tenGodRelation;
        let score = 75;
        let description = '';
        let tips = [];

        if (!relation) {
            description = '적극적인 자세로 기회를 포착하세요.';
            tips = ['꾸준한 노력', '새로운 학습', '인맥 관리'];
            return { score, description, tips };
        }

        switch (relation.type) {
            case 'expression': // 식상 - 木일간
                score = 82;
                description = '창작, 기획, 표현이 중요한 일에서 두각을 나타냅니다. 콘텐츠 제작, 디자인, 마케팅, 교육 분야에서 좋은 성과를 낼 수 있습니다. 다만 혼자 과도하게 일하면 번아웃이 올 수 있으니 적절히 분배하세요.';
                tips = ['창의적 프로젝트 주도', '자신의 아이디어 적극 표현', '개인 브랜딩 강화', '적절한 휴식 확보'];
                break;
            case 'competition': // 비겁 - 火일간
                score = 72;
                description = '동료, 경쟁자와의 관계가 성과에 큰 영향을 미칩니다. 팀 프로젝트나 파트너십은 좋지만, 혼자 독식하려는 태도는 갈등을 일으킬 수 있습니다. 협력과 독립의 균형이 중요합니다.';
                tips = ['팀워크 중시', '과도한 경쟁 자제', '공동 목표 설정', '독립적 판단력 유지'];
                break;
            case 'support': // 인성 - 土일간
                score = 90;
                description = '학업, 자격증, 전문성 향상에 최적의 해입니다. 멘토나 스승의 도움을 받기 쉽고, 새로운 분야를 배우기 좋습니다. 공부하거나 연구하는 일, 전문직 종사자에게 특히 유리합니다.';
                tips = ['새로운 자격증 취득', '전문 교육 이수', '멘토 찾기', '학술 활동 참여'];
                break;
            case 'pressure': // 관살 - 金일간
                score = 68;
                description = '책임과 압박이 큰 한 해입니다. 승진, 중요 프로젝트 책임 등 부담스러운 일이 많지만, 이를 잘 해내면 크게 성장합니다. 스트레스 관리가 핵심이며, 무리하지 말고 계획적으로 대응하세요.';
                tips = ['책임감 있게 임하기', '스트레스 관리법 익히기', '단계적 목표 설정', '건강 최우선'];
                break;
            case 'wealth': // 재성 - 水일간
                score = 85;
                description = '사업 확장, 투자, 수익 창출에 좋은 해입니다. 특히 영업, 사업, 부동산 관련 일에서 좋은 기회가 찾아옵니다. 적극적으로 기회를 잡되, 욕심을 부리지 말고 계획적으로 진행하세요.';
                tips = ['사업 확장 검토', '새로운 수익원 개척', '투자 기회 포착', '계획적 실행'];
                break;
        }

        return { score, description, tips };
    }

    // 재물 운세
    getWealthFortune() {
        const relation = this.tenGodRelation;
        let score = 70;
        let description = '';
        let tips = [];

        if (!relation) {
            description = '계획적인 재무 관리를 통해 안정을 유지하세요.';
            tips = ['꾸준한 저축', '충동구매 자제', '재무 계획 수립'];
            return { score, description, tips };
        }

        switch (relation.type) {
            case 'expression': // 식상 - 木일간
                score = 78;
                description = '창작 활동, 프리랜싱, 부업으로 수입을 늘릴 수 있습니다. 재능을 활용한 수익 창출이 좋습니다. 다만 에너지를 많이 쓰는 만큼 수입도 들쭉날쭉할 수 있으니 저축을 꾸준히 하세요.';
                tips = ['재능을 활용한 부업', '크리에이티브 수익 창출', '정기 저축 습관', '변동 수입 대비'];
                break;
            case 'competition': // 비겁 - 火일간
                score = 65;
                description = '재물 분산에 주의가 필요합니다. 친구나 동업자와의 금전 거래는 신중히 하세요. 혼자 재정을 관리하고, 불필요한 지출을 줄이는 것이 중요합니다. 공동 투자는 피하는 것이 좋습니다.';
                tips = ['개인 재무 독립', '공동 투자 신중', '계약서 철저히', '불필요한 지출 줄이기'];
                break;
            case 'support': // 인성 - 土일간
                score = 70;
                description = '안정적이지만 크게 늘지는 않는 재물운입니다. 교육이나 자기계발에 투자하면 장기적으로 도움이 됩니다. 부모님이나 멘토의 재정적 지원을 받을 수도 있습니다.';
                tips = ['자기계발 투자', '장기 안정 자산', '교육비 아끼지 않기', '멘토 조언 구하기'];
                break;
            case 'pressure': // 관살 - 金일간
                score = 62;
                description = '지출이 많고 재정 압박을 느낄 수 있습니다. 세금, 벌금, 의료비 등 예상치 못한 지출이 생길 수 있으니 비상금을 준비하세요. 무리한 투자나 대출은 피하고, 보수적으로 관리하세요.';
                tips = ['비상금 확보', '보수적 재무 관리', '불필요한 대출 자제', '건강 관리로 의료비 절감'];
                break;
            case 'wealth': // 재성 - 水일간
                score = 92;
                description = '최고의 재물운을 누리는 해입니다! 수입 증대, 사업 성공, 투자 수익 등 다양한 재정적 기회가 찾아옵니다. 부동산, 주식, 사업 확장 모두 좋은 시기입니다. 다만 과욕은 금물이며, 세금과 기부를 통해 나누는 마음도 중요합니다.';
                tips = ['적극적 투자 검토', '사업 확장 기회 포착', '부동산 매입 고려', '계획적 지출 유지'];
                break;
        }

        return { score, description, tips };
    }

    // 대인관계 운세
    getRelationshipFortune() {
        const relation = this.tenGodRelation;
        let score = 80;
        let description = '';
        let tips = [];

        if (!relation) {
            description = '진솔한 소통으로 관계를 깊게 만드세요.';
            tips = ['정기적 연락', '경청하기', '신뢰 구축'];
            return { score, description, tips };
        }

        switch (relation.type) {
            case 'expression': // 식상 - 木일간
                score = 82;
                description = '표현력이 좋아 많은 사람들과 소통하기 좋습니다. SNS, 모임 등에서 인기를 끌 수 있습니다. 다만 말이 많아질 수 있으니 때로는 경청하는 자세도 필요합니다.';
                tips = ['적극적 소통', 'SNS 활동 강화', '경청의 자세', '말 조심'];
                break;
            case 'competition': // 비겁 - 火일간
                score = 75;
                description = '친구, 동료와의 관계가 중요합니다. 함께하면 시너지가 나지만, 경쟁심이 생기면 갈등이 될 수 있습니다. 이해관계를 떠나 순수한 우정을 나누는 것이 좋습니다.';
                tips = ['순수한 우정 추구', '경쟁보다 협력', '금전 거래 신중', '개인 영역 존중'];
                break;
            case 'support': // 인성 - 土일간
                score = 88;
                description = '귀인의 도움을 많이 받는 해입니다. 멘토, 선배, 선생님 등 윗사람과의 관계가 좋습니다. 겸손한 자세로 배우려는 태도를 가지면 많은 도움을 받을 수 있습니다.';
                tips = ['멘토 관계 강화', '겸손한 자세', '배움의 태도', '감사 표현'];
                break;
            case 'pressure': // 관살 - 金일간
                score = 68;
                description = '상사, 고객, 권위자와의 관계에서 긴장감이 있을 수 있습니다. 갈등이나 마찰이 생기기 쉬우니 신중하게 대응하세요. 감정 조절이 중요하며, 필요시 전문가의 도움을 받으세요.';
                tips = ['감정 조절 연습', '신중한 언행', '전문가 조언 구하기', '스트레스 해소'];
                break;
            case 'wealth': // 재성 - 水일간
                score = 85;
                description = '비즈니스 관계, 고객 관계가 좋습니다. 사람을 통해 재물과 기회를 얻을 수 있습니다. 네트워킹에 적극 참여하고, 윈윈 관계를 만들어가세요.';
                tips = ['적극적 네트워킹', '비즈니스 관계 강화', '윈윈 마인드', '고객 관리'];
                break;
        }

        return { score, description, tips };
    }

    // 건강 운세
    getHealthFortune() {
        const relation = this.tenGodRelation;
        let score = 75;
        let description = '';
        let tips = [];

        if (!relation) {
            description = '활력이 넘치는 한 해입니다. 규칙적인 운동으로 건강을 유지하세요.';
            tips = ['규칙적 운동', '균형잡힌 식사', '충분한 수면'];
            return { score, description, tips };
        }

        switch (relation.type) {
            case 'expression': // 식상 - 木일간
                score = 72;
                description = '에너지 소모가 큰 해입니다. 과로, 번아웃, 목-어깨 통증에 주의하세요. 충분한 휴식과 영양 섭취가 중요합니다. 말을 많이 하면 목이 쉴 수 있으니 성대 관리도 필요합니다.';
                tips = ['적절한 휴식 확보', '영양 보충', '목-어깨 스트레칭', '성대 관리'];
                break;
            case 'competition': // 비겁 - 火일간
                score = 70;
                description = '火 과다로 열성 질환 주의가 필요합니다. 혈압, 심장, 피부 트러블, 염증 등을 체크하세요. 흥분하거나 화를 내면 건강에 악영향을 미칠 수 있으니 감정 조절이 중요합니다.';
                tips = ['혈압 체크', '시원한 음식', '감정 조절', '피부 관리'];
                break;
            case 'support': // 인성 - 土일간
                score = 78;
                description = '비교적 안정적인 건강 상태를 유지합니다. 소화기, 비장, 근육 계통을 보호하세요. 좋은 음식을 먹고 규칙적인 생활을 하면 건강이 더욱 좋아집니다.';
                tips = ['소화 잘되는 음식', '규칙적인 식사', '근력 운동', '충분한 휴식'];
                break;
            case 'pressure': // 관살 - 金일간
                score = 62;
                description = '스트레스로 인한 건강 악화에 주의하세요. 호흡기, 폐, 대장, 피부 등 金에 해당하는 부위가 약해질 수 있습니다. 정기 검진을 받고, 스트레스 관리를 철저히 하세요.';
                tips = ['정기 건강 검진', '스트레스 해소법 익히기', '호흡 운동', '명상이나 요가'];
                break;
            case 'wealth': // 재성 - 水일간
                score = 80;
                description = '활력이 넘치는 건강한 해입니다. 다만 바쁘게 움직이다 보면 과로할 수 있으니 적절한 휴식을 취하세요. 신장, 방광, 생식기 계통은 정기적으로 체크하는 것이 좋습니다.';
                tips = ['규칙적 운동', '과로 주의', '충분한 수분 섭취', '정기 검진'];
                break;
        }

        return { score, description, tips };
    }

    // 추천 행동
    getRecommendations() {
        const relation = this.tenGodRelation;
        const doList = [];
        const dontList = [];

        if (!relation) {
            doList.push('🎯 새로운 도전과 프로젝트 시작하기');
            doList.push('🌟 적극적으로 기회 잡기');
            doList.push('💪 건강한 운동으로 에너지 소화');
            dontList.push('🌙 충분한 휴식 소홀히 하지 않기');
            dontList.push('🍀 주변 사람들과의 소통 소홀히 하지 않기');
            return { doList, dontList };
        }

        switch (relation.type) {
            case 'expression': // 식상 - 木일간
                doList.push('🎨 창의적 프로젝트나 콘텐츠 제작');
                doList.push('📢 자신의 생각과 아이디어 적극 표현');
                doList.push('🎓 교육, 강의, 멘토링 활동');
                doList.push('💡 개인 브랜딩 및 SNS 활동');

                dontList.push('⚠️ 과도한 업무로 번아웃되지 않기');
                dontList.push('🤐 말 조심 (언행으로 인한 분쟁 주의)');
                dontList.push('💤 충분한 휴식 확보하기');
                break;
            case 'competition': // 비겁 - 火일간
                doList.push('🤝 동료, 친구와의 협력 프로젝트');
                doList.push('🎯 독립적인 사업이나 활동 시작');
                doList.push('🏋️ 규칙적인 운동으로 에너지 발산');
                doList.push('👥 순수한 인간관계 맺기');

                dontList.push('⚔️ 과도한 경쟁심 갖지 않기');
                dontList.push('💰 친구와의 금전 거래 신중히');
                dontList.push('🔥 감정 조절 (화, 흥분 주의)');
                break;
            case 'support': // 인성 - 土일간
                doList.push('📚 학습, 자격증, 전문 교육 이수');
                doList.push('🎓 석박사 과정이나 전문 과정 등록');
                doList.push('👨‍🏫 멘토, 스승 찾아 배우기');
                doList.push('📖 독서와 공부에 시간 투자');

                dontList.push('🏃 너무 수동적이지 않기');
                dontList.push('🍀 의존성 주의 (스스로 판단하기)');
                dontList.push('💤 안주하지 말고 성장하기');
                break;
            case 'pressure': // 관살 - 金일간
                doList.push('📋 체계적인 계획과 목표 수립');
                doList.push('🧘 스트레스 관리 방법 익히기');
                doList.push('💊 정기 건강 검진받기');
                doList.push('🎯 단계적으로 목표 달성하기');

                dontList.push('😰 과도한 스트레스 받지 않기');
                dontList.push('🔥 무리한 일정 잡지 않기');
                dontList.push('💢 권위자와의 갈등 피하기');
                break;
            case 'wealth': // 재성 - 水일간
                doList.push('💰 투자 기회 적극 검토하기');
                doList.push('🏢 사업 확장이나 신규 사업 시작');
                doList.push('🏠 부동산 매입 검토하기');
                doList.push('🤝 비즈니스 네트워킹 강화');

                dontList.push('💸 과욕 부리지 않기');
                dontList.push('🎰 무리한 투자나 도박 자제');
                dontList.push('💳 과소비 주의하기');
                break;
        }

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
