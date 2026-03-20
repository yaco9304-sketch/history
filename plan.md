# 역사전쟁: 삼국시대 - 추가 개발 계획

> 디지털교육연구대회 교육용 SW·AI 분과 출품을 위한 상세 개발 계획

## 📋 목차
1. [개발 목표](#개발-목표)
2. [현재 상태 분석](#현재-상태-분석)
3. [**Phase 0: 게임 기능 강화 (1주)**](#phase-0-게임-기능-강화-1주) ⭐ NEW
4. [Phase 1: 출품 필수 기능 (2주)](#phase-1-출품-필수-기능-2주)
5. [Phase 2: 경쟁력 강화 기능 (4주)](#phase-2-경쟁력-강화-기능-4주)
6. [Phase 3: 차별화 기능 (8주)](#phase-3-차별화-기능-8주)
7. [기술 스택 및 아키텍처](#기술-스택-및-아키텍처)
8. [일정 및 마일스톤](#일정-및-마일스톤)

---

## 개발 목표

### 최종 목표
디지털교육연구대회 교육용 SW·AI 분과에서 **최우수상** 수상을 위한 교육적 가치와 기술력을 갖춘 게임 기반 학습 플랫폼 완성

### 핵심 가치
1. **교육과정 연계**: 2015/2022 개정 교육과정 역사 교과 성취기준 달성
2. **학습 효과 측정**: 데이터 기반 학습 분석 및 리포트 제공
3. **교사 지원**: 수업 운영 및 평가에 실질적으로 도움이 되는 도구
4. **학생 참여**: 게임 기반 학습으로 높은 몰입도와 동기 부여

---

## 현재 상태 분석

### ✅ 구현 완료된 기능

#### 게임 핵심 기능
- [x] 삼국(고구려, 백제, 신라) 선택 및 플레이
- [x] 실시간 멀티플레이어 (Socket.io)
- [x] 싱글플레이어 AI 대전
- [x] 턴제 게임 진행
- [x] 역사 이벤트 시스템 (100개 이상)
- [x] 투표 및 의사결정 시스템

#### 소통 기능
- [x] 실시간 채팅 (팀/공개/외교)
- [x] AI 어드바이저 (Google Gemini)

#### 전투 및 외교
- [x] 국가 간 전투 시스템
- [x] 동맹 및 적대 관계
- [x] 전투 결과 시뮬레이션

#### 교사 기능
- [x] 기본 대시보드
- [x] 게임 생성 및 관리
- [x] 국가별 현황 확인
- [x] 채팅 로그 확인

#### UI/UX
- [x] 한국 전통 디자인 테마
- [x] 반응형 레이아웃
- [x] 애니메이션 (Framer Motion)

### ❌ 부족한 기능 (출품 필수)

#### 학습 데이터 분석
- [ ] 학습 활동 로그 수집 시스템
- [ ] 개인별 학습 데이터 분석
- [ ] 학급별 통계 대시보드
- [ ] 학습 리포트 자동 생성 (PDF)

#### 교육과정 연계
- [ ] 성취기준 매핑 문서
- [ ] 핵심 역량 연계 설명
- [ ] 수업 지도안 (8차시)
- [ ] 교사용/학생용 매뉴얼

#### 피드백 시스템
- [ ] 즉각적 학습 피드백
- [ ] 성취 배지 시스템
- [ ] 오답 노트 기능

#### 교육 콘텐츠
- [ ] 역사 자료실 (연표, 인물, 지도)
- [ ] 역사 용어 사전
- [ ] 토론 주제 가이드

---

## Phase 0: 게임 기능 강화 (1주)

> **목표**: 문명(Civilization) 게임을 참고하여 게임성 및 교육적 가치 향상
> **기간**: 1주 (Day 0-7)
> **참고**: 전략 게임의 핵심 요소를 삼국시대 역사 교육에 접목

### 🎯 구현 기능 목록

| 순서 | 기능 | 예상 기간 | 교육적 가치 | 상태 |
|------|------|----------|------------|------|
| 1 | 다양한 승리 조건 | 1일 | 역사의 다양한 측면 이해 | ✅ 완료 |
| 2 | 위인 시스템 | 2일 | 역사 인물 학습 | ✅ 완료 |
| 3 | 테크 트리 | 2일 | 기술/문화 발전 이해 | ✅ 완료 |
| 4 | 문화유산 시스템 | 1일 | 삼국의 문화재 학습 | ✅ 완료 |

---

### 1. 다양한 승리 조건 시스템 ⭐ 최우선

**우선순위**: 🔴 최우선 (Day 1)

**현재 문제점**:
- 군사적 승리만 존재
- 다양한 플레이 스타일 제한
- 역사는 전쟁만이 아님을 배울 수 없음

**구현 내용**:

```typescript
// server/src/types.ts 추가
export type VictoryType = 'military' | 'cultural' | 'diplomatic' | 'technological' | 'score';

export interface VictoryCondition {
  type: VictoryType;
  name: string;
  description: string;
  requirement: {
    military?: { conqueredNations: number };      // 정복한 국가 수
    cultural?: { culturePoints: number };          // 문화 점수
    diplomatic?: { alliances: number; peaceTurns: number }; // 동맹 수, 평화 유지 턴
    technological?: { completedTechs: number };    // 완료 기술 수
    score?: { minTurns: number };                  // 최소 턴 (시간 승리)
  };
}

// 국가 스탯 확장
export interface NationStats {
  // 기존 스탯
  military: number;
  economy: number;
  culture: number;
  territory: number;
  population: number;
  // 새로운 스탯
  culturePoints: number;       // 문화 점수 (문화 승리용)
  techProgress: number;        // 기술 진행도
  diplomaticReputation: number; // 외교 평판
}
```

**승리 조건 5가지**:

| 유형 | 이름 | 조건 | 역사적 의미 |
|------|------|------|------------|
| 🏆 군사 승리 | 삼국통일 | 다른 두 국가 정복 | 신라의 삼국통일 |
| 🏛️ 문화 승리 | 문화대국 | 문화 점수 500점 달성 | 백제의 문화 발전 |
| 📜 외교 승리 | 평화의 시대 | 2국 동맹 + 20턴 평화 유지 | 외교적 균형 |
| 🔬 기술 승리 | 기술 선진국 | 모든 기술 연구 완료 | 고구려의 철기 문화 |
| ⏰ 점수 승리 | 최강국 | 30턴 후 최고 총점 | 종합 국력 |

**UI 추가**:
- 게임 화면에 "승리 조건 진행 상황" 패널
- 각 승리 조건별 진행 바
- 승리 달성 시 엔딩 화면 분기

**예상 공수**: 1일

---

### 2. 위인 시스템 ⭐ 높은 교육적 가치

**우선순위**: 🟠 중요 (Day 2-3)

**구현 내용**:

```typescript
// client/src/data/heroes.ts
export interface HistoricalHero {
  id: string;
  name: string;
  nation: Nation;
  era: string;
  title: string;
  portrait?: string;
  specialAbility: {
    name: string;
    description: string;
    effect: HeroEffect;
    duration: number; // 턴
    cooldown: number; // 재사용 대기 턴
  };
  historicalFact: string;
  unlockCondition: {
    type: 'turn' | 'event' | 'stat';
    requirement: any;
  };
}

export type HeroEffect = 
  | { type: 'military_boost'; value: number }
  | { type: 'culture_boost'; value: number }
  | { type: 'diplomacy_boost'; value: number }
  | { type: 'economy_boost'; value: number }
  | { type: 'defense_boost'; value: number };

// 위인 데이터
export const HEROES: HistoricalHero[] = [
  // 고구려
  {
    id: 'gwanggaeto',
    name: '광개토대왕',
    nation: 'goguryeo',
    era: '391-413년',
    title: '정복왕',
    specialAbility: {
      name: '정복왕의 기상',
      description: '전투 승률 25% 증가',
      effect: { type: 'military_boost', value: 25 },
      duration: 3,
      cooldown: 10,
    },
    historicalFact: '영토를 크게 확장하여 만주와 한반도 북부를 지배. 광개토대왕비에 업적이 기록됨.',
    unlockCondition: { type: 'turn', requirement: 5 },
  },
  {
    id: 'eulji',
    name: '을지문덕',
    nation: 'goguryeo',
    era: '6세기 말-7세기 초',
    title: '살수대첩의 영웅',
    specialAbility: {
      name: '청야전술',
      description: '방어 시 적 피해 2배',
      effect: { type: 'defense_boost', value: 100 },
      duration: 2,
      cooldown: 8,
    },
    historicalFact: '612년 수나라 대군을 살수에서 격파. 수나라 30만 대군 중 2,700명만 생존.',
    unlockCondition: { type: 'turn', requirement: 10 },
  },
  // 백제
  {
    id: 'geunchogo',
    name: '근초고왕',
    nation: 'baekje',
    era: '346-375년',
    title: '해상왕',
    specialAbility: {
      name: '해상 무역로',
      description: '경제력 30% 증가',
      effect: { type: 'economy_boost', value: 30 },
      duration: 5,
      cooldown: 12,
    },
    historicalFact: '백제의 전성기를 이끔. 일본, 중국과 활발한 교류. 칠지도 제작.',
    unlockCondition: { type: 'turn', requirement: 5 },
  },
  {
    id: 'gyebaek',
    name: '계백',
    nation: 'baekje',
    era: '?-660년',
    title: '결사대장',
    specialAbility: {
      name: '결사 항전',
      description: '패배 직전 공격력 50% 증가',
      effect: { type: 'military_boost', value: 50 },
      duration: 2,
      cooldown: 15,
    },
    historicalFact: '황산벌 전투에서 5천 결사대로 5만 신라군에 맞섬. 4번 승리 후 전사.',
    unlockCondition: { type: 'stat', requirement: { military: -50 } },
  },
  // 신라
  {
    id: 'kimyushin',
    name: '김유신',
    nation: 'silla',
    era: '595-673년',
    title: '삼국통일의 주역',
    specialAbility: {
      name: '통일의 의지',
      description: '동맹 성공률 50% 증가',
      effect: { type: 'diplomacy_boost', value: 50 },
      duration: 3,
      cooldown: 10,
    },
    historicalFact: '가야 왕족 출신. 삼국통일의 핵심 인물. 태대각간 최고 관직.',
    unlockCondition: { type: 'turn', requirement: 5 },
  },
  {
    id: 'seondeok',
    name: '선덕여왕',
    nation: 'silla',
    era: '632-647년',
    title: '최초의 여왕',
    specialAbility: {
      name: '문화 부흥',
      description: '문화 점수 획득 40% 증가',
      effect: { type: 'culture_boost', value: 40 },
      duration: 5,
      cooldown: 12,
    },
    historicalFact: '한국 최초의 여왕. 첨성대, 황룡사 9층 목탑 건립. 불교 발전.',
    unlockCondition: { type: 'turn', requirement: 8 },
  },
];
```

**UI 컴포넌트**:
- `HeroPanel.tsx` - 위인 목록 및 선택
- `HeroCard.tsx` - 위인 카드 (초상, 능력, 역사 정보)
- `HeroAbilityModal.tsx` - 능력 발동 확인

**예상 공수**: 2일

---

### 3. 테크 트리 시스템

**우선순위**: 🟠 중요 (Day 4-5)

**구현 내용**:

```typescript
// client/src/data/techTree.ts
export interface Technology {
  id: string;
  name: string;
  category: 'military' | 'economy' | 'culture' | 'diplomacy';
  era: number; // 1-3 (초기/중기/후기)
  cost: { turns: number; gold: number };
  prerequisites: string[]; // 선행 기술 ID
  effect: TechEffect;
  historicalInfo: string;
  icon: string;
}

export type TechEffect = 
  | { type: 'stat_boost'; stat: keyof NationStats; value: number }
  | { type: 'unlock_unit'; unitId: string }
  | { type: 'unlock_building'; buildingId: string }
  | { type: 'special'; description: string };

export const TECH_TREE: Technology[] = [
  // 1시대 - 초기
  {
    id: 'iron_working',
    name: '철기 기술',
    category: 'military',
    era: 1,
    cost: { turns: 2, gold: 100 },
    prerequisites: [],
    effect: { type: 'stat_boost', stat: 'military', value: 10 },
    historicalInfo: '철제 무기와 농기구 제작. 고구려의 철기 문화가 대표적.',
    icon: '⚔️',
  },
  {
    id: 'agriculture',
    name: '관개 농업',
    category: 'economy',
    era: 1,
    cost: { turns: 2, gold: 80 },
    prerequisites: [],
    effect: { type: 'stat_boost', stat: 'economy', value: 15 },
    historicalInfo: '저수지와 수로 건설. 벽골제(백제)가 대표적.',
    icon: '🌾',
  },
  {
    id: 'buddhism',
    name: '불교 수용',
    category: 'culture',
    era: 1,
    cost: { turns: 3, gold: 120 },
    prerequisites: [],
    effect: { type: 'stat_boost', stat: 'culture', value: 20 },
    historicalInfo: '4세기 고구려, 백제에 전래. 왕실 후원으로 발전.',
    icon: '☸️',
  },
  // 2시대 - 중기
  {
    id: 'cavalry',
    name: '기병 양성',
    category: 'military',
    era: 2,
    cost: { turns: 3, gold: 150 },
    prerequisites: ['iron_working'],
    effect: { type: 'stat_boost', stat: 'military', value: 20 },
    historicalInfo: '고구려의 철갑기병(개마무사)이 유명.',
    icon: '🐴',
  },
  {
    id: 'maritime_trade',
    name: '해상 무역',
    category: 'economy',
    era: 2,
    cost: { turns: 3, gold: 180 },
    prerequisites: ['agriculture'],
    effect: { type: 'stat_boost', stat: 'economy', value: 25 },
    historicalInfo: '백제의 중국, 일본과의 해상 교류.',
    icon: '⛵',
  },
  {
    id: 'temple_building',
    name: '사찰 건축',
    category: 'culture',
    era: 2,
    cost: { turns: 4, gold: 200 },
    prerequisites: ['buddhism'],
    effect: { type: 'stat_boost', stat: 'culture', value: 30 },
    historicalInfo: '황룡사, 미륵사 등 대규모 사찰 건립.',
    icon: '🏛️',
  },
  // 3시대 - 후기
  {
    id: 'fortification',
    name: '성곽 기술',
    category: 'military',
    era: 3,
    cost: { turns: 4, gold: 250 },
    prerequisites: ['cavalry'],
    effect: { type: 'stat_boost', stat: 'territory', value: 15 },
    historicalInfo: '산성 축조 기술. 고구려 산성이 대표적.',
    icon: '🏰',
  },
  {
    id: 'writing_system',
    name: '기록 문화',
    category: 'culture',
    era: 3,
    cost: { turns: 5, gold: 300 },
    prerequisites: ['temple_building'],
    effect: { type: 'special', description: '모든 이벤트 정답률 +10%' },
    historicalInfo: '삼국사기, 삼국유사 등 역사서 편찬.',
    icon: '📜',
  },
];
```

**테크 트리 UI**:
```
┌──────────────────────────────────────────────────────────┐
│                    삼국시대 기술 트리                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [철기 기술]⚔️ ─→ [기병 양성]🐴 ─→ [성곽 기술]🏰        │
│                                                          │
│  [관개 농업]🌾 ─→ [해상 무역]⛵                         │
│                                                          │
│  [불교 수용]☸️ ─→ [사찰 건축]🏛️ ─→ [기록 문화]📜       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**예상 공수**: 2일

---

### 4. 문화유산 시스템

**우선순위**: 🟡 중요 (Day 6)

**구현 내용**:

```typescript
// client/src/data/culturalHeritage.ts
export interface CulturalHeritage {
  id: string;
  name: string;
  nation: Nation;
  type: 'architecture' | 'artifact' | 'monument';
  constructionCost: { turns: number; gold: number; culturePoints: number };
  effect: {
    cultureBonus: number;
    specialEffect?: string;
  };
  historicalInfo: string;
  imageUrl?: string;
  unlockTech?: string; // 선행 기술
}

export const CULTURAL_HERITAGES: CulturalHeritage[] = [
  // 고구려
  {
    id: 'gwanggaeto_stele',
    name: '광개토대왕비',
    nation: 'goguryeo',
    type: 'monument',
    constructionCost: { turns: 3, gold: 200, culturePoints: 50 },
    effect: { cultureBonus: 30, specialEffect: '군사력 +10%' },
    historicalInfo: '414년 건립. 광개토대왕의 정복 업적 기록. 현재 중국 지안시 소재.',
  },
  {
    id: 'anak_tomb',
    name: '안악 3호분 벽화',
    nation: 'goguryeo',
    type: 'artifact',
    constructionCost: { turns: 2, gold: 150, culturePoints: 30 },
    effect: { cultureBonus: 25 },
    historicalInfo: '357년 축조. 고구려 귀족의 생활상과 행렬도 묘사.',
  },
  // 백제
  {
    id: 'mireuksa',
    name: '미륵사',
    nation: 'baekje',
    type: 'architecture',
    constructionCost: { turns: 5, gold: 350, culturePoints: 80 },
    effect: { cultureBonus: 50, specialEffect: '문화 승리 요구 -50점' },
    historicalInfo: '600년경 무왕 건립. 동아시아 최대 규모 사찰. 서탑 현존.',
    unlockTech: 'temple_building',
  },
  {
    id: 'chiljido',
    name: '칠지도',
    nation: 'baekje',
    type: 'artifact',
    constructionCost: { turns: 2, gold: 180, culturePoints: 40 },
    effect: { cultureBonus: 20, specialEffect: '외교 성공률 +15%' },
    historicalInfo: '369년 제작. 일본에 하사한 7개 가지 모양 보검.',
  },
  // 신라
  {
    id: 'hwangnyongsa',
    name: '황룡사 9층 목탑',
    nation: 'silla',
    type: 'architecture',
    constructionCost: { turns: 6, gold: 400, culturePoints: 100 },
    effect: { cultureBonus: 60, specialEffect: '문화 승리 요구 -100점' },
    historicalInfo: '645년 완공. 높이 약 80m. 신라 불교의 상징.',
    unlockTech: 'temple_building',
  },
  {
    id: 'cheomseongdae',
    name: '첨성대',
    nation: 'silla',
    type: 'architecture',
    constructionCost: { turns: 3, gold: 250, culturePoints: 60 },
    effect: { cultureBonus: 35, specialEffect: '기술 연구 속도 +20%' },
    historicalInfo: '634년 선덕여왕 시기 건립. 동아시아 현존 최고 천문대.',
    unlockTech: 'writing_system',
  },
];
```

**예상 공수**: 1일

---

### Phase 0 완료 체크리스트

- [x] 다양한 승리 조건 시스템 구현 및 테스트 ✅
- [x] 위인 시스템 구현 및 테스트 ✅
- [x] 테크 트리 시스템 구현 및 테스트 ✅
- [x] 문화유산 시스템 구현 및 테스트 ✅
- [x] UI/UX 통합 ✅
- [x] 전체 기능 통합 테스트 ✅
- [x] 코드 정리 및 중복 제거 ✅

---

## Phase 1: 출품 필수 기능 (2주)

> **목표**: 대회 출품에 필요한 최소 요구사항 충족
> **기간**: 2주 (Day 8-21)

### Week 1 (Day 1-7)

#### 1. 학습 데이터 수집 시스템 구축
**우선순위**: 🔴 최우선

**서버 측 구현** (`server/src/`)
```typescript
// server/src/types.ts 확장
export interface LearningLog {
  id: string;
  playerId: string;
  playerName: string;
  roomId: string;
  nation: Nation;
  timestamp: number;
  logType: 'event_choice' | 'battle' | 'diplomacy' | 'chat' | 'advisor_use';
  data: {
    // 이벤트 선택
    eventId?: string;
    choiceId?: string;
    isCorrect?: boolean;

    // 전투
    battleResult?: 'win' | 'lose';

    // 외교
    diplomaticAction?: 'alliance' | 'war' | 'peace';
    targetNation?: Nation;

    // 채팅
    chatType?: 'team' | 'public' | 'diplomacy';
    messageLength?: number;

    // AI 어드바이저
    advisorQuery?: string;
  };
}

export interface PlayerProgress {
  playerId: string;
  playerName: string;
  nation: Nation;
  roomId: string;

  // 시간 데이터
  totalPlayTime: number; // 밀리초
  sessionStart: number;
  sessionEnd?: number;

  // 게임 진행
  completedTurns: number;
  totalTurns: number;

  // 의사결정
  totalChoices: number;
  correctChoices: number;
  incorrectChoices: number;

  // 활동 빈도
  battleCount: number;
  diplomacyCount: number;
  chatCount: number;
  advisorUseCount: number;

  // 상세 로그
  learningLogs: LearningLog[];
}
```

**새 파일 생성**: `server/src/learningAnalytics.ts`
```typescript
// 학습 데이터 수집 및 분석 모듈
export class LearningAnalytics {
  private progressMap: Map<string, PlayerProgress> = new Map();

  // 플레이어 세션 시작
  startSession(playerId: string, playerName: string, nation: Nation, roomId: string): void

  // 로그 기록
  logEventChoice(playerId: string, eventId: string, choiceId: string, isCorrect: boolean): void
  logBattle(playerId: string, result: 'win' | 'lose'): void
  logDiplomacy(playerId: string, action: string, target: Nation): void
  logChat(playerId: string, type: string, messageLength: number): void
  logAdvisorUse(playerId: string, query: string): void

  // 데이터 조회
  getPlayerProgress(playerId: string): PlayerProgress | null
  getRoomProgress(roomId: string): PlayerProgress[]

  // 통계 계산
  calculateAccuracyRate(playerId: string): number
  calculateEngagementScore(playerId: string): number
}
```

**gameManager.ts 통합**
- 기존 이벤트 처리 로직에 로그 수집 추가
- `handleVote()` 함수에 정답/오답 기록
- `handleBattle()` 함수에 전투 결과 기록
- 채팅 전송 시 활동 로그 기록

**작업 시간**: 3일

---

#### 2. 교사용 학습 분석 대시보드 v1
**우선순위**: 🔴 최우선

**클라이언트 구현** (`client/src/pages/TeacherDashboardPage.tsx`)

기존 대시보드를 확장하여 다음 기능 추가:

**개인별 학습 현황 테이블**
```typescript
interface StudentProgressRow {
  playerId: string;
  playerName: string;
  nation: Nation;
  playTime: string; // "45분 30초"
  completedTurns: number;
  accuracyRate: number; // 0-100
  choiceCount: number;
  battleCount: number;
  diplomacyCount: number;
  chatCount: number;
  advisorUseCount: number;
  engagementScore: number; // 참여도 점수 0-100
}
```

**새로운 UI 컴포넌트**
- 학생별 진도 현황 테이블
- 정답률 차트 (막대 그래프)
- 활동 참여도 히트맵
- 국가별 비교 차트
- 실시간 활동 로그 스트림

**API 엔드포인트 추가** (`server/src/index.ts`)
```typescript
// GET /api/teacher/dashboard/:roomCode/analytics
app.get('/api/teacher/dashboard/:roomCode/analytics', (req, res) => {
  const { roomCode } = req.params;
  const room = gameManager.rooms.get(roomCode);

  const analytics = {
    students: [], // PlayerProgress[]
    summary: {
      totalStudents: number,
      averageAccuracy: number,
      averagePlayTime: number,
      mostActiveNation: Nation,
    },
    timeline: [], // 시간대별 활동 데이터
  };

  res.json(analytics);
});
```

**작업 시간**: 3일

---

#### 3. 교육과정 연계 문서 작성
**우선순위**: 🔴 최우선

**새 파일 생성**: `docs/curriculum-mapping.md`

```markdown
# 교육과정 연계 문서

## 1. 성취기준 매핑

### 중학교 역사①
**성취기준**: [9역01-03]
- 삼국 및 가야의 성립과 발전 과정을 파악하고, 삼국 간의 항쟁 과정을 이해한다.

**게임 내 구현**:
- 국가 선택 단계에서 삼국의 건국 배경과 특징 학습
- 턴별 이벤트를 통해 정치·경제·사회·문화 발전 과정 체험
- 외교 및 전투 시스템으로 삼국 간 관계 이해
- AI 어드바이저의 역사적 맥락 설명

**연계 활동**:
- 게임 전: 삼국시대 기본 개념 학습
- 게임 중: 역사적 사건 의사결정 체험
- 게임 후: 선택과 결과에 대한 역사적 고찰

### 고등학교 한국사
**성취기준**: [10한사01-02]
- 삼국의 형성과 발전 과정을 이해하고, 고대 국가의 통치 체제와 대외 관계를 탐구한다.

...

## 2. 핵심 역량 연계

### 역사적 사고력
- **게임 요소**: 역사 이벤트 선택 시 원인과 결과 분석
- **측정 방법**: 정답률, 의사결정 패턴 분석

### 비판적 사고력
- **게임 요소**: 다양한 선택지 비교, AI 어드바이저 활용
- **측정 방법**: 선택 시간, 어드바이저 활용 빈도

### 의사소통 역량
- **게임 요소**: 팀 채팅, 외교 협상
- **측정 방법**: 채팅 참여도, 외교 활동 횟수

### 공동체 역량
- **게임 요소**: 멀티플레이어 협력, 동맹 체결
- **측정 방법**: 협업 선택 빈도, 팀 승률

### 문제해결력
- **게임 요소**: 국가 위기 상황 대응
- **측정 방법**: 위기 상황 극복률, 자원 관리 효율성

### 창의적 사고력
- **게임 요소**: 다양한 전략 수립
- **측정 방법**: 전략 다양성 지수

## 3. 단원별 학습 목표

[상세 내용...]
```

**작업 시간**: 1일

---

### Week 2 (Day 8-14)

#### 4. 수업 지도안 작성
**우선순위**: 🔴 최우선

**새 파일 생성**: `docs/lesson-plans.md`

```markdown
# 역사전쟁: 삼국시대 수업 지도안

## 전체 구성
- 대상: 중학교 2학년
- 교과: 역사
- 단원: 삼국의 성립과 발전
- 차시: 8차시 (4주)
- 학습 형태: 모둠별 게임 기반 학습

## 1-2차시: 삼국시대 기본 이해

### 학습 목표
- 고구려, 백제, 신라의 건국과 초기 발전 과정을 설명할 수 있다.
- 각 국가의 지리적 특징과 정치 체제를 비교할 수 있다.

### 수업 흐름

**도입 (10분)**
- 삼국시대 개념 소개
- 게임 소개 및 규칙 설명
- 모둠 편성 (3-4명)

**전개 (30분)**
- 국가 선택 및 게임 시작
- 초기 10턴 플레이
- 각 국가의 특징 체험
- 교사 순회 지도

**정리 (10분)**
- 각 모둠 발표: 선택한 국가의 특징
- 삼국 비교 토론
- 학습지 작성

### 평가 요소
- 게임 참여도 (20%)
- 의사결정 정확성 (30%)
- 발표 및 토론 (30%)
- 학습지 (20%)

### 준비물
- 태블릿 또는 PC (모둠당 1대)
- 학습지
- PPT 자료

[3-4차시, 5-6차시, 7-8차시 상세 내용...]
```

**작업 시간**: 2일

---

#### 5. 사용자 매뉴얼 작성
**우선순위**: 🟡 필수

**교사용 가이드**: `docs/teacher-guide.md`
**학생용 가이드**: `docs/student-guide.md`

각 20-30페이지 분량, 스크린샷 포함

**작업 시간**: 3일

---

#### 6. 즉각적 피드백 시스템 기초
**우선순위**: 🟡 필수

**클라이언트 구현**: `client/src/components/game/FeedbackModal.tsx`

```typescript
interface FeedbackMessage {
  eventId: string;
  choiceId: string;
  isCorrect: boolean;
  message: string;
  historicalContext: string;
  suggestion?: string;
}

// 피드백 메시지 데이터베이스 (100개)
const feedbackMessages: Record<string, FeedbackMessage> = {
  'goguryeo_expansion_war': {
    eventId: 'goguryeo_expansion_war',
    choiceId: 'preemptive_strike',
    isCorrect: false,
    message: '선제공격은 신중해야 합니다!',
    historicalContext: '고구려는 광개토대왕 시기에 영토를 크게 확장했지만, 무분별한 전쟁은 국력 소모를 가져왔습니다.',
    suggestion: '외교적 해결을 먼저 시도하거나, 충분한 군사력을 확보한 후 진행하세요.',
  },
  // ... 100개 이상의 피드백 메시지
};
```

**EventModal.tsx 수정**
- 선택 직후 피드백 표시
- 역사적 맥락 설명
- 다음 행동 제안

**작업 시간**: 2일

---

### Phase 1 완료 체크리스트

- [ ] 학습 데이터 수집 시스템 구현 및 테스트
- [ ] 교사용 대시보드 v1 완성
- [ ] 교육과정 연계 문서 작성
- [ ] 수업 지도안 8차시 작성
- [ ] 교사용/학생용 매뉴얼 작성
- [ ] 즉각적 피드백 시스템 100개 메시지 작성
- [ ] 전체 기능 통합 테스트
- [ ] 버그 수정

---

## Phase 2: 경쟁력 강화 기능 (4주)

> **목표**: 대회 경쟁력을 높이는 차별화 기능 구현
> **기간**: 4주 (Day 15-42)

### Week 3-4 (Day 15-28)

#### 7. 학습 리포트 자동 생성 시스템
**우선순위**: 🟠 중요

**서버 측 구현**: `server/src/reportGenerator.ts`

```typescript
export interface LearningReport {
  // 기본 정보
  student: {
    name: string;
    nation: Nation;
    className: string;
  };

  // 게임 요약
  summary: {
    playDate: string;
    totalPlayTime: string;
    completedTurns: number;
    finalScore: number;
  };

  // 학습 성과
  performance: {
    accuracyRate: number;
    correctChoices: number;
    incorrectChoices: number;
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  };

  // 역량 분석
  competencies: {
    historicalThinking: number; // 0-100
    criticalThinking: number;
    communication: number;
    collaboration: number;
    problemSolving: number;
    creativity: number;
  };

  // 활동 분석
  activities: {
    battleCount: number;
    diplomacyCount: number;
    chatCount: number;
    advisorUseCount: number;
  };

  // 강점/약점
  strengths: string[];
  weaknesses: string[];

  // 개선 방안
  suggestions: string[];

  // 주요 의사결정 이력
  keyDecisions: Array<{
    turn: number;
    event: string;
    choice: string;
    isCorrect: boolean;
    impact: string;
  }>;

  // 교사 코멘트 (선택)
  teacherComment?: string;
}

export class ReportGenerator {
  generateReport(playerId: string): LearningReport
  exportToPDF(report: LearningReport): Buffer
  exportToExcel(reports: LearningReport[]): Buffer // 학급 전체
}
```

**PDF 생성 라이브러리**: `pdfkit` 사용

**API 엔드포인트**
```typescript
// GET /api/teacher/report/:roomCode/:playerId
app.get('/api/teacher/report/:roomCode/:playerId', (req, res) => {
  const report = reportGenerator.generateReport(req.params.playerId);
  res.json(report);
});

// GET /api/teacher/report/:roomCode/:playerId/pdf
app.get('/api/teacher/report/:roomCode/:playerId/pdf', (req, res) => {
  const report = reportGenerator.generateReport(req.params.playerId);
  const pdfBuffer = reportGenerator.exportToPDF(report);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdfBuffer);
});

// GET /api/teacher/report/:roomCode/excel
app.get('/api/teacher/report/:roomCode/excel', (req, res) => {
  const reports = reportGenerator.generateRoomReports(req.params.roomCode);
  const excelBuffer = reportGenerator.exportToExcel(reports);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(excelBuffer);
});
```

**클라이언트 UI**: 대시보드에 "리포트 다운로드" 버튼 추가

**작업 시간**: 5일

---

#### 8. 역사 자료실 구축
**우선순위**: 🟠 중요

**새 파일**: `client/src/data/historicalResources.ts`

```typescript
export interface HistoricalTimeline {
  year: number;
  events: Array<{
    nation: Nation | 'all';
    title: string;
    description: string;
    significance: string;
  }>;
}

export interface HistoricalFigure {
  id: string;
  name: string;
  nation: Nation;
  period: string;
  title: string; // 직위
  achievements: string[];
  imageUrl?: string;
  biography: string;
}

export interface CulturalHeritage {
  id: string;
  name: string;
  nation: Nation;
  type: 'architecture' | 'artifact' | 'document' | 'tomb';
  period: string;
  location: string;
  description: string;
  significance: string;
  imageUrl?: string;
}

export interface HistoricalTerm {
  id: string;
  term: string;
  category: 'politics' | 'military' | 'economy' | 'culture' | 'society';
  definition: string;
  example: string;
  relatedTerms: string[];
}

// 데이터
export const timeline: HistoricalTimeline[] = [...]; // 50개 이상
export const figures: HistoricalFigure[] = [...]; // 30명 이상
export const heritage: CulturalHeritage[] = [...]; // 30개 이상
export const terms: HistoricalTerm[] = [...]; // 100개 이상
```

**새 페이지**: `client/src/pages/HistoricalResourcesPage.tsx`
- 탭: 연표 / 인물 / 문화유산 / 용어사전
- 검색 기능
- 필터링 (국가별, 시대별, 카테고리별)
- 상세 모달

**게임 내 통합**:
- 이벤트 모달에 "자세히 알아보기" 버튼
- 관련 인물/사건/용어 자동 링크
- 툴팁으로 용어 설명 표시

**작업 시간**: 5일

---

#### 9. 역사 지도 및 타임라인 시각화
**우선순위**: 🟡 중요

**지도 컴포넌트**: `client/src/components/resources/InteractiveMap.tsx`
- 삼국의 영토 변화 애니메이션
- 턴별 영토 표시
- 주요 전투 위치 마커
- 수도 및 주요 도시 표시

**라이브러리**: `react-simple-maps` 또는 `leaflet`

**타임라인 컴포넌트**: `client/src/components/resources/TimelineVisualization.tsx`
- 가로 스크롤 타임라인
- 주요 사건 표시
- 클릭 시 상세 정보

**작업 시간**: 4일

---

### Week 5-6 (Day 29-42)

#### 10. 성취 배지 시스템
**우선순위**: 🟡 중요

**배지 타입**: `client/src/types/achievements.ts`

```typescript
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: {
    type: 'event' | 'stat' | 'streak' | 'combo';
    requirement: any;
  };
}

// 배지 예시
export const achievements: Achievement[] = [
  // 평화 배지
  {
    id: 'peaceful_diplomat',
    name: '평화 외교가',
    description: '전쟁 없이 30턴 생존',
    icon: '🏛️',
    rarity: 'rare',
    condition: { type: 'stat', requirement: { turnsWithoutWar: 30 } },
  },

  // 전투 배지
  {
    id: 'war_strategist',
    name: '전략가',
    description: '5번 연속 전투 승리',
    icon: '⚔️',
    rarity: 'epic',
    condition: { type: 'streak', requirement: { winStreak: 5 } },
  },

  // 학습 배지
  {
    id: 'historian',
    name: '역사학자',
    description: '모든 이벤트 경험',
    icon: '📜',
    rarity: 'legendary',
    condition: { type: 'event', requirement: { uniqueEvents: 50 } },
  },

  // 협력 배지
  {
    id: 'master_negotiator',
    name: '협상의 달인',
    description: '외교 협정 10회 체결',
    icon: '🤝',
    rarity: 'rare',
    condition: { type: 'stat', requirement: { diplomacyCount: 10 } },
  },

  // ... 총 30개 이상
];
```

**배지 획득 시스템**: `server/src/achievementManager.ts`
- 실시간 조건 체크
- 배지 획득 알림 전송
- 배지 컬렉션 저장

**UI 컴포넌트**:
- 배지 획득 토스트 알림
- 마이페이지에 배지 컬렉션 표시
- 배지 진행도 표시

**작업 시간**: 3일

---

#### 11. 오답 노트 기능
**우선순위**: 🟡 중요

**데이터 구조**: `server/src/types.ts`

```typescript
export interface MistakeNote {
  playerId: string;
  mistakes: Array<{
    turn: number;
    eventId: string;
    eventTitle: string;
    wrongChoiceId: string;
    wrongChoiceText: string;
    correctChoiceId: string;
    correctChoiceText: string;
    explanation: string;
    timestamp: number;
    reviewed: boolean;
    retryCount: number;
  }>;
}
```

**클라이언트 페이지**: `client/src/pages/MistakeNotePage.tsx`
- 틀린 문제 목록
- 정답 및 해설 표시
- "다시 도전" 버튼 (같은 상황 재현)
- 복습 완료 체크

**게임 내 통합**:
- 게임 종료 후 "오답 노트 보기" 버튼
- 재도전 시 같은 이벤트 발생

**작업 시간**: 3일

---

#### 12. 교육적 효과 검증 (파일럿 테스트)
**우선순위**: 🔴 최우선

**테스트 계획**:
- 대상: 중학교 2학년 3개 학급 (90명)
- 기간: 4주 (8차시)
- 측정 도구:
  - 사전-사후 검사 (역사 지식)
  - 학습 동기 설문조사
  - 수업 만족도 조사
  - 교사 인터뷰
  - 학생 인터뷰

**데이터 수집**:
- 게임 플레이 데이터 자동 수집
- 설문조사 응답
- 관찰 일지

**분석 및 리포트 작성**:
- 통계 분석 (SPSS)
- 결과 정리 및 그래프 작성
- 효과 검증 보고서 작성

**작업 시간**: 5일 (테스트 기간 제외)

---

### Phase 2 완료 체크리스트

- [ ] 학습 리포트 자동 생성 (PDF/Excel)
- [ ] 역사 자료실 구축 (연표, 인물, 문화유산, 용어사전)
- [ ] 역사 지도 및 타임라인 시각화
- [ ] 성취 배지 시스템 (30개 이상)
- [ ] 오답 노트 기능
- [ ] 파일럿 테스트 실시 및 결과 분석
- [ ] 버그 수정 및 개선

---

## Phase 3: 차별화 기능 (8주)

> **목표**: 대회 최우수상을 위한 차별화된 기능 구현
> **기간**: 8주 (Day 43-98)

### Week 7-10 (Day 43-70)

#### 13. AI 기반 맞춤형 학습
**우선순위**: 🟠 중요

**AI 어드바이저 고도화** (`server/src/aiAdvisor.ts`)

현재 기능 확장:
```typescript
export interface AIAdvisorRequest {
  playerId: string;
  playerName: string;
  nation: Nation;
  currentStats: NationStats;
  recentEvents: EventHistory[];
  learningProgress: {
    weakAreas: string[]; // 약한 영역 (군사, 경제 등)
    strengths: string[];
    accuracyRate: number;
  };
  question: string;
}

export interface AIAdvisorResponse {
  answer: string;

  // 맞춤형 학습 가이드
  personalizedTips: string[];

  // 추천 전략
  recommendedStrategy: {
    shortTerm: string;
    longTerm: string;
    alternatives: string[];
  };

  // 학습 자료 추천
  recommendedResources: Array<{
    type: 'timeline' | 'figure' | 'heritage' | 'term';
    id: string;
    reason: string;
  }>;

  // 역사적 맥락
  historicalContext: string;

  // 현대 교훈
  modernLesson?: string;
}
```

**학습 패턴 분석**:
- 플레이어의 약점 자동 감지
- 난이도 자동 조절
- 맞춤형 이벤트 추천

**작업 시간**: 7일

---

#### 14. 빅데이터 분석 시스템
**우선순위**: 🟡 선택

**데이터 수집**:
- 전국 학생들의 플레이 데이터
- 선택 패턴 분석
- 학습 효과 데이터

**분석 대시보드**: `client/src/pages/BigDataDashboard.tsx`
- 전국 평균 통계
- 인기 전략 순위
- 국가별 승률 통계
- 이벤트 난이도 분석
- 학습 효과가 높은 이벤트 Top 10

**교사용 기능**:
- "우리 반과 전국 평균 비교" 차트
- 효과적인 수업 방법 제안
- 게임 밸런스 개선 제안

**작업 시간**: 7일

---

#### 15. 실생활 연계 학습 콘텐츠
**우선순위**: 🟡 선택

**현대 교훈 시스템**:

```typescript
export interface ModernLesson {
  historicalEvent: string;
  gameChoice: string;
  modernConnection: {
    topic: string; // "국제 관계", "경제 정책" 등
    example: string; // 현대 사례
    lesson: string; // 교훈
    discussion: string[]; // 토론 주제
  };
}

// 예시
const lessons: ModernLesson[] = [
  {
    historicalEvent: '동맹국의 배신',
    gameChoice: '신라가 당나라와 동맹 후 배신당함',
    modernConnection: {
      topic: '국제 관계에서의 신뢰',
      example: '현대 국제 조약 및 동맹 관계 (NATO, UN 등)',
      lesson: '국제 관계에서 신뢰의 중요성과 자국 이익 추구의 균형',
      discussion: [
        '국가 간 신뢰는 어떻게 구축되는가?',
        '자국 이익과 동맹의 의무가 충돌할 때 어떻게 해야 하는가?',
      ],
    },
  },
];
```

**UI 통합**:
- 게임 종료 후 "현대와의 연결" 페이지
- 역사 → 현대 비교 차트
- 토론 주제 제공

**작업 시간**: 5일

---

### Week 11-12 (Day 71-84)

#### 16. 접근성 기능
**우선순위**: 🟢 선택

**시각 접근성**:
```typescript
// 색약 모드
export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

// 테마 설정
export interface AccessibilitySettings {
  colorBlindMode: ColorBlindMode;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge'; // 100%, 125%, 150%
  reduceMotion: boolean; // 애니메이션 감소
  screenReader: boolean; // 스크린 리더 지원
}
```

**구현**:
- 색약 모드 CSS 필터 적용
- 고대비 테마 추가
- 텍스트 크기 조절
- ARIA 레이블 추가
- 애니메이션 비활성화 옵션

**조작 접근성**:
- 모든 기능에 키보드 단축키 추가
- 탭 네비게이션 순서 최적화
- 포커스 표시 명확화

**작업 시간**: 5일

---

#### 17. 오프라인 모드 (PWA)
**우선순위**: 🟢 선택

**PWA 설정**:
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '역사전쟁: 삼국시대',
        short_name: '삼국시대',
        description: '게임으로 배우는 역사',
        theme_color: '#f59e0b',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
});
```

**오프라인 기능**:
- 싱글플레이어 모드만 오프라인 지원
- 로컬 스토리지에 진행 상황 저장
- 온라인 복귀 시 자동 동기화

**작업 시간**: 4일

---

#### 18. 성능 최적화 및 저사양 PC 지원
**우선순위**: 🟡 중요

**최적화 작업**:
- 코드 스플리팅 (React.lazy)
- 이미지 최적화 (WebP, lazy loading)
- 번들 사이즈 줄이기
- 메모리 누수 제거
- 렌더링 최적화 (useMemo, useCallback)

**저사양 모드**:
```typescript
export interface PerformanceSettings {
  quality: 'low' | 'medium' | 'high';
  animations: boolean;
  particleEffects: boolean;
  shadows: boolean;
}

// 자동 감지
export function detectPerformance(): PerformanceSettings {
  const memory = (performance as any).memory;
  const cores = navigator.hardwareConcurrency;

  if (cores < 4 || (memory && memory.jsHeapSizeLimit < 2000000000)) {
    return { quality: 'low', animations: false, particleEffects: false, shadows: false };
  }
  // ...
}
```

**작업 시간**: 4일

---

### Phase 3 완료 체크리스트

- [ ] AI 기반 맞춤형 학습 구현
- [ ] 빅데이터 분석 시스템 구축
- [ ] 실생활 연계 학습 콘텐츠 (30개)
- [ ] 접근성 기능 (색약 모드, 키보드 단축키 등)
- [ ] 오프라인 모드 (PWA)
- [ ] 성능 최적화 및 저사양 PC 지원
- [ ] 최종 통합 테스트
- [ ] 보안 점검
- [ ] 버그 수정

---

## 기술 스택 및 아키텍처

### Frontend
```
React 18.3.1
├── TypeScript 5.6.2
├── Vite 5.4.10
├── TailwindCSS 4.0.0
├── Framer Motion 11.0.0
├── Socket.io-client 4.8.1
├── Zustand 4.5.7
├── React Router 6.20.0
└── Lucide React (icons)
```

### Backend
```
Node.js + Express 4.18.2
├── TypeScript 5.3.2
├── Socket.io 4.7.2
├── Google Generative AI 0.24.1
└── UUID 9.0.1
```

### 새로 추가할 라이브러리

**Phase 1**
- 없음 (기존 기술 스택 활용)

**Phase 2**
```bash
# 서버
npm install pdfkit @types/pdfkit
npm install exceljs

# 클라이언트
npm install react-simple-maps
npm install chart.js react-chartjs-2
npm install date-fns
```

**Phase 3**
```bash
# PWA
npm install -D vite-plugin-pwa

# 성능
npm install -D vite-plugin-compression
npm install -D rollup-plugin-visualizer
```

### 데이터베이스

현재는 인메모리 저장소 사용. Phase 2부터 영구 저장소 필요 시:

**옵션 1**: SQLite (간단, 파일 기반)
```bash
npm install better-sqlite3 @types/better-sqlite3
```

**옵션 2**: MongoDB (확장성 높음)
```bash
npm install mongodb mongoose
```

**추천**: 초기에는 SQLite, 확장 시 MongoDB로 마이그레이션

---

## 일정 및 마일스톤

### 전체 일정표

```
Week 1-2  (Phase 1)  ████████████████░░░░░░░░░░░░░░░░  출품 필수 기능
Week 3-4  (Phase 2)  ░░░░░░░░░░░░░░░░████████░░░░░░░░  리포트 & 자료실
Week 5-6  (Phase 2)  ░░░░░░░░░░░░░░░░░░░░░░░░████████  배지 & 오답노트
Week 7-10 (Phase 3)  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░████  AI & 빅데이터
Week 11-12(Phase 3)  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██  접근성 & 최적화
Week 13-14          ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  최종 준비
```

### 마일스톤

**M1 - Day 7**: 학습 데이터 수집 시스템 완료
- [ ] LearningAnalytics 클래스 구현
- [ ] 모든 게임 이벤트에 로그 통합
- [ ] API 엔드포인트 구현
- [ ] 테스트 완료

**M2 - Day 14**: Phase 1 완료
- [ ] 대시보드 v1 완성
- [ ] 교육과정 문서 작성
- [ ] 수업 지도안 작성
- [ ] 매뉴얼 작성
- [ ] 피드백 시스템 기초

**M3 - Day 28**: 리포트 & 자료실 완료
- [ ] PDF/Excel 리포트 생성
- [ ] 역사 자료실 100개 항목
- [ ] 지도 및 타임라인
- [ ] 파일럿 테스트 계획 수립

**M4 - Day 42**: Phase 2 완료
- [ ] 배지 시스템 30개
- [ ] 오답 노트 기능
- [ ] 파일럿 테스트 실시 및 결과 분석
- [ ] 중간 버그 수정

**M5 - Day 70**: AI & 빅데이터 완료
- [ ] AI 어드바이저 고도화
- [ ] 빅데이터 분석 대시보드
- [ ] 실생활 연계 콘텐츠 30개

**M6 - Day 84**: Phase 3 완료
- [ ] 접근성 기능 전체
- [ ] 오프라인 모드 (PWA)
- [ ] 성능 최적화
- [ ] 보안 점검

**M7 - Day 98**: 출품 준비 완료
- [ ] 최종 통합 테스트
- [ ] 문서 최종 검토
- [ ] 표절 검사 (카피킬러 20% 미만)
- [ ] 제출 자료 패키징

---

## 일일 개발 목표 (예시)

### Week 1

**Day 1 (월)**
- [ ] 08:00-09:00: LearningLog 타입 정의
- [ ] 09:00-12:00: LearningAnalytics 클래스 구현
- [ ] 13:00-15:00: gameManager.ts에 로그 수집 통합
- [ ] 15:00-17:00: 로그 저장 테스트
- [ ] 17:00-18:00: 코드 리뷰 및 리팩토링

**Day 2 (화)**
- [ ] 08:00-10:00: API 엔드포인트 구현
- [ ] 10:00-12:00: 통계 계산 로직 구현
- [ ] 13:00-15:00: 단위 테스트 작성
- [ ] 15:00-17:00: 통합 테스트
- [ ] 17:00-18:00: 버그 수정

**Day 3 (수)**
- [ ] 08:00-10:00: PlayerProgress 타입 정의
- [ ] 10:00-12:00: 프론트엔드 API 연동
- [ ] 13:00-15:00: 대시보드 테이블 컴포넌트
- [ ] 15:00-17:00: 차트 컴포넌트 (Chart.js)
- [ ] 17:00-18:00: 스타일링

[계속...]

---

## 품질 관리

### 코드 품질
- [ ] ESLint 규칙 준수
- [ ] TypeScript strict 모드
- [ ] 코드 리뷰 (AI 도구 활용)
- [ ] 리팩토링 (중복 코드 제거)

### 테스트
- [ ] 단위 테스트 (주요 로직)
- [ ] 통합 테스트 (API)
- [ ] E2E 테스트 (주요 시나리오)
- [ ] 사용성 테스트 (교사, 학생)

### 보안
- [ ] XSS 방어
- [ ] SQL Injection 방어 (DB 사용 시)
- [ ] CORS 설정
- [ ] 입력 검증
- [ ] 개인정보 보호

### 성능
- [ ] 번들 사이즈 < 2MB
- [ ] 초기 로딩 시간 < 3초
- [ ] 메모리 사용량 < 500MB
- [ ] 저사양 PC 테스트 (4GB RAM, 듀얼코어)

---

## 리스크 관리

### 주요 리스크

**R1: 개발 일정 지연**
- 확률: 중 (40%)
- 영향: 높음
- 대응: Phase 3 일부 기능 축소, 우선순위 조정

**R2: 파일럿 테스트 섭외 실패**
- 확률: 중 (30%)
- 영향: 높음
- 대응: 대안 학교 사전 섭외, 온라인 테스트 병행

**R3: 기술적 문제 (버그, 성능)**
- 확률: 중 (50%)
- 영향: 중
- 대응: 충분한 테스트 기간 확보, 코드 리뷰 강화

**R4: 표절 검사 실패**
- 확률: 낮음 (10%)
- 영향: 매우 높음
- 대응: 모든 콘텐츠 자체 제작, 참고 문헌 명확히 표기

---

## 성공 지표 (KPI)

### 개발 완료도
- [ ] Phase 1 기능 100% 완료
- [ ] Phase 2 기능 80% 이상 완료
- [ ] Phase 3 기능 50% 이상 완료

### 문서화
- [ ] 교육과정 연계 문서 완성
- [ ] 수업 지도안 8차시 완성
- [ ] 매뉴얼 (교사/학생) 완성
- [ ] 개발 문서 완성

### 교육적 효과
- [ ] 학습 동기 20% 이상 증가
- [ ] 역사 지식 이해도 30% 이상 향상
- [ ] 수업 만족도 4.0/5.0 이상
- [ ] 협업 능력 향상 긍정 응답 80% 이상

### 기술적 품질
- [ ] 버그 심각도 높음 0건
- [ ] 성능 목표 달성 (로딩 < 3초)
- [ ] 접근성 WCAG 2.1 AA 수준
- [ ] 브라우저 호환성 (Chrome, Safari, Edge)

---

## 최종 제출 체크리스트

### 필수 문서
- [ ] 연구 계획서 (10-20페이지)
- [ ] 교육과정 연계 문서 (5-10페이지)
- [ ] 수업 지도안 8차시 (20-30페이지)
- [ ] 교사용 매뉴얼 (20-30페이지)
- [ ] 학생용 매뉴얼 (15-20페이지)
- [ ] 교육적 효과 검증 보고서 (10-15페이지)
- [ ] 개발 문서 (10-15페이지)
- [ ] 카피킬러 검사 결과 (20% 미만)

### 필수 기능
- [ ] 학습 데이터 수집 시스템
- [ ] 교사용 학습 분석 대시보드
- [ ] 학생별 학습 리포트 생성 (PDF)
- [ ] 역사 자료실 (최소 50개 항목)
- [ ] 피드백 시스템 (100개 메시지)
- [ ] AI 어드바이저 고도화

### 기술적 요구사항
- [ ] Chrome, Safari, Edge 테스트 완료
- [ ] 모바일/태블릿 반응형 확인
- [ ] 저사양 PC 성능 테스트 (4GB RAM)
- [ ] 보안 취약점 점검 완료
- [ ] 개인정보 보호 조치 완료

### 사용성 테스트
- [ ] 교사 5명 이상 테스트
- [ ] 학생 30명 이상 파일럿 테스트
- [ ] 피드백 반영 및 개선
- [ ] 모든 버그 수정 완료

### 제출 자료
- [ ] 소스 코드 (GitHub 또는 ZIP)
- [ ] 설치 가이드
- [ ] 데모 영상 (5-10분)
- [ ] PPT 발표 자료 (20-30장)
- [ ] 스크린샷 (10-20장)

---

## 개발 팀 역할 분담

### 개발자 1 (백엔드 중심)
- 학습 데이터 수집 시스템
- 리포트 생성 시스템
- API 엔드포인트
- AI 어드바이저 고도화

### 개발자 2 (프론트엔드 중심)
- 대시보드 UI/UX
- 역사 자료실 페이지
- 성취 배지 시스템
- 오답 노트 UI

### 교육 전문가
- 교육과정 연계 문서
- 수업 지도안 작성
- 교육적 효과 검증
- 콘텐츠 검수

### 디자이너
- UI/UX 개선
- 아이콘 및 일러스트
- 배지 디자인
- 발표 자료 디자인

---

## 참고 자료

### 개발 문서
- [React 공식 문서](https://react.dev/)
- [Socket.io 공식 문서](https://socket.io/docs/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [TailwindCSS 문서](https://tailwindcss.com/docs)

### 교육 관련
- [2015 개정 교육과정](https://ncic.go.kr/)
- [2022 개정 교육과정](https://ncic.go.kr/)
- [디지털교육연구대회 안내](COMPETITION_GUIDE.md)

### 역사 자료
- 국사편찬위원회 한국사 데이터베이스
- 문화재청 문화유산 정보
- 국립중앙박물관 소장품 정보

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2024-12-04 | 1.0 | 최초 작성 | 개발팀 |
| 2026-01-17 | 1.1 | Phase 0 추가 (문명 참고 게임 기능 강화) | 개발팀 |

---

**다음 업데이트 예정**: Phase 0 완료 후
