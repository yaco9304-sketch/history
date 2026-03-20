// ============================================
// 역사전쟁:삼국시대 서버 타입 정의
// ============================================

export type Nation = 'goguryeo' | 'baekje' | 'silla';

// ============================================
// 승리 조건 시스템
// ============================================
export type VictoryType = 'military' | 'cultural' | 'diplomatic' | 'technological' | 'score';

export interface VictoryCondition {
  type: VictoryType;
  name: string;
  description: string;
  icon: string;
  requirement: {
    military?: { conqueredNations: number };
    cultural?: { culturePoints: number };
    diplomatic?: { alliances: number; peaceTurns: number };
    technological?: { completedTechs: number };
    score?: { minTurns: number };
  };
}

export interface VictoryProgress {
  military: { conqueredNations: string[]; progress: number };
  cultural: { culturePoints: number; progress: number };
  diplomatic: { alliances: number; peaceTurns: number; progress: number };
  technological: { completedTechs: string[]; progress: number };
  score: { totalScore: number; progress: number };
}

// 승리 조건 상수
export const VICTORY_CONDITIONS: VictoryCondition[] = [
  {
    type: 'military',
    name: '삼국통일',
    description: '다른 두 국가를 모두 정복하여 삼국을 통일합니다.',
    icon: '🏆',
    requirement: { military: { conqueredNations: 2 } },
  },
  {
    type: 'cultural',
    name: '문화대국',
    description: '문화 점수 500점을 달성하여 문화적 우위를 점합니다.',
    icon: '🏛️',
    requirement: { cultural: { culturePoints: 500 } },
  },
  {
    type: 'diplomatic',
    name: '평화의 시대',
    description: '두 국가와 동맹을 맺고 10턴간 평화를 유지합니다.',
    icon: '📜',
    requirement: { diplomatic: { alliances: 2, peaceTurns: 10 } },
  },
  {
    type: 'technological',
    name: '기술 선진국',
    description: '모든 기술을 연구하여 기술적 우위를 달성합니다.',
    icon: '🔬',
    requirement: { technological: { completedTechs: 8 } },
  },
  {
    type: 'score',
    name: '최강국',
    description: '30턴이 지났을 때 가장 높은 총점을 획득합니다.',
    icon: '⏰',
    requirement: { score: { minTurns: 30 } },
  },
];

// ============================================
// 국가 스탯
// ============================================
export interface NationStats {
  military: number;
  economy: number;
  diplomacy: number;
  culture: number;
  gold: number;
  population: number;
  morale: number;
  // 새로운 승리 조건용 스탯
  culturePoints: number;      // 문화 점수 (문화 승리용)
  techProgress: number;       // 기술 진행도
  peaceTurns: number;         // 평화 유지 턴 수
  [key: string]: number; // index signature 추가
}

export interface Player {
  id: string;
  socketId: string;
  name: string;
  team: Nation | null;
  role?: 'king' | 'general' | 'minister';
  isReady: boolean;
  isOnline: boolean;
  joinedAt: number;
  isAI?: boolean; // AI 플레이어 여부
  aiDifficulty?: 'easy' | 'normal' | 'hard'; // AI 난이도
}

// 이벤트 선택 이력
export interface EventHistory {
  turn: number;
  year: number;
  eventId: string;
  eventTitle: string;
  choiceId: string;
  choiceText: string;
  isHistorical: boolean; // 역사적 선택(맞음) 여부
  timestamp: number;
}

export interface Team {
  nation: Nation;
  players: string[]; // player ids
  stats: NationStats;
  allies: Nation[];
  enemies: Nation[];
  eventHistory: EventHistory[]; // 국가별 이벤트 선택 이력
  conqueredBy?: Nation; // 정복당한 경우 정복자 국가
  isEliminated: boolean; // 탈락 여부
  victoryProgress: VictoryProgress; // 승리 진행 상황
}

export interface Choice {
  id: string;
  text: string;
  effects: Partial<NationStats>;
  isHistorical: boolean;
  tooltip: string;
  risk: 'safe' | 'normal' | 'risky';
}

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

export interface Vote {
  eventId: string;
  votes: Record<string, string>; // playerId -> choiceId
  deadline: number;
  result?: string;
}

export type GameStatus = 'waiting' | 'countdown' | 'playing' | 'discussion' | 'voting' | 'finished';

export interface GameSettings {
  maxTurns: number;
  turnDuration: number;
  discussionDuration: number; // 토론 시간 (초)
  voteDuration: number;
  maxPlayersPerTeam: number;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface GameRoom {
  id: string;
  code: string;
  hostId: string;
  hostName: string;
  className: string;
  status: GameStatus;
  currentTurn: number;
  currentYear: number;
  teams: Record<Nation, Team>;
  players: Record<string, Player>;
  settings: GameSettings;
  currentEvent?: HistoricalEvent;
  currentVotes: Record<Nation, Vote>;
  turnDeadline?: number;
  createdAt: number;
  startedAt?: number;
  chatMessages: ChatMessage[]; // 채팅 메시지 저장 (교사용 대시보드용)
  isSinglePlayerAI?: boolean; // 싱글플레이 AI 대전 여부
  // 승리 조건 관련
  victoryConditions: VictoryCondition[]; // 활성화된 승리 조건들
  winner?: { nation: Nation; victoryType: VictoryType; turn: number }; // 승자 정보
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  team: Nation;
  message: string;
  type: 'team' | 'public' | 'diplomacy' | 'system';
  target?: Nation;
  timestamp: number;
}

// Socket.io 이벤트 타입
export interface ServerToClientEvents {
  // 방 관련
  roomCreated: (room: GameRoom) => void;
  roomJoined: (room: GameRoom, player: Player) => void;
  roomUpdated: (room: GameRoom) => void;
  playerJoined: (player: Player) => void;
  playerLeft: (playerId: string) => void;
  playerUpdated: (player: Player) => void;
  
  // 게임 진행
  gameStarting: (countdown: number) => void;
  gameStarted: (room: GameRoom) => void;
  turnStarted: (turn: number, year: number, deadline: number) => void;
  eventTriggered: (event: HistoricalEvent, deadline: number) => void;
  voteReceived: (nation: Nation, playerId: string, choiceId: string) => void;
  voteResult: (nation: Nation, choiceId: string, effects: Partial<NationStats>) => void;
  turnEnded: (room: GameRoom) => void;
  gameEnded: (room: GameRoom, winner: Nation | null, reason: string) => void;
  
  // 승리 조건
  victoryProgress: (nation: Nation, progress: VictoryProgress) => void;
  victoryAchieved: (nation: Nation, victoryType: VictoryType, victoryName: string) => void;
  nationEliminated: (nation: Nation, conqueror: Nation) => void;
  
  // 채팅
  chatMessage: (message: ChatMessage) => void;

  // 외교
  allianceProposed: (fromNation: Nation, toNation: Nation) => void;
  allianceAccepted: (nation1: Nation, nation2: Nation) => void;
  allianceBroken: (nation1: Nation, nation2: Nation) => void;
  warDeclared: (attackerNation: Nation, defenderNation: Nation) => void;
  warEnded: (nation1: Nation, nation2: Nation) => void;

  // 전투
  battleProposed: (attackerNation: Nation, defenderNation: Nation, battleId: string) => void;
  battleResult: (result: {
    winner: Nation;
    attackerNation: Nation;
    defenderNation: Nation;
    attackerLosses: Partial<NationStats>;
    defenderLosses: Partial<NationStats>;
    allySupport: Record<Nation, number>;
  }) => void;

  // 에러
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  // 방 관련
  createRoom: (data: { hostName: string; className: string; settings?: Partial<GameSettings> }) => void;
  joinRoom: (data: { code: string; playerName: string; playerId?: string }) => void;
  leaveRoom: () => void;
  selectTeam: (nation: Nation) => void;
  toggleReady: () => void;
  kickPlayer: (playerId: string) => void;

  // 게임 진행
  startGame: () => void;
  submitVote: (choiceId: string) => void;

  // 채팅
  sendChat: (data: { message: string; type: 'team' | 'public' | 'diplomacy'; target?: Nation }) => void;

  // 외교
  proposeAlliance: (targetNation: Nation) => void;
  acceptAlliance: (proposerNation: Nation) => void;
  breakAlliance: (targetNation: Nation) => void;
  declareWar: (targetNation: Nation) => void;
  endWar: (targetNation: Nation) => void;

  // 전투
  initiateBattle: (defenderNation: Nation) => void;
  acceptBattle: (battleId: string) => void;
  rejectBattle: (battleId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  roomId?: string;
  playerId?: string;
}





