// 전역 스타일 필터 인스턴스
let globalStyleFilter = null;

// 앱 메인 로직
document.getElementById('sajuForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // 입력값 가져오기
    const year = parseInt(document.getElementById('year').value);
    const month = parseInt(document.getElementById('month').value);
    const day = parseInt(document.getElementById('day').value);
    const hour = parseInt(document.getElementById('hour').value);
    const gender = document.getElementById('gender').value;

    // 유효성 검사
    if (!validateInput(year, month, day)) {
        alert('올바른 날짜를 입력해주세요.');
        return;
    }

    // 로딩 표시
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '사주 계산 중...';
    submitBtn.disabled = true;

    try {
        // API를 사용한 사주 계산
        const calculator = new SajuCalculatorAPI(year, month, day, hour);
        const saju = await calculator.calculateSajuWithAPI();
        const elementCount = calculator.analyzeElements(saju);
        const elementAnalysis = calculator.findStrongElements(elementCount);
        const characteristics = calculator.analyzeCharacteristics(saju, elementAnalysis);

        // 2026년 운세 계산
        const fortune2026 = new Fortune2026(saju, elementCount, elementAnalysis);
        const fortuneResult = fortune2026.analyze();

        // 결과 표시 (부캐명은 나중에 타입 선택 시 생성)
        window.currentSajuData = {
            saju,
            elementCount,
            elementAnalysis,
            characteristics,
            gender,
            birthInfo: { year, month, day, hour },
            fortuneResult
        };
        displayResults(saju, elementCount, elementAnalysis, characteristics, fortuneResult);

        // 타입 선택 버튼 이벤트 리스너 추가
        setupNicknameTypeButtons();

        // 결과 섹션으로 스크롤
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('사주 계산 오류:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        alert('사주 계산 중 오류가 발생했습니다. 다시 시도해주세요.\n\n오류 내용: ' + error.message);
    } finally {
        // 버튼 복구
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// 입력값 유효성 검사
function validateInput(year, month, day) {
    if (year < 1900 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // 월별 일수 체크
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;

    return true;
}

// 사주팔자 표시
function displaySaju(saju) {
    // 천간과 지지 각각의 오행 색상 적용
    const sajuTable = `
        <table class="saju-table">
            <tr>
                <th>시주</th>
                <th>일주</th>
                <th>월주</th>
                <th>년주</th>
            </tr>
            <tr>
                <td>
                    <span class="${ELEMENT_PROPERTIES[FIVE_ELEMENTS[saju.hour.stem]].color}">${saju.hour.stem}</span>
                    <br>
                    <span class="${ELEMENT_PROPERTIES[FIVE_ELEMENTS[saju.hour.branch]].color}">${saju.hour.branch}</span>
                </td>
                <td>
                    <span class="${ELEMENT_PROPERTIES[FIVE_ELEMENTS[saju.day.stem]].color}">${saju.day.stem}</span>
                    <br>
                    <span class="${ELEMENT_PROPERTIES[FIVE_ELEMENTS[saju.day.branch]].color}">${saju.day.branch}</span>
                </td>
                <td>
                    <span class="${ELEMENT_PROPERTIES[FIVE_ELEMENTS[saju.month.stem]].color}">${saju.month.stem}</span>
                    <br>
                    <span class="${ELEMENT_PROPERTIES[FIVE_ELEMENTS[saju.month.branch]].color}">${saju.month.branch}</span>
                </td>
                <td>
                    <span class="${ELEMENT_PROPERTIES[FIVE_ELEMENTS[saju.year.stem]].color}">${saju.year.stem}</span>
                    <br>
                    <span class="${ELEMENT_PROPERTIES[FIVE_ELEMENTS[saju.year.branch]].color}">${saju.year.branch}</span>
                </td>
            </tr>
            <tr>
                <td colspan="4" style="background: #f8f9ff; padding: 10px;">
                    <strong>일간(본인):</strong> <span class="${ELEMENT_PROPERTIES[FIVE_ELEMENTS[saju.dayMaster]].color}">${saju.dayMaster}</span>
                    (${ELEMENT_PROPERTIES[FIVE_ELEMENTS[saju.dayMaster]].name})
                </td>
            </tr>
        </table>
    `;
    return sajuTable;
}

// 오행 분포 표시
function displayElementDistribution(elementCount, elementAnalysis) {
    const maxValue = Math.max(...Object.values(elementCount));

    let html = '<div style="margin-top: 20px;">';
    html += '<h4 style="color: #764ba2; margin-bottom: 15px;">오행 분포</h4>';

    for (const [element, count] of elementAnalysis.distribution) {
        const percentage = (count / maxValue) * 100;
        const props = ELEMENT_PROPERTIES[element];

        html += `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span class="${props.color}" style="font-weight: bold;">
                        ${props.name}
                    </span>
                    <span style="color: #666;">${count.toFixed(1)}</span>
                </div>
                <div style="background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
                    <div class="${props.color}" style="
                        width: ${percentage}%;
                        height: 100%;
                        background: ${getElementColor(element)};
                        transition: width 0.5s ease;
                    "></div>
                </div>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

// 오행별 색상
function getElementColor(element) {
    const colors = {
        '목': '#4caf50',
        '화': '#f44336',
        '토': '#ff9800',
        '금': '#9e9e9e',
        '수': '#2196f3'
    };
    return colors[element];
}

// 특성 표시
function displayCharacteristics(characteristics) {
    let html = '';
    characteristics.forEach(char => {
        html += `
            <div class="characteristic-item">
                <strong>${char.title}:</strong> ${char.description}
            </div>
        `;
    });
    return html;
}

// 부캐명 표시 (개선된 버전)
function displayNicknames(nicknames) {
    const typeTitle = nicknames.type === 'enhance'
        ? '💪 강점 극대화형'
        : '⚖️ 균형 보완형';

    let html = `
        <div class="nickname-card">
            <div style="font-size: 1em; opacity: 0.8; margin-bottom: 10px;">${typeTitle}</div>
            <div class="main-nickname">${nicknames.main.name}</div>
            <div class="description">${nicknames.main.description}</div>
        </div>
    `;

    html += '<div class="alternative-nicknames">';
    html += '<h4>🎮 다양한 스타일의 부캐명</h4>';

    nicknames.alternatives.forEach((alt, index) => {
        html += `
            <div class="nickname-option">
                <div class="name">${index + 1}. ${alt.name} <span style="color: #999; font-size: 0.9em;">[${alt.style}]</span></div>
                <div class="reason">${alt.reason}</div>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

// 전체 결과 표시
function displayResults(saju, elementCount, elementAnalysis, characteristics, fortuneResult) {
    // 사주 표시
    document.getElementById('sajuDisplay').innerHTML =
        displaySaju(saju) + displayElementDistribution(elementCount, elementAnalysis);

    // 특성 표시
    document.getElementById('characteristicsDisplay').innerHTML =
        displayCharacteristics(characteristics);

    // 2026년 운세는 별도 페이지로 이동 (fortune-2026.html)
    // 메인 페이지에서는 표시하지 않음

    // 스타일 필터 초기화 및 UI 생성
    initializeStyleFilter();

    // 부캐명은 스타일 선택 후 생성되도록 안내 메시지 표시
    displayNicknamePrompt();
}

// 타입 선택 버튼 설정
function setupNicknameTypeButtons() {
    const buttons = document.querySelectorAll('.type-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // 버튼 활성화 상태 변경
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 선택한 타입으로 부캐명 생성
            const type = this.dataset.type;
            generateAndDisplayNickname(type);
        });
    });
}

// 부캐명 생성 및 표시
function generateAndDisplayNickname(type) {
    const { saju, elementAnalysis, characteristics, birthInfo } = window.currentSajuData;

    // 선택된 스타일 가져오기
    const selectedStyles = globalStyleFilter ? globalStyleFilter.selectedStyles : null;

    // 개선된 부캐명 생성기 사용 (스타일 선호도 반영)
    const nicknameGen = new ImprovedNicknameGenerator(
        saju,
        elementAnalysis,
        characteristics,
        birthInfo,
        selectedStyles
    );
    const nicknames = nicknameGen.generate(type);

    // 부캐명 표시
    document.getElementById('nicknameDisplay').innerHTML = displayNicknames(nicknames);
}

// 2026년 운세 표시
function displayFortune2026(fortuneResult) {
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

    // 운세 카테고리 (종합, 사업/학업, 재물, 대인관계, 건강)
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

// 별명 생성 전 안내 메시지 표시
function displayNicknamePrompt() {
    const html = `
        <div style="text-align: center; padding: 40px; background: var(--revolut-card-bg); border-radius: var(--radius-lg); border: 2px dashed var(--revolut-gray-200);">
            <div style="font-size: 48px; margin-bottom: 20px;">🎨</div>
            <h3 style="color: var(--revolut-white); margin-bottom: 15px;">원하는 스타일을 선택해주세요</h3>
            <p style="color: var(--revolut-gray-500); margin-bottom: 20px;">
                스타일을 선택하면 더 맞춤형 별명을 추천해드립니다.<br>
                선택하지 않아도 괜찮아요!
            </p>
            <button class="filter-apply-btn" onclick="document.getElementById('applyFilterBtn').click()">
                별명 생성하기
            </button>
        </div>
    `;
    document.getElementById('nicknameDisplay').innerHTML = html;
}

// 스타일 필터 초기화
function initializeStyleFilter() {
    globalStyleFilter = new StyleFilter();

    const styleTagsContainer = document.getElementById('styleTags');
    styleTagsContainer.innerHTML = '';

    // 스타일 태그 생성
    for (const [key, style] of Object.entries(globalStyleFilter.styleCategories)) {
        const tag = document.createElement('div');
        tag.className = 'style-tag';
        tag.dataset.style = key;
        tag.innerHTML = `<span class="emoji">${style.emoji}</span><span>${style.name.split(' ')[1]}</span>`;

        tag.addEventListener('click', function() {
            this.classList.toggle('active');
            globalStyleFilter.toggleStyle(key);

            // 태그 변경 시 이미 별명이 생성되어 있으면 자동 재생성
            const nicknameDisplay = document.getElementById('nicknameDisplay');
            if (nicknameDisplay && nicknameDisplay.querySelector('.nickname-card')) {
                const activeTypeBtn = document.querySelector('.type-btn.active');
                const type = activeTypeBtn ? activeTypeBtn.dataset.type : 'enhance';
                generateAndDisplayNickname(type);
            }
        });

        styleTagsContainer.appendChild(tag);
    }

    // 필터 적용 버튼 이벤트 (별명 생성)
    document.getElementById('applyFilterBtn').addEventListener('click', function() {
        const activeTypeBtn = document.querySelector('.type-btn.active');
        const type = activeTypeBtn ? activeTypeBtn.dataset.type : 'enhance';
        generateAndDisplayNickname(type);
    });
}

// 입력 필드 포커스 효과
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s';
        });
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});

// 예제 데이터 채우기 (테스트용 - 개발 후 제거 가능)
function fillExample() {
    document.getElementById('year').value = 1990;
    document.getElementById('month').value = 6;
    document.getElementById('day').value = 15;
    document.getElementById('hour').value = 6;
    document.getElementById('gender').value = 'male';
}

// 개발 중 테스트를 위해 콘솔에 함수 노출
// fillExample(); // 주석 해제하면 자동으로 예제 데이터 채움

// 2026년 운세 페이지로 이동
function openFortunePage() {
    if (!window.currentSajuData) {
        alert('먼저 사주 분석을 완료해주세요.');
        return;
    }

    // localStorage에 데이터 저장
    localStorage.setItem('fortune2026Data', JSON.stringify({
        saju: window.currentSajuData.saju,
        elementCount: window.currentSajuData.elementCount,
        elementAnalysis: window.currentSajuData.elementAnalysis,
        characteristics: window.currentSajuData.characteristics,
        birthInfo: window.currentSajuData.birthInfo,
        fortuneResult: window.currentSajuData.fortuneResult
    }));

    // 페이지 이동 플래그 설정 (뒤로가기 감지용)
    sessionStorage.setItem('justNavigated', 'true');

    // 같은 탭에서 운세 페이지 열기
    window.location.href = 'fortune-2026.html';
}

// 애니 캐릭터 페이지 열기
function openAnimeCharacterPage() {
    if (!window.currentSajuData) {
        alert('먼저 사주 분석을 완료해주세요.');
        return;
    }

    // localStorage에 사주 데이터 저장
    localStorage.setItem('animeCharacterData', JSON.stringify({
        saju: window.currentSajuData.saju,
        elementCount: window.currentSajuData.elementCount,
        elementAnalysis: window.currentSajuData.elementAnalysis,
        characteristics: window.currentSajuData.characteristics,
        birthInfo: window.currentSajuData.birthInfo,
        fortuneResult: window.currentSajuData.fortuneResult
    }));

    // 페이지 이동 플래그 설정 (뒤로가기 감지용)
    sessionStorage.setItem('justNavigated', 'true');

    // 같은 탭에서 애니 캐릭터 페이지 열기
    window.location.href = 'anime-character.html';
}

// 페이지 로드 시 이전 결과 복원
window.addEventListener('DOMContentLoaded', function() {
    // sessionStorage로 "방금 페이지 이동했다가 돌아왔는지" 확인
    const justNavigated = sessionStorage.getItem('justNavigated');

    // justNavigated 플래그가 있으면 뒤로가기로 온 것
    if (justNavigated) {
        sessionStorage.removeItem('justNavigated'); // 플래그 제거

        // 뒤로가기로 온 경우 복원 시도
        const fortuneData = localStorage.getItem('fortune2026Data');
        const animeData = localStorage.getItem('animeCharacterData');

        if (fortuneData || animeData) {
            try {
                const data = JSON.parse(fortuneData || animeData);

                // window.currentSajuData 복원
                if (data.saju) {
                    window.currentSajuData = {
                        saju: data.saju,
                        elementCount: data.elementCount,
                        elementAnalysis: data.elementAnalysis,
                        characteristics: data.characteristics || {},
                        gender: data.birthInfo?.gender || 'male',
                        birthInfo: data.birthInfo,
                        fortuneResult: data.fortuneResult
                    };

                    // 먼저 결과 재표시
                    displayResults(
                        window.currentSajuData.saju,
                        window.currentSajuData.elementCount,
                        window.currentSajuData.elementAnalysis,
                        window.currentSajuData.characteristics,
                        window.currentSajuData.fortuneResult
                    );

                    // 타입 선택 버튼 이벤트 리스너 추가 (중요!)
                    setupNicknameTypeButtons();

                    // 그 다음 결과 영역 표시 (폼 숨기고 결과 보이기)
                    // 약간의 지연을 주어 displayResults가 DOM을 업데이트한 후 실행
                    setTimeout(() => {
                        // 인트로 및 입력 섹션 숨기기
                        const introSection = document.getElementById('introSection');
                        const inputSection = document.getElementById('inputSection');
                        const resultSection = document.getElementById('result');

                        if (introSection) introSection.style.display = 'none';
                        if (inputSection) inputSection.style.display = 'none';
                        if (resultSection) {
                            resultSection.style.display = 'block';
                            // 스크롤은 하지 않음 (뒤로가기니까)
                        }
                    }, 0);
                }
            } catch (error) {
                console.error('결과 복원 실패:', error);
            }
        }
    }
});
