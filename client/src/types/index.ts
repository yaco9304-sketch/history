// ========================================
// 역사전쟁:삼국시대 타입 정의
// ========================================

// 국가 타입
export type Nation = 'goguryeo' | 'baekje' | 'silla';

// 국가 정보
export interface NationInfo {
  id: Nation;
  name: string;
  englishName: string;
  color: string;
  colorDark: string;
  traits: string[];
  description: string;
}

// 국력 스탯
export interface NationStats {
  military: number;    // 군사력 (0-500)
  economy: number;     // 경제력 (0-500)
  diplomacy: number;   // 외교력 (0-500)
  culture: number;     // 문화력 (0-500)
  gold: number;        // 재화
  population: number;  // 인구
  morale: number;      // 민심 (0-100)
  [key: string]: number; // index signature 추가
}

// 플레이어
export interface Player {
  id: string;
  name: string;
  team: Nation | null;
  role?: 'king' | 'general' | 'minister';
  isReady: boolean;
  isOnline: boolean;
  isAI?: boolean; // AI 플레이어 여부
  aiDifficulty?: 'easy' | 'normal' | 'hard'; // AI 난이도
}

// 팀
export interface Team {
  nation: Nation;
  players: Player[];
  stats: NationStats;
  allies: Nation[];
  enemies: Nation[];
}

// 선택지
export interface Choice {
  id: string;
  text: string;
  effects: Partial<NationStats>;
  isHistorical: boolean;
  tooltip: string;
  risk: 'safe' | 'normal' | 'risky';
}

// 역사 이벤트
export interface HistoricalEvent {
  id: string;
  year: number;
  targetNation: Nation | 'all';
  title: string;
  description: string;
  historicalContext: string;
  choices: Choice[];
  difficulty: 'easy' | 'normal' | 'hard';
  category: 'military' | 'economy' | 'diplomacy' | 'culture' | 'politics';
}

// 투표
export interface Vote {
  eventId: string;
  votes: Record<string, string>; // playerId -> choiceId
  deadline: number;
  result?: string;
}

// 게임 상태
export type GameStatus = 'waiting' | 'playing' | 'finished';

// 게임 설정
export interface GameSettings {
  maxTurns: number;
  turnDuration: number; // seconds
  eventDuration: number; // seconds
  difficulty: 'easy' | 'normal' | 'hard';
}

// 게임 세션
export interface GameSession {
  id: string;
  code: string;
  hostId: string;
  className: string;
  status: GameStatus;
  currentTurn: number;
  currentYear: number;
  teams: Record<Nation, Team>;
  settings: GameSettings;
  currentEvent?: HistoricalEvent;
  currentVote?: Vote;
  createdAt: number;
  startedAt?: number;
}

// 채팅 메시지
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  team: Nation;
  message: string;
  type: 'team' | 'public' | 'diplomacy' | 'system';
  target?: Nation;
  timestamp: number;
}

// 외교 관계
export interface DiplomaticRelation {
  nation: Nation;
  friendliness: number; // 0-100
  status: 'ally' | 'friendly' | 'neutral' | 'tense' | 'enemy';
  history: string[];
}
