import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  MessageCircle,
  Settings,
  Swords,
  Handshake,
  BookOpen,
  Building2,
  ChevronRight,
  Trophy,
  Crown,
  FlaskConical,
  Landmark,
} from 'lucide-react';
import { Button, Card, Countdown } from '../components/common';
import { GameMap } from '../components/game/GameMap';
import { StatsPanel } from '../components/game/StatsPanel';
import { EventModal } from '../components/game/EventModal';
import { DiplomacyPanel } from '../components/game/DiplomacyPanel';
import { ChatPanel } from '../components/game/ChatPanel';
import { BattleModal } from '../components/game/BattleModal';
import { VictoryPanel } from '../components/game/VictoryPanel';
import { HeroPanel } from '../components/game/HeroPanel';
import { TechTreePanel } from '../components/game/TechTreePanel';
import { HeritagePanel } from '../components/game/HeritagePanel';
import { NATIONS } from '../data/nations';
import { getHeroById } from '../data/heroes';
import { getTechById } from '../data/techTree';
import { getHeritageById } from '../data/culturalHeritage';
import { Nation, NationStats, Player } from '../types';
import { useGameStore, initializeSocketListeners, getMyTeamPlayers } from '../stores/gameStore';
import * as socket from '../socket';
import { isSinglePlayerAIMode } from '../utils/gameMode';

export const GamePage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);

  // 디버깅: 게임 모드 확인
  const isSinglePlayerMode = isSinglePlayerAIMode();
  console.log('[GamePage] Game mode check:', {
    isSinglePlayerMode,
    singlePlayerRoomCode: localStorage.getItem('singlePlayerRoomCode'),
    currentRoomCode: roomCode
  });
  const [showDiplomacy, setShowDiplomacy] = useState(false);
  const [showVictoryPanel, setShowVictoryPanel] = useState(false);
  const [showHeroPanel, setShowHeroPanel] = useState(false);
  const [showTechTree, setShowTechTree] = useState(false);
  const [activeHero, setActiveHero] = useState<{ heroId: string; turnsRemaining: number } | undefined>();
  const [completedTechs, _setCompletedTechs] = useState<string[]>([]);
  const [researchingTech, setResearchingTech] = useState<{ techId: string; turnsRemaining: number } | undefined>();
  const [showHeritage, setShowHeritage] = useState(false);
  const [builtHeritages, _setBuiltHeritages] = useState<string[]>([]);
  const [buildingHeritage, setBuildingHeritage] = useState<{ heritageId: string; turnsRemaining: number } | undefined>();
  const [pendingBattle, setPendingBattle] = useState<{
    attackerNation: Nation;
    defenderNation: Nation;
    battleId: string;
  } | null>(null);
  
  // GameStore에서 상태 가져오기
  const {
    room,
    playerId: _playerId,
    playerName,
    myNation,
    countdown,
    currentEvent,
    eventDeadline,
    currentVotes,
    myVote,
    messages,
    isConnected,
    submitVote,
    sendChat,
    proposeAlliance,
    acceptAlliance,
    breakAlliance,
    declareWar,
    endWar,
    initiateBattle,
    acceptBattle,
    rejectBattle,
  } = useGameStore();

  // Socket 리스너 초기화 및 컴포넌트 언마운트 시 방 나가기
  useEffect(() => {
    initializeSocketListeners();
    const sock = socket.connectSocket();

    // 전투 제안 수신
    sock.on('battleProposed', (attackerNation, defenderNation, battleId) => {
      setPendingBattle({ attackerNation, defenderNation, battleId });
    });

    // 전투 결과 수신
    sock.on('battleResult', (result) => {
      // 전투 결과는 나중에 결과 모달로 표시 가능
      console.log('Battle result:', result);
      setPendingBattle(null);
    });

    // 게임 종료 수신
    sock.on('gameEnded', (_room, winner, reason) => {
      console.log('Game ended:', winner, reason);
      // ResultPage로 이동
      navigate(`/game/${roomCode}/result`);
    });

    return () => {
      // 컴포넌트 언마운트 시 방 나가기 (뒤로가기 등)
      console.log('[GamePage] Component unmounting, leaving room...');
      useGameStore.getState().leaveRoom();
      sock.off('battleProposed');
      sock.off('battleResult');
      sock.off('gameEnded');
    };
  }, [roomCode, navigate]);
  
  // room 상태가 없으면 서버에서 다시 요청
  useEffect(() => {
    if (!room && roomCode && isConnected) {
      console.log('[GamePage] Room not found, attempting to rejoin...');

      // localStorage에서 playerName 가져오기 (더 안전한 방법)
      const playerName =
        localStorage.getItem('pendingPlayerName') ||
        localStorage.getItem('playerName') ||
        sessionStorage.getItem('playerName') ||
        `플레이어${Math.floor(Math.random() * 1000)}`;

      // 플레이어 이름 저장
      if (!localStorage.getItem('pendingPlayerName')) {
        localStorage.setItem('pendingPlayerName', playerName);
      }

      console.log('[GamePage] Rejoining room with player name:', playerName);
      useGameStore.getState().joinRoom(roomCode, playerName);

      // 타임아웃 설정 (10초 후에도 room이 없으면 에러)
      const timeout = setTimeout(() => {
        if (!useGameStore.getState().room) {
          console.error('[GamePage] Failed to join room after timeout');
          alert('방에 입장할 수 없습니다. 메인 화면으로 돌아갑니다.');
          navigate('/');
        }
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [room, roomCode, isConnected, navigate]);

  // 게임이 시작되지 않았으면 로비로 이동
  useEffect(() => {
    if (room && room.status === 'waiting') {
      navigate(`/game/${roomCode}/lobby`);
    }
  }, [room?.status, roomCode, navigate]);
  
  // roomCode가 없으면 메인으로 리다이렉트
  useEffect(() => {
    if (!roomCode) {
      navigate('/');
    }
  }, [roomCode, navigate]);

  // 팀 플레이어 가져오기
  const teamPlayers: Player[] = myNation ? getMyTeamPlayers() : [];

  // 게임 상태에서 값 가져오기 (메모이제이션)
  const currentTurn = useMemo(() => room?.currentTurn || 1, [room?.currentTurn]);
  const currentYear = useMemo(() => room?.currentYear || 300, [room?.currentYear]);
  const showCountdown = countdown !== null;
  
  // 스탯 가져오기 (메모이제이션)
  const stats: Record<Nation, NationStats> = useMemo(() => {
    if (!room) {
      return {
        goguryeo: { military: 0, economy: 0, diplomacy: 0, culture: 0, gold: 0, population: 0, morale: 0, culturePoints: 0, techProgress: 0, peaceTurns: 0 },
        baekje: { military: 0, economy: 0, diplomacy: 0, culture: 0, gold: 0, population: 0, morale: 0, culturePoints: 0, techProgress: 0, peaceTurns: 0 },
        silla: { military: 0, economy: 0, diplomacy: 0, culture: 0, gold: 0, population: 0, morale: 0, culturePoints: 0, techProgress: 0, peaceTurns: 0 },
      };
    }
    return {
      goguryeo: room.teams.goguryeo.stats,
      baekje: room.teams.baekje.stats,
      silla: room.teams.silla.stats,
    };
  }, [room?.teams.goguryeo.stats, room?.teams.baekje.stats, room?.teams.silla.stats]);
  
  // 이벤트 표시 여부 - 디버깅을 위해 일단 모든 이벤트 표시
  const showEvent = useMemo(() => {
    if (!currentEvent) {
      console.log('[GamePage] No currentEvent');
      return false;
    }
    
    console.log('[GamePage] Event received:', {
      eventTitle: currentEvent.title,
      targetNation: currentEvent.targetNation,
      myNation,
      hasEvent: !!currentEvent
    });
    
    // 일단 모든 이벤트 표시 (디버깅용)
    return true;
  }, [currentEvent, myNation]);
  
  // 이벤트 타이머 계산 (1초마다 업데이트)
  const [eventTimeRemaining, setEventTimeRemaining] = useState(0);
  useEffect(() => {
    if (!eventDeadline) {
      setEventTimeRemaining(0);
      return;
    }
    
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((eventDeadline - Date.now()) / 1000));
      setEventTimeRemaining(remaining);
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [eventDeadline]);
  
  // 턴 타이머 계산 (1초마다 업데이트)
  const [turnTimeRemaining, setTurnTimeRemaining] = useState(0);
  useEffect(() => {
    if (!room?.turnDeadline) {
      setTurnTimeRemaining(0);
      return;
    }
    
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((room.turnDeadline! - Date.now()) / 1000));
      setTurnTimeRemaining(remaining);
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [room?.turnDeadline]);

  // Mock territories (나중에 실제 데이터로 교체)
  const [territories] = useState<Record<string, Nation | null>>({
    pyongyang: 'goguryeo',
    gungnae: 'goguryeo',
    north1: 'goguryeo',
    hanseong: 'baekje',
    sabi: 'baekje',
    west: 'baekje',
    gyeongju: 'silla',
    geumgwan: 'silla',
    east: 'silla',
    hangang: null,
    central: null,
  });

  // 투표 핸들러 (메모이제이션)
  const handleVote = useCallback((choiceId: string) => {
    if (myNation) {
      submitVote(choiceId);
    }
  }, [myNation, submitVote]);

  // 채팅 전송 핸들러 (메모이제이션)
  const handleSendMessage = useCallback((message: string, type: 'team' | 'public' | 'diplomacy', target?: Nation) => {
    console.log('[GamePage] handleSendMessage called:', { message, type, target });
    sendChat(message, type, target);
  }, [sendChat]);

  // 방이 없으면 로딩 표시 (명확한 배경색 적용)
  if (!room) {
    return (
      <div className="min-h-screen bg-[#1a1510] flex items-center justify-center" style={{ background: '#1a1510' }}>
        <div className="text-center p-8">
          <div className="mb-4">
            <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-100 text-lg mb-2 font-bold">게임 정보를 불러오는 중...</p>

          {!isConnected && (
            <>
              <p className="text-red-400 text-sm mb-2">⚠️ 서버 연결 실패</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-amber-600 rounded-lg text-white mt-2 hover:bg-amber-700 transition-colors"
              >
                새로고침
              </button>
            </>
          )}

          {isConnected && (
            <p className="text-green-400 text-sm">✓ 서버에 연결됨</p>
          )}

          {roomCode && (
            <p className="text-amber-200/50 text-sm mt-2">방 코드: {roomCode}</p>
          )}

          <p className="text-amber-200/30 text-xs mt-4">10초 이상 걸리면 페이지를 새로고침해주세요</p>
        </div>
      </div>
    );
  }
  
  // myNation이 없으면 로딩 표시 (팀 선택 대기)
  if (!myNation) {
    return (
      <div className="min-h-screen bg-[#1a1510] flex items-center justify-center" style={{ background: '#1a1510' }}>
        <div className="text-center p-8">
          <div className="mb-4">
            <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-100 text-lg mb-2 font-bold">팀 정보를 불러오는 중...</p>
          <p className="text-amber-200/50 text-sm">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  const actionButtons = [
    { icon: Building2, label: '내정', desc: '국가 발전 투자', color: 'text-green-400', onClick: () => {} },
    { icon: Handshake, label: '외교', desc: '다른 나라와 협상', color: 'text-blue-400', onClick: () => setShowDiplomacy(true) },
    { icon: Swords, label: '군사', desc: '군대 운용', color: 'text-red-400', onClick: () => {} },
    { icon: BookOpen, label: '문화', desc: '문화 발전', color: 'text-purple-400', onClick: () => {} },
  ];

  return (
    <div className="min-h-screen baram-bg hanji-texture">
      {/* Countdown */}
      {showCountdown && countdown !== null && (
        <Countdown from={countdown} onComplete={() => {}} />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-sm border-b border-amber-900/30">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Turn Info */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-amber-200/50">턴</p>
              <p className="text-lg font-bold text-amber-100">{currentTurn}/{room.settings.maxTurns}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-amber-200/50">연도</p>
              <p className="text-lg font-bold gold-text">{currentYear}년</p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/80 border border-amber-900/30">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="font-mono font-bold text-amber-100">
              {Math.floor(turnTimeRemaining / 60)}:{(turnTimeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* 문화유산 버튼 */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowHeritage(!showHeritage)}
              className={showHeritage ? 'bg-amber-500/20' : ''}
              title="문화유산"
            >
              <Landmark className="w-5 h-5 text-purple-400" />
            </Button>
            {/* 테크 트리 버튼 */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowTechTree(!showTechTree)}
              className={showTechTree ? 'bg-amber-500/20' : ''}
              title="기술 연구"
            >
              <FlaskConical className="w-5 h-5 text-green-400" />
            </Button>
            {/* 위인 버튼 */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowHeroPanel(!showHeroPanel)}
              className={showHeroPanel ? 'bg-amber-500/20' : ''}
              title="위인"
            >
              <Crown className="w-5 h-5 text-amber-300" />
            </Button>
            {/* 승리 조건 버튼 */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowVictoryPanel(!showVictoryPanel)}
              className={showVictoryPanel ? 'bg-amber-500/20' : ''}
              title="승리 조건"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
            </Button>
            {/* 멀티플레이 모드에서만 채팅 버튼 표시 */}
            {!isSinglePlayerMode && (
              <Button variant="ghost" size="sm" onClick={() => setShowChat(!showChat)}>
                <MessageCircle className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-4 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Panel - Stats */}
          <div className="lg:col-span-3 space-y-4">
            <StatsPanel
              nation={myNation}
              stats={stats[myNation]}
              kingName={playerName || '플레이어'}
            />

            {/* Quick Actions */}
            <Card variant="glass" padding="sm">
              <h3 className="text-sm font-medium text-amber-200/60 mb-3">빠른 행동</h3>
              <div className="grid grid-cols-2 gap-2">
                {actionButtons.map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
                    className="p-3 rounded-lg bg-stone-900/50 border border-amber-900/30 hover:border-amber-700/50 transition-colors text-left"
                  >
                    <action.icon className={`w-5 h-5 ${action.color} mb-1`} />
                    <p className="text-sm font-medium text-amber-100">{action.label}</p>
                    <p className="text-xs text-amber-200/40">{action.desc}</p>
                  </motion.button>
                ))}
              </div>
            </Card>
          </div>

          {/* Center - Map */}
          <div className="lg:col-span-6">
            <Card variant="glass" padding="none" className="h-[500px] lg:h-full">
              <GameMap territories={territories} />
            </Card>
          </div>

          {/* Right Panel - Other Nations */}
          <div className="lg:col-span-3 space-y-4">
            {/* Other Nations Summary */}
            {(['baekje', 'silla'] as Nation[]).map((nation) => {
              const nationInfo = NATIONS[nation];
              const nationStats = stats[nation];
              
              return (
                <Card key={nation} variant="glass" padding="sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          nation === 'baekje' ? 'bg-blue-400' : 'bg-amber-500'
                        }`}
                      />
                      <h3 className="font-medium text-amber-100">{nationInfo.name}</h3>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-xs text-amber-200/50">🗡️</p>
                      <p className="text-sm font-bold text-amber-100">{nationStats.military}</p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-200/50">🌾</p>
                      <p className="text-sm font-bold text-amber-100">{nationStats.economy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-200/50">🤝</p>
                      <p className="text-sm font-bold text-amber-100">{nationStats.diplomacy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-200/50">📚</p>
                      <p className="text-sm font-bold text-amber-100">{nationStats.culture}</p>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Game Log */}
            <Card variant="glass" padding="sm" className="flex-1">
              <h3 className="text-sm font-medium text-amber-200/60 mb-3">게임 로그</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <p className="text-amber-100/70">게임이 시작되었습니다.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <p className="text-amber-100/70">백제가 불교를 수용했습니다.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Chat Panel - 멀티플레이 모드에서만 표시 */}
      <AnimatePresence>
        {!isSinglePlayerMode && showChat && room && (
          <ChatPanel
            messages={messages}
            myNation={myNation}
            roomPlayers={room.players}
            onSendMessage={handleSendMessage}
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>

      {/* Victory Panel */}
      <AnimatePresence>
        {showVictoryPanel && room && myNation && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-4 z-50 w-80"
          >
            <VictoryPanel
              victoryProgress={room.teams[myNation]?.victoryProgress}
              currentTurn={currentTurn}
              maxTurns={room.settings.maxTurns}
              allianceCount={room.teams[myNation]?.allies?.length || 0}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Panel */}
      <AnimatePresence>
        {showHeroPanel && myNation && (
          <HeroPanel
            nation={myNation}
            currentTurn={currentTurn}
            nationStats={stats[myNation]}
            activeHero={activeHero}
            onActivateHero={(heroId) => {
              // 위인 능력 발동
              const hero = getHeroById(heroId);
              if (hero) {
                setActiveHero({
                  heroId,
                  turnsRemaining: hero.specialAbility.duration,
                });
                console.log(`[Hero] Activated: ${hero.name}`);
              }
              setShowHeroPanel(false);
            }}
            onClose={() => setShowHeroPanel(false)}
          />
        )}
      </AnimatePresence>

      {/* Tech Tree Panel */}
      <AnimatePresence>
        {showTechTree && myNation && (
          <TechTreePanel
            nation={myNation}
            currentGold={stats[myNation]?.gold || 0}
            completedTechs={completedTechs}
            researchingTech={researchingTech}
            onResearchTech={(techId) => {
              const tech = getTechById(techId);
              if (tech) {
                setResearchingTech({
                  techId,
                  turnsRemaining: tech.cost.turns,
                });
                console.log(`[Tech] Started researching: ${tech.name}`);
              }
              setShowTechTree(false);
            }}
            onClose={() => setShowTechTree(false)}
          />
        )}
      </AnimatePresence>

      {/* Heritage Panel */}
      <AnimatePresence>
        {showHeritage && myNation && (
          <HeritagePanel
            nation={myNation}
            currentGold={stats[myNation]?.gold || 0}
            currentCulturePoints={stats[myNation]?.culturePoints || 0}
            completedTechs={completedTechs}
            builtHeritages={builtHeritages}
            buildingHeritage={buildingHeritage}
            onBuildHeritage={(heritageId) => {
              const heritage = getHeritageById(heritageId);
              if (heritage) {
                setBuildingHeritage({
                  heritageId,
                  turnsRemaining: heritage.constructionCost.turns,
                });
                console.log(`[Heritage] Started building: ${heritage.name}`);
              }
              setShowHeritage(false);
            }}
            onClose={() => setShowHeritage(false)}
          />
        )}
      </AnimatePresence>

      {/* Event Modal */}
      {currentEvent && (
        <EventModal
          event={currentEvent}
          isOpen={showEvent}
          onClose={() => {}}
          onVote={handleVote}
          currentVotes={currentVotes}
          myVote={myVote || undefined}
          teamPlayers={teamPlayers}
          timeRemaining={eventTimeRemaining}
          nation={myNation || undefined}
          stats={myNation ? stats[myNation] : undefined}
          roomStatus={room?.status}
          messages={!isSinglePlayerMode ? messages.filter(msg => msg.type === 'team') : undefined}
          onSendMessage={!isSinglePlayerMode ? (message) => handleSendMessage(message, 'team') : undefined}
          isSinglePlayerMode={isSinglePlayerMode}
        />
      )}

      {/* Diplomacy Panel */}
      {showDiplomacy && room && myNation && (
        <DiplomacyPanel
          myNation={myNation}
          teams={room.teams}
          onProposeAlliance={(target) => {
            proposeAlliance(target);
            setShowDiplomacy(false);
          }}
          onAcceptAlliance={(target) => {
            acceptAlliance(target);
            setShowDiplomacy(false);
          }}
          onBreakAlliance={(target) => {
            breakAlliance(target);
            setShowDiplomacy(false);
          }}
          onDeclareWar={(target) => {
            declareWar(target);
            setShowDiplomacy(false);
          }}
          onEndWar={(target) => {
            endWar(target);
            setShowDiplomacy(false);
          }}
          onInitiateBattle={(target) => {
            initiateBattle(target);
            setShowDiplomacy(false);
          }}
          onClose={() => setShowDiplomacy(false)}
        />
      )}

      {/* Battle Modal */}
      {pendingBattle && room && (
        <BattleModal
          isOpen={!!pendingBattle}
          attackerNation={pendingBattle.attackerNation}
          defenderNation={pendingBattle.defenderNation}
          battleId={pendingBattle.battleId}
          myNation={myNation}
          attackerStats={room.teams[pendingBattle.attackerNation].stats}
          defenderStats={room.teams[pendingBattle.defenderNation].stats}
          onAccept={(battleId) => {
            acceptBattle(battleId);
            setPendingBattle(null);
          }}
          onReject={(battleId) => {
            rejectBattle(battleId);
            setPendingBattle(null);
          }}
          onClose={() => setPendingBattle(null)}
        />
      )}
    </div>
  );
};
