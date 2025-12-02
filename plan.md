# 역사전쟁:삼국시대 - 개발 계획서

> 역사 교육용 실시간 멀티플레이 전략 웹게임

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [개발 단계별 계획](#3-개발-단계별-계획)
4. [MVP 기능 정의](#4-mvp-기능-정의)
5. [데이터 구조](#5-데이터-구조)
6. [API 설계](#6-api-설계)
7. [화면 구성](#7-화면-구성)
8. [폴더 구조](#8-폴더-구조)
9. [무료 리소스 활용](#9-무료-리소스-활용)
10. [위험 관리](#10-위험-관리)

---

## 1. 프로젝트 개요

### 1.1 핵심 목표
- **대상**: 초등 5-6학년 / 중등 1학년 역사 수업
- **인원**: 12-15명 (3팀, 팀당 4-5명)
- **시간**: 40분 수업 1회분
- **형태**: 웹 브라우저 기반 (PC/태블릿)

### 1.2 핵심 기능 (MVP)
1. ✅ 방 생성 및 팀 구성 (고구려/백제/신라)
2. ✅ 턴 기반 게임 진행
3. ✅ 역사 이벤트 선택 시스템
4. ✅ 실시간 팀 투표
5. ✅ 국력 스탯 관리
6. ✅ 간단한 외교 (채팅, 동맹)
7. ✅ 승리 조건 판정

### 1.3 확장 기능 (시간 여유 시)
- 🔲 교사 대시보드
- 🔲 AI 조언자
- 🔲 전투 시스템
- 🔲 도전과제
- 🔲 게임 리플레이

---

## 2. 기술 스택

### 2.1 프론트엔드
```
- React 18 + TypeScript
- Vite (빌드 도구)
- Tailwind CSS (스타일링)
- Framer Motion (애니메이션)
- Socket.io-client (실시간 통신)
- Zustand (상태관리)
```

### 2.2 백엔드
```
- Node.js + Express
- Socket.io (실시간 멀티플레이)
- Firebase Realtime Database (게임 상태 저장)
- Firebase Authentication (간편 로그인)
```

### 2.3 배포
```
- Frontend: Vercel (무료)
- Backend: Railway / Render (무료 티어)
- Database: Firebase Spark Plan (무료)
```

### 2.4 AI (무료 옵션)
```
- Google Gemini API (무료 티어: 60 QPM)
- 또는 Hugging Face Inference API (무료)
- 용도: AI 조언자, 역사 설명 생성
```

---

## 3. 개발 단계별 계획

### 📅 Week 1: 프로젝트 설정 및 기본 UI
| 일차 | 작업 내용 | 산출물 |
|------|----------|--------|
| 1-2 | 프로젝트 초기 설정 (React + Vite + TypeScript) | 프로젝트 구조 |
| 3-4 | Firebase 연동, 기본 인증 | 로그인/회원가입 |
| 5-6 | 메인 화면, 방 생성 UI | 랜딩 페이지 |
| 7 | 국가 선택 화면 | 팀 선택 UI |

**목표**: 방 생성 → 국가 선택 → 게임 대기 화면 완성

---

### 📅 Week 2: 게임 코어 시스템
| 일차 | 작업 내용 | 산출물 |
|------|----------|--------|
| 1-2 | 게임 상태 관리 구조 설계 | Zustand 스토어 |
| 3-4 | 턴 시스템 구현 | 턴 진행 로직 |
| 5-6 | 스탯 시스템 (군사/경제/외교/문화) | 스탯 UI |
| 7 | 기본 지도 UI | 삼국 지도 컴포넌트 |

**목표**: 싱글 플레이어로 턴 진행 가능한 상태

---

### 📅 Week 3: 이벤트 시스템
| 일차 | 작업 내용 | 산출물 |
|------|----------|--------|
| 1-2 | 이벤트 데이터 구조 설계 | 이벤트 JSON |
| 3-4 | 이벤트 표시 UI | 선택지 모달 |
| 5-6 | 선택 결과 반영 로직 | 스탯 변화 |
| 7 | 역사 이벤트 20개 작성 | 콘텐츠 |

**목표**: 이벤트 발생 → 선택 → 결과 반영 흐름 완성

---

### 📅 Week 4: 실시간 멀티플레이 (핵심!)
| 일차 | 작업 내용 | 산출물 |
|------|----------|--------|
| 1-2 | Socket.io 서버 설정 | 백엔드 서버 |
| 3-4 | 방 동기화 (입장/퇴장) | 실시간 접속 |
| 5-6 | 팀 투표 시스템 | 투표 UI |
| 7 | 게임 상태 동기화 | 실시간 업데이트 |

**목표**: 3팀이 동시에 접속하여 턴 진행 가능

---

### 📅 Week 5: 외교 및 전투
| 일차 | 작업 내용 | 산출물 |
|------|----------|--------|
| 1-2 | 실시간 채팅 (팀 내/국가 간) | 채팅 UI |
| 3-4 | 동맹/적대 시스템 | 외교 관계 |
| 5-6 | 간소화 전투 시스템 | 전투 결과 |
| 7 | 역사 이벤트 30개 추가 | 콘텐츠 확장 |

**목표**: 국가 간 상호작용 가능

---

### 📅 Week 6: 게임 완성
| 일차 | 작업 내용 | 산출물 |
|------|----------|--------|
| 1-2 | 승리 조건 구현 | 게임 종료 로직 |
| 3-4 | 결과 화면 (역사 비교) | 결과 UI |
| 5-6 | AI 조언자 연동 (무료 API) | AI 기능 |
| 7 | UI/UX 개선 | 시각적 완성도 |

**목표**: 게임 시작부터 종료까지 전체 플로우 완성

---

### 📅 Week 7: 테스트 및 안정화
| 일차 | 작업 내용 | 산출물 |
|------|----------|--------|
| 1-2 | 내부 테스트 (버그 수정) | 안정화 |
| 3-4 | 학급 베타 테스트 | 피드백 |
| 5-6 | 밸런스 조정 | 게임성 개선 |
| 7 | 성능 최적화 | 30명 동접 |

**목표**: 실제 수업에서 사용 가능한 안정성 확보

---

### 📅 Week 8: 마무리 및 발표 준비
| 일차 | 작업 내용 | 산출물 |
|------|----------|--------|
| 1-2 | 최종 버그 수정 | 릴리즈 버전 |
| 3-4 | 사용자 매뉴얼 작성 | 문서 |
| 5-6 | 발표 자료 제작 | PPT, 시연 영상 |
| 7 | 배포 및 최종 점검 | 라이브 서비스 |

**목표**: 대회 발표 준비 완료

---

## 4. MVP 기능 정의

### 4.1 필수 기능 (Must Have)

#### 🎮 게임 흐름
```
1. 방 생성 (교사가 코드 생성)
2. 학생 입장 (코드 입력)
3. 국가 선택 (고구려/백제/신라)
4. 게임 시작
5. 턴 진행 (이벤트 → 선택 → 결과)
6. 게임 종료 (승리 조건 달성 또는 타임아웃)
7. 결과 화면
```

#### 📊 국력 시스템
```typescript
interface NationStats {
  military: number;    // 군사력 (0-500)
  economy: number;     // 경제력 (0-500)
  diplomacy: number;   // 외교력 (0-500)
  culture: number;     // 문화력 (0-500)
  gold: number;        // 재화
  population: number;  // 인구
  morale: number;      // 민심 (0-100)
}
```

#### 🗳️ 투표 시스템
```
- 이벤트 발생 시 60초 제한
- 팀원 개별 투표
- 과반수 결정 (동점 시 무작위)
- 실시간 투표 현황 표시
```

### 4.2 선택 기능 (Should Have)
- 팀 내 채팅
- 국가 간 외교 채팅
- 동맹 시스템
- 역사 팁/설명 팝업

### 4.3 추가 기능 (Could Have)
- AI 조언자
- 교사 대시보드
- 도전과제
- 게임 리플레이

### 4.4 제외 기능 (Won't Have - MVP)
- VR/AR
- 모바일 앱
- 복잡한 전투 시스템
- 영토 확장 지도

---

## 5. 데이터 구조

### 5.1 Firebase Realtime Database 구조

```
/games
  /{gameId}
    /info
      - code: "ABC123"
      - teacherId: "teacher_001"
      - status: "waiting" | "playing" | "finished"
      - currentTurn: 1
      - currentYear: 300
      - startedAt: timestamp
      - settings
        - maxTurns: 30
        - turnDuration: 120
        - difficulty: "normal"
    
    /teams
      /goguryeo
        - players: ["uid1", "uid2"]
        - stats: { military, economy, diplomacy, culture }
        - gold: 1000
        - population: 50000
        - morale: 70
        - allies: ["silla"]
        - enemies: []
      /baekje
        - ...
      /silla
        - ...
    
    /events
      /{eventIndex}
        - eventId: "buddhism_372"
        - turn: 5
        - targetTeam: "goguryeo"
        - votes: { uid1: "A", uid2: "B" }
        - result: "A"
        - appliedAt: timestamp
    
    /chat
      /{messageId}
        - sender: "uid1"
        - senderName: "김철수"
        - team: "goguryeo"
        - message: "불교 받아들이자!"
        - type: "team" | "public" | "diplomacy"
        - target: "baekje" (외교 시)
        - timestamp: ...

/users
  /{uid}
    - name: "김철수"
    - email: "..."
    - role: "student" | "teacher"
    - currentGame: "gameId"
    - stats
      - gamesPlayed: 5
      - wins: 2
      - achievements: ["historian", "diplomat"]
```

### 5.2 이벤트 데이터 (JSON 파일)

```typescript
// /src/data/events.json
interface HistoricalEvent {
  id: string;
  year: number;
  targetNation: "goguryeo" | "baekje" | "silla" | "all";
  
  title: string;
  description: string;
  historicalContext: string;  // 역사적 배경 설명
  
  choices: Choice[];
  
  difficulty: "easy" | "normal" | "hard";
  category: "military" | "economy" | "diplomacy" | "culture";
  
  // 대체역사 분기
  triggers?: {
    condition: string;  // 이전 선택 조건
    newEventId: string; // 대체 이벤트
  }[];
}

interface Choice {
  id: string;
  text: string;
  effects: {
    military?: number;
    economy?: number;
    diplomacy?: number;
    culture?: number;
    gold?: number;
    population?: number;
    morale?: number;
  };
  isHistorical: boolean;  // 실제 역사와 같은 선택인지
  tooltip: string;        // 역사 팁
  risk: "safe" | "normal" | "risky";
  
  // 특수 효과
  special?: {
    type: "alliance" | "war" | "territory" | "unlock";
    target?: string;
    value?: any;
  };
}
```

### 5.3 예시 이벤트

```json
{
  "id": "buddhism_372",
  "year": 372,
  "targetNation": "goguryeo",
  "title": "불교 전래",
  "description": "전진(前秦)에서 승려 순도가 불상과 경문을 가지고 왔습니다. 새로운 종교를 어떻게 하시겠습니까?",
  "historicalContext": "소수림왕 2년, 중국 전진에서 순도가 불교를 전파했습니다. 이는 고구려 최초의 공식적인 불교 수용이었습니다.",
  
  "choices": [
    {
      "id": "A",
      "text": "불교를 국가 종교로 받아들인다",
      "effects": { "culture": 30, "morale": 20, "gold": -100 },
      "isHistorical": true,
      "tooltip": "실제 소수림왕은 불교를 수용하고 2년 뒤 절을 지었어요",
      "risk": "safe"
    },
    {
      "id": "B",
      "text": "불교를 거부하고 순도를 돌려보낸다",
      "effects": { "military": 10, "morale": -10 },
      "isHistorical": false,
      "tooltip": "역사와 다른 선택입니다. 어떤 결과가 생길까요?",
      "risk": "normal"
    },
    {
      "id": "C",
      "text": "일단 순도를 머물게 하고 상황을 지켜본다",
      "effects": {},
      "isHistorical": false,
      "tooltip": "신중한 선택이지만, 기회를 놓칠 수도 있어요",
      "risk": "safe"
    }
  ],
  
  "difficulty": "easy",
  "category": "culture"
}
```

---

## 6. API 설계

### 6.1 REST API (Express)

```
# 인증
POST   /api/auth/register     - 회원가입
POST   /api/auth/login        - 로그인
GET    /api/auth/me           - 내 정보

# 게임
POST   /api/games             - 방 생성 (교사)
GET    /api/games/:code       - 방 정보 조회
POST   /api/games/:code/join  - 방 입장
DELETE /api/games/:id         - 방 삭제

# 이벤트 데이터
GET    /api/events            - 전체 이벤트 목록
GET    /api/events/:id        - 이벤트 상세
```

### 6.2 Socket.io 이벤트

```typescript
// Client → Server
socket.emit('join-game', { gameCode, teamId });
socket.emit('leave-game', { gameCode });
socket.emit('vote', { gameCode, eventId, choiceId });
socket.emit('chat', { gameCode, message, type, target? });
socket.emit('diplomacy', { gameCode, action, targetTeam, data });
socket.emit('ready', { gameCode });  // 게임 시작 준비

// Server → Client
socket.on('player-joined', { player, team });
socket.on('player-left', { playerId });
socket.on('game-started', { initialState });
socket.on('turn-changed', { turn, year });
socket.on('event-triggered', { event, deadline });
socket.on('vote-updated', { eventId, votes });
socket.on('event-resolved', { eventId, result, effects });
socket.on('stats-updated', { team, stats });
socket.on('chat-message', { message });
socket.on('diplomacy-request', { from, action, data });
socket.on('game-ended', { winner, reason, summary });
socket.on('error', { message });
```

---

## 7. 화면 구성

### 7.1 화면 목록

```
1. 랜딩 페이지 (/)
   - 게임 소개
   - 로그인/회원가입 버튼
   - 방 코드 입력

2. 로그인/회원가입 (/auth)
   - 간편 로그인 (구글, 이메일)
   - 교사/학생 구분

3. 대시보드 (/dashboard)
   - 교사: 방 생성, 이전 게임 기록
   - 학생: 방 입장, 내 기록

4. 대기실 (/game/:code/lobby)
   - 팀 선택 (고구려/백제/신라)
   - 팀원 목록
   - 준비 버튼
   - 채팅

5. 게임 화면 (/game/:code/play)
   - 지도 (중앙)
   - 내 팀 스탯 (좌측)
   - 현재 턴/연도 (상단)
   - 채팅 (우측 하단)
   - 이벤트 모달

6. 이벤트 모달 (오버레이)
   - 이벤트 제목/설명
   - 선택지 (효과, 역사 팁)
   - 투표 현황
   - 타이머

7. 결과 화면 (/game/:code/result)
   - 승리 팀
   - 최종 스탯 비교
   - 역사 vs 우리의 선택 비교
   - 주요 이벤트 타임라인
```

### 7.2 UI 컴포넌트

```
공통 컴포넌트:
- Button, Input, Modal
- Card, Badge, Progress
- Timer, Tooltip
- Chat, PlayerAvatar

게임 컴포넌트:
- GameMap (삼국 지도)
- StatsPanel (국력 표시)
- EventCard (이벤트 카드)
- VotePanel (투표 현황)
- TeamList (팀원 목록)
- TurnIndicator (턴 표시)
- ChatBox (채팅창)
- DiplomacyPanel (외교 패널)
```

---

## 8. 폴더 구조

```
history/
├── client/                    # 프론트엔드
│   ├── public/
│   │   └── assets/           # 이미지, 아이콘
│   ├── src/
│   │   ├── components/       # UI 컴포넌트
│   │   │   ├── common/       # 공통 컴포넌트
│   │   │   ├── game/         # 게임 컴포넌트
│   │   │   └── layout/       # 레이아웃
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── hooks/            # 커스텀 훅
│   │   ├── stores/           # Zustand 스토어
│   │   ├── services/         # API, Socket 서비스
│   │   ├── data/             # 이벤트 JSON
│   │   ├── types/            # TypeScript 타입
│   │   ├── utils/            # 유틸리티 함수
│   │   ├── styles/           # 글로벌 스타일
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── server/                    # 백엔드
│   ├── src/
│   │   ├── config/           # 설정 (Firebase, 환경변수)
│   │   ├── controllers/      # API 컨트롤러
│   │   ├── middleware/       # 미들웨어
│   │   ├── routes/           # 라우트
│   │   ├── services/         # 비즈니스 로직
│   │   ├── socket/           # Socket.io 핸들러
│   │   ├── utils/            # 유틸리티
│   │   └── index.ts          # 진입점
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                    # 공유 타입/유틸
│   └── types/
│
├── docs/                      # 문서
│   ├── api.md
│   ├── events.md
│   └── manual.md
│
├── plan.md                    # 이 문서
├── .gitignore
├── .env.example
└── README.md
```

---

## 9. 무료 리소스 활용

### 9.1 무료 AI API 옵션

| 서비스 | 무료 한도 | 용도 |
|--------|----------|------|
| **Google Gemini** | 60 QPM, 1500 QPD | AI 조언자, 역사 설명 |
| Hugging Face | 무제한 (속도제한) | 텍스트 생성 |
| Cohere | 5 QPM | 대안 |

**선택: Google Gemini API (추천)**
- 가장 넉넉한 무료 한도
- 한국어 성능 우수
- 빠른 응답 속도

### 9.2 무료 호스팅

| 서비스 | 용도 | 무료 한도 |
|--------|------|----------|
| **Vercel** | 프론트엔드 | 무제한 |
| **Railway** | 백엔드 | $5/월 크레딧 |
| **Render** | 백엔드 (대안) | 750시간/월 |
| **Firebase** | DB, Auth | Spark Plan |

### 9.3 무료 디자인 리소스

```
아이콘:
- Lucide Icons (React)
- Heroicons

이미지:
- Unsplash (배경)
- 직접 제작 SVG (지도, 캐릭터)

폰트:
- Google Fonts (Noto Sans KR)
- Pretendard
```

### 9.4 Firebase Spark Plan 한도

```
- Realtime Database: 1GB 저장, 10GB/월 전송
- Authentication: 무제한 (이메일, 구글)
- Hosting: 10GB 저장, 360MB/일 전송

→ 학급 단위 사용에 충분
```

---

## 10. 위험 관리

### 10.1 기술적 위험

| 위험 | 대응 방안 | 우선순위 |
|------|----------|----------|
| Socket.io 동기화 오류 | 낙관적 업데이트 + 재동기화 로직 | 높음 |
| 30명 동접 성능 | 조기 부하 테스트, 최적화 | 높음 |
| Firebase 무료 한도 초과 | 사용량 모니터링, 캐싱 | 중간 |
| AI API 레이트 리밋 | 응답 캐싱, 폴백 메시지 | 낮음 |

### 10.2 일정 위험

| 위험 | 대응 방안 |
|------|----------|
| Week 4 (멀티플레이) 지연 | Week 3부터 병행 개발 |
| 콘텐츠 부족 | AI로 이벤트 초안 생성 |
| 테스트 시간 부족 | 매주 작은 테스트 진행 |

### 10.3 MVP 축소 시나리오

시간 부족 시 제거할 기능:
1. AI 조언자 → 정적 힌트로 대체
2. 전투 시스템 → 외교만 유지
3. 교사 대시보드 → 기본 모니터링만
4. 도전과제 → 제거
5. 리플레이 → 텍스트 요약만

---

## 📌 진행 현황

### ✅ 완료된 작업

#### Week 1: 프로젝트 설정 및 기본 UI (완료)
- [x] 프로젝트 초기 설정 (Vite + React + TypeScript)
- [x] Tailwind CSS 설정
- [x] 기본 라우팅 설정 (React Router)
- [x] 공통 UI 컴포넌트 제작 (Button, Card, Modal, Timer 등)
- [x] 랜딩 페이지 완성
- [x] 국가 선택 화면 완성
- [x] 로비(대기실) 화면 완성

#### Week 2: 게임 코어 시스템 (완료)
- [x] 게임 상태 관리 구조 설계
- [x] 턴 시스템 UI 구현
- [x] 스탯 시스템 UI (군사/경제/외교/문화)
- [x] 기본 지도 UI 컴포넌트
- [x] 게임 페이지 완성
- [x] 결과 페이지 완성

#### Week 3: 이벤트 시스템 (완료)
- [x] 이벤트 데이터 구조 설계
- [x] 이벤트 표시 모달 UI
- [x] 선택지 투표 UI
- [x] 투표 완료 후 역사 배경 표시
- [x] **역사 이벤트 20개 작성 완료** → `story.md`

#### UI/UX 개선 (추가 완료)
- [x] 바람의 나라 스타일 배경 적용
- [x] 호국체 폰트 적용
- [x] 국가별 대표 이미지 (SVG) 제작
  - 고구려: 삼족오
  - 백제: 금동대향로
  - 신라: 금관
- [x] 모달 위치 버그 수정
- [x] 게임 이름 변경: "삼국지략" → "역사전쟁:삼국시대"

#### Week 4: 실시간 멀티플레이 (완료)
- [x] Socket.io 서버 설정 (Express + Socket.io)
- [x] 백엔드 게임 매니저 구현 (GameManager)
- [x] 방 생성/참가 시스템 구현
- [x] Zustand 상태 관리 설정
- [x] Socket.io 클라이언트 연결 및 이벤트 리스너
- [x] LobbyPage를 Socket.io와 연결 (실시간 플레이어 목록, 준비 토글, 게임 시작)
- [x] GamePage를 Socket.io와 연결 (게임 상태 동기화, 투표 시스템, 채팅)
- [x] 실시간 방 동기화 (입장/퇴장)
- [x] 팀 투표 시스템 (실시간 투표 전송 및 수신)
- [x] 게임 상태 동기화 (턴, 연도, 스탯, 이벤트)

---

#### Week 5: 외교 및 전투 (진행 중)
- [x] 동맹/적대 시스템 구현
  - [x] 서버 측 동맹/적대 관리 함수 (proposeAlliance, acceptAlliance, breakAlliance, declareWar, endWar)
  - [x] Socket.io 이벤트 핸들러 추가
  - [x] DiplomacyPanel 컴포넌트 생성
  - [x] GamePage에 외교 패널 통합
  - [x] gameStore에 외교 액션 추가

#### Week 5: 외교 및 전투 (진행 중)
- [x] 동맹/적대 시스템 구현
  - [x] 서버 측 동맹/적대 관리 함수 (proposeAlliance, acceptAlliance, breakAlliance, declareWar, endWar)
  - [x] Socket.io 이벤트 핸들러 추가
  - [x] DiplomacyPanel 컴포넌트 생성
  - [x] GamePage에 외교 패널 통합
  - [x] gameStore에 외교 액션 추가
- [x] 실시간 채팅 시스템 개선
  - [x] ChatPanel 컴포넌트 생성 (채널 탭: 팀/공개/외교)
  - [x] 채널별 메시지 필터링
  - [x] GamePage에 새로운 채팅 패널 통합

#### Week 5: 외교 및 전투 (완료)
- [x] 동맹/적대 시스템 구현
  - [x] 서버 측 동맹/적대 관리 함수 (proposeAlliance, acceptAlliance, breakAlliance, declareWar, endWar)
  - [x] Socket.io 이벤트 핸들러 추가
  - [x] DiplomacyPanel 컴포넌트 생성
  - [x] GamePage에 외교 패널 통합
  - [x] gameStore에 외교 액션 추가
- [x] 실시간 채팅 시스템 개선
  - [x] ChatPanel 컴포넌트 생성 (채널 탭: 팀/공개/외교)
  - [x] 채널별 메시지 필터링
  - [x] GamePage에 새로운 채팅 패널 통합
- [x] 간소화 전투 시스템 구현
  - [x] 서버 측 전투 로직 (initiateBattle, calculateBattleResult, applyBattleResult)
  - [x] 전투력 계산 (군사력 + 민심 + 동맹 지원 + 랜덤 요소)
  - [x] Socket.io 전투 이벤트 핸들러
  - [x] BattleModal 컴포넌트 생성
  - [x] DiplomacyPanel에 전투 제안 버튼 추가
  - [x] GamePage에 전투 모달 통합

---

#### Week 6: 게임 완성 (완료)
- [x] 승리 조건 구현
  - [x] 최대 턴 도달 시 점수 기반 승자 결정
  - [x] 통일 조건 (다른 나라 스탯 0 이하)
  - [x] 투표 완료 후 턴 진행 및 게임 종료 체크
  - [x] 전투 결과 후 게임 종료 체크
  - [x] 게임 종료 시 gameEnded 이벤트 전송
- [x] 결과 화면 개선
  - [x] ResultPage를 실제 게임 데이터와 연결
  - [x] 점수 기반 순위 표시
  - [x] 최종 스탯 및 업적 표시
  - [x] GamePage에서 게임 종료 시 자동 이동
- [x] AI 조언자 연동 (Gemini API)
  - [x] 서버 측 Gemini API 통합 (`@google/generative-ai`)
  - [x] AI 조언자 API 엔드포인트 (`/api/ai/advice`)
  - [x] AI 조언자 컴포넌트 생성 (`AIAdvisor.tsx`)
  - [x] EventModal에 AI 조언자 버튼 추가
  - [x] 폴백 조언 시스템 (API 실패 시)
  - [x] 환경 변수 설정 가이드 (`.env.example`)
- [x] 싱글플레이 모드 개선
  - [x] 중복 이벤트 방지 시스템
  - [x] 점수 시스템 (역사적 선택, 긍정 효과 보너스, 부정 효과 감점)
  - [x] 선택지 랜덤 배열
  - [x] 게임 종료 화면 (최종 점수, 평가, 대기실로 돌아가기)
  - [x] 이벤트 연도 순서대로 진행
- [x] 문화재 이벤트 추가
  - [x] 고구려: 고분벽화 제작
  - [x] 백제: 정림사지 5층석탑, 무령왕릉, 금동대향로
  - [x] 신라: 경주 금관총 금관, 안압지
  - [x] 각 문화재 이벤트에 3개 선택지 추가 (고민할 수 있는 선택지)

**설정 필요**: 서버 `.env` 파일에 `GEMINI_API_KEY` 추가
- Google AI Studio에서 발급: https://makersuite.google.com/app/apikey
- 무료 티어: 60 QPM, 1500 QPD

#### 싱글플레이 AI 대전 모드 개선 (추가 완료)
- [x] 싱글플레이 "팀 모드"를 "AI 대전"으로 명칭 변경
  - [x] `SinglePlayerModeSelectPage.tsx`: 모드 선택 화면 텍스트 변경
  - [x] `SinglePlayerTeamSetupPage.tsx` → `SinglePlayerAISetupPage.tsx`로 파일명 변경
- [x] AI 플레이어 생성 슬라이더 UI 제거
  - [x] AI 플레이어는 자동으로 배치되도록 변경
- [x] AI 플레이어 자동 배치 시스템 구현
  - [x] 사용자가 선택한 국가를 제외한 나머지 두 국가에 각각 1명씩 AI 플레이어 자동 배치
  - [x] `NationSelectPage.tsx`: 국가 선택 시 자동으로 AI 플레이어 추가 로직 구현
  - [x] `Promise.all`을 사용하여 모든 AI 플레이어 추가 완료 후 로비로 이동
- [x] 게임 시작 권한 변경
  - [x] AI 대전 모드에서는 호스트가 아닌 사용자(플레이어)에게 게임 시작 권한 부여
  - [x] `LobbyPage.tsx`: 게임 시작 버튼 표시 조건 수정
- [x] 게임 시작 전 카운트다운 화면 추가
  - [x] 게임 시작 버튼 클릭 시 "5, 4, 3, 2, 1" 카운트다운 표시
  - [x] 카운트다운 완료 후 게임 시작
- [x] 게임 모드 분리 및 유틸리티 함수 추가
  - [x] `client/src/utils/gameMode.ts` 파일 생성
  - [x] `isSinglePlayerAIMode()`, `isMultiplayerMode()` 등 게임 모드 감지 유틸리티 함수 구현
  - [x] LocalStorage 기반 게임 모드 관리 (`singlePlayerRoomCode` 활용)
  - [x] `LobbyPage.tsx`, `NationSelectPage.tsx` 등에서 유틸리티 함수 사용으로 코드 정리
- [x] AI 대전 모드 이벤트 필터링 개선
  - [x] `server/src/index.ts`: `selectEventForTurn` 함수 수정
  - [x] AI 대전 모드에서는 선택한 국가의 이벤트만 표시 (targetNation이 'all'인 이벤트 제외)
  - [x] 이벤트를 연도 순서대로 정렬하여 표시
  - [x] `story.md`의 36개 이벤트 (국가별 12개씩) 반영 확인
- [x] 채팅 메시지 중복 문제 해결
  - [x] `client/src/stores/gameStore.ts`: `initializeSocketListeners`에서 `chatMessage` 리스너 중복 등록 방지
  - [x] `removeAllListeners('chatMessage')` 추가하여 중복 메시지 방지

#### 멀티플레이 모드 개선 (추가 완료)
- [x] 멀티플레이와 AI 대전 모드 코드 명확히 분리
  - [x] 서버 측 `isAIBattleMode` 함수로 모드 감지 로직 개선
  - [x] 멀티플레이 모드에서 AI 플레이어 추가/제거 기능 완전 제거
    - [x] `LobbyPage.tsx`: AI 추가/제거 버튼이 멀티플레이 모드에서 표시되지 않도록 수정
    - [x] `handleAddAI`, `handleRemoveAI` 함수에 멀티플레이 모드 가드 추가
    - [x] 서버 측 `/api/ai/add`, `/api/ai/remove` 엔드포인트에 멀티플레이 모드 체크 추가
  - [x] 멀티플레이 모드 진입 시 기존 AI 플레이어 자동 제거
    - [x] `server/src/index.ts`: `selectTeam` 이벤트 핸들러에서 멀티플레이 모드 감지 시 AI 플레이어 자동 제거 로직 추가
- [x] 멀티플레이 방 코드 입력 방식 변경
  - [x] `LandingPage.tsx`: "Join Game" 모달 제거
  - [x] 멀티플레이 버튼 클릭 시 바로 `/select`로 이동하도록 변경
  - [x] 멀티플레이 모드는 고정된 'MAIN' 방 코드 사용

### 🔄 진행 중

#### Week 7: 테스트 및 안정화 (진행 중)
- [ ] 내부 테스트 및 버그 수정
  - [ ] 게임 전체 플로우 테스트 (방 생성 → 입장 → 게임 진행 → 종료)
  - [ ] 멀티플레이 동시 접속 테스트
  - [ ] 싱글플레이 모드 테스트
  - [ ] 버그 수정 및 에러 핸들링 개선
- [ ] 밸런스 조정
  - [ ] 스탯 효과 밸런스 조정
  - [ ] 이벤트 난이도 조정
  - [ ] 승리 조건 조정
- [ ] 성능 최적화
  - [ ] 30명 동접 대비 최적화
  - [ ] Socket.io 이벤트 최적화
  - [ ] 렌더링 성능 개선
- [ ] UI/UX 개선
  - [ ] 사용성 개선
  - [ ] 반응형 디자인 개선
  - [ ] 접근성 개선

---

### ⏳ 예정된 작업

#### Week 5: 외교 및 전투
- [ ] 실시간 채팅 시스템 개선 (팀 내/국가 간/외교 채널 분리)
- [ ] 동맹/적대 시스템 구현 (외교 패널, 동맹 제안/수락)
- [ ] 간소화 전투 시스템 (전투 이벤트, 전투 결과 계산)
- [ ] 역사 이벤트 30개 추가

#### Week 6: 게임 완성
- [ ] 승리 조건 구현 (국력 기준, 특수 조건)
- [ ] 결과 화면 개선 (역사 비교, 타임라인)
- [ ] AI 조언자 연동 (Gemini API)

#### Week 6: 게임 완성
- [ ] 승리 조건 구현
- [ ] 결과 화면 개선
- [ ] AI 조언자 연동 (Gemini API)

#### Week 7: 테스트 및 안정화
- [ ] 내부 테스트
- [ ] 밸런스 조정
- [ ] 성능 최적화

#### Week 8: 마무리
- [ ] 최종 버그 수정
- [ ] 사용자 매뉴얼
- [ ] 배포

---

### 📁 생성된 파일 목록

```
history/
├── client/                    # 프론트엔드
│   ├── public/
│   │   ├── fonts/            # 호국체 폰트
│   │   └── images/           # 국가 SVG 이미지
│   ├── src/
│   │   ├── components/       # UI 컴포넌트
│   │   ├── pages/            # 페이지
│   │   ├── data/             # 이벤트/국가 데이터
│   │   ├── types/            # TypeScript 타입
│   │   └── utils/            # 유틸리티
│   │       └── gameMode.ts   # 게임 모드 감지 유틸리티
│   └── package.json
├── server/                    # 백엔드
│   ├── src/
│   │   ├── gameManager.ts    # 게임 로직 관리
│   │   ├── index.ts          # Express + Socket.io 서버
│   │   └── types.ts           # 타입 정의
│   └── package.json
├── plan.md                    # 개발 계획서
└── story.md                   # 역사 시나리오 20개
```

---

---

## 📝 최근 변경사항 (2024년 12월)

### 싱글플레이 AI 대전 모드 개선
- **명칭 변경**: "팀 모드" → "AI 대전"
- **AI 플레이어 자동 배치**: 사용자가 선택한 국가 외 나머지 두 국가에 각각 1명씩 자동 배치
- **게임 시작 권한**: 호스트가 아닌 사용자(플레이어)에게 게임 시작 권한 부여
- **카운트다운 화면**: 게임 시작 전 5초 카운트다운 추가
- **이벤트 필터링**: AI 대전 모드에서 선택한 국가의 이벤트만 표시 (연도 순서대로)
- **코드 분리**: 게임 모드 감지 유틸리티 함수 추가 (`gameMode.ts`)

### 멀티플레이 모드 개선
- **AI 기능 제거**: 멀티플레이 모드에서 AI 플레이어 추가/제거 기능 완전 제거
- **자동 정리**: 멀티플레이 모드 진입 시 기존 AI 플레이어 자동 제거
- **방 코드 방식**: 멀티플레이 모드는 고정된 'MAIN' 방 코드 사용

### 버그 수정
- **채팅 중복 메시지**: Socket.io 리스너 중복 등록 문제 해결

---

*마지막 업데이트: 2024년 12월*

