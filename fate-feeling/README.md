# Fate & Feeling (MVP)

감성 톤 기반 관계 회복 MVP 웹 프로젝트입니다.

## 실행 방법

```bash
cd fate-feeling
npm install
npm start
```

- 기본 포트: `3200`
- 접속 URL: `http://localhost:3200`

## 페이지 경로

- `/` : 랜딩 (공감 카피 + 시작 CTA)
- `/test.html` : 12문항 심리 테스트
- `/result.html` : 결과 요약 (감정 분석 + 행동 가이드 3개 + 다음 CTA)
- `/experts.html` : 재회 타로/사주 상담사 카드(더미)
- `/ai.html` : 무료 AI 코치 체험 UI (입력 후 샘플 맞춤 조언)
- `/community.html` : 정모/후기 피드(더미)

## 구현 포인트

- Node + Express 정적 서버
- test → result 실제 연결 (`localStorage` 기반 결과 전달)
- 라이트/다크 모드 토글
- 모바일 반응형 레이아웃
- 과장/자극을 피한 감성 톤 문구
