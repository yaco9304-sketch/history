// ============================================
// 역사전쟁:삼국시대 게임 매니저
// 방 생성, 게임 진행, 투표 관리
// ============================================

import { v4 as uuidv4 } from 'uuid';
import {
  GameRoom,
  GameSettings,
  Player,
  Team,
  Nation,
  NationStats,
  HistoricalEvent,
  Vote,
  ChatMessage,
  EventHistory,
} from './types.js';

// 기본 게임 설정
const DEFAULT_SETTINGS: GameSettings = {
  maxTurns: 30,
  turnDuration: 120,
  discussionDuration: 120, // 2분 토론
  voteDuration: 60, // 1분 투표
  maxPlayersPerTeam: 5,
  difficulty: 'normal',
};

// 국가별 초기 스탯
const INITIAL_STATS: Record<Nation, NationStats> = {
  goguryeo: {
    military: 150,
    economy: 100,
    diplomacy: 80,
    culture: 90,
    gold: 1000,
    population: 80000,
    morale: 70,
  },
  baekje: {
    military: 100,
    economy: 130,
    diplomacy: 120,
    culture: 120,
    gold: 1200,
    population: 60000,
    morale: 75,
  },
  silla: {
    military: 90,
    economy: 110,
    diplomacy: 100,
    culture: 100,
    gold: 800,
    population: 50000,
    morale: 80,
  },
};

// 연도 계산 (턴 당 10년)
const START_YEAR = 300;
const YEAR_PER_TURN = 10;

export class GameManager {
  private rooms: Map<string, GameRoom> = new Map();
  private codeToRoomId: Map<string, string> = new Map();
  private playerToRoom: Map<string, string> = new Map();

  // 방 코드 생성 (6자리 영문+숫자)
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // 중복 체크
    if (this.codeToRoomId.has(code)) {
      return this.generateRoomCode();
    }
    return code;
  }

  // 방 생성
  createRoom(hostId: string, hostName: string, className: string, settings?: Partial<GameSettings>, code?: string): GameRoom {
    const roomId = uuidv4();
    const roomCode = code || this.generateRoomCode();
    
    // 코드 중복 체크
    if (this.codeToRoomId.has(roomCode)) {
      throw new Error(`방 코드 ${roomCode}가 이미 존재합니다.`);
    }

    const room: GameRoom = {
      id: roomId,
      code: roomCode,
      hostId,
      hostName,
      className,
      status: 'waiting',
      currentTurn: 0,
      currentYear: START_YEAR,
      teams: {
        goguryeo: {
          nation: 'goguryeo',
          players: [],
          stats: { ...INITIAL_STATS.goguryeo },
          allies: [],
          enemies: [],
          eventHistory: [],
        },
        baekje: {
          nation: 'baekje',
          players: [],
          stats: { ...INITIAL_STATS.baekje },
          allies: [],
          enemies: [],
          eventHistory: [],
        },
        silla: {
          nation: 'silla',
          players: [],
          stats: { ...INITIAL_STATS.silla },
          allies: [],
          enemies: [],
          eventHistory: [],
        },
      },
      players: {},
      settings: { ...DEFAULT_SETTINGS, ...settings },
      currentVotes: {
        goguryeo: { eventId: '', votes: {}, deadline: 0 },
        baekje: { eventId: '', votes: {}, deadline: 0 },
        silla: { eventId: '', votes: {}, deadline: 0 },
      },
      chatMessages: [], // 채팅 메시지 저장 (교사용 대시보드용)
      createdAt: Date.now(),
    };

    this.rooms.set(roomId, room);
    this.codeToRoomId.set(roomCode, roomId);

    console.log(`[GameManager] Room created: ${roomCode} (${roomId})`);
    return room;
  }

  // 방 코드로 방 찾기
  getRoomByCode(code: string): GameRoom | null {
    const roomId = this.codeToRoomId.get(code.toUpperCase());
    if (!roomId) return null;
    return this.rooms.get(roomId) || null;
  }

  // 방 ID로 방 찾기
  getRoom(roomId: string): GameRoom | null {
    return this.rooms.get(roomId) || null;
  }

  // 플레이어의 현재 방 찾기
  getPlayerRoom(playerId: string): GameRoom | null {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return null;
    return this.rooms.get(roomId) || null;
  }

  // 방 참가
  joinRoom(roomId: string, playerId: string, socketId: string, playerName: string): Player | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    // 이미 참가한 플레이어인지 확인
    if (room.players[playerId]) {
      // 재접속 처리
      room.players[playerId].socketId = socketId;
      room.players[playerId].isOnline = true;
      this.playerToRoom.set(playerId, roomId);
      return room.players[playerId];
    }

    // 새 플레이어 생성
    const player: Player = {
      id: playerId,
      socketId,
      name: playerName,
      team: null,
      isReady: false,
      isOnline: true,
      joinedAt: Date.now(),
    };

    room.players[playerId] = player;
    this.playerToRoom.set(playerId, roomId);

    console.log(`[GameManager] Player joined: ${playerName} (${playerId}) -> Room ${room.code}`);
    return player;
  }

  // 방 나가기
  leaveRoom(playerId: string): { room: GameRoom; player: Player } | null {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players[playerId];
    if (!player) return null;

    // 팀에서 제거
    if (player.team) {
      const teamPlayers = room.teams[player.team].players;
      const index = teamPlayers.indexOf(playerId);
      if (index > -1) {
        teamPlayers.splice(index, 1);
      }
    }

    // 플레이어 오프라인 처리 (완전 삭제 대신)
    player.isOnline = false;
    this.playerToRoom.delete(playerId);

    // 방장이 나간 경우 처리
    if (room.hostId === playerId) {
      const onlinePlayers = Object.values(room.players).filter(p => p.isOnline);
      if (onlinePlayers.length > 0) {
        room.hostId = onlinePlayers[0].id;
        room.hostName = onlinePlayers[0].name;
        console.log(`[GameManager] New host: ${room.hostName}`);
      } else {
        // 방 삭제
        this.rooms.delete(roomId);
        this.codeToRoomId.delete(room.code);
        console.log(`[GameManager] Room deleted: ${room.code}`);
      }
    }

    console.log(`[GameManager] Player left: ${player.name} (${playerId})`);
    return { room, player };
  }

  // 팀 선택
  selectTeam(playerId: string, nation: Nation): boolean {
    const room = this.getPlayerRoom(playerId);
    if (!room) return false;

    const player = room.players[playerId];
    if (!player) return false;

    // 게임 중에는 팀 변경 불가
    if (room.status !== 'waiting') return false;

    // 이미 같은 팀인 경우
    if (player.team === nation) return true;

    // 팀 인원 확인
    const teamPlayers = room.teams[nation].players;
    if (teamPlayers.length >= room.settings.maxPlayersPerTeam) {
      return false;
    }

    // 기존 팀에서 제거
    if (player.team) {
      const oldTeamPlayers = room.teams[player.team].players;
      const index = oldTeamPlayers.indexOf(playerId);
      if (index > -1) {
        oldTeamPlayers.splice(index, 1);
      }
    }

    // 새 팀에 추가
    player.team = nation;
    player.isReady = false;
    teamPlayers.push(playerId);

    // 첫 번째 플레이어는 왕 역할
    if (teamPlayers.length === 1) {
      player.role = 'king';
    }

    console.log(`[GameManager] ${player.name} selected team: ${nation}`);
    return true;
  }

  // 준비 토글
  toggleReady(playerId: string): boolean {
    const room = this.getPlayerRoom(playerId);
    if (!room) return false;

    const player = room.players[playerId];
    if (!player || !player.team) return false;

    player.isReady = !player.isReady;
    console.log(`[GameManager] ${player.name} ready: ${player.isReady}`);
    return player.isReady;
  }

  // 게임 시작 가능 여부 확인
  canStartGame(roomId: string): { canStart: boolean; reason?: string } {
    const room = this.rooms.get(roomId);
    if (!room) return { canStart: false, reason: '방을 찾을 수 없습니다.' };

    // 각 팀에 최소 1명 필요
    for (const nation of ['goguryeo', 'baekje', 'silla'] as Nation[]) {
      if (room.teams[nation].players.length === 0) {
        return { canStart: false, reason: `${nation} 팀에 플레이어가 없습니다.` };
      }
    }

    // 모든 플레이어 준비 완료 확인
    const teamPlayers = Object.values(room.players).filter(p => p.team && p.isOnline);
    const notReady = teamPlayers.filter(p => !p.isReady);
    if (notReady.length > 0) {
      return { canStart: false, reason: `${notReady.length}명이 아직 준비되지 않았습니다.` };
    }

    return { canStart: true };
  }

  // 게임 시작
  startGame(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const { canStart } = this.canStartGame(roomId);
    if (!canStart) return false;

    room.status = 'playing';
    room.currentTurn = 1;
    room.currentYear = START_YEAR;
    room.startedAt = Date.now();

    console.log(`[GameManager] Game started: ${room.code}`);
    return true;
  }

  // 턴 진행
  advanceTurn(roomId: string): { room: GameRoom; isGameOver: boolean; winner?: Nation } | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.currentTurn++;
    room.currentYear += YEAR_PER_TURN;

    // 게임 종료 조건 확인
    const gameOver = this.checkGameOver(room);
    if (gameOver.isOver) {
      room.status = 'finished';
      return { room, isGameOver: true, winner: gameOver.winner };
    }

    return { room, isGameOver: false };
  }

  // 이벤트 트리거
  triggerEvent(roomId: string, event: HistoricalEvent): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.currentEvent = event;
    room.status = 'voting';

    const deadline = Date.now() + room.settings.voteDuration * 1000;

    // 해당 국가에 대한 투표 초기화
    if (event.targetNation === 'all') {
      for (const nation of ['goguryeo', 'baekje', 'silla'] as Nation[]) {
        room.currentVotes[nation] = {
          eventId: event.id,
          votes: {},
          deadline,
        };
      }
    } else {
      room.currentVotes[event.targetNation] = {
        eventId: event.id,
        votes: {},
        deadline,
      };
    }

    console.log(`[GameManager] Event triggered: ${event.title} (${event.id})`);
    return true;
  }

  // 투표 제출
  submitVote(playerId: string, choiceId: string): { room: GameRoom; nation: Nation } | null {
    const room = this.getPlayerRoom(playerId);
    if (!room || !room.currentEvent) return null;

    const player = room.players[playerId];
    if (!player || !player.team) return null;

    // 해당 국가의 이벤트인지 확인
    const event = room.currentEvent;
    if (event.targetNation !== 'all' && event.targetNation !== player.team) {
      return null;
    }

    // 투표 기록
    room.currentVotes[player.team].votes[playerId] = choiceId;

    console.log(`[GameManager] Vote received: ${player.name} -> ${choiceId}`);
    return { room, nation: player.team };
  }

  // 투표 결과 계산
  calculateVoteResult(roomId: string, nation: Nation): { choiceId: string; effects: Partial<NationStats> } | null {
    const room = this.rooms.get(roomId);
    if (!room || !room.currentEvent) return null;

    const vote = room.currentVotes[nation];
    const event = room.currentEvent;

    // 투표 집계
    const voteCounts: Record<string, number> = {};
    for (const choiceId of Object.values(vote.votes)) {
      voteCounts[choiceId] = (voteCounts[choiceId] || 0) + 1;
    }

    // 가장 많은 표를 받은 선택지
    let maxVotes = 0;
    let winningChoice = event.choices[0].id;
    for (const [choiceId, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        winningChoice = choiceId;
      }
    }

    // 선택지 효과 적용
    const choice = event.choices.find(c => c.id === winningChoice);
    if (!choice) return null;

    // 스탯 적용 (안전하게)
    const stats = room.teams[nation].stats;
    for (const [key, value] of Object.entries(choice.effects)) {
      if (key in stats && typeof value === 'number' && !isNaN(value) && isFinite(value)) {
        const currentValue = (stats as Record<string, number>)[key] || 0;
        const newValue = currentValue + value;
        
        // 범위 제한
        if (key === 'morale') {
          stats.morale = Math.max(0, Math.min(100, newValue));
        } else if (['military', 'economy', 'diplomacy', 'culture'].includes(key)) {
          (stats as Record<string, number>)[key] = Math.max(0, Math.min(500, newValue));
        } else if (key === 'gold') {
          stats.gold = Math.max(0, newValue); // gold는 음수 방지만
        } else if (key === 'population') {
          stats.population = Math.max(0, newValue); // population도 음수 방지만
        } else {
          // 기타 스탯도 안전하게 적용
          (stats as Record<string, number>)[key] = Math.max(0, newValue);
        }
      }
    }

    vote.result = winningChoice;

    // 이벤트 이력 저장
    if (!room.teams[nation].eventHistory) {
      room.teams[nation].eventHistory = [];
    }
    
    const eventHistory: EventHistory = {
      turn: room.currentTurn,
      year: room.currentYear,
      eventId: event.id,
      eventTitle: event.title,
      choiceId: winningChoice,
      choiceText: choice.text,
      isHistorical: choice.isHistorical,
      timestamp: Date.now(),
    };
    
    room.teams[nation].eventHistory.push(eventHistory);

    console.log(`[GameManager] Vote result for ${nation}: ${winningChoice} (historical: ${choice.isHistorical})`);
    return { choiceId: winningChoice, effects: choice.effects };
  }

  // 게임 종료 조건 확인 (public으로 변경)
  checkGameOver(room: GameRoom): { isOver: boolean; winner?: Nation; reason?: string } {
    // 최대 턴 도달
    if (room.currentTurn >= room.settings.maxTurns) {
      const winner = this.getWinnerByScore(room);
      return { isOver: true, winner, reason: 'turns' };
    }

    // 통일 조건 (다른 나라 스탯이 0 이하)
    for (const nation of ['goguryeo', 'baekje', 'silla'] as Nation[]) {
      const stats = room.teams[nation].stats;
      const otherNations = ['goguryeo', 'baekje', 'silla'].filter(n => n !== nation) as Nation[];
      
      const allOthersDefeated = otherNations.every(other => {
        const otherStats = room.teams[other].stats;
        return otherStats.military <= 0 || otherStats.morale <= 0;
      });

      if (allOthersDefeated) {
        return { isOver: true, winner: nation, reason: 'conquest' };
      }
    }

    return { isOver: false };
  }

  // 점수로 승자 결정 (밸런스 조정)
  private getWinnerByScore(room: GameRoom): Nation {
    let maxScore = 0;
    let winner: Nation = 'goguryeo';

    for (const nation of ['goguryeo', 'baekje', 'silla'] as Nation[]) {
      const stats = room.teams[nation].stats;
      
      // 밸런스 조정된 점수 계산
      // 각 스탯의 중요도와 범위를 고려하여 가중치 조정
      const score = 
        stats.military * 1.2 +        // 군사력: 약간 감소 (고구려 유리 방지)
        stats.economy * 1.1 +         // 경제력: 약간 증가 (백제 유리)
        stats.diplomacy * 1.0 +       // 외교력: 동일
        stats.culture * 1.5 +          // 문화력: 감소 (신라 유리 방지)
        stats.morale * 1.5 +           // 민심: 감소 (균형)
        (stats.gold / 10) +            // 재화: 10분의 1로 환산
        (stats.population / 100);      // 인구: 100분의 1로 환산

      if (score > maxScore) {
        maxScore = score;
        winner = nation;
      }
    }

    return winner;
  }

  // 채팅 메시지 생성
  createChatMessage(
    roomId: string,
    playerId: string,
    message: string,
    type: 'team' | 'public' | 'diplomacy' | 'system',
    target?: Nation
  ): ChatMessage | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players[playerId];
    if (!player || !player.team) return null;

    const chatMessage: ChatMessage = {
      id: uuidv4(),
      roomId,
      senderId: playerId,
      senderName: player.name,
      team: player.team,
      message,
      type,
      target,
      timestamp: Date.now(),
    };

    // 채팅 메시지를 방에 저장 (최근 1000개만 유지)
    if (!room.chatMessages) {
      room.chatMessages = [];
    }
    room.chatMessages.push(chatMessage);
    if (room.chatMessages.length > 1000) {
      room.chatMessages = room.chatMessages.slice(-1000);
    }

    return chatMessage;
  }

  // 동맹 제안
  proposeAlliance(roomId: string, proposerNation: Nation, targetNation: Nation): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    // 자기 자신에게는 제안 불가
    if (proposerNation === targetNation) return false;

    // 이미 동맹이면 불가
    if (room.teams[proposerNation].allies.includes(targetNation)) return false;

    // 이미 적대 관계면 불가 (먼저 적대 해제 필요)
    if (room.teams[proposerNation].enemies.includes(targetNation)) return false;

    // 동맹 제안은 게임 진행 중에만 가능
    if (room.status !== 'playing') return false;

    // 동맹 제안 생성 (실제로는 클라이언트에서 처리하지만, 여기서는 관계만 설정)
    // 실제 구현에서는 제안 상태를 별도로 관리해야 함
    return true;
  }

  // 동맹 수락
  acceptAlliance(roomId: string, proposerNation: Nation, acceptorNation: Nation): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    // 이미 동맹이면 불가
    if (room.teams[proposerNation].allies.includes(acceptorNation)) return false;
    if (room.teams[acceptorNation].allies.includes(proposerNation)) return false;

    // 동맹 수락
    room.teams[proposerNation].allies.push(acceptorNation);
    room.teams[acceptorNation].allies.push(proposerNation);

    // 적대 관계가 있으면 해제
    const proposerEnemyIndex = room.teams[proposerNation].enemies.indexOf(acceptorNation);
    if (proposerEnemyIndex > -1) {
      room.teams[proposerNation].enemies.splice(proposerEnemyIndex, 1);
    }
    const acceptorEnemyIndex = room.teams[acceptorNation].enemies.indexOf(proposerNation);
    if (acceptorEnemyIndex > -1) {
      room.teams[acceptorNation].enemies.splice(acceptorEnemyIndex, 1);
    }

    return true;
  }

  // 동맹 파기
  breakAlliance(roomId: string, nation1: Nation, nation2: Nation): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const index1 = room.teams[nation1].allies.indexOf(nation2);
    const index2 = room.teams[nation2].allies.indexOf(nation1);

    if (index1 > -1) {
      room.teams[nation1].allies.splice(index1, 1);
    }
    if (index2 > -1) {
      room.teams[nation2].allies.splice(index2, 1);
    }

    return true;
  }

  // 적대 선포
  declareWar(roomId: string, declarerNation: Nation, targetNation: Nation): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    // 자기 자신에게는 선포 불가
    if (declarerNation === targetNation) return false;

    // 이미 적대 관계면 불가
    if (room.teams[declarerNation].enemies.includes(targetNation)) return false;

    // 적대 선포
    room.teams[declarerNation].enemies.push(targetNation);
    room.teams[targetNation].enemies.push(declarerNation);

    // 동맹 관계가 있으면 자동 파기
    this.breakAlliance(roomId, declarerNation, targetNation);

    return true;
  }

  // 적대 해제
  endWar(roomId: string, nation1: Nation, nation2: Nation): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const index1 = room.teams[nation1].enemies.indexOf(nation2);
    const index2 = room.teams[nation2].enemies.indexOf(nation1);

    if (index1 > -1) {
      room.teams[nation1].enemies.splice(index1, 1);
    }
    if (index2 > -1) {
      room.teams[nation2].enemies.splice(index2, 1);
    }

    return true;
  }

  // 전투 제안
  initiateBattle(roomId: string, attackerNation: Nation, defenderNation: Nation): { room: GameRoom; battleId: string } | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    // 자기 자신과는 전투 불가
    if (attackerNation === defenderNation) return null;

    // 게임 진행 중에만 전투 가능
    if (room.status !== 'playing') return null;

    const battleId = uuidv4();
    // 전투 제안은 별도로 관리할 수도 있지만, 간단하게 바로 진행
    return { room, battleId };
  }

  // 전투 결과 계산
  calculateBattleResult(
    roomId: string,
    attackerNation: Nation,
    defenderNation: Nation
  ): {
    winner: Nation;
    attackerLosses: Partial<NationStats>;
    defenderLosses: Partial<NationStats>;
    allySupport: Record<Nation, number>; // 동맹 지원 정도
  } | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const attackerStats = room.teams[attackerNation].stats;
    const defenderStats = room.teams[defenderNation].stats;
    const attackerTeam = room.teams[attackerNation];
    const defenderTeam = room.teams[defenderNation];

    // 기본 전투력 계산 (군사력 + 민심의 일부)
    let attackerPower = attackerStats.military + attackerStats.morale * 0.5;
    let defenderPower = defenderStats.military + defenderStats.morale * 0.5;

    // 동맹 지원 계산
    const allySupport: Record<Nation, number> = {
      goguryeo: 0,
      baekje: 0,
      silla: 0,
    };

    // 공격자의 동맹 지원
    for (const ally of attackerTeam.allies) {
      if (ally !== defenderNation) {
        const allyStats = room.teams[ally].stats;
        const support = Math.min(allyStats.military * 0.3, 50); // 최대 50 지원
        attackerPower += support;
        allySupport[ally] = support;
      }
    }

    // 방어자의 동맹 지원
    for (const ally of defenderTeam.allies) {
      if (ally !== attackerNation) {
        const allyStats = room.teams[ally].stats;
        const support = Math.min(allyStats.military * 0.3, 50);
        defenderPower += support;
        allySupport[ally] = support;
      }
    }

    // 랜덤 요소 추가 (±10%)
    const attackerRandom = attackerPower * (0.9 + Math.random() * 0.2);
    const defenderRandom = defenderPower * (0.9 + Math.random() * 0.2);

    // 승자 결정
    const winner = attackerRandom > defenderRandom ? attackerNation : defenderNation;
    const isAttackerWin = winner === attackerNation;

    // 손실 계산 (패배한 쪽이 더 큰 손실)
    const lossRatio = isAttackerWin
      ? defenderRandom / attackerRandom
      : attackerRandom / defenderRandom;

    const attackerLosses: Partial<NationStats> = {
      military: Math.max(0, Math.floor(attackerStats.military * (isAttackerWin ? 0.1 : 0.3 * lossRatio))),
      morale: Math.max(0, Math.floor(attackerStats.morale * (isAttackerWin ? 0.05 : 0.2 * lossRatio))),
      population: Math.max(0, Math.floor(attackerStats.population * (isAttackerWin ? 0.02 : 0.1 * lossRatio))),
      gold: Math.max(0, Math.floor(attackerStats.gold * (isAttackerWin ? 0.05 : 0.15 * lossRatio))),
    };

    const defenderLosses: Partial<NationStats> = {
      military: Math.max(0, Math.floor(defenderStats.military * (isAttackerWin ? 0.3 * lossRatio : 0.1))),
      morale: Math.max(0, Math.floor(defenderStats.morale * (isAttackerWin ? 0.2 * lossRatio : 0.05))),
      population: Math.max(0, Math.floor(defenderStats.population * (isAttackerWin ? 0.1 * lossRatio : 0.02))),
      gold: Math.max(0, Math.floor(defenderStats.gold * (isAttackerWin ? 0.15 * lossRatio : 0.05))),
    };

    // 승자의 작은 보상
    if (isAttackerWin) {
      attackerLosses.gold = Math.max(0, (attackerLosses.gold || 0) - Math.floor(defenderLosses.gold || 0) * 0.3);
    } else {
      defenderLosses.gold = Math.max(0, (defenderLosses.gold || 0) - Math.floor(attackerLosses.gold || 0) * 0.3);
    }

    return {
      winner,
      attackerLosses,
      defenderLosses,
      allySupport,
    };
  }

  // 전투 결과 적용
  applyBattleResult(
    roomId: string,
    attackerNation: Nation,
    defenderNation: Nation,
    result: {
      winner: Nation;
      attackerLosses: Partial<NationStats>;
      defenderLosses: Partial<NationStats>;
    }
  ): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    // 공격자 손실 적용 (안전하게)
    const attackerStats = room.teams[attackerNation].stats;
    for (const [key, value] of Object.entries(result.attackerLosses)) {
      if (key in attackerStats && typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0) {
        const currentValue = (attackerStats as Record<string, number>)[key] || 0;
        const newValue = Math.max(0, currentValue - value);
        
        // 범위 제한
        if (key === 'morale') {
          attackerStats.morale = Math.max(0, Math.min(100, newValue));
        } else if (['military', 'economy', 'diplomacy', 'culture'].includes(key)) {
          (attackerStats as Record<string, number>)[key] = Math.max(0, Math.min(500, newValue));
        } else {
          (attackerStats as Record<string, number>)[key] = Math.max(0, newValue);
        }
      }
    }

    // 방어자 손실 적용 (안전하게)
    const defenderStats = room.teams[defenderNation].stats;
    for (const [key, value] of Object.entries(result.defenderLosses)) {
      if (key in defenderStats && typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0) {
        const currentValue = (defenderStats as Record<string, number>)[key] || 0;
        const newValue = Math.max(0, currentValue - value);
        
        // 범위 제한
        if (key === 'morale') {
          defenderStats.morale = Math.max(0, Math.min(100, newValue));
        } else if (['military', 'economy', 'diplomacy', 'culture'].includes(key)) {
          (defenderStats as Record<string, number>)[key] = Math.max(0, Math.min(500, newValue));
        } else {
          (defenderStats as Record<string, number>)[key] = Math.max(0, newValue);
        }
      }
    }

    // 승자의 작은 보상 (금) - 안전하게
    const reward = result.winner === attackerNation
      ? Math.floor((result.defenderLosses.gold || 0) * 0.3)
      : Math.floor((result.attackerLosses.gold || 0) * 0.3);
    
    if (reward > 0 && !isNaN(reward) && isFinite(reward)) {
      if (result.winner === attackerNation) {
        attackerStats.gold = Math.max(0, attackerStats.gold + reward);
      } else {
        defenderStats.gold = Math.max(0, defenderStats.gold + reward);
      }
    }

    return true;
  }

  // 디버그: 모든 방 정보
  getAllRooms(): GameRoom[] {
    return Array.from(this.rooms.values());
  }
}

export const gameManager = new GameManager();





