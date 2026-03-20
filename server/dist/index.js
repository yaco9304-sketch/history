// ============================================
// 역사전쟁:삼국시대 실시간 멀티플레이 서버
// Express + Socket.io
// ============================================
// 환경 변수 로드
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// dist 폴더에서 실행되므로 상위 디렉토리의 .env 파일을 찾도록 설정
const envPath = join(__dirname, '..', '.env');
console.log('[Env] Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('[Env] Error loading .env:', result.error);
}
else {
    console.log('[Env] .env loaded successfully');
    console.log('[Env] GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('[Env] GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
}
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { gameManager } from './gameManager.js';
import { getAIAdvice, getFallbackAdvice, testGeminiAPI } from './aiAdvisor.js';
import { validateChatMessage } from './chatFilter.js';
import { createAIPlayer, selectBestChoice } from './aiPlayer.js';
import { SAMPLE_EVENTS } from './events.js';
// 국가 이름 매핑
const NATIONS = {
    goguryeo: { name: '고구려' },
    baekje: { name: '백제' },
    silla: { name: '신라' },
};
// 환경 변수
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// roomUpdated 이벤트 디바운싱 (성능 최적화)
const roomUpdateTimers = new Map();
const debouncedRoomUpdate = (roomId, room) => {
    // 기존 타이머가 있으면 취소
    if (roomUpdateTimers.has(roomId)) {
        clearTimeout(roomUpdateTimers.get(roomId));
    }
    // 100ms 후에 업데이트 (짧은 시간 내 여러 업데이트를 하나로 합침)
    const timer = setTimeout(() => {
        console.log(`[Server] Sending roomUpdated to room ${roomId}:`, {
            roomCode: room?.code,
            playersCount: room ? Object.keys(room.players || {}).length : 0,
            aiPlayersCount: room ? Object.values(room.players || {}).filter((p) => p.isAI).length : 0
        });
        io.to(roomId).emit('roomUpdated', room);
        roomUpdateTimers.delete(roomId);
    }, 100);
    roomUpdateTimers.set(roomId, timer);
};
// Express 앱 설정
const app = express();
app.use(cors({
    origin: (origin, callback) => {
        // Allow any localhost origin
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        }
        else {
            callback(null, CLIENT_URL);
        }
    }
}));
app.use(express.json());
// HTTP 서버 생성
const httpServer = createServer(app);
// Socket.io 서버 설정
const io = new Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            // Allow any localhost origin
            if (!origin || origin.startsWith('http://localhost:')) {
                callback(null, true);
            }
            else {
                callback(null, CLIENT_URL);
            }
        },
        methods: ['GET', 'POST'],
    },
});
// 이벤트는 events.ts에서 import하여 사용
/**
 * AI 대전 모드 감지 함수
 * 실제 플레이어(비AI)가 1명이고 AI 플레이어가 있는 경우 AI 대전 모드로 간주
 */
function isAIBattleMode(roomId) {
    if (!roomId)
        return false;
    const room = gameManager.getRoom(roomId);
    if (!room)
        return false;
    // 팀을 선택한 실제 플레이어(비AI) 수 - 호스트는 팀을 선택하지 않음
    const realPlayersWithTeam = Object.values(room.players).filter(p => !p.isAI && p.team !== null);
    // AI 플레이어 수
    const aiPlayers = Object.values(room.players).filter(p => p.isAI);
    console.log(`[isAIBattleMode] Room ${room.code}: realPlayersWithTeam=${realPlayersWithTeam.length}, aiPlayers=${aiPlayers.length}`);
    console.log(`[isAIBattleMode] Real players with team:`, realPlayersWithTeam.map(p => `${p.name}(${p.team})`));
    console.log(`[isAIBattleMode] AI players:`, aiPlayers.map(p => `${p.name}(${p.id})`));
    // 팀을 선택한 실제 플레이어 1명 + AI 플레이어가 있으면 AI 대전 모드
    const result = realPlayersWithTeam.length === 1 && aiPlayers.length > 0;
    console.log(`[isAIBattleMode] Result: ${result}`);
    return result;
}
// 이벤트 선택 함수 - 턴과 국가 정보를 기반으로 적절한 이벤트 선택
function selectEventForTurn(turn, nationsPresentInGame, roomId) {
    // 전체 이벤트 개수 로그
    console.log(`[EventSelect] Total events available: ${SAMPLE_EVENTS.length}`);
    console.log(`[EventSelect] Event breakdown:`, {
        goguryeo: SAMPLE_EVENTS.filter(e => e.targetNation === 'goguryeo').length,
        baekje: SAMPLE_EVENTS.filter(e => e.targetNation === 'baekje').length,
        silla: SAMPLE_EVENTS.filter(e => e.targetNation === 'silla').length,
        all: SAMPLE_EVENTS.filter(e => e.targetNation === 'all').length,
    });
    // AI 대전 모드: 플레이어 국가 우선
    let playerNation = null;
    const isAIBattle = isAIBattleMode(roomId);
    console.log(`[EventSelect] Turn ${turn}: isAIBattle=${isAIBattle}, roomId=${roomId}`);
    if (roomId) {
        const room = gameManager.getRoom(roomId);
        if (room) {
            // 팀을 선택한 실제 플레이어 (AI가 아닌) 찾기 - 호스트는 팀이 없음
            const realPlayer = Object.values(room.players).find(p => !p.isAI && p.team !== null);
            if (realPlayer?.team) {
                playerNation = realPlayer.team;
                console.log(`[EventSelect] Found player nation: ${playerNation} (player: ${realPlayer.name})`);
            }
            else {
                console.log(`[EventSelect] No real player with team found. Players:`, Object.values(room.players).map(p => `${p.name}(${p.isAI ? 'AI' : 'Human'}, team: ${p.team})`));
            }
        }
    }
    // AI 대전 모드: 플레이어 국가의 이벤트만 선택 (공통 이벤트 제외)
    if (isAIBattle && playerNation) {
        // 플레이어 국가 이벤트만 선택 ('all' 이벤트 제외)
        const playerEvents = SAMPLE_EVENTS.filter(e => e.targetNation === playerNation);
        console.log(`[EventSelect] Turn ${turn}: AI Battle mode - Found ${playerEvents.length} events for ${playerNation} (excluding 'all' events)`);
        if (playerEvents.length > 0) {
            console.log(`[EventSelect] Available events for ${playerNation}:`, playerEvents.map(e => `${e.title} (${e.year}년)`).join(', '));
        }
        if (playerEvents.length > 0) {
            // 연도 순서대로 정렬
            const sortedEvents = [...playerEvents].sort((a, b) => a.year - b.year);
            // 턴에 맞는 이벤트 선택 (순환)
            const eventIndex = (turn - 1) % sortedEvents.length;
            const selectedEvent = sortedEvents[eventIndex];
            console.log(`[EventSelect] Turn ${turn}: AI Battle mode - Selecting event ${eventIndex + 1}/${sortedEvents.length}: ${selectedEvent.title} (year: ${selectedEvent.year})`);
            return selectedEvent;
        }
        else {
            console.error(`[EventSelect] Turn ${turn}: No events found for player nation ${playerNation}, using first event`);
            return SAMPLE_EVENTS[0];
        }
    }
    // 멀티플레이 모드: 모든 국가의 이벤트 사용
    const availableEvents = SAMPLE_EVENTS.filter(e => e.targetNation === 'all' || nationsPresentInGame.includes(e.targetNation));
    if (availableEvents.length === 0) {
        console.error(`[EventSelect] No available events for turn ${turn}, using first event`);
        return SAMPLE_EVENTS[0];
    }
    const eventIndex = (turn - 1) % availableEvents.length;
    const selectedEvent = availableEvents[eventIndex];
    console.log(`[EventSelect] Turn ${turn}: Multiplayer mode - Selected event: ${selectedEvent.title} (${selectedEvent.targetNation})`);
    return selectedEvent;
}
// ============================================
// 투표 완료 확인 및 턴 진행 헬퍼 함수
// ============================================
const checkVoteCompletionAndAdvance = (roomId, nation) => {
    const room = gameManager.getRoom(roomId);
    if (!room || !room.currentVotes[nation]) {
        console.error('[VoteCheck] Room or vote data missing');
        return;
    }
    const vote = room.currentVotes[nation];
    // 싱글플레이 AI 대전: 플레이어만 투표하면 즉시 진행
    let allVoted = false;
    let teamPlayers = [];
    if (room.isSinglePlayerAI) {
        // 인간 플레이어만 확인
        const humanPlayers = room.teams[nation]?.players.filter(pid => {
            const player = room.players[pid];
            return player && !player.isAI && !pid.startsWith('test-host-');
        }) || [];
        teamPlayers = humanPlayers;
        allVoted = humanPlayers.length > 0 && humanPlayers.every(pid => vote.votes[pid]);
        console.log(`[VoteCheck] SinglePlayer AI mode - Human players only:`, {
            humanPlayers: humanPlayers.map(pid => room.players[pid]?.name),
            allVoted
        });
    }
    else {
        // 멀티플레이: 팀의 모든 플레이어 (인간 + AI) - test-host 제외
        // AI 플레이어는 자동 투표하므로 포함해야 함
        teamPlayers = room.teams[nation]?.players.filter(pid => {
            const player = room.players[pid];
            // AI 플레이어는 항상 포함, 인간 플레이어는 온라인일 때만 포함
            return player && !pid.startsWith('test-host-') && (player.isAI || player.isOnline);
        }) || [];
        allVoted = teamPlayers.length > 0 && teamPlayers.every(pid => vote.votes[pid]);
    }
    console.log(`[VoteCheck] ${nation} team vote status:`, {
        teamPlayers: teamPlayers.map(pid => {
            const p = room.players[pid];
            return `${p?.name}(${p?.isAI ? 'AI' : 'Human'}, ${pid})`;
        }),
        votedPlayers: Object.keys(vote.votes).map(pid => {
            const p = room.players[pid];
            return `${p?.name}(${p?.isAI ? 'AI' : 'Human'}, ${pid})`;
        }),
        allVoted,
        teamPlayerIds: teamPlayers,
        votedPlayerIds: Object.keys(vote.votes)
    });
    if (allVoted) {
        // 투표 결과 계산
        const voteResult = gameManager.calculateVoteResult(roomId, nation);
        if (voteResult) {
            io.to(roomId).emit('voteResult', nation, voteResult.choiceId, voteResult.effects);
            // 방 상태 다시 가져오기
            const updatedRoom = gameManager.getRoom(roomId);
            if (!updatedRoom)
                return;
            debouncedRoomUpdate(roomId, updatedRoom);
            // 모든 국가의 투표가 완료되었는지 확인
            const event = updatedRoom.currentEvent;
            if (event) {
                // 이벤트 대상 국가 결정
                let targetNations;
                targetNations = event.targetNation === 'all'
                    ? ['goguryeo', 'baekje', 'silla']
                    : [event.targetNation];
                console.log(`[VoteCheck] Event: ${event.title}, Target Nations:`, targetNations);
                const allNationsVoted = targetNations.every(nation => {
                    const vote = updatedRoom.currentVotes[nation];
                    if (!vote) {
                        console.log(`[VoteCheck] ${nation}: No vote data`);
                        return false;
                    }
                    // 싱글플레이 AI 대전: 인간 플레이어만 확인
                    let teamPlayers;
                    if (updatedRoom.isSinglePlayerAI) {
                        teamPlayers = updatedRoom.teams[nation].players.filter(pid => {
                            const player = updatedRoom.players[pid];
                            return player && !player.isAI && !pid.startsWith('test-host-');
                        });
                    }
                    else {
                        // 멀티플레이: 팀의 모든 플레이어 (인간 + AI) - test-host 제외
                        // AI 플레이어는 자동 투표하므로 포함해야 함
                        teamPlayers = updatedRoom.teams[nation].players.filter(pid => {
                            const player = updatedRoom.players[pid];
                            // AI 플레이어는 항상 포함, 인간 플레이어는 온라인일 때만 포함
                            return player && !pid.startsWith('test-host-') && (player.isAI || player.isOnline);
                        });
                    }
                    const hasVoted = teamPlayers.length > 0 && teamPlayers.every(pid => vote.votes[pid]);
                    console.log(`[VoteCheck] ${nation}: ${teamPlayers.length} players (${teamPlayers.map(pid => {
                        const p = updatedRoom.players[pid];
                        return `${p?.name}(${p?.isAI ? 'AI' : 'Human'})`;
                    }).join(', ')}), voted: ${hasVoted}`);
                    console.log(`[VoteCheck] ${nation} vote details:`, {
                        teamPlayerIds: teamPlayers,
                        votedPlayerIds: Object.keys(vote.votes),
                        missingVotes: teamPlayers.filter(pid => !vote.votes[pid]).map(pid => {
                            const p = updatedRoom.players[pid];
                            return `${p?.name}(${p?.isAI ? 'AI' : 'Human'}, ${pid})`;
                        })
                    });
                    return hasVoted;
                });
                console.log(`[VoteCheck] All nations voted: ${allNationsVoted}`);
                if (allNationsVoted) {
                    console.log(`[Server] All votes complete for turn ${updatedRoom.currentTurn}, advancing to next turn...`);
                    // 모든 투표 완료 - 턴 진행
                    setTimeout(() => {
                        const turnResult = gameManager.advanceTurn(roomId);
                        console.log(`[Server] advanceTurn result:`, {
                            hasResult: !!turnResult,
                            isGameOver: turnResult?.isGameOver,
                            newTurn: turnResult?.room.currentTurn,
                            newYear: turnResult?.room.currentYear
                        });
                        if (!turnResult) {
                            console.error(`[Server] advanceTurn returned null for room ${roomId}`);
                            return;
                        }
                        if (turnResult.isGameOver) {
                            // 게임 종료
                            console.log(`[Server] Game over! Winner: ${turnResult.winner}`);
                            io.to(roomId).emit('gameEnded', turnResult.room, turnResult.winner || null, 'game_over');
                            return;
                        }
                        // 다음 턴 시작 - 최신 방 정보 다시 가져오기
                        const latestRoom = gameManager.getRoom(roomId);
                        if (!latestRoom) {
                            console.error(`[Server] Room ${roomId} not found after advanceTurn`);
                            return;
                        }
                        console.log(`[Server] Starting turn ${latestRoom.currentTurn} (year ${latestRoom.currentYear})`);
                        latestRoom.status = 'playing';
                        latestRoom.currentEvent = undefined;
                        latestRoom.currentVotes = {
                            goguryeo: { eventId: '', votes: {}, deadline: 0 },
                            baekje: { eventId: '', votes: {}, deadline: 0 },
                            silla: { eventId: '', votes: {}, deadline: 0 },
                        };
                        const deadline = Date.now() + latestRoom.settings.turnDuration * 1000;
                        latestRoom.turnDeadline = deadline;
                        io.to(roomId).emit('turnStarted', latestRoom.currentTurn, latestRoom.currentYear, deadline);
                        debouncedRoomUpdate(roomId, latestRoom);
                        // 다음 이벤트 발생
                        setTimeout(() => {
                            const currentRoom = gameManager.getRoom(roomId);
                            if (!currentRoom) {
                                console.error(`[Server] Room ${roomId} not found before event trigger`);
                                return;
                            }
                            const nations = ['goguryeo', 'baekje', 'silla'];
                            // AI 대전 모드: 모든 국가가 활성화되어 있음 (AI 플레이어 포함)
                            const activeNations = nations.filter(nation => currentRoom.teams[nation].players.some(pid => {
                                const player = currentRoom.players[pid];
                                return player && (player.isOnline || player.isAI);
                            }));
                            console.log(`[Server] Active nations for turn ${currentRoom.currentTurn}:`, activeNations);
                            if (activeNations.length === 0) {
                                console.error(`[Server] No active nations found for turn ${currentRoom.currentTurn}`);
                                return;
                            }
                            const event = selectEventForTurn(currentRoom.currentTurn, activeNations, roomId);
                            if (!event) {
                                console.error(`[Server] No event selected for turn ${currentRoom.currentTurn}`);
                                return;
                            }
                            console.log(`[Server] Triggering event for turn ${currentRoom.currentTurn}:`, {
                                eventTitle: event.title,
                                targetNation: event.targetNation,
                                roomId,
                                isAIBattle: isAIBattleMode(roomId)
                            });
                            const triggered = gameManager.triggerEvent(roomId, event);
                            if (!triggered) {
                                console.error(`[Server] Failed to trigger event for room ${roomId}`);
                                return;
                            }
                            const roomAfterTrigger = gameManager.getRoom(roomId);
                            if (!roomAfterTrigger) {
                                console.error(`[Server] Room ${roomId} not found after triggerEvent`);
                                return;
                            }
                            const eventDeadline = Date.now() + roomAfterTrigger.settings.voteDuration * 1000;
                            io.to(roomId).emit('eventTriggered', event, eventDeadline);
                            debouncedRoomUpdate(roomId, roomAfterTrigger);
                            console.log(`[Server] EventTriggered emitted to room ${roomId}, status: ${roomAfterTrigger.status}, turn: ${roomAfterTrigger.currentTurn}`);
                            // AI 플레이어 자동 투표
                            autoAIVote(roomId, event, 2000);
                        }, 3000);
                    }, 1500);
                }
            }
        }
    }
};
// ============================================
// AI 플레이어 자동 투표 헬퍼 함수
// ============================================
const autoAIVote = (roomId, event, delayMs = 2000) => {
    const room = gameManager.getRoom(roomId);
    if (!room || !room.currentEvent)
        return;
    // 대상 국가 결정
    const targetNations = event.targetNation === 'all'
        ? ['goguryeo', 'baekje', 'silla']
        : [event.targetNation];
    console.log(`[AutoAIVote] Starting auto-vote for event "${event.title}", target nations:`, targetNations);
    // 각 국가의 AI 플레이어들이 자동으로 투표 (랜덤 딜레이로 자연스럽게)
    targetNations.forEach(nation => {
        const teamPlayers = room.teams[nation].players;
        console.log(`[AutoAIVote] ${nation} team has ${teamPlayers.length} players:`, teamPlayers.map(pid => {
            const p = room.players[pid];
            return `${p?.name}(${p?.isAI ? 'AI' : 'Human'})`;
        }));
        teamPlayers.forEach(playerId => {
            const player = room.players[playerId];
            // AI 플레이어만 자동 투표
            if (player && player.isAI) {
                // 이미 투표했는지 확인
                if (!room.currentVotes[nation].votes[playerId]) {
                    // AI는 즉시 투표 (딜레이 최소화)
                    const randomDelay = Math.random() * 1000 + 500; // 500ms ~ 1500ms
                    console.log(`[AutoAIVote] Scheduling ${player.name} (${player.id}) to vote in ${Math.round(randomDelay)}ms for ${nation} team`);
                    setTimeout(() => {
                        const currentRoom = gameManager.getRoom(roomId);
                        if (!currentRoom || !currentRoom.currentEvent) {
                            console.log(`[AutoAIVote] Room or event not found for ${player.name}, aborting vote`);
                            return;
                        }
                        // 다시 한번 투표했는지 확인 (동시성 체크)
                        if (currentRoom.currentVotes[nation]?.votes[playerId]) {
                            console.log(`[AutoAIVote] ${player.name} already voted, skipping`);
                            return;
                        }
                        // AI가 최선의 선택지 선택
                        const bestChoice = selectBestChoice(event, nation, currentRoom.teams[nation].stats, player.aiDifficulty || 'normal');
                        console.log(`[AutoAIVote] ${player.name} selecting choice ${bestChoice.id} for ${nation}`);
                        const result = gameManager.submitVote(playerId, bestChoice.id);
                        if (result) {
                            io.to(roomId).emit('voteReceived', result.nation, playerId, bestChoice.id);
                            console.log(`[AIVote] ✅ ${player.name} (${player.aiDifficulty}) voted ${bestChoice.id} - ${bestChoice.text} for ${result.nation}`);
                            // AI 투표 후에도 투표 완료 확인
                            checkVoteCompletionAndAdvance(roomId, nation);
                        }
                        else {
                            console.error(`[AutoAIVote] ❌ Failed to submit vote for ${player.name} (${playerId}) in ${nation} team`);
                            console.error(`[AutoAIVote] Room exists: ${!!currentRoom}, Event exists: ${!!currentRoom.currentEvent}, Player team: ${player.team}`);
                        }
                    }, randomDelay);
                }
                else {
                    console.log(`[AutoAIVote] ${player.name} already has a vote, skipping`);
                }
            }
        });
    });
};
// REST API 엔드포인트
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});
app.get('/api/rooms', (req, res) => {
    const rooms = gameManager.getAllRooms();
    res.json(rooms.map(room => ({
        code: room.code,
        className: room.className,
        status: room.status,
        playerCount: Object.values(room.players).filter(p => p.isOnline).length,
    })));
});
// AI 조언자 API
app.post('/api/ai/advice', async (req, res) => {
    try {
        const { event, nation, stats } = req.body;
        if (!event || !nation || !stats) {
            return res.status(400).json({ error: '필수 파라미터가 누락되었습니다.' });
        }
        // AI 조언 요청
        const adviceResult = await getAIAdvice(event, nation, stats);
        if (adviceResult) {
            // isQuotaError가 true이면, 해당 메시지를 그대로 반환 (isFallback으로 처리)
            if (adviceResult.isQuotaError) {
                res.json({ advice: adviceResult.advice, isFallback: true });
            }
            else {
                res.json({ advice: adviceResult.advice });
            }
        }
        else {
            // 폴백 조언 (네트워크 오류 등)
            const fallbackAdvice = getFallbackAdvice(event, nation, stats);
            res.json({ advice: fallbackAdvice, isFallback: true });
        }
    }
    catch (error) {
        console.error('[API] AI advice error:', error);
        res.status(500).json({ error: 'AI 조언을 가져오는 중 오류가 발생했습니다.' });
    }
});
// 교사용 대시보드 API
app.get('/api/teacher/dashboard/:roomCode', (req, res) => {
    try {
        const { roomCode } = req.params;
        const room = gameManager.getRoomByCode(roomCode.toUpperCase());
        if (!room) {
            return res.status(404).json({ error: '방을 찾을 수 없습니다.' });
        }
        // 모든 채팅 메시지 (최근 500개)
        const chatMessages = (room.chatMessages || []).slice(-500);
        // 국가별 진행상황
        const nationProgress = ['goguryeo', 'baekje', 'silla'].map(nation => {
            const team = room.teams[nation];
            const eventHistory = team.eventHistory || [];
            // 맞힌/틀린 선택 계산
            const correctChoices = eventHistory.filter(h => h.isHistorical).length;
            const incorrectChoices = eventHistory.filter(h => !h.isHistorical).length;
            const totalChoices = eventHistory.length;
            return {
                nation,
                nationName: NATIONS[nation].name,
                stats: team.stats,
                players: team.players.map(playerId => {
                    const player = room.players[playerId];
                    return player ? {
                        id: player.id,
                        name: player.name,
                        role: player.role,
                        isReady: player.isReady,
                        isOnline: player.isOnline,
                    } : null;
                }).filter(p => p !== null),
                allies: team.allies,
                enemies: team.enemies,
                // 진행 이력
                progress: {
                    completedTurns: room.currentTurn, // 현재 턴 (진행한 턴 수)
                    totalTurns: room.settings.maxTurns,
                    correctChoices, // 맞힌 선택 (역사적 선택)
                    incorrectChoices, // 틀린 선택 (비역사적 선택)
                    totalChoices, // 총 선택 수
                    eventHistory: eventHistory.slice(-10), // 최근 10개 이벤트 이력
                },
            };
        });
        // 게임 진행 정보
        const gameInfo = {
            status: room.status,
            currentTurn: room.currentTurn,
            currentYear: room.currentYear,
            maxTurns: room.settings.maxTurns,
            currentEvent: room.currentEvent,
            turnDeadline: room.turnDeadline,
            startedAt: room.startedAt,
        };
        res.json({
            room: {
                code: room.code,
                className: room.className,
                hostName: room.hostName,
                createdAt: room.createdAt,
            },
            chatMessages,
            nationProgress,
            gameInfo,
            totalPlayers: Object.values(room.players).filter(p => p.isOnline).length,
        });
    }
    catch (error) {
        console.error('[API] Teacher dashboard error:', error);
        res.status(500).json({ error: '대시보드 정보를 가져오는 중 오류가 발생했습니다.' });
    }
});
// AI 플레이어 추가 API
app.post('/api/ai/add', express.json(), (req, res) => {
    try {
        const { roomCode, nation, difficulty } = req.body;
        if (!roomCode || !nation) {
            return res.status(400).json({ error: '방 코드와 국가를 입력해주세요.' });
        }
        const room = gameManager.getRoomByCode(roomCode.toUpperCase());
        if (!room) {
            return res.status(404).json({ error: '방을 찾을 수 없습니다.' });
        }
        // 멀티플레이 모드에서는 AI 플레이어 추가 불가
        const realPlayersWithTeam = Object.values(room.players).filter(p => !p.isAI && p.team !== null);
        if (realPlayersWithTeam.length > 1) {
            return res.status(400).json({ error: '멀티플레이 모드에서는 AI 플레이어를 추가할 수 없습니다.' });
        }
        if (room.status !== 'waiting') {
            return res.status(400).json({ error: '게임이 진행 중이면 AI 플레이어를 추가할 수 없습니다.' });
        }
        // 팀 인원 확인
        const teamPlayers = room.teams[nation].players;
        if (teamPlayers.length >= room.settings.maxPlayersPerTeam) {
            return res.status(400).json({ error: '해당 팀이 이미 가득 찼습니다.' });
        }
        // AI 플레이어 생성
        const aiPlayer = createAIPlayer(nation, (difficulty || 'normal'));
        // 방에 추가
        const player = gameManager.joinRoom(room.id, aiPlayer.id, '', aiPlayer.name);
        if (!player) {
            return res.status(500).json({ error: 'AI 플레이어 추가에 실패했습니다.' });
        }
        // AI 플레이어 속성 설정
        player.isAI = true;
        player.aiDifficulty = aiPlayer.aiDifficulty;
        // 팀 선택
        const teamSelected = gameManager.selectTeam(aiPlayer.id, nation);
        if (!teamSelected) {
            return res.status(500).json({ error: 'AI 플레이어를 팀에 추가하는데 실패했습니다.' });
        }
        // AI 플레이어 자동 준비 완료
        player.isReady = true;
        // toggleReady는 토글이므로 한 번 호출하면 준비 상태로 변경됨
        // 최신 방 상태 가져오기 (변경 사항 반영)
        const updatedRoom = gameManager.getRoomByCode(roomCode.toUpperCase());
        if (!updatedRoom) {
            return res.status(500).json({ error: '방을 찾을 수 없습니다.' });
        }
        // 방 정보 업데이트 (AI 플레이어 포함 - 싱글플레이 팀 모드에서 표시 필요)
        const cleanRoom = {
            ...updatedRoom,
            players: Object.fromEntries(Object.entries(updatedRoom.players).filter(([pid, p]) => p.isOnline &&
                !pid.startsWith('test-host-')
            // AI 플레이어(dummy-)는 포함 (싱글플레이 팀 모드에서 표시)
            )),
        };
        io.to(updatedRoom.id).emit('playerJoined', player);
        debouncedRoomUpdate(updatedRoom.id, cleanRoom);
        console.log(`[API] AI player added and roomUpdated scheduled: ${aiPlayer.name} to ${roomCode}`, {
            totalPlayers: Object.keys(cleanRoom.players).length,
            aiPlayers: Object.values(cleanRoom.players).filter((p) => p.isAI).length
        });
        console.log(`[API] AI player added: ${aiPlayer.name} to ${roomCode}`);
        res.json({
            success: true,
            player: {
                id: aiPlayer.id,
                name: aiPlayer.name,
                nation: nation,
                difficulty: aiPlayer.aiDifficulty,
            },
        });
    }
    catch (error) {
        console.error('[API] Add AI player error:', error);
        res.status(500).json({ error: 'AI 플레이어 추가 중 오류가 발생했습니다.' });
    }
});
// AI 플레이어 제거 API
app.post('/api/ai/remove', express.json(), (req, res) => {
    try {
        const { roomCode, playerId } = req.body;
        if (!roomCode || !playerId) {
            return res.status(400).json({ error: '방 코드와 플레이어 ID를 입력해주세요.' });
        }
        const room = gameManager.getRoomByCode(roomCode.toUpperCase());
        if (!room) {
            return res.status(404).json({ error: '방을 찾을 수 없습니다.' });
        }
        // 멀티플레이 모드에서는 AI 플레이어 제거 불가 (이미 AI가 없어야 함)
        const realPlayersWithTeam = Object.values(room.players).filter(p => !p.isAI && p.team !== null);
        if (realPlayersWithTeam.length > 1) {
            return res.status(400).json({ error: '멀티플레이 모드에서는 AI 플레이어를 제거할 수 없습니다.' });
        }
        if (room.status !== 'waiting') {
            return res.status(400).json({ error: '게임이 진행 중이면 AI 플레이어를 제거할 수 없습니다.' });
        }
        const player = room.players[playerId];
        if (!player || !player.isAI) {
            return res.status(400).json({ error: 'AI 플레이어가 아닙니다.' });
        }
        // AI 플레이어 제거
        const result = gameManager.leaveRoom(playerId);
        if (!result) {
            return res.status(500).json({ error: 'AI 플레이어 제거에 실패했습니다.' });
        }
        // 방 정보 업데이트
        const cleanRoom = {
            ...result.room,
            players: Object.fromEntries(Object.entries(result.room.players).filter(([pid, p]) => p.isOnline && !p.isAI)),
        };
        io.to(result.room.id).emit('playerLeft', player.id);
        debouncedRoomUpdate(result.room.id, cleanRoom);
        console.log(`[API] AI player removed: ${player.name} from ${roomCode}`);
        res.json({ success: true });
    }
    catch (error) {
        console.error('[API] Remove AI player error:', error);
        res.status(500).json({ error: 'AI 플레이어 제거 중 오류가 발생했습니다.' });
    }
});
// 방 리셋 API (테스트용)
app.post('/api/rooms/:roomCode/reset', express.json(), (req, res) => {
    try {
        const { roomCode } = req.params;
        if (!roomCode) {
            return res.status(400).json({ error: '방 코드를 입력해주세요.' });
        }
        const room = gameManager.getRoomByCode(roomCode.toUpperCase());
        if (!room) {
            return res.status(404).json({ error: '방을 찾을 수 없습니다.' });
        }
        // 모든 플레이어 제거
        const playerIds = Object.keys(room.players);
        for (const playerId of playerIds) {
            gameManager.leaveRoom(playerId);
        }
        // 방 상태 초기화
        room.status = 'waiting';
        room.currentTurn = 0;
        room.currentYear = 300;
        room.currentEvent = undefined;
        room.currentVotes = {
            goguryeo: { eventId: '', votes: {}, deadline: 0 },
            baekje: { eventId: '', votes: {}, deadline: 0 },
            silla: { eventId: '', votes: {}, deadline: 0 },
        };
        room.turnDeadline = undefined;
        // 팀 초기화는 gameManager에서 처리
        room.chatMessages = [];
        // Socket.io 방의 모든 클라이언트 연결 해제
        io.in(room.id).disconnectSockets();
        console.log(`[API] Room reset: ${roomCode}`);
        res.json({
            success: true,
            message: `방 ${roomCode}이(가) 초기화되었습니다.`,
            room: {
                code: room.code,
                status: room.status,
                playerCount: Object.keys(room.players).length
            }
        });
    }
    catch (error) {
        console.error('[API] Reset room error:', error);
        res.status(500).json({ error: '방 리셋 중 오류가 발생했습니다.' });
    }
});
// 전투 제안 저장 (battleId -> { attackerNation, defenderNation, roomId })
const pendingBattles = new Map();
// Socket.io 연결 처리
io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);
    // 방 생성
    socket.on('createRoom', ({ hostName, className, settings }) => {
        const playerId = uuidv4();
        const room = gameManager.createRoom(playerId, hostName, className, settings);
        // 방장을 방에 참가시킴
        const player = gameManager.joinRoom(room.id, playerId, socket.id, hostName);
        if (!player) {
            socket.emit('error', '방 생성에 실패했습니다.');
            return;
        }
        socket.data.roomId = room.id;
        socket.data.playerId = playerId;
        socket.join(room.id);
        console.log(`[Socket] Room created: ${room.code} by ${hostName}`);
        socket.emit('roomCreated', room);
    });
    // 방 참가
    socket.on('joinRoom', ({ code, playerName, playerId: providedPlayerId }) => {
        try {
            // 입력 검증
            if (!code || typeof code !== 'string' || code.trim().length === 0) {
                socket.emit('error', '방 코드를 입력해주세요.');
                return;
            }
            if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
                socket.emit('error', '플레이어 이름을 입력해주세요.');
                return;
            }
            // 방 코드 정규화 (대문자로 변환, 공백 제거)
            const normalizedCode = code.toUpperCase().trim();
            // 방 코드 형식 검증 (6자리 영문+숫자 또는 'MAIN')
            if (normalizedCode !== 'MAIN' && !/^[A-Z0-9]{6}$/.test(normalizedCode)) {
                socket.emit('error', '올바른 방 코드 형식이 아닙니다. (6자리 영문+숫자)');
                return;
            }
            let room = gameManager.getRoomByCode(normalizedCode);
            // MAIN 방이 없으면 자동 생성 (코드 없이 진행하는 멀티플레이 모드)
            if (!room && normalizedCode === 'MAIN') {
                console.log(`[Socket] MAIN room not found, creating automatically...`);
                room = gameManager.createRoom('system', '시스템', '기본 게임', {
                    maxPlayersPerTeam: 5, // 멀티플레이 모드: 각 국가당 최대 5명
                }, 'MAIN');
                console.log(`[Socket] MAIN room created automatically: ${room.code}`);
            }
            if (!room) {
                socket.emit('error', '방을 찾을 수 없습니다. 코드를 확인해주세요.');
                return;
            }
            // playerId가 제공되었고, 해당 플레이어가 이미 방에 있으면 재접속 처리
            let playerId = providedPlayerId || uuidv4();
            let isReconnect = false;
            if (providedPlayerId && room.players[providedPlayerId]) {
                // 재접속: 기존 플레이어 정보 유지
                playerId = providedPlayerId;
                isReconnect = true;
                console.log(`[Socket] Reconnecting player: ${playerName} (${playerId})`);
            }
            else if (providedPlayerId && !room.players[providedPlayerId]) {
                // playerId가 제공되었지만 방에 없으면 새로 생성
                playerId = uuidv4();
                console.log(`[Socket] Provided playerId not found in room, creating new: ${playerId}`);
            }
            else {
                // playerId가 없으면 새로 생성
                console.log(`[Socket] Creating new playerId: ${playerId}`);
            }
            // 게임이 진행 중일 때는 재접속만 허용
            if (room.status !== 'waiting' && !isReconnect) {
                socket.emit('error', '이미 게임이 진행 중입니다. 새로운 플레이어는 참가할 수 없습니다.');
                return;
            }
            const player = gameManager.joinRoom(room.id, playerId, socket.id, playerName.trim());
            if (!player) {
                socket.emit('error', '방 참가에 실패했습니다.');
                return;
            }
            // MAIN 방이고 hostId가 'system'이면 첫 번째 실제 플레이어를 방장으로 설정
            if (room.code === 'MAIN' && room.hostId === 'system') {
                room.hostId = playerId;
                room.hostName = playerName.trim();
                console.log(`[Socket] ${playerName} is now the host of MAIN room`);
            }
            socket.data.roomId = room.id;
            socket.data.playerId = playerId;
            socket.join(room.id);
            console.log(`[Socket] ${playerName} joined room: ${room.code}`);
            // 참가자에게 방 정보 전송 (AI 플레이어도 포함 - 싱글플레이 팀 모드 지원)
            const cleanRoom = {
                ...room,
                players: Object.fromEntries(Object.entries(room.players).filter(([pid, p]) => p.isOnline &&
                    !pid.startsWith('test-host-')
                // AI 플레이어(dummy-)는 포함 (싱글플레이 팀 모드에서 표시 필요)
                )),
            };
            console.log(`[Socket] Sending roomJoined to ${playerName}:`, {
                roomCode: room.code,
                playerId: playerId,
                hasTeam: !!player.team,
                playersCount: Object.keys(cleanRoom.players).length
            });
            socket.emit('roomJoined', cleanRoom, player);
            // 다른 참가자들에게 알림
            socket.to(room.id).emit('playerJoined', player);
            debouncedRoomUpdate(room.id, cleanRoom);
        }
        catch (error) {
            console.error('[Socket] joinRoom error:', error);
            socket.emit('error', '방 입장 중 오류가 발생했습니다.');
        }
    });
    // 방 나가기
    socket.on('leaveRoom', () => {
        const playerId = socket.data.playerId;
        if (!playerId)
            return;
        const result = gameManager.leaveRoom(playerId);
        if (result) {
            socket.leave(result.room.id);
            io.to(result.room.id).emit('playerLeft', playerId);
            io.to(result.room.id).emit('roomUpdated', result.room);
            console.log(`[Socket] ${result.player.name} left room: ${result.room.code}`);
        }
        socket.data.roomId = undefined;
        socket.data.playerId = undefined;
    });
    // 팀 선택
    socket.on('selectTeam', (nation) => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const success = gameManager.selectTeam(playerId, nation);
        if (!success) {
            socket.emit('error', '팀 선택에 실패했습니다. 인원이 가득 찼을 수 있습니다.');
            return;
        }
        const room = gameManager.getRoom(roomId);
        if (room) {
            const player = room.players[playerId];
            // 멀티플레이 모드 감지: 실제 플레이어가 2명 이상이면 멀티플레이 모드
            const realPlayersWithTeam = Object.values(room.players).filter(p => !p.isAI && p.team !== null);
            if (realPlayersWithTeam.length >= 2) {
                // 멀티플레이 모드: 모든 AI 플레이어 제거
                const aiPlayers = Object.values(room.players).filter(p => p.isAI);
                if (aiPlayers.length > 0) {
                    console.log(`[Server] Multiplayer mode detected: Removing ${aiPlayers.length} AI players from room ${room.code}`);
                    aiPlayers.forEach(aiPlayer => {
                        gameManager.leaveRoom(aiPlayer.id);
                        console.log(`[Server] Removed AI player: ${aiPlayer.name} (${aiPlayer.id})`);
                    });
                }
            }
            // 방 상태 다시 가져오기 (AI 제거 후)
            const updatedRoom = gameManager.getRoom(roomId);
            if (updatedRoom) {
                const cleanRoom = {
                    ...updatedRoom,
                    players: Object.fromEntries(Object.entries(updatedRoom.players).filter(([pid, p]) => p.isOnline &&
                        !pid.startsWith('test-host-'))),
                };
                io.to(roomId).emit('playerUpdated', updatedRoom.players[playerId]);
                debouncedRoomUpdate(roomId, cleanRoom);
            }
            else {
                io.to(roomId).emit('playerUpdated', player);
                io.to(roomId).emit('roomUpdated', room);
            }
        }
    });
    // 준비 토글
    socket.on('toggleReady', () => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        gameManager.toggleReady(playerId);
        const room = gameManager.getRoom(roomId);
        if (room) {
            const player = room.players[playerId];
            io.to(roomId).emit('playerUpdated', player);
            io.to(roomId).emit('roomUpdated', room);
        }
    });
    // 게임 시작
    socket.on('startGame', () => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const room = gameManager.getRoom(roomId);
        if (!room) {
            socket.emit('error', '방을 찾을 수 없습니다.');
            return;
        }
        // 호스트 체크 제거 - 모든 플레이어가 게임을 시작할 수 있음
        const { canStart, reason } = gameManager.canStartGame(roomId);
        if (!canStart) {
            socket.emit('error', reason || '게임을 시작할 수 없습니다.');
            return;
        }
        // 이미 게임이 시작되었거나 시작 중이면 중복 시작 방지
        if (room.status !== 'waiting') {
            console.log(`[Server] Game already started or starting, status: ${room.status}`);
            return;
        }
        // 게임 시작 (클라이언트에서 이미 카운트다운을 완료했으므로 바로 시작)
        const started = gameManager.startGame(roomId);
        if (started) {
            const updatedRoom = gameManager.getRoom(roomId);
            if (updatedRoom) {
                io.to(roomId).emit('gameStarted', updatedRoom);
                // 첫 턴 시작
                const deadline = Date.now() + updatedRoom.settings.turnDuration * 1000;
                io.to(roomId).emit('turnStarted', updatedRoom.currentTurn, updatedRoom.currentYear, deadline);
                // 3초 후 첫 이벤트 발생
                setTimeout(() => {
                    // 최신 방 정보 다시 가져오기
                    const currentRoom = gameManager.getRoom(roomId);
                    if (!currentRoom) {
                        console.error(`[Server] Room ${roomId} not found before event trigger`);
                        return;
                    }
                    // 게임에 참여 중인 국가 확인 (AI 대전 모드: 모든 국가 활성화)
                    const nations = ['goguryeo', 'baekje', 'silla'];
                    const activateNations = nations.filter(nation => currentRoom.teams[nation].players.some(pid => {
                        const player = currentRoom.players[pid];
                        return player && (player.isOnline || player.isAI);
                    }));
                    console.log(`[Server] Active nations for initial event:`, activateNations);
                    // 턴에 맞는 이벤트 선택
                    const event = selectEventForTurn(currentRoom.currentTurn, activateNations, roomId);
                    const isAIBattle = isAIBattleMode(roomId);
                    console.log(`[Server] Triggering event for turn ${currentRoom.currentTurn}:`, {
                        eventTitle: event.title,
                        targetNation: event.targetNation,
                        roomId,
                        isAIBattle
                    });
                    const triggered = gameManager.triggerEvent(roomId, event);
                    if (!triggered) {
                        console.error(`[Server] Failed to trigger event for room ${roomId}`);
                        return;
                    }
                    // 방 상태 업데이트 후 다시 가져오기
                    const roomAfterTrigger = gameManager.getRoom(roomId);
                    if (roomAfterTrigger) {
                        // 싱글플레이 AI 대전: 토론 단계 건너뛰고 바로 투표
                        if (roomAfterTrigger.isSinglePlayerAI) {
                            console.log('[Server] SinglePlayer AI mode: Skipping discussion, going straight to voting');
                            roomAfterTrigger.status = 'voting';
                            const voteDeadline = Date.now() + 999999000; // 긴 시간 (실제로는 즉시 처리됨)
                            io.to(roomId).emit('votingStarted', event, voteDeadline);
                            debouncedRoomUpdate(roomId, roomAfterTrigger);
                            // 싱글플레이 AI 대전에서도 AI 플레이어 자동 투표
                            autoAIVote(roomId, event, 2000);
                        }
                        else {
                            // 멀티플레이: 1단계 토론 시작 (discussionDuration)
                            roomAfterTrigger.status = 'discussion';
                            const discussionDeadline = Date.now() + roomAfterTrigger.settings.discussionDuration * 1000;
                            io.to(roomId).emit('discussionStarted', event, discussionDeadline);
                            debouncedRoomUpdate(roomId, roomAfterTrigger);
                            console.log(`[Server] Discussion started for room ${roomId}, duration: ${roomAfterTrigger.settings.discussionDuration}s`);
                            // 토론 종료 후 투표 시작
                            setTimeout(() => {
                                const roomForVoting = gameManager.getRoom(roomId);
                                if (!roomForVoting)
                                    return;
                                // 2단계: 투표 시작 (voteDuration)
                                roomForVoting.status = 'voting';
                                const voteDeadline = Date.now() + roomForVoting.settings.voteDuration * 1000;
                                io.to(roomId).emit('votingStarted', event, voteDeadline);
                                debouncedRoomUpdate(roomId, roomForVoting);
                                console.log(`[Server] Voting started for room ${roomId}, duration: ${roomForVoting.settings.voteDuration}s`);
                                // AI 플레이어 자동 투표 (멀티플레이에서도 AI가 있을 수 있음)
                                autoAIVote(roomId, event, 2000);
                            }, roomAfterTrigger.settings.discussionDuration * 1000);
                        }
                    }
                }, 3000);
            }
        }
    });
    // 투표 제출
    socket.on('submitVote', (choiceId) => {
        try {
            const playerId = socket.data.playerId;
            const roomId = socket.data.roomId;
            if (!playerId || !roomId) {
                socket.emit('error', '플레이어 정보가 없습니다.');
                return;
            }
            if (!choiceId || typeof choiceId !== 'string') {
                socket.emit('error', '유효하지 않은 선택지입니다.');
                return;
            }
            const result = gameManager.submitVote(playerId, choiceId);
            if (!result) {
                socket.emit('error', '투표 제출에 실패했습니다.');
                return;
            }
            const playerName = result.room?.players[playerId]?.name || 'Unknown';
            console.log(`[Vote] ${playerName} voted for choice ${choiceId} in ${result.nation} team`);
            io.to(roomId).emit('voteReceived', result.nation, playerId, choiceId);
            // 싱글플레이 AI 대전: 즉시 다음 이벤트로 진행
            if (result.room.isSinglePlayerAI) {
                console.log('[Vote] SinglePlayer AI mode: Processing vote immediately');
                setTimeout(() => {
                    checkVoteCompletionAndAdvance(roomId, result.nation);
                }, 1000); // 1초 후 처리 (사용자가 선택을 확인할 시간)
            }
            else {
                // 멀티플레이: 투표 완료 확인 및 턴 진행
                checkVoteCompletionAndAdvance(roomId, result.nation);
            }
        }
        catch (error) {
            console.error('[Socket] submitVote error:', error);
            socket.emit('error', '투표 처리 중 오류가 발생했습니다.');
        }
    });
    // 채팅
    socket.on('sendChat', ({ message, type, target }) => {
        console.log('[Socket] sendChat event received:', { message, type, target });
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        console.log('[Socket] sendChat player info:', { playerId, roomId });
        if (!playerId || !roomId) {
            console.log('[Socket] sendChat rejected: missing playerId or roomId');
            return;
        }
        // 메시지 유효성 검증 및 필터링
        const validation = validateChatMessage(message);
        if (!validation.isValid) {
            socket.emit('error', validation.error || '올바르지 않은 메시지입니다.');
            return;
        }
        // 필터링이 적용되었는지 확인 (원본 메시지와 다르면 필터링됨)
        const wasFiltered = validation.filteredMessage !== message.trim();
        if (wasFiltered) {
            const room = gameManager.getRoom(roomId);
            const player = room?.players[playerId];
            console.log(`[ChatFilter] Message filtered from ${player?.name} (${playerId}): "${message}" -> "${validation.filteredMessage}"`);
        }
        // 필터링된 메시지로 채팅 메시지 생성
        const filteredMessage = validation.filteredMessage;
        const chatMessage = gameManager.createChatMessage(roomId, playerId, filteredMessage, type, target);
        console.log('[Socket] createChatMessage result:', {
            chatMessage: chatMessage ? { id: chatMessage.id, type: chatMessage.type, team: chatMessage.team, message: chatMessage.message.substring(0, 20) } : null,
            type,
            playerId
        });
        if (chatMessage) {
            if (type === 'team') {
                // 팀 채팅: 같은 팀에게만 (메시지 보낸 사람 포함)
                const room = gameManager.getRoom(roomId);
                console.log('[Socket] Team chat - room:', room ? 'found' : 'not found', 'team:', chatMessage.team);
                if (room) {
                    const teamPlayers = room.teams[chatMessage.team].players;
                    console.log('[Socket] Team players:', teamPlayers.map(pid => {
                        const p = room.players[pid];
                        return `${p?.name} (${pid}, online: ${p?.isOnline}, socketId: ${p?.socketId})`;
                    }));
                    // 메시지를 보낸 플레이어에게도 전송 (자기 자신)
                    socket.emit('chatMessage', chatMessage);
                    console.log(`[Socket] Sent team chat to sender: ${socket.data.playerId}`);
                    // 나머지 팀 플레이어들에게 전송
                    for (const pid of teamPlayers) {
                        // 메시지 보낸 사람은 이미 전송했으므로 제외
                        if (pid === playerId)
                            continue;
                        const player = room.players[pid];
                        if (player && player.isOnline && player.socketId) {
                            // 개별 소켓에 직접 메시지 전송
                            const targetSocket = io.sockets.sockets.get(player.socketId);
                            if (targetSocket) {
                                console.log(`[Socket] Sending team chat to ${player.name} (${player.socketId})`);
                                targetSocket.emit('chatMessage', chatMessage);
                            }
                            else {
                                console.warn(`[Chat] Socket not found for player ${player.name} (${player.socketId})`);
                            }
                        }
                        else {
                            console.log(`[Socket] Skipping player ${player?.name} (${pid}): isOnline=${player?.isOnline}, socketId=${player?.socketId}`);
                        }
                    }
                }
            }
            else if (type === 'diplomacy' && target) {
                // 외교 채팅: 보낸 팀과 받는 팀에게만 (메시지 보낸 사람 포함)
                const room = gameManager.getRoom(roomId);
                if (room) {
                    // 메시지를 보낸 플레이어에게 먼저 전송
                    socket.emit('chatMessage', chatMessage);
                    console.log(`[Socket] Sent diplomacy chat to sender: ${socket.data.playerId}`);
                    const senderTeamPlayers = room.teams[chatMessage.team].players;
                    const targetTeamPlayers = room.teams[target].players;
                    for (const pid of [...senderTeamPlayers, ...targetTeamPlayers]) {
                        // 메시지 보낸 사람은 이미 전송했으므로 제외
                        if (pid === playerId)
                            continue;
                        const player = room.players[pid];
                        if (player && player.isOnline && player.socketId) {
                            // 개별 소켓에 직접 메시지 전송
                            const targetSocket = io.sockets.sockets.get(player.socketId);
                            if (targetSocket) {
                                console.log(`[Socket] Sending diplomacy chat to ${player.name}`);
                                targetSocket.emit('chatMessage', chatMessage);
                            }
                            else {
                                console.warn(`[Chat] Socket not found for player ${player.name} (${player.socketId})`);
                            }
                        }
                    }
                }
            }
            else {
                // 공개 채팅: 모든 플레이어에게 (방 전체)
                io.to(roomId).emit('chatMessage', chatMessage);
                console.log(`[Socket] Sent public chat to room: ${roomId}`);
            }
        }
    });
    // 동맹 제안
    socket.on('proposeAlliance', (targetNation) => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const room = gameManager.getRoom(roomId);
        if (!room)
            return;
        const player = room.players[playerId];
        if (!player || !player.team)
            return;
        const proposerNation = player.team;
        const success = gameManager.proposeAlliance(roomId, proposerNation, targetNation);
        if (success) {
            // 동맹 제안 메시지 생성
            const message = gameManager.createChatMessage(roomId, playerId, `${NATIONS[targetNation].name}에 동맹을 제안했습니다.`, 'diplomacy', targetNation);
            if (message) {
                // 양쪽 팀에게만 전송
                const proposerTeamPlayers = room.teams[proposerNation].players;
                const targetTeamPlayers = room.teams[targetNation].players;
                for (const pid of [...proposerTeamPlayers, ...targetTeamPlayers]) {
                    const p = room.players[pid];
                    if (p && p.isOnline && p.socketId) {
                        // 개별 소켓에 직접 메시지 전송
                        const targetSocket = io.sockets.sockets.get(p.socketId);
                        if (targetSocket) {
                            targetSocket.emit('chatMessage', message);
                        }
                        else {
                            console.warn(`[Chat] Socket not found for player ${p.name} (${p.socketId})`);
                        }
                    }
                }
            }
            io.to(roomId).emit('roomUpdated', room);
        }
    });
    // 동맹 수락
    socket.on('acceptAlliance', (proposerNation) => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const room = gameManager.getRoom(roomId);
        if (!room)
            return;
        const player = room.players[playerId];
        if (!player || !player.team)
            return;
        const acceptorNation = player.team;
        const success = gameManager.acceptAlliance(roomId, proposerNation, acceptorNation);
        if (success) {
            // 동맹 수락 메시지 생성
            const message = gameManager.createChatMessage(roomId, playerId, `${NATIONS[proposerNation].name}와 동맹을 맺었습니다!`, 'system');
            if (message) {
                io.to(roomId).emit('chatMessage', message);
            }
            io.to(roomId).emit('roomUpdated', room);
        }
    });
    // 동맹 파기
    socket.on('breakAlliance', (targetNation) => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const room = gameManager.getRoom(roomId);
        if (!room)
            return;
        const player = room.players[playerId];
        if (!player || !player.team)
            return;
        const nation = player.team;
        const success = gameManager.breakAlliance(roomId, nation, targetNation);
        if (success) {
            const message = gameManager.createChatMessage(roomId, playerId, `${NATIONS[targetNation].name}와의 동맹을 파기했습니다.`, 'system');
            if (message) {
                io.to(roomId).emit('chatMessage', message);
            }
            io.to(roomId).emit('roomUpdated', room);
        }
    });
    // 적대 선포
    socket.on('declareWar', (targetNation) => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const room = gameManager.getRoom(roomId);
        if (!room)
            return;
        const player = room.players[playerId];
        if (!player || !player.team)
            return;
        const declarerNation = player.team;
        const success = gameManager.declareWar(roomId, declarerNation, targetNation);
        if (success) {
            const message = gameManager.createChatMessage(roomId, playerId, `${NATIONS[targetNation].name}에 전쟁을 선포했습니다!`, 'system');
            if (message) {
                io.to(roomId).emit('chatMessage', message);
            }
            io.to(roomId).emit('roomUpdated', room);
        }
    });
    // 적대 해제
    socket.on('endWar', (targetNation) => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const room = gameManager.getRoom(roomId);
        if (!room)
            return;
        const player = room.players[playerId];
        if (!player || !player.team)
            return;
        const nation = player.team;
        const success = gameManager.endWar(roomId, nation, targetNation);
        if (success) {
            const message = gameManager.createChatMessage(roomId, playerId, `${NATIONS[targetNation].name}와의 전쟁을 종료했습니다.`, 'system');
            if (message) {
                io.to(roomId).emit('chatMessage', message);
            }
            io.to(roomId).emit('roomUpdated', room);
        }
    });
    // 전투 제안
    socket.on('initiateBattle', (defenderNation) => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const room = gameManager.getRoom(roomId);
        if (!room)
            return;
        const player = room.players[playerId];
        if (!player || !player.team)
            return;
        const attackerNation = player.team;
        const result = gameManager.initiateBattle(roomId, attackerNation, defenderNation);
        if (result) {
            const battleId = result.battleId;
            pendingBattles.set(battleId, { attackerNation, defenderNation, roomId });
            // 전투 제안 알림
            io.to(roomId).emit('battleProposed', attackerNation, defenderNation, battleId);
            const message = gameManager.createChatMessage(roomId, playerId, `${NATIONS[defenderNation].name}에 전투를 제안했습니다!`, 'system');
            if (message) {
                io.to(roomId).emit('chatMessage', message);
            }
        }
    });
    // 전투 수락
    socket.on('acceptBattle', (battleId) => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const battle = pendingBattles.get(battleId);
        if (!battle || battle.roomId !== roomId) {
            socket.emit('error', '전투 제안을 찾을 수 없습니다.');
            return;
        }
        const room = gameManager.getRoom(roomId);
        if (!room)
            return;
        const player = room.players[playerId];
        if (!player || !player.team)
            return;
        // 방어자만 수락 가능
        if (player.team !== battle.defenderNation) {
            socket.emit('error', '방어자만 전투를 수락할 수 있습니다.');
            return;
        }
        // 전투 결과 계산
        const battleResult = gameManager.calculateBattleResult(roomId, battle.attackerNation, battle.defenderNation);
        if (battleResult) {
            // 전투 결과 적용
            gameManager.applyBattleResult(roomId, battle.attackerNation, battle.defenderNation, battleResult);
            // 전투 결과 전송
            io.to(roomId).emit('battleResult', {
                winner: battleResult.winner,
                attackerNation: battle.attackerNation,
                defenderNation: battle.defenderNation,
                attackerLosses: battleResult.attackerLosses,
                defenderLosses: battleResult.defenderLosses,
                allySupport: battleResult.allySupport,
            });
            // 시스템 메시지
            const message = gameManager.createChatMessage(roomId, playerId, `${NATIONS[battleResult.winner].name}가 전투에서 승리했습니다!`, 'system');
            if (message) {
                io.to(roomId).emit('chatMessage', message);
            }
            // 방 상태 업데이트
            const updatedRoom = gameManager.getRoom(roomId);
            if (updatedRoom) {
                io.to(roomId).emit('roomUpdated', updatedRoom);
                // 게임 종료 체크
                const gameOver = gameManager.checkGameOver(updatedRoom);
                if (gameOver.isOver) {
                    updatedRoom.status = 'finished';
                    io.to(roomId).emit('gameEnded', updatedRoom, gameOver.winner || null, gameOver.reason || 'game_over');
                }
            }
            // 전투 제안 제거
            pendingBattles.delete(battleId);
        }
    });
    // 전투 거절
    socket.on('rejectBattle', (battleId) => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const battle = pendingBattles.get(battleId);
        if (!battle || battle.roomId !== roomId)
            return;
        const room = gameManager.getRoom(roomId);
        if (!room)
            return;
        const player = room.players[playerId];
        if (!player || !player.team)
            return;
        // 방어자만 거절 가능
        if (player.team !== battle.defenderNation)
            return;
        // 전투 제안 제거
        pendingBattles.delete(battleId);
        const message = gameManager.createChatMessage(roomId, playerId, `${NATIONS[battle.attackerNation].name}의 전투 제안을 거절했습니다.`, 'system');
        if (message) {
            io.to(roomId).emit('chatMessage', message);
        }
    });
    // 플레이어 강퇴
    socket.on('kickPlayer', (targetPlayerId) => {
        const playerId = socket.data.playerId;
        const roomId = socket.data.roomId;
        if (!playerId || !roomId)
            return;
        const room = gameManager.getRoom(roomId);
        if (!room || room.hostId !== playerId) {
            socket.emit('error', '방장만 플레이어를 내보낼 수 있습니다.');
            return;
        }
        const targetPlayer = room.players[targetPlayerId];
        if (targetPlayer) {
            // 대상 플레이어의 소켓 찾기
            const targetSocket = io.sockets.sockets.get(targetPlayer.socketId);
            if (targetSocket) {
                targetSocket.emit('error', '방장에 의해 퇴장되었습니다.');
                targetSocket.leave(roomId);
                targetSocket.data.roomId = undefined;
                targetSocket.data.playerId = undefined;
            }
            gameManager.leaveRoom(targetPlayerId);
            io.to(roomId).emit('playerLeft', targetPlayerId);
            io.to(roomId).emit('roomUpdated', room);
        }
    });
    // 연결 해제
    socket.on('disconnect', () => {
        const playerId = socket.data.playerId;
        if (playerId) {
            const result = gameManager.leaveRoom(playerId);
            if (result) {
                io.to(result.room.id).emit('playerLeft', playerId);
                io.to(result.room.id).emit('roomUpdated', result.room);
            }
        }
        console.log(`[Socket] Disconnected: ${socket.id}`);
    });
});
// 서버 시작
httpServer.listen(PORT, () => {
    // 단일 게임 모드: 기본 방 'MAIN' 자동 생성
    try {
        const existingRoom = gameManager.getRoomByCode('MAIN');
        if (!existingRoom) {
            const mainRoom = gameManager.createRoom('system', '시스템', '기본 게임', undefined, 'MAIN');
            console.log(`[Server] 기본 방 생성 완료: ${mainRoom.code}`);
            // AI 대전 모드: 서버 시작 시에는 AI 플레이어를 추가하지 않음
            // 사용자가 국가를 선택할 때 다른 두 국가에 자동으로 추가됨
        }
        else {
            console.log('[Server] 기본 방이 이미 존재합니다.');
        }
    }
    catch (error) {
        console.error('[Server] 기본 방 생성 실패:', error);
    }
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   역사전쟁:삼국시대 - 멀티플레이 서버                      ║
║                                                            ║
║   🚀 Server running on http://localhost:${PORT}              ║
║   🔗 Client URL: ${CLIENT_URL}                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
    // Gemini API 연결 테스트
    testGeminiAPI().then(success => {
        if (!success) {
            console.warn('[Server] ⚠️  Gemini API 테스트 실패. AI 조언자 기능이 제한될 수 있습니다.');
        }
    });
});
//# sourceMappingURL=index.js.map