import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Crown,
  MessageCircle,
  Send,
  Users,
  Play,
  Check,
  Clock,
  ArrowLeft,
  Plus,
  Minus,
} from 'lucide-react';
import { Button, Card } from '../components/common';
import { NATIONS } from '../data/nations';
import { Nation, Player } from '../types';
import { useGameStore, initializeSocketListeners, getTeamPlayers, isHost, allPlayersReady, allTeamsHavePlayers } from '../stores/gameStore';
import { isSinglePlayerAIMode } from '../utils/gameMode';

// 국가별 대표 이미지 경로
const nationImages: Record<Nation, string> = {
  goguryeo: '/images/goguryeo.svg',
  baekje: '/images/baekje.svg',
  silla: '/images/silla.svg',
};

export const LobbyPage = () => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [inputMessage, setInputMessage] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // GameStore에서 상태 가져오기
  const {
    room,
    playerId,
    playerName,
    myNation,
    messages,
    isConnected,
    error,
    toggleReady,
    startGame,
    sendChat,
    leaveRoom,
  } = useGameStore();

  // Socket 리스너 초기화
  useEffect(() => {
    initializeSocketListeners();
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      // 리스너는 유지 (다른 페이지에서도 사용)
    };
  }, []);

  // 채팅 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    const container = document.getElementById('chat-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // roomCode로 방 입장 확인 및 처리
  useEffect(() => {
    if (!roomCode) {
      navigate('/');
      return;
    }

    // 이미 방에 입장되어 있고 roomCode가 일치하면 정상
    if (room && room.code === roomCode) {
      console.log('[Lobby] Already in room:', room.code);
      return;
    }

    // 소켓이 연결되지 않았으면 대기
    if (!isConnected) {
      console.log('[Lobby] Waiting for socket connection...');
      return;
    }

    // 방이 없거나 roomCode가 다르면 다시 입장 시도
    const currentRoom = useGameStore.getState().room;
    const currentPlayerName = useGameStore.getState().playerName || localStorage.getItem('pendingPlayerName') || 'Player';
    
    if (!currentRoom || currentRoom.code !== roomCode) {
      console.log('[Lobby] Room not found or code mismatch, attempting to join...', {
        currentRoomCode: currentRoom?.code,
        targetRoomCode: roomCode,
        playerName: currentPlayerName
      });
      
      // 방 입장 시도
      const { joinRoom } = useGameStore.getState();
      joinRoom(roomCode, currentPlayerName);
      
      // 입장 확인 (최대 5초 대기)
      let attempts = 0;
      const maxAttempts = 25; // 5초 (200ms * 25)
      const checkInterval = setInterval(() => {
        attempts++;
        const updatedRoom = useGameStore.getState().room;
        
        if (updatedRoom && updatedRoom.code === roomCode) {
          console.log('[Lobby] Successfully joined room:', updatedRoom.code);
          clearInterval(checkInterval);
        } else if (attempts >= maxAttempts) {
          console.error('[Lobby] Failed to join room after timeout');
          clearInterval(checkInterval);
          // 에러 표시는 gameStore에서 처리됨
        }
      }, 200);
      
      return () => clearInterval(checkInterval);
    }
  }, [roomCode, room, isConnected, navigate]);

  // 에러 표시 (페이지 이동 없이 에러만 표시)
  useEffect(() => {
    if (error) {
      console.error('[Lobby] Error:', error);
      // 에러는 사용자에게 표시되지만 자동으로 페이지 이동하지 않음
    }
  }, [error]);

  // 게임 시작 시 GamePage로 이동 (room 상태가 확실히 업데이트된 후)
  useEffect(() => {
    if (room?.status === 'countdown' || room?.status === 'playing') {
      // 약간의 지연을 두어 room 상태가 확실히 업데이트되도록 함
      const timer = setTimeout(() => {
        console.log('[Lobby] Navigating to game page, room status:', room.status);
        navigate(`/game/${roomCode}/play`);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [room?.status, roomCode, navigate]);

  // 방 입장 실패 시 처리
  useEffect(() => {
    if (error && roomCode && !room) {
      // 에러가 있고 방이 없으면 3초 후 랜딩 페이지로 이동
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, roomCode, room, navigate]);
  
  // roomCode가 없으면 랜딩 페이지로 이동
  useEffect(() => {
    if (!roomCode) {
      navigate('/');
    }
  }, [roomCode, navigate]);

  // 현재 플레이어 정보
  const currentPlayer: Player | null = playerId && room ? room.players[playerId] : null;
  const host = isHost();

  // 게임 모드 확인
  const isSingleAI = isSinglePlayerAIMode();

  // 팀별 플레이어 가져오기 (AI 플레이어 포함)
  const getPlayersByNation = (nation: Nation): Player[] => {
    if (!room) return [];
    // AI 플레이어 포함 (test-host만 제외)
    return getTeamPlayers(nation).filter(p =>
      p.isOnline &&
      !p.id.startsWith('test-host-')
    );
  };

  // ============================================
  // AI 플레이어 추가/제거 (싱글플레이 AI 모드에서만 사용)
  // ============================================
  const handleAddAI = async (nation: Nation) => {
    // 멀티플레이 모드에서는 AI 추가 불가
    if (!isSingleAI) {
      console.warn('[Lobby] Cannot add AI in multiplayer mode');
      return;
    }
    
    if (!room) return;

    const teamPlayers = getPlayersByNation(nation);
    if (teamPlayers.length >= room.settings.maxPlayersPerTeam) {
      console.log(`[Lobby] Cannot add AI to ${nation}: team is full`);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/ai/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: room.code,
          nation: nation,
          difficulty: 'normal',
        }),
      });

      if (!response.ok) {
        console.error(`[Lobby] Failed to add AI to ${nation}`);
      }
    } catch (err) {
      console.error(`[Lobby] Error adding AI to ${nation}:`, err);
    }
  };

  const handleRemoveAI = async (nation: Nation) => {
    // 멀티플레이 모드에서는 AI 제거 불가
    if (!isSingleAI) {
      console.warn('[Lobby] Cannot remove AI in multiplayer mode');
      return;
    }
    
    if (!room) return;

    const teamPlayers = getPlayersByNation(nation);
    // AI 플레이어 중 첫 번째를 제거
    const aiPlayer = teamPlayers.find(p => 'isAI' in p && p.isAI);

    if (!aiPlayer) {
      console.log(`[Lobby] No AI player to remove from ${nation}`);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/ai/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: room.code,
          playerId: aiPlayer.id,
        }),
      });

      if (!response.ok) {
        console.error(`[Lobby] Failed to remove AI from ${nation}`);
      }
    } catch (err) {
      console.error(`[Lobby] Error removing AI from ${nation}:`, err);
    }
  };

  // AI 플레이어 포함한 전체 플레이어 카운트
  const totalPlayers = room ? Object.values(room.players).filter(p =>
    p.isOnline &&
    p.team &&
    !p.id.startsWith('test-host-')
  ).length : 0;
  // AI 플레이어는 항상 준비 완료로 간주
  const readyPlayers = room ? Object.values(room.players).filter(p =>
    p.isOnline &&
    p.team &&
    (p.isReady || p.isAI) &&  // AI 플레이어는 항상 준비 완료
    !p.id.startsWith('test-host-')
  ).length : 0;
  // 게임 시작 권한 확인: 호스트만 시작 가능
  const canStart = allPlayersReady() && allTeamsHavePlayers() && host;
  const allReadyForCountdown = allPlayersReady() && allTeamsHavePlayers();
  
  // 모든 플레이어 준비 완료 시 자동 카운트다운 시작 (모든 플레이어에게 표시)
  useEffect(() => {
    // 카운트다운이 진행 중이거나 이미 끝났으면 더 이상 처리하지 않음
    if (countdownTimerRef.current !== null || countdownFinished) {
      return;
    }

    const shouldStartCountdown = allReadyForCountdown && room?.status === 'waiting';
    
    // 카운트다운이 아직 시작되지 않았고, 조건이 만족되면 시작
    if (shouldStartCountdown && !countdownStarted && countdown === null) {
      console.log('[Lobby] 모든 플레이어 준비 완료! 카운트다운 시작');
      setCountdownStarted(true);
      setCountdown(5);
      setCountdownFinished(true); // 카운트다운 시작 시 플래그 설정하여 중복 시작 방지
      
      // 카운트다운 진행
      let currentCount = 5;
      countdownTimerRef.current = setInterval(() => {
        currentCount -= 1;
        setCountdown(currentCount);
        
        console.log(`[Lobby] 카운트다운: ${currentCount}`);
        
        if (currentCount <= 0) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          
          // 카운트다운 종료 시 모든 플레이어가 자동으로 게임 시작 (호스트 체크 없음)
          setTimeout(() => {
            const currentRoom = useGameStore.getState().room;
            
            console.log('[Lobby] 카운트다운 종료!', {
              roomStatus: currentRoom?.status,
              allReady: allPlayersReady(),
              allTeams: allTeamsHavePlayers(),
            });
            
            // 모든 플레이어가 준비 완료되고 모든 팀에 플레이어가 있으면 게임 시작
            if (currentRoom && allPlayersReady() && allTeamsHavePlayers()) {
              console.log('[Lobby] 게임 시작 실행');
              startGame();
            }
            
            setCountdownStarted(false);
            setCountdown(null);
            // countdownFinished는 이미 true로 설정되어 있으므로 변경하지 않음
          }, 100);
        }
      }, 1000);
    } 
    // 조건이 만족되지 않으면 카운트다운 취소
    else if (!allReadyForCountdown && countdownStarted && countdownTimerRef.current === null && !countdownFinished) {
      console.log('[Lobby] 카운트다운 취소됨');
      setCountdownStarted(false);
      setCountdown(null);
      setCountdownFinished(false); // 취소 시에는 플래그 리셋
    }

    return () => {
      // 컴포넌트 언마운트 시에만 정리
    };
  }, [allReadyForCountdown, countdownStarted, countdown, countdownFinished, room?.status, startGame]);
  
  // 디버깅: 게임 시작 버튼 표시 조건 확인
  useEffect(() => {
    if (room) {
      console.log('[Lobby] Game start conditions:', {
        host,
        canStart,
        allPlayersReady: allPlayersReady(),
        allTeamsHavePlayers: allTeamsHavePlayers(),
        totalPlayers,
        readyPlayers,
        roomHostId: room.hostId,
        playerId,
        countdown,
      });
    }
  }, [room, host, canStart, totalPlayers, readyPlayers, playerId, countdown]);

  const handleSendMessage = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!inputMessage.trim() || !room) return;
    sendChat(inputMessage, 'public');
    setInputMessage('');
  };

  const handleStartGame = () => {
    if (canStart) {
      // 게임 시작 버튼을 누르면 카운트다운 시작
      if (countdown === null && !countdownStarted) {
        console.log('[Lobby] 게임 시작 버튼 클릭 - 카운트다운 시작');
        setCountdownStarted(true);
        setCountdown(5);
        setCountdownFinished(true);
        
        // 카운트다운 진행
        let currentCount = 5;
        countdownTimerRef.current = setInterval(() => {
          currentCount -= 1;
          setCountdown(currentCount);
          
          console.log(`[Lobby] 카운트다운: ${currentCount}`);
          
          if (currentCount <= 0) {
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            
            // 카운트다운 종료 시 게임 시작
            setTimeout(() => {
              const currentRoom = useGameStore.getState().room;
              
              console.log('[Lobby] 카운트다운 종료! 게임 시작');
              
              if (currentRoom && allPlayersReady() && allTeamsHavePlayers()) {
                console.log('[Lobby] 게임 시작 실행');
                startGame();
              }
              
              setCountdownStarted(false);
              setCountdown(null);
            }, 100);
          }
        }, 1000);
      }
    }
  };

  const handleToggleReady = () => {
    if (myNation) {
      toggleReady();
    }
  };

  const getNationColor = (nation: Nation) => {
    const colors = {
      goguryeo: 'text-red-400',
      baekje: 'text-blue-400',
      silla: 'text-orange-400',
    };
    return colors[nation];
  };

  const getNationBg = (nation: Nation) => {
    const colors = {
      goguryeo: 'bg-red-500/20 border-red-500/30',
      baekje: 'bg-blue-500/20 border-blue-500/30',
      silla: 'bg-orange-500/20 border-orange-500/30',
    };
    return colors[nation];
  };

  // 디버깅 정보
  useEffect(() => {
    console.log('[Lobby] State:', {
      roomCode,
      room: room ? 'exists' : 'null',
      isConnected,
      playerId,
      playerName,
      pendingPlayerName: localStorage.getItem('pendingPlayerName'),
      pendingNation: localStorage.getItem('pendingNation'),
      error,
    });
  }, [roomCode, room, isConnected, playerId, playerName, error]);

  if (!room) {
    return (
      <div className="min-h-screen baram-bg hanji-texture flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-100 text-lg mb-2">방 정보를 불러오는 중...</p>
          {!isConnected && (
            <p className="text-amber-200/50 text-sm">서버에 연결 중...</p>
          )}
          {isConnected && !room && (
            <p className="text-amber-200/50 text-sm">방 참가 중...</p>
          )}
          {error && (
            <p className="text-red-400 text-sm mt-2">에러: {error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen baram-bg hanji-texture">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                leaveRoom();
                navigate('/');
              }}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              돌아가기
            </Button>
            <div>
              <h1 className="text-xl font-bold text-amber-100">대기실</h1>
              <p className="text-amber-200/50 text-sm">방 코드: {room.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-amber-200/70">
              <Users className="w-4 h-4" />
              <span>{totalPlayers}명 참가</span>
            </div>
            <Button variant="ghost" size="sm" onClick={leaveRoom}>
              나가기
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-amber-100 mb-4">팀 구성</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(NATIONS) as Nation[]).map((nationId) => {
                const nation = NATIONS[nationId];
                const players = getPlayersByNation(nationId);

                return (
                  <Card
                    key={nationId}
                    variant="glass"
                    padding="none"
                    className={`border ${getNationBg(nationId)}`}
                  >
                    {/* Team Header */}
                    <div
                      className={`p-4 border-b border-slate-700/50 ${getNationBg(nationId)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Nation Image */}
                          <img 
                            src={nationImages[nationId]} 
                            alt={nation.name}
                            className="w-12 h-12 object-contain drop-shadow-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div>
                            <h3 className={`font-bold ${getNationColor(nationId)}`}>
                              {nation.name}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              {players.length}/{room?.settings.maxPlayersPerTeam || 5}명
                            </p>
                          </div>
                        </div>

                        {/* AI 추가/제거 버튼 (싱글플레이 AI 모드에서만 표시) */}
                        {isSingleAI && (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveAI(nationId);
                              }}
                              disabled={!players.some(p => p.isAI)}
                              className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="AI 플레이어 제거"
                            >
                              <Minus className="w-4 h-4 text-amber-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddAI(nationId);
                              }}
                              disabled={players.length >= (room?.settings.maxPlayersPerTeam || 5)}
                              className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="AI 플레이어 추가"
                            >
                              <Plus className="w-4 h-4 text-amber-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Players List */}
                    <div className="p-3 space-y-2">
                      {players.map((player) => (
                        <motion.div
                          key={player.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50"
                        >
                          {/* Avatar */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                              nationId === 'goguryeo'
                                ? 'bg-red-600'
                                : nationId === 'baekje'
                                ? 'bg-blue-600'
                                : 'bg-orange-500'
                            }`}
                          >
                            {player.name[0]}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-100 text-sm font-medium truncate">
                                {player.name}
                              </span>
                              {player.role === 'king' && (
                                <Crown className="w-3 h-3 text-amber-400" />
                              )}
                              {'isAI' in player && player.isAI && (
                                <span className="text-xs text-blue-400">(AI)</span>
                              )}
                              {player.id === playerId && (
                                <span className="text-xs text-amber-400">(나)</span>
                              )}
                            </div>
                          </div>

                          {/* Ready Status */}
                          {player.isReady ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-500" />
                          )}
                        </motion.div>
                      ))}

                      {/* 빈 자리 표시 */}
                      {players.length < (room?.settings.maxPlayersPerTeam || 5) && (
                        <div className="text-center py-2 text-slate-500 text-xs">
                          {room?.settings.maxPlayersPerTeam || 5 - players.length}자리 남음
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <Card variant="glass" padding="none" className="h-[500px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700/50 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-slate-400" />
                <h3 className="font-medium text-amber-100">채팅</h3>
              </div>

              {/* Messages */}
              <div 
                id="chat-messages-container"
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {messages.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center">메시지가 없습니다.</p>
                ) : (
                  messages.map((msg) => {
                    const senderNation = room.players[msg.senderId]?.team;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 ${
                            senderNation === 'goguryeo'
                              ? 'bg-red-600'
                              : senderNation === 'baekje'
                              ? 'bg-blue-600'
                              : 'bg-orange-500'
                          }`}
                        >
                          {msg.senderName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span
                              className={`text-sm font-medium ${senderNation ? getNationColor(senderNation) : 'text-slate-400'}`}
                            >
                              {msg.senderName}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-amber-100/80 text-sm break-words">
                            {msg.message}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-slate-700/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="메시지 입력..."
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => handleSendMessage(e)}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-lg scroll-card oriental-border">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-100">
                {readyPlayers}/{totalPlayers}
              </p>
              <p className="text-amber-200/50 text-sm">준비 완료</p>
            </div>
            <div className="w-32 h-2 bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${totalPlayers > 0 ? (readyPlayers / totalPlayers) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            {!myNation ? (
              <Button
                variant="secondary"
                onClick={() => navigate(`/select`)}
              >
                팀 선택하기
              </Button>
            ) : (
              <Button
                variant={currentPlayer?.isReady ? 'ghost' : 'secondary'}
                onClick={handleToggleReady}
                disabled={countdown !== null}
              >
                {currentPlayer?.isReady ? '준비 취소' : '준비 완료'}
              </Button>
            )}

            {host && !countdown && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartGame}
                disabled={!canStart}
                leftIcon={<Play className="w-5 h-5" />}
              >
                게임 시작
              </Button>
            )}
          </div>
        </div>

        {/* 카운트다운 오버레이 */}
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.p
                className="text-9xl font-black gold-text drop-shadow-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
              >
                {countdown}
              </motion.p>
              <p className="text-2xl text-amber-200 mt-4">게임 시작 중...</p>
            </motion.div>
          </motion.div>
        )}

        {/* 시작 메시지 */}
        {countdown === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.p
              className="text-7xl font-black gold-text drop-shadow-2xl"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.3,
                repeat: 3,
              }}
            >
              시작!
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
