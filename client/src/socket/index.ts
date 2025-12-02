// ============================================
// Socket.io 클라이언트 연결
// ============================================

import { io, Socket } from 'socket.io-client';
import {
  Nation,
  Player,
  HistoricalEvent,
  NationStats,
  ChatMessage,
} from '../types';

// 서버 URL
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

// 게임 룸 타입 (서버와 동일)
export interface GameRoom {
  id: string;
  code: string;
  hostId: string;
  hostName: string;
  className: string;
  status: 'waiting' | 'countdown' | 'playing' | 'voting' | 'finished';
  currentTurn: number;
  currentYear: number;
  teams: Record<Nation, {
    nation: Nation;
    players: string[];
    stats: NationStats;
    allies: Nation[];
    enemies: Nation[];
  }>;
  players: Record<string, Player & { socketId: string; joinedAt: number }>;
  settings: {
    maxTurns: number;
    turnDuration: number;
    voteDuration: number;
    maxPlayersPerTeam: number;
    difficulty: 'easy' | 'normal' | 'hard';
  };
  currentEvent?: HistoricalEvent;
  currentVotes: Record<Nation, {
    eventId: string;
    votes: Record<string, string>;
    deadline: number;
    result?: string;
  }>;
  turnDeadline?: number;
  createdAt: number;
  startedAt?: number;
}

// 서버 -> 클라이언트 이벤트 타입
interface ServerToClientEvents {
  roomCreated: (room: GameRoom) => void;
  roomJoined: (room: GameRoom, player: Player) => void;
  roomUpdated: (room: GameRoom) => void;
  playerJoined: (player: Player) => void;
  playerLeft: (playerId: string) => void;
  playerUpdated: (player: Player) => void;
  gameStarting: (countdown: number) => void;
  gameStarted: (room: GameRoom) => void;
  turnStarted: (turn: number, year: number, deadline: number) => void;
  discussionStarted: (event: HistoricalEvent, deadline: number) => void;
  votingStarted: (event: HistoricalEvent, deadline: number) => void;
  eventTriggered: (event: HistoricalEvent, deadline: number) => void; // 하위 호환성 유지
  voteReceived: (nation: Nation, playerId: string, choiceId: string) => void;
  voteResult: (nation: Nation, choiceId: string, effects: Partial<NationStats>) => void;
  turnEnded: (room: GameRoom) => void;
  gameEnded: (room: GameRoom, winner: Nation | null, reason: string) => void;
  chatMessage: (message: ChatMessage) => void;
  battleProposed: (attackerNation: Nation, defenderNation: Nation, battleId: string) => void;
  battleResult: (result: {
    winner: Nation;
    attackerNation: Nation;
    defenderNation: Nation;
    attackerLosses: Partial<NationStats>;
    defenderLosses: Partial<NationStats>;
    allySupport: Record<Nation, number>;
  }) => void;
  error: (message: string) => void;
}

// 클라이언트 -> 서버 이벤트 타입
interface ClientToServerEvents {
  createRoom: (data: { hostName: string; className: string; settings?: Partial<GameRoom['settings']> }) => void;
  joinRoom: (data: { code: string; playerName: string; playerId?: string }) => void;
  leaveRoom: () => void;
  selectTeam: (nation: Nation) => void;
  toggleReady: () => void;
  kickPlayer: (playerId: string) => void;
  startGame: () => void;
  submitVote: (choiceId: string) => void;
  sendChat: (data: { message: string; type: 'team' | 'public' | 'diplomacy'; target?: Nation }) => void;
  proposeAlliance: (targetNation: Nation) => void;
  acceptAlliance: (proposerNation: Nation) => void;
  breakAlliance: (targetNation: Nation) => void;
  declareWar: (targetNation: Nation) => void;
  endWar: (targetNation: Nation) => void;
  initiateBattle: (defenderNation: Nation) => void;
  acceptBattle: (battleId: string) => void;
  rejectBattle: (battleId: string) => void;
}

// 타입이 적용된 소켓
type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// 소켓 인스턴스
let socket: TypedSocket | null = null;

// 연결 상태
export const getSocket = (): TypedSocket | null => socket;

export const isConnected = (): boolean => socket?.connected ?? false;

// 소켓 연결
export const connectSocket = (): TypedSocket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SERVER_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected to server');
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
    // 재연결 시도 중이 아닌 경우에만 에러 표시
    if (reason === 'io server disconnect') {
      // 서버가 연결을 끊은 경우
      console.warn('[Socket] Server disconnected the connection');
    }
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error);
    // 재연결 시도 중이면 에러를 표시하지 않음 (자동 재연결 중)
  });

  // @ts-ignore - Socket.io reserved events
  socket.on('reconnect', (attemptNumber: number) => {
    console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
  });

  // @ts-ignore - Socket.io reserved events
  socket.on('reconnect_error', (error: Error) => {
    console.error('[Socket] Reconnection error:', error);
  });

  // @ts-ignore - Socket.io reserved events
  socket.on('reconnect_failed', () => {
    console.error('[Socket] Reconnection failed. Please refresh the page.');
  });

  return socket;
};

// 소켓 연결 해제
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ============================================
// API 함수들
// ============================================

// 방 생성
export const createRoom = (hostName: string, className: string, settings?: Partial<GameRoom['settings']>): void => {
  const sock = connectSocket();
  sock.emit('createRoom', { hostName, className, settings });
};

// 방 참가
export const joinRoom = (code: string, playerName: string, playerId?: string): void => {
  try {
    const sock = connectSocket();
    if (!sock) {
      throw new Error('소켓 연결에 실패했습니다.');
    }
    
    // localStorage에서 기존 playerId 가져오기 (없으면 전달받은 playerId 사용)
    const savedPlayerId = playerId || localStorage.getItem('playerId') || undefined;
    
    sock.emit('joinRoom', { code, playerName, playerId: savedPlayerId });
  } catch (error) {
    console.error('[Socket] joinRoom error:', error);
    throw error;
  }
};

// 방 나가기
export const leaveRoom = (): void => {
  socket?.emit('leaveRoom');
};

// 팀 선택
export const selectTeam = (nation: Nation): void => {
  socket?.emit('selectTeam', nation);
};

// 준비 토글
export const toggleReady = (): void => {
  socket?.emit('toggleReady');
};

// 게임 시작
export const startGame = (): void => {
  socket?.emit('startGame');
};

// 투표 제출
export const submitVote = (choiceId: string): void => {
  socket?.emit('submitVote', choiceId);
};

// 채팅 전송
export const sendChat = (message: string, type: 'team' | 'public' | 'diplomacy', target?: Nation): void => {
  console.log('[Socket] sendChat called:', { message, type, target, socketExists: !!socket, socketConnected: socket?.connected });
  socket?.emit('sendChat', { message, type, target });
  console.log('[Socket] sendChat emit completed');
};

// 플레이어 강퇴
export const kickPlayer = (playerId: string): void => {
  socket?.emit('kickPlayer', playerId);
};

// 동맹 제안
export const proposeAlliance = (targetNation: Nation): void => {
  socket?.emit('proposeAlliance', targetNation);
};

// 동맹 수락
export const acceptAlliance = (proposerNation: Nation): void => {
  socket?.emit('acceptAlliance', proposerNation);
};

// 동맹 파기
export const breakAlliance = (targetNation: Nation): void => {
  socket?.emit('breakAlliance', targetNation);
};

// 적대 선포
export const declareWar = (targetNation: Nation): void => {
  socket?.emit('declareWar', targetNation);
};

// 적대 해제
export const endWar = (targetNation: Nation): void => {
  socket?.emit('endWar', targetNation);
};

// 전투 제안
export const initiateBattle = (defenderNation: Nation): void => {
  socket?.emit('initiateBattle', defenderNation);
};

// 전투 수락
export const acceptBattle = (battleId: string): void => {
  socket?.emit('acceptBattle', battleId);
};

// 전투 거절
export const rejectBattle = (battleId: string): void => {
  socket?.emit('rejectBattle', battleId);
};

// ============================================
// 이벤트 리스너 등록
// ============================================

export const onRoomCreated = (callback: (room: GameRoom) => void): void => {
  socket?.on('roomCreated', callback);
};

export const onRoomJoined = (callback: (room: GameRoom, player: Player) => void): void => {
  socket?.on('roomJoined', callback);
};

export const onRoomUpdated = (callback: (room: GameRoom) => void): void => {
  socket?.on('roomUpdated', callback);
};

export const onPlayerJoined = (callback: (player: Player) => void): void => {
  socket?.on('playerJoined', callback);
};

export const onPlayerLeft = (callback: (playerId: string) => void): void => {
  socket?.on('playerLeft', callback);
};

export const onPlayerUpdated = (callback: (player: Player) => void): void => {
  socket?.on('playerUpdated', callback);
};

export const onGameStarting = (callback: (countdown: number) => void): void => {
  socket?.on('gameStarting', callback);
};

export const onGameStarted = (callback: (room: GameRoom) => void): void => {
  socket?.on('gameStarted', callback);
};

export const onTurnStarted = (callback: (turn: number, year: number, deadline: number) => void): void => {
  socket?.on('turnStarted', callback);
};

export const onEventTriggered = (callback: (event: HistoricalEvent, deadline: number) => void): void => {
  socket?.on('eventTriggered', callback);
};

export const onVoteReceived = (callback: (nation: Nation, playerId: string, choiceId: string) => void): void => {
  socket?.on('voteReceived', callback);
};

export const onVoteResult = (callback: (nation: Nation, choiceId: string, effects: Partial<NationStats>) => void): void => {
  socket?.on('voteResult', callback);
};

export const onTurnEnded = (callback: (room: GameRoom) => void): void => {
  socket?.on('turnEnded', callback);
};

export const onGameEnded = (callback: (room: GameRoom, winner: Nation | null, reason: string) => void): void => {
  socket?.on('gameEnded', callback);
};

export const onChatMessage = (callback: (message: ChatMessage) => void): void => {
  socket?.on('chatMessage', callback);
};

export const onError = (callback: (message: string) => void): void => {
  socket?.on('error', callback);
};

// 모든 이벤트 리스너 제거
export const removeAllListeners = (): void => {
  socket?.removeAllListeners();
};





