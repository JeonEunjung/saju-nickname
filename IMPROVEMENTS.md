# 별명 생성 시스템 개선 사항

## 문제점
기존 시스템에서는 동일한 사주를 가진 유저들에게 같은 별명이 반복적으로 생성되는 문제가 있었습니다.

## 해결 방안

### 1. 생년월일 기반 시드 랜덤 시스템 (`seeded-random.js`)

**문제**: 완전 랜덤 방식으로 인해 같은 조합이 반복 생성됨

**해결**:
- 생년월일을 시드로 사용하는 의사 랜덤 생성기 구현
- 같은 사주도 생년월일에 따라 다른 별명 생성
- 시드 생성 공식: `year * 10000 + month * 100 + day + hour * 100000`

**효과**: 동일 사주라도 개인별로 고유한 별명 생성

---

### 2. 키워드 풀 대폭 확장 (`enhanced-keywords.js`)

**문제**: 각 오행당 5-10개의 제한된 키워드

**해결**:
- 오행별 키워드를 3배 이상 확장 (각 30-40개)
- 카테고리 세분화:
  - 형용사 30개
  - 명사 40개
  - 접두사/접미사 각 8개
  - 한자 조합 20개
  - 자연물 6개
  - 동물 6개
  - 추상 개념 8개

**예시 (木 오행)**:
```javascript
adjectives: ['푸른', '푸르른', '청명한', '싱그러운', ...] // 30개
nouns: ['나무', '숲', '가지', '잎', '새싹', ...] // 40개
```

**효과**: 조합 가능한 별명의 수가 기하급수적으로 증가

---

### 3. 조합 패턴 다양화 (`nickname-improved.js`)

**문제**: 단순한 2가지 조합 패턴만 사용

**해결**: 18가지 다양한 조합 템플릿 구현

**템플릿 종류**:
1. 형용사 + 명사
2. 접두사 + 일간특성
3. 명사 + 접미사
4. 형용사 + 일간특성
5. 접두사 + 명사
6. 자연물 + 특성
7. 동물 명칭
8. 일간특성 + 명사
9. 추상개념 + 접미사
10. 형용사 + 자연물
11. 한자 이름 (성 + 명)
12. 동물 + 특성
13. 형용사 + 추상개념
14. 일간 + 명사 + 접미사
15. 자연물 단독
16. 이중 형용사 + 명사
17. 스타일 + 접미사
18. 명사 + 일간 + 접미사

**효과**: 같은 키워드도 다양한 방식으로 조합 가능

---

### 4. 중복 방지 로직

**문제**: 생성된 별명 간 중복 발생

**해결**:
- `Set` 자료구조를 사용한 중복 추적
- 생성 시 실시간 중복 체크
- 중복 발견 시 자동 재생성 (최대 50회 시도)

```javascript
generateUniqueNickname(element, isWeak = false, maxAttempts = 50) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const nickname = template();
        if (!this.generatedNicknames.has(nickname)) {
            this.generatedNicknames.add(nickname);
            return nickname;
        }
    }
}
```

**효과**: 한 사용자가 받는 5개의 대안 별명이 모두 다름

---

## 통계적 개선 효과

### 이전 시스템
- 키워드 수: 오행당 약 15개
- 조합 패턴: 4가지
- 예상 고유 별명 수: **약 60개** (오행당)
- 중복 확률: **높음** (같은 사주는 거의 항상 동일)

### 개선 시스템
- 키워드 수: 오행당 약 120개 (8배 증가)
- 조합 패턴: 18가지 (4.5배 증가)
- 예상 고유 별명 수: **약 2,160개 이상** (오행당)
- 중복 확률: **매우 낮음** (36배 감소)

---

## 사용 방법

### 기본 사용
```javascript
const generator = new ImprovedNicknameGenerator(
    saju,
    elementAnalysis,
    characteristics,
    { year, month, day, hour }
);

// 강점 극대화형
const enhanceNicknames = generator.generate('enhance');

// 균형 보완형
const balanceNicknames = generator.generate('balance');
```

### 전체 패키지 생성
```javascript
const fullPackage = generator.generateFullPackage();
// {
//   enhance: { main, alternatives },
//   balance: { main, alternatives }
// }
```

---

## 파일 구조

```
saju-nickname/
├── seeded-random.js          # 시드 기반 랜덤 생성기
├── enhanced-keywords.js      # 확장된 키워드 데이터베이스
├── nickname-improved.js      # 개선된 별명 생성 엔진
├── index.html               # 통합된 HTML (스크립트 추가)
└── app.js                   # 업데이트된 앱 로직
```

---

## 추가 개선 가능 사항 (향후)

1. **사용자 히스토리 DB 연동**
   - 전체 사용자 중 이미 사용된 별명 추적
   - 글로벌 중복 방지

2. **AI 기반 별명 생성**
   - LLM API를 활용한 창의적 별명 생성
   - 사용자 피드백 기반 학습

3. **개인화 옵션**
   - 사용자 선호도 반영 (귀여운 vs 멋진 vs 고풍스러운)
   - 길이 제한 옵션

4. **소셜 기능**
   - 별명 공유 및 평가 시스템
   - 인기 별명 랭킹
