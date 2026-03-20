# 역사전쟁: 삼국시대 개발 일지

> 역사전쟁: 삼국시대 실시간 멀티플레이 교육용 게임

## 프로젝트 개요

**프로젝트명**: 역사전쟁: 삼국시대
**설명**: 삼국시대(고구려, 백제, 신라)를 배경으로 한 실시간 멀티플레이 역사 교육 게임
**버전**: 0.0.1

### 기술 스택

**Frontend**
- React 18.3.1
- TypeScript 5.6.2
- Vite 5.4.10
- TailwindCSS 4.0.0
- Framer Motion 11.0.0
- Socket.io-client 4.8.1
- Zustand 4.5.7

**Backend**
- Node.js + Express 4.18.2
- TypeScript 5.3.2
- Socket.io 4.7.2
- Google Generative AI 0.24.1
- UUID 9.0.1

---

## 주요 기능

### 게임 모드
- 싱글플레이어 (AI 상대)
- 멀티플레이어 (실시간 대전)
- 교사용 대시보드
- 튜토리얼 모드

### 핵심 시스템
- 실시간 채팅 (팀/외교/공개)
- AI 어드바이저
- 전투 시스템
- 이벤트 시스템
- 국가 선택 및 관리

---

## 개발 이력

### 2024-12-04

#### 프로젝트 정리
- 테스트 파일 삭제 (test-*.js)
- 데모 스크립트 삭제 (demo-*.js, demo-*.sh)
- 문서 파일 정리 (README.md, plan.md 등)
- screenshots/, docs/ 폴더 삭제
- 프로덕션 배포를 위한 코드베이스 정리 완료

#### 채팅 기능 수정 완료
- ChatPanel z-index 증가 및 AnimatePresence 추가
- 서버에서 메시지 발신자에게도 chatMessage 전송
- 팀/외교/공개 채팅 모두 정상 작동 확인

---

## 향후 계획

### 단기 목표
- [ ] 프로덕션 환경 배포 준비
- [ ] 성능 최적화
- [ ] 버그 수정 및 안정화

### 중기 목표
- [ ] 추가 이벤트 컨텐츠 개발
- [ ] AI 어드바이저 기능 개선
- [ ] 교사용 대시보드 기능 확장

### 장기 목표
- [ ] 모바일 반응형 지원
- [ ] 추가 역사 시대 확장
- [ ] 멀티플레이어 매칭 시스템

---

## 알려진 이슈

현재 알려진 주요 이슈 없음

---

## 개발 노트

### 프로젝트 구조
```
history/
├── client/          # React 프론트엔드
├── server/          # Express 백엔드
├── font/            # 폰트 파일
└── package.json     # 루트 패키지 설정
```

### 실행 방법

**개발 환경**
```bash
# 클라이언트
cd client
npm run dev

# 서버
cd server
npm run dev
```

**프로덕션 빌드**
```bash
# 클라이언트
cd client
npm run build

# 서버
cd server
npm run build
npm start
```

---

## 참고사항

- 모든 테스트 및 데모 파일은 프로덕션 배포를 위해 제거됨
- AI 기능 사용을 위해 `.env` 파일 설정 필요
- Socket.io를 통한 실시간 통신 구현

---

*마지막 업데이트: 2024-12-04*
