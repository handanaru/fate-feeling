# Fate & Feeling PRD v0.1 (고민 해결형 사주 리포트)

## 0) 제품 한 줄 정의
사주를 보여주는 서비스가 아니라, **지금 고민의 다음 행동을 제시하는 프리미엄 의사결정 리포트**.

## 1) 포지셔닝
- Core JTBD: "재회/연애/재물/직업 고민에 대해 지금 뭘 해야 하는지 알고 싶다"
- 톤: 미니멀 럭셔리(딥 네이비 + 골드 포인트)
- 금지: 허브형 과밀 IA, 상품 과다 노출, 과한 컬러/장식

## 2) MVP IA
### Public
- `/` 홈(고민 선택 랜딩)
- `/report/:type` 상품 상세
- `/sample/:type` 샘플 리포트
- `/pricing` 가격
- `/about-method` 해석 기준/면책
- `/faq`

### Auth
- `/onboarding`
- `/checkout/:type`
- `/result/:reportId`
- `/my/reports`
- `/my/profile`
- `/ask`

### Admin
- `/admin/reports`
- `/admin/prompts`
- `/admin/pricing`
- `/admin/abtest`

## 3) 화면별 핵심 컴포넌트
### 홈 `/`
- Hero: "지금 가장 궁금한 고민은?"
- Concern Cards (5개): 재회/연애·궁합/재물·직업/3개월 월운/오늘의 운세(무료)
- Trust Strip: 누적 리포트 수, 만족도, 샘플 CTA
- Bottom CTA: "3분 안에 내 리포트 받기"

### 상품 상세 `/report/:type`
- 문제 공감 헤더
- 얻는 내용 4포인트
- 샘플 일부 공개(20~30%)
- 가격 카드(Basic / Premium)
- CTA

### 온보딩 `/onboarding`
- Step 1 생년월일 + 양/음력
- Step 2 출생시간(모름 허용)
- Step 3 성별
- Step 4 고민 선택 + 선택형 상세질문

### 결과 `/result/:id`
- 요약 지수(연애/재물/직업)
- 본문 4블록(현재흐름/타임라인/행동가이드/주의포인트)
- 잠금 섹션(프리미엄 질문 3개)

## 4) 전환 설계
- 무료 공개 20~30% + 핵심 인사이트 잠금
- 신뢰장치: 해석 기준 공개, 샘플 공개, 만족도/재열람률
- CTA 언어: 행동 지시형("다음 행동 확인하기")

## 5) 데이터 스키마 (초안)
### users
- id, createdAt, loginType, marketingConsent

### user_profiles
- userId, birthDate, calendarType(solar/lunar), birthTime(known/unknown), gender

### reports
- id, userId, reportType(reunion/love/wealth/career/monthly),
- finalScore, gradeBand, summary,
- timelineJson, actionGuideJson, cautionJson,
- isPremiumUnlocked, createdAt, updatedAt

### report_events
- id, reportId, eventType(view/cta_click/unlock/pay_success), metaJson, createdAt

### purchases
- id, userId, reportId, planType(basic/premium), amount, currency, status, paidAt

### ab_assignments
- userId, experimentKey, variant, assignedAt

## 6) API 엔드포인트 (초안)
- `POST /api/onboarding`
- `POST /api/reports/generate`
- `GET /api/reports/:id`
- `POST /api/reports/:id/unlock`
- `GET /api/my/reports`
- `POST /api/payments/checkout`
- `POST /api/events`
- `GET /api/admin/reports/quality`

## 7) 우선순위 백로그
### P0
- 고민형 랜딩
- 온보딩 폼
- 결과 리포트 생성
- 유료 잠금 해제
- 보관함

### P1
- 샘플 리포트
- 후속 질문 3개
- 리마인드 알림

### P2
- 2인 궁합 입력
- 시즌 랜딩
- 상담 연계(제휴)

## 8) 디자인 시스템 가이드(초안)
- 컬러: Deep Navy 기반 + Gold Accent 최소 사용
- 아이콘: 단색 라인 아이콘 통일
- 카드 반경/그림자 규칙 통일
- 모바일 우선(390~430px) 터치 영역 44px+

## 9) 이번 리뉴얼 실행 루프(30분 스프린트)
1. 문제 하나만 선택(FAB/홈카드/결과 CTA 등)
2. 구현 + 모바일 QA
3. `public ↔ fate-feeling/public` 동기화
4. 커밋 + 결과 요약

---
다음 단계: v0.2에서 실제 페이지별 컴포넌트 명세(Props/State/Events)와 API request/response 샘플 추가.
