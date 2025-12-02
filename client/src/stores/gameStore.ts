// ============================================
// Zustand 게임 상태 관리
// ============================================

import { create } from 'zustand';
import { Nation, Player, HistoricalEvent, ChatMessage } from '../types';
import { GameRoom } from '../socket';
import * as socket from '../socket';

interface GameState {
  // 연결 상태
  isConnected: boolean;
  
  // 플레이어 정보
  playerId: string | null;
  playerName: string | null;
  myNation: Nation | null;
  
  // 방 정보
  room: GameRoom | null;
  
  // 게임 진행 상태
  countdown: number | null;
  currentEvent: HistoricalEvent | null;
  eventDeadline: number | null;
  currentVotes: Record<string, string>; // playerId -> choiceId
  myVote: string | null;
  
  // 채팅
  messages: ChatMessage[];
  
  // 에러
  error: string | null;
  
  // 액션
  setConnected: (connected: boolean) => void;
  setPlayerInfo: (playerId: string, playerName: string) => void;
  setRoom: (room: GameRoom | null) => void;
  setMyNation: (nation: Nation | null) => void;
  setCountdown: (countdown: number | null) => void;
  setCurrentEvent: (event: HistoricalEvent | null, deadline: number | null) => void;
  addVote: (playerId: string, choiceId: string) => void;
  setMyVote: (choiceId: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  setError: (error: string | null) => void;
  clearGame: () => void;
  
  // Socket 액션
  createRoom: (hostName: string, className: string) => void;
  joinRoom: (code: string, playerName: string) => void;
  leaveRoom: () => void;
  selectTeam: (nation: Nation) => void;
  toggleReady: () => void;
  startGame: () => void;
  submitVote: (choiceId: string) => void;
  sendChat: (message: string, type: 'team' | 'public' | 'diplomacy', target?: Nation) => void;
  proposeAlliance: (targetNation: Nation) => void;
  acceptAlliance: (proposerNation: Nation) => void;
  breakAlliance: (targetNation: Nation) => void;
  declareWar: (targetNation: Nation) => void;
  endWar: (targetNation: Nation) => void;
  initiateBattle: (defenderNation: Nation) => void;
  acceptBattle: (battleId: string) => void;
  rejectBattle: (battleId: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // 초기 상태
  isConnected: false,
  playerId: null,
  playerName: null,
  myNation: null,
  room: null,
  countdown: null,
  currentEvent: null,
  eventDeadline: null,
  currentVotes: {},
  myVote: null,
  messages: [],
  error: null,
  
  // 상태 업데이트 액션
  setConnected: (connected) => set({ isConnected: connected }),
  
  setPlayerInfo: (playerId, playerName) => set({ playerId, playerName }),
  
  setRoom: (room) => {
    if (room) {
      const { playerId } = get();
      const player = playerId ? room.players[playerId] : null;
      set({ 
        room,
        myNation: player?.team || null,
      });
    } else {
      set({ room: null, myNation: null });
    }
  },
  
  setMyNation: (nation) => set({ myNation: nation }),
  
  setCountdown: (countdown) => set({ countdown }),
  
  setCurrentEvent: (event, deadline) => set({ 
    currentEvent: event, 
    eventDeadline: deadline,
    currentVotes: {},
    myVote: null,
  }),
  
  addVote: (playerId, choiceId) => set((state) => ({
    currentVotes: { ...state.currentVotes, [playerId]: choiceId },
  })),
  
  setMyVote: (choiceId) => set({ myVote: choiceId }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages.slice(-99), message], // 최근 100개만 유지
  })),
  
  setError: (error) => set({ error }),
  
  clearGame: () => set({
    room: null,
    myNation: null,
    countdown: null,
    currentEvent: null,
    eventDeadline: null,
    currentVotes: {},
    myVote: null,
    messages: [],
    error: null,
  }),
  
  // Socket 액션
  createRoom: (hostName, className) => {
    try {
      if (!hostName || !className) {
        set({ error: '선생님 성함과 학급명을 입력해주세요.' });
        return;
      }

      socket.connectSocket();
      socket.createRoom(hostName, className);
    } catch (error) {
      console.error('[GameStore] createRoom error:', error);
      set({ error: error instanceof Error ? error.message : '방 생성 중 오류가 발생했습니다.' });
    }
  },
  
  joinRoom: (code, playerName) => {
    try {
      if (!code || !playerName) {
        set({ error: '방 코드와 플레이어 이름을 입력해주세요.' });
        return;
      }

      const sock = socket.connectSocket();

      if (!sock) {
        set({ error: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' });
        return;
      }

      // 연결 상태 확인 및 대기 로직 개선
      const attemptJoin = () => {
        if (sock.connected) {
          console.log('[GameStore] Socket connected, joining room:', code);
          socket.joinRoom(code, playerName);
        } else {
          console.log('[GameStore] Socket not connected, waiting for connection...');
          const onConnect = () => {
            console.log('[GameStore] Socket connected after waiting, joining room:', code);
            socket.joinRoom(code, playerName);
            sock.off('connect', onConnect);
          };
          sock.once('connect', onConnect);

          // 연결 타임아웃 (10초로 증가)
          setTimeout(() => {
            if (!sock.connected) {
              sock.off('connect', onConnect);
              console.error('[GameStore] Socket connection timeout');
              set({ error: '서버 연결 시간이 초과되었습니다. 서버가 실행 중인지 확인해주세요.' });
            }
          }, 10000);
        }
      };

      attemptJoin();

    } catch (error) {
      console.error('[GameStore] joinRoom error:', error);
      set({ error: error instanceof Error ? error.message : '방 입장 중 오류가 발생했습니다.' });
    }
  },
  
  leaveRoom: () => {
    socket.leaveRoom();
    // 방을 나갈 때 playerId는 유지 (재접속 가능하도록)
    // localStorage.removeItem('playerId'); // 주석 처리: 재접속을 위해 유지
    get().clearGame();
  },
  
  selectTeam: (nation) => {
    socket.selectTeam(nation);
  },
  
  toggleReady: () => {
    socket.toggleReady();
  },
  
  startGame: () => {
    socket.startGame();
  },
  
  submitVote: (choiceId) => {
    try {
      const { playerId, currentEvent } = get();
      
      if (!playerId) {
        set({ error: '플레이어 정보가 없습니다.' });
        return;
      }

      if (!currentEvent) {
        set({ error: '현재 진행 중인 이벤트가 없습니다.' });
        return;
      }

      if (!choiceId) {
        set({ error: '선택지를 선택해주세요.' });
        return;
      }

      // 선택지 유효성 검증
      const isValidChoice = currentEvent.choices.some(choice => choice.id === choiceId);
      if (!isValidChoice) {
        set({ error: '유효하지 않은 선택지입니다.' });
        return;
      }

      socket.submitVote(choiceId);
      set({ myVote: choiceId });
    } catch (error) {
      console.error('[GameStore] submitVote error:', error);
      set({ error: error instanceof Error ? error.message : '투표 제출 중 오류가 발생했습니다.' });
    }
  },
  
  sendChat: (message, type, target) => {
    console.log('[GameStore] sendChat called:', { message, type, target });
    socket.sendChat(message, type, target);
  },
  
  proposeAlliance: (targetNation) => {
    socket.proposeAlliance(targetNation);
  },
  
  acceptAlliance: (proposerNation) => {
    socket.acceptAlliance(proposerNation);
  },
  
  breakAlliance: (targetNation) => {
    socket.breakAlliance(targetNation);
  },
  
  declareWar: (targetNation) => {
    socket.declareWar(targetNation);
  },
  
  endWar: (targetNation) => {
    socket.endWar(targetNation);
  },
  
  initiateBattle: (defenderNation) => {
    socket.initiateBattle(defenderNation);
  },
  
  acceptBattle: (battleId) => {
    socket.acceptBattle(battleId);
  },
  
  rejectBattle: (battleId) => {
    socket.rejectBattle(battleId);
  },
}));

// ============================================
// Socket 이벤트 리스너 초기화
// ============================================

let listenersInitialized = false;

export const initializeSocketListeners = (force: boolean = false): void => {
  // 이미 초기화되었으면 중복 등록 방지 (force가 true면 강제로 재등록)
  if (listenersInitialized && !force) {
    console.log('[Store] Socket listeners already initialized, skipping...');
    return;
  }
  
  const sock = socket.connectSocket();
  
  // 기존 리스너 제거 후 새로 등록 (중복 방지)
  if (listenersInitialized) {
    sock.removeAllListeners('roomJoined');
    sock.removeAllListeners('roomUpdated');
    sock.removeAllListeners('roomCreated');
    sock.removeAllListeners('chatMessage');
    sock.removeAllListeners('playerJoined');
    sock.removeAllListeners('playerLeft');
    sock.removeAllListeners('playerUpdated');
    sock.removeAllListeners('gameStarting');
    sock.removeAllListeners('gameStarted');
    sock.removeAllListeners('turnStarted');
    sock.removeAllListeners('eventTriggered');
    sock.removeAllListeners('voteReceived');
    sock.removeAllListeners('voteResult');
    sock.removeAllListeners('turnEnded');
    sock.removeAllListeners('gameEnded');
    sock.removeAllListeners('battleProposed');
    sock.removeAllListeners('battleResult');
    sock.removeAllListeners('error');
    console.log('[Store] Removing old listeners and re-registering...');
  }
  
  sock.on('connect', () => {
    useGameStore.getState().setConnected(true);
  });
  
  sock.on('disconnect', () => {
    useGameStore.getState().setConnected(false);
  });
  
  sock.on('roomCreated', (room) => {
    const store = useGameStore.getState();
    // 방장의 playerId 찾기 (첫 번째 플레이어)
    const players = Object.values(room.players);
    if (players.length > 0) {
      store.setPlayerInfo(players[0].id, players[0].name);
    }
    store.setRoom(room);
  });
  
  sock.on('roomJoined', (room, player) => {
    console.log('[Store] roomJoined event received:', { 
      roomCode: room?.code, 
      playerId: player?.id, 
      playerName: player?.name,
      hasRoom: !!room,
      timestamp: Date.now()
    });
    
    if (!room || !player) {
      console.error('[Store] Invalid roomJoined event data:', { room, player });
      return;
    }
    
    try {
      const store = useGameStore.getState();
      store.setPlayerInfo(player.id, player.name);
      
      // playerId를 localStorage에 저장 (재접속 시 사용)
      localStorage.setItem('playerId', player.id);
      console.log('[Store] PlayerId saved to localStorage:', player.id);
      
      store.setRoom(room);
      console.log('[Store] Room state updated:', { 
        roomCode: room?.code, 
        playerId: store.playerId,
        myNation: store.myNation,
        isConnected: store.isConnected
      });
    } catch (error) {
      console.error('[Store] Error processing roomJoined event:', error);
    }
  });
  
  // 에러 이벤트 리스너 추가
  sock.on('error', (errorMsg: string) => {
    console.error('[Store] Socket error received:', errorMsg);
    useGameStore.getState().setError(errorMsg);
  });
  
  sock.on('roomUpdated', (room) => {
    console.log('[Store] roomUpdated event received:', {
      roomCode: room?.code,
      playersCount: room ? Object.keys(room.players || {}).length : 0,
      timestamp: Date.now()
    });
    useGameStore.getState().setRoom(room);
    console.log('[Store] Room updated after roomUpdated event');
  });
  
  sock.on('playerJoined', (player) => {
    console.log('[Store] Player joined:', player.name, player);
    // playerJoined 이벤트가 발생하면, 현재 방 상태를 가져와서 업데이트
    // roomUpdated 이벤트가 올 때까지 기다리거나, 방 상태를 강제로 다시 가져옴
    const currentRoom = useGameStore.getState().room;
    if (currentRoom) {
      // 현재 방에 플레이어 추가 (임시로)
      const updatedRoom = {
        ...currentRoom,
        players: {
          ...currentRoom.players,
          [player.id]: player as any
        }
      };
      // 팀에 추가
      if (player.team && updatedRoom.teams[player.team]) {
        if (!updatedRoom.teams[player.team].players.includes(player.id)) {
          updatedRoom.teams[player.team].players.push(player.id);
        }
      }
      useGameStore.getState().setRoom(updatedRoom);
      console.log('[Store] Room updated after playerJoined:', {
        playerName: player.name,
        playerTeam: player.team,
        totalPlayers: Object.keys(updatedRoom.players).length
      });
    }
  });
  
  sock.on('playerLeft', (playerId) => {
    console.log('[Store] Player left:', playerId);
  });
  
  sock.on('playerUpdated', (player) => {
    console.log('[Store] Player updated:', player.name);
  });
  
  sock.on('gameStarting', (countdown) => {
    useGameStore.getState().setCountdown(countdown);
  });
  
  sock.on('gameStarted', (room) => {
    const store = useGameStore.getState();
    store.setRoom(room);
    store.setCountdown(null);
  });
  
  sock.on('turnStarted', (turn, year, _deadline) => {
    console.log(`[Store] Turn ${turn} started (year ${year})`);
    // 다음 턴 시작 시 현재 이벤트 초기화
    useGameStore.getState().setCurrentEvent(null, null);
  });
  
  // 토론 시작 이벤트 (멀티플레이용)
  sock.on('discussionStarted', (event, deadline) => {
    console.log('[Store] Discussion started:', {
      title: event.title,
      targetNation: event.targetNation,
      deadline,
      timestamp: Date.now()
    });
    useGameStore.getState().setCurrentEvent(event, deadline);
  });

  // 투표 시작 이벤트 (멀티플레이용)
  sock.on('votingStarted', (event, deadline) => {
    console.log('[Store] Voting started:', {
      title: event.title,
      targetNation: event.targetNation,
      deadline,
      timestamp: Date.now()
    });
    useGameStore.getState().setCurrentEvent(event, deadline);
  });

  // 이벤트 트리거 (하위 호환성 및 싱글플레이용)
  sock.on('eventTriggered', (event, deadline) => {
    console.log('[Store] Event triggered:', {
      title: event.title,
      targetNation: event.targetNation,
      deadline,
      timestamp: Date.now()
    });
    useGameStore.getState().setCurrentEvent(event, deadline);
  });
  
  sock.on('voteReceived', (_nation, playerId, choiceId) => {
    useGameStore.getState().addVote(playerId, choiceId);
  });
  
  sock.on('voteResult', (nation, choiceId, effects) => {
    console.log(`[Store] Vote result for ${nation}: ${choiceId}`, effects);
  });
  
  sock.on('turnEnded', (room) => {
    useGameStore.getState().setRoom(room);
  });
  
  sock.on('gameEnded', (room, winner, reason) => {
    const store = useGameStore.getState();
    store.setRoom(room);
    console.log(`[Store] Game ended. Winner: ${winner}, Reason: ${reason}`);
  });
  
  sock.on('chatMessage', (message) => {
    console.log('[Store] chatMessage received:', { 
      id: message.id, 
      type: message.type, 
      team: message.team, 
      senderName: message.senderName,
      message: message.message.substring(0, 30) 
    });
    useGameStore.getState().addMessage(message);
    console.log('[Store] Messages after add:', useGameStore.getState().messages.length);
  });
  
  sock.on('battleProposed', (attackerNation, defenderNation, battleId) => {
    console.log(`[Store] Battle proposed: ${attackerNation} vs ${defenderNation} (${battleId})`);
    // 전투 제안은 UI에서 처리 (모달 표시 등)
  });
  
  sock.on('battleResult', (result) => {
    console.log(`[Store] Battle result: ${result.winner} wins!`, result);
    // 전투 결과는 UI에서 처리 (결과 모달 표시 등)
  });
  
  sock.on('error', (message) => {
    useGameStore.getState().setError(message);
    console.error('[Socket] Error:', message);
  });
  
  listenersInitialized = true;
  console.log('[Store] Socket listeners initialized successfully');
};

// ============================================
// 유틸리티 함수
// ============================================

// 팀 플레이어 목록 가져오기 (AI 플레이어 포함, 테스트 호스트만 제외)
export const getTeamPlayers = (nation: Nation): Player[] => {
  const room = useGameStore.getState().room;
  if (!room) return [];

  const playerIds = room.teams[nation].players;
  return playerIds
    .map(id => room.players[id])
    .filter(p => p && p.isOnline && !p.id.startsWith('test-host-'));
};

// 내 팀원들 가져오기
export const getMyTeamPlayers = (): Player[] => {
  const { myNation } = useGameStore.getState();
  if (!myNation) return [];
  return getTeamPlayers(myNation);
};

// 방장 여부 확인
export const isHost = (): boolean => {
  const { room, playerId } = useGameStore.getState();
  return room?.hostId === playerId;
};

// 모든 플레이어 준비 완료 여부 (AI 플레이어 포함)
export const allPlayersReady = (): boolean => {
  const room = useGameStore.getState().room;
  if (!room) return false;

  const teamPlayers = Object.values(room.players).filter(p =>
    p.team &&
    p.isOnline &&
    !p.id.startsWith('test-host-')
  );
  // AI 플레이어는 항상 준비 완료로 간주
  return teamPlayers.length > 0 && teamPlayers.every(p => p.isReady || p.isAI);
};

// 각 팀에 최소 1명 있는지 확인 (AI 플레이어 포함)
export const allTeamsHavePlayers = (): boolean => {
  const room = useGameStore.getState().room;
  if (!room) return false;

  for (const nation of ['goguryeo', 'baekje', 'silla'] as Nation[]) {
    // AI 플레이어 포함 (test-host만 제외)
    const players = room.teams[nation].players.filter(pid => {
      const player = room.players[pid];
      return player &&
             player.isOnline &&
             !pid.startsWith('test-host-');
    });

    if (players.length === 0) {
      return false;
    }
  }
  return true;
};





