// ============================================
// 역사전쟁:삼국시대 게임 매니저
// 방 생성, 게임 진행, 투표 관리
// ============================================
import { v4 as uuidv4 } from 'uuid';
import { VICTORY_CONDITIONS, } from './types.js';
// 기본 게임 설정
const DEFAULT_SETTINGS = {
    maxTurns: 30,
    turnDuration: 120,
    discussionDuration: 120, // 2분 토론
    voteDuration: 60, // 1분 투표
    maxPlayersPerTeam: 5,
    difficulty: 'normal',
};
// 국가별 초기 스탯
const INITIAL_STATS = {
    goguryeo: {
        military: 150,
        economy: 100,
        diplomacy: 80,
        culture: 90,
        gold: 1000,
        population: 80000,
        morale: 70,
        culturePoints: 0,
        techProgress: 0,
        peaceTurns: 0,
    },
    baekje: {
        military: 100,
        economy: 130,
        diplomacy: 120,
        culture: 120,
        gold: 1200,
        population: 60000,
        morale: 75,
        culturePoints: 0,
        techProgress: 0,
        peaceTurns: 0,
    },
    silla: {
        military: 90,
        economy: 110,
        diplomacy: 100,
        culture: 100,
        gold: 800,
        population: 50000,
        morale: 80,
        culturePoints: 0,
        techProgress: 0,
        peaceTurns: 0,
    },
};
// 초기 승리 진행 상황
const INITIAL_VICTORY_PROGRESS = {
    military: { conqueredNations: [], progress: 0 },
    cultural: { culturePoints: 0, progress: 0 },
    diplomatic: { alliances: 0, peaceTurns: 0, progress: 0 },
    technological: { completedTechs: [], progress: 0 },
    score: { totalScore: 0, progress: 0 },
};
// 연도 계산 (턴 당 10년)
const START_YEAR = 300;
const YEAR_PER_TURN = 10;
export class GameManager {
    rooms = new Map();
    codeToRoomId = new Map();
    playerToRoom = new Map();
    // 방 코드 생성 (6자리 영문+숫자)
    generateRoomCode() {
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
    createRoom(hostId, hostName, className, settings, code) {
        const roomId = uuidv4();
        const roomCode = code || this.generateRoomCode();
        // 코드 중복 체크
        if (this.codeToRoomId.has(roomCode)) {
            throw new Error(`방 코드 ${roomCode}가 이미 존재합니다.`);
        }
        const room = {
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
                    isEliminated: false,
                    victoryProgress: { ...INITIAL_VICTORY_PROGRESS },
                },
                baekje: {
                    nation: 'baekje',
                    players: [],
                    stats: { ...INITIAL_STATS.baekje },
                    allies: [],
                    enemies: [],
                    eventHistory: [],
                    isEliminated: false,
                    victoryProgress: { ...INITIAL_VICTORY_PROGRESS },
                },
                silla: {
                    nation: 'silla',
                    players: [],
                    stats: { ...INITIAL_STATS.silla },
                    allies: [],
                    enemies: [],
                    eventHistory: [],
                    isEliminated: false,
                    victoryProgress: { ...INITIAL_VICTORY_PROGRESS },
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
            isSinglePlayerAI: hostName === '싱글플레이어 AI 대전', // 싱글플레이 AI 대전 여부
            victoryConditions: [...VICTORY_CONDITIONS], // 모든 승리 조건 활성화
            createdAt: Date.now(),
        };
        this.rooms.set(roomId, room);
        this.codeToRoomId.set(roomCode, roomId);
        console.log(`[GameManager] Room created: ${roomCode} (${roomId})`);
        return room;
    }
    // 방 코드로 방 찾기
    getRoomByCode(code) {
        const roomId = this.codeToRoomId.get(code.toUpperCase());
        if (!roomId)
            return null;
        return this.rooms.get(roomId) || null;
    }
    // 방 ID로 방 찾기
    getRoom(roomId) {
        return this.rooms.get(roomId) || null;
    }
    // 플레이어의 현재 방 찾기
    getPlayerRoom(playerId) {
        const roomId = this.playerToRoom.get(playerId);
        if (!roomId)
            return null;
        return this.rooms.get(roomId) || null;
    }
    // 방 참가
    joinRoom(roomId, playerId, socketId, playerName) {
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
        // 이미 참가한 플레이어인지 확인
        if (room.players[playerId]) {
            // 재접속 처리
            room.players[playerId].socketId = socketId;
            room.players[playerId].isOnline = true;
            this.playerToRoom.set(playerId, roomId);
            return room.players[playerId];
        }
        // 새 플레이어 생성
        const player = {
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
    leaveRoom(playerId) {
        const roomId = this.playerToRoom.get(playerId);
        if (!roomId)
            return null;
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
        const player = room.players[playerId];
        if (!player)
            return null;
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
            // AI가 아닌 온라인 플레이어만 호스트 후보로 선택
            const onlinePlayers = Object.values(room.players).filter(p => p.isOnline && !p.isAI);
            if (onlinePlayers.length > 0) {
                room.hostId = onlinePlayers[0].id;
                room.hostName = onlinePlayers[0].name;
                console.log(`[GameManager] New host: ${room.hostName}`);
            }
            else {
                // 방 삭제 (AI만 남은 경우)
                this.rooms.delete(roomId);
                this.codeToRoomId.delete(room.code);
                console.log(`[GameManager] Room deleted: ${room.code}`);
            }
        }
        console.log(`[GameManager] Player left: ${player.name} (${playerId})`);
        return { room, player };
    }
    // 팀 선택
    selectTeam(playerId, nation) {
        const room = this.getPlayerRoom(playerId);
        if (!room)
            return false;
        const player = room.players[playerId];
        if (!player)
            return false;
        // 게임 중에는 팀 변경 불가
        if (room.status !== 'waiting')
            return false;
        // 이미 같은 팀인 경우
        if (player.team === nation)
            return true;
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
    toggleReady(playerId) {
        const room = this.getPlayerRoom(playerId);
        if (!room)
            return false;
        const player = room.players[playerId];
        if (!player || !player.team)
            return false;
        player.isReady = !player.isReady;
        console.log(`[GameManager] ${player.name} ready: ${player.isReady}`);
        return player.isReady;
    }
    // 게임 시작 가능 여부 확인
    canStartGame(roomId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return { canStart: false, reason: '방을 찾을 수 없습니다.' };
        // 각 팀에 최소 1명 필요
        for (const nation of ['goguryeo', 'baekje', 'silla']) {
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
    startGame(roomId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return false;
        const { canStart } = this.canStartGame(roomId);
        if (!canStart)
            return false;
        room.status = 'playing';
        room.currentTurn = 1;
        room.currentYear = START_YEAR;
        room.startedAt = Date.now();
        console.log(`[GameManager] Game started: ${room.code}`);
        return true;
    }
    // 턴 진행
    advanceTurn(roomId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
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
    triggerEvent(roomId, event) {
        const room = this.rooms.get(roomId);
        if (!room)
            return false;
        room.currentEvent = event;
        room.status = 'voting';
        const deadline = Date.now() + room.settings.voteDuration * 1000;
        // 해당 국가에 대한 투표 초기화
        if (event.targetNation === 'all') {
            for (const nation of ['goguryeo', 'baekje', 'silla']) {
                room.currentVotes[nation] = {
                    eventId: event.id,
                    votes: {},
                    deadline,
                };
            }
        }
        else {
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
    submitVote(playerId, choiceId) {
        const room = this.getPlayerRoom(playerId);
        if (!room || !room.currentEvent)
            return null;
        const player = room.players[playerId];
        if (!player || !player.team)
            return null;
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
    calculateVoteResult(roomId, nation) {
        const room = this.rooms.get(roomId);
        if (!room || !room.currentEvent)
            return null;
        const vote = room.currentVotes[nation];
        const event = room.currentEvent;
        // 투표 집계
        const voteCounts = {};
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
        if (!choice)
            return null;
        // 스탯 적용 (안전하게)
        const stats = room.teams[nation].stats;
        for (const [key, value] of Object.entries(choice.effects)) {
            if (key in stats && typeof value === 'number' && !isNaN(value) && isFinite(value)) {
                const currentValue = stats[key] || 0;
                const newValue = currentValue + value;
                // 범위 제한
                if (key === 'morale') {
                    stats.morale = Math.max(0, Math.min(100, newValue));
                }
                else if (['military', 'economy', 'diplomacy', 'culture'].includes(key)) {
                    stats[key] = Math.max(0, Math.min(500, newValue));
                }
                else if (key === 'gold') {
                    stats.gold = Math.max(0, newValue); // gold는 음수 방지만
                }
                else if (key === 'population') {
                    stats.population = Math.max(0, newValue); // population도 음수 방지만
                }
                else {
                    // 기타 스탯도 안전하게 적용
                    stats[key] = Math.max(0, newValue);
                }
            }
        }
        vote.result = winningChoice;
        // 이벤트 이력 저장
        if (!room.teams[nation].eventHistory) {
            room.teams[nation].eventHistory = [];
        }
        const eventHistory = {
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
    checkGameOver(room) {
        // 최대 턴 도달
        if (room.currentTurn >= room.settings.maxTurns) {
            const winner = this.getWinnerByScore(room);
            return { isOver: true, winner, reason: 'turns' };
        }
        // 통일 조건 (다른 나라 스탯이 0 이하)
        for (const nation of ['goguryeo', 'baekje', 'silla']) {
            const stats = room.teams[nation].stats;
            const otherNations = ['goguryeo', 'baekje', 'silla'].filter(n => n !== nation);
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
    getWinnerByScore(room) {
        let maxScore = 0;
        let winner = 'goguryeo';
        for (const nation of ['goguryeo', 'baekje', 'silla']) {
            const stats = room.teams[nation].stats;
            // 밸런스 조정된 점수 계산
            // 각 스탯의 중요도와 범위를 고려하여 가중치 조정
            const score = stats.military * 1.2 + // 군사력: 약간 감소 (고구려 유리 방지)
                stats.economy * 1.1 + // 경제력: 약간 증가 (백제 유리)
                stats.diplomacy * 1.0 + // 외교력: 동일
                stats.culture * 1.5 + // 문화력: 감소 (신라 유리 방지)
                stats.morale * 1.5 + // 민심: 감소 (균형)
                (stats.gold / 10) + // 재화: 10분의 1로 환산
                (stats.population / 100); // 인구: 100분의 1로 환산
            if (score > maxScore) {
                maxScore = score;
                winner = nation;
            }
        }
        return winner;
    }
    // 채팅 메시지 생성
    createChatMessage(roomId, playerId, message, type, target) {
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
        const player = room.players[playerId];
        if (!player || !player.team)
            return null;
        const chatMessage = {
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
    proposeAlliance(roomId, proposerNation, targetNation) {
        const room = this.rooms.get(roomId);
        if (!room)
            return false;
        // 자기 자신에게는 제안 불가
        if (proposerNation === targetNation)
            return false;
        // 이미 동맹이면 불가
        if (room.teams[proposerNation].allies.includes(targetNation))
            return false;
        // 이미 적대 관계면 불가 (먼저 적대 해제 필요)
        if (room.teams[proposerNation].enemies.includes(targetNation))
            return false;
        // 동맹 제안은 게임 진행 중에만 가능
        if (room.status !== 'playing')
            return false;
        // 동맹 제안 생성 (실제로는 클라이언트에서 처리하지만, 여기서는 관계만 설정)
        // 실제 구현에서는 제안 상태를 별도로 관리해야 함
        return true;
    }
    // 동맹 수락
    acceptAlliance(roomId, proposerNation, acceptorNation) {
        const room = this.rooms.get(roomId);
        if (!room)
            return false;
        // 이미 동맹이면 불가
        if (room.teams[proposerNation].allies.includes(acceptorNation))
            return false;
        if (room.teams[acceptorNation].allies.includes(proposerNation))
            return false;
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
    breakAlliance(roomId, nation1, nation2) {
        const room = this.rooms.get(roomId);
        if (!room)
            return false;
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
    declareWar(roomId, declarerNation, targetNation) {
        const room = this.rooms.get(roomId);
        if (!room)
            return false;
        // 자기 자신에게는 선포 불가
        if (declarerNation === targetNation)
            return false;
        // 이미 적대 관계면 불가
        if (room.teams[declarerNation].enemies.includes(targetNation))
            return false;
        // 적대 선포
        room.teams[declarerNation].enemies.push(targetNation);
        room.teams[targetNation].enemies.push(declarerNation);
        // 동맹 관계가 있으면 자동 파기
        this.breakAlliance(roomId, declarerNation, targetNation);
        return true;
    }
    // 적대 해제
    endWar(roomId, nation1, nation2) {
        const room = this.rooms.get(roomId);
        if (!room)
            return false;
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
    initiateBattle(roomId, attackerNation, defenderNation) {
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
        // 자기 자신과는 전투 불가
        if (attackerNation === defenderNation)
            return null;
        // 게임 진행 중에만 전투 가능
        if (room.status !== 'playing')
            return null;
        const battleId = uuidv4();
        // 전투 제안은 별도로 관리할 수도 있지만, 간단하게 바로 진행
        return { room, battleId };
    }
    // 전투 결과 계산
    calculateBattleResult(roomId, attackerNation, defenderNation) {
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
        const attackerStats = room.teams[attackerNation].stats;
        const defenderStats = room.teams[defenderNation].stats;
        const attackerTeam = room.teams[attackerNation];
        const defenderTeam = room.teams[defenderNation];
        // 기본 전투력 계산 (군사력 + 민심의 일부)
        let attackerPower = attackerStats.military + attackerStats.morale * 0.5;
        let defenderPower = defenderStats.military + defenderStats.morale * 0.5;
        // 동맹 지원 계산
        const allySupport = {
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
        const attackerLosses = {
            military: Math.max(0, Math.floor(attackerStats.military * (isAttackerWin ? 0.1 : 0.3 * lossRatio))),
            morale: Math.max(0, Math.floor(attackerStats.morale * (isAttackerWin ? 0.05 : 0.2 * lossRatio))),
            population: Math.max(0, Math.floor(attackerStats.population * (isAttackerWin ? 0.02 : 0.1 * lossRatio))),
            gold: Math.max(0, Math.floor(attackerStats.gold * (isAttackerWin ? 0.05 : 0.15 * lossRatio))),
        };
        const defenderLosses = {
            military: Math.max(0, Math.floor(defenderStats.military * (isAttackerWin ? 0.3 * lossRatio : 0.1))),
            morale: Math.max(0, Math.floor(defenderStats.morale * (isAttackerWin ? 0.2 * lossRatio : 0.05))),
            population: Math.max(0, Math.floor(defenderStats.population * (isAttackerWin ? 0.1 * lossRatio : 0.02))),
            gold: Math.max(0, Math.floor(defenderStats.gold * (isAttackerWin ? 0.15 * lossRatio : 0.05))),
        };
        // 승자의 작은 보상
        if (isAttackerWin) {
            attackerLosses.gold = Math.max(0, (attackerLosses.gold || 0) - Math.floor(defenderLosses.gold || 0) * 0.3);
        }
        else {
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
    applyBattleResult(roomId, attackerNation, defenderNation, result) {
        const room = this.rooms.get(roomId);
        if (!room)
            return false;
        // 공격자 손실 적용 (안전하게)
        const attackerStats = room.teams[attackerNation].stats;
        for (const [key, value] of Object.entries(result.attackerLosses)) {
            if (key in attackerStats && typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0) {
                const currentValue = attackerStats[key] || 0;
                const newValue = Math.max(0, currentValue - value);
                // 범위 제한
                if (key === 'morale') {
                    attackerStats.morale = Math.max(0, Math.min(100, newValue));
                }
                else if (['military', 'economy', 'diplomacy', 'culture'].includes(key)) {
                    attackerStats[key] = Math.max(0, Math.min(500, newValue));
                }
                else {
                    attackerStats[key] = Math.max(0, newValue);
                }
            }
        }
        // 방어자 손실 적용 (안전하게)
        const defenderStats = room.teams[defenderNation].stats;
        for (const [key, value] of Object.entries(result.defenderLosses)) {
            if (key in defenderStats && typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0) {
                const currentValue = defenderStats[key] || 0;
                const newValue = Math.max(0, currentValue - value);
                // 범위 제한
                if (key === 'morale') {
                    defenderStats.morale = Math.max(0, Math.min(100, newValue));
                }
                else if (['military', 'economy', 'diplomacy', 'culture'].includes(key)) {
                    defenderStats[key] = Math.max(0, Math.min(500, newValue));
                }
                else {
                    defenderStats[key] = Math.max(0, newValue);
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
            }
            else {
                defenderStats.gold = Math.max(0, defenderStats.gold + reward);
            }
        }
        return true;
    }
    // ============================================
    // 승리 조건 시스템
    // ============================================
    // 승리 진행 상황 업데이트
    updateVictoryProgress(roomId, nation) {
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
        const team = room.teams[nation];
        const stats = team.stats;
        const progress = team.victoryProgress;
        // 군사 승리 진행 상황
        const conqueredNations = ['goguryeo', 'baekje', 'silla']
            .filter(n => n !== nation && room.teams[n].isEliminated && room.teams[n].conqueredBy === nation);
        progress.military = {
            conqueredNations,
            progress: Math.min(100, (conqueredNations.length / 2) * 100),
        };
        // 문화 승리 진행 상황
        progress.cultural = {
            culturePoints: stats.culturePoints,
            progress: Math.min(100, (stats.culturePoints / 500) * 100),
        };
        // 외교 승리 진행 상황
        const alliances = team.allies.length;
        const peaceTurns = stats.peaceTurns;
        const diplomaticProgress = Math.min(100, ((alliances / 2) * 50) + ((peaceTurns / 10) * 50));
        progress.diplomatic = {
            alliances,
            peaceTurns,
            progress: diplomaticProgress,
        };
        // 기술 승리 진행 상황 (추후 테크 트리 구현 시 업데이트)
        progress.technological = {
            completedTechs: [],
            progress: Math.min(100, (stats.techProgress / 8) * 100),
        };
        // 점수 승리 진행 상황
        const totalScore = this.calculateTotalScore(stats);
        progress.score = {
            totalScore,
            progress: room.currentTurn >= 30 ? 100 : (room.currentTurn / 30) * 100,
        };
        return progress;
    }
    // 총점 계산
    calculateTotalScore(stats) {
        return Math.floor(stats.military * 1.5 +
            stats.economy * 1.2 +
            stats.culture * 1.3 +
            stats.diplomacy * 1.0 +
            stats.gold * 0.01 +
            stats.population * 0.001 +
            stats.culturePoints * 2 +
            stats.morale * 0.5);
    }
    // 승리 조건 체크
    checkVictoryConditions(roomId) {
        const room = this.rooms.get(roomId);
        if (!room || room.status === 'finished')
            return null;
        const nations = ['goguryeo', 'baekje', 'silla'];
        for (const nation of nations) {
            const team = room.teams[nation];
            if (team.isEliminated)
                continue;
            // 승리 진행 상황 업데이트
            const progress = this.updateVictoryProgress(roomId, nation);
            if (!progress)
                continue;
            // 1. 군사 승리 체크 - 다른 두 국가 정복
            if (progress.military.conqueredNations.length >= 2) {
                return { winner: nation, victoryType: 'military', victoryName: '삼국통일' };
            }
            // 2. 문화 승리 체크 - 문화 점수 500점
            if (progress.cultural.culturePoints >= 500) {
                return { winner: nation, victoryType: 'cultural', victoryName: '문화대국' };
            }
            // 3. 외교 승리 체크 - 2국 동맹 + 10턴 평화
            if (team.allies.length >= 2 && team.stats.peaceTurns >= 10) {
                return { winner: nation, victoryType: 'diplomatic', victoryName: '평화의 시대' };
            }
            // 4. 기술 승리 체크 - 8개 기술 완료 (추후 테크 트리 구현 시)
            if (team.stats.techProgress >= 8) {
                return { winner: nation, victoryType: 'technological', victoryName: '기술 선진국' };
            }
        }
        // 5. 점수 승리 체크 - 30턴 후 최고 점수
        if (room.currentTurn >= room.settings.maxTurns) {
            let highestScore = 0;
            let winner = 'goguryeo';
            for (const nation of nations) {
                if (room.teams[nation].isEliminated)
                    continue;
                const score = this.calculateTotalScore(room.teams[nation].stats);
                if (score > highestScore) {
                    highestScore = score;
                    winner = nation;
                }
            }
            return { winner, victoryType: 'score', victoryName: '최강국' };
        }
        return null;
    }
    // 국가 탈락 처리
    eliminateNation(roomId, nation, conqueror) {
        const room = this.rooms.get(roomId);
        if (!room)
            return false;
        const team = room.teams[nation];
        team.isEliminated = true;
        team.conqueredBy = conqueror;
        console.log(`[GameManager] Nation ${nation} eliminated by ${conqueror} in room ${room.code}`);
        return true;
    }
    // 평화 턴 업데이트 (매 턴마다 호출)
    updatePeaceTurns(roomId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        const nations = ['goguryeo', 'baekje', 'silla'];
        for (const nation of nations) {
            const team = room.teams[nation];
            if (team.isEliminated)
                continue;
            // 적이 없으면 평화 턴 증가
            if (team.enemies.length === 0) {
                team.stats.peaceTurns += 1;
            }
            else {
                team.stats.peaceTurns = 0; // 전쟁 중이면 리셋
            }
        }
    }
    // 문화 점수 추가 (이벤트 선택, 건물 건설 등에서 호출)
    addCulturePoints(roomId, nation, points) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        const team = room.teams[nation];
        if (team.isEliminated)
            return;
        team.stats.culturePoints += points;
        console.log(`[GameManager] ${nation} gained ${points} culture points (total: ${team.stats.culturePoints})`);
    }
    // 승리 처리
    handleVictory(roomId, winner, victoryType) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        room.status = 'finished';
        room.winner = {
            nation: winner,
            victoryType,
            turn: room.currentTurn,
        };
        console.log(`[GameManager] Game ended! Winner: ${winner} by ${victoryType} victory at turn ${room.currentTurn}`);
    }
    // 디버그: 모든 방 정보
    getAllRooms() {
        return Array.from(this.rooms.values());
    }
}
export const gameManager = new GameManager();
//# sourceMappingURL=gameManager.js.map