import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button, Card } from '../components/common';
import { NATIONS } from '../data/nations';
import { Nation } from '../types';
import { useGameStore, initializeSocketListeners, getTeamPlayers } from '../stores/gameStore';
import * as socket from '../socket';
import { getSinglePlayerRoomCode } from '../utils/gameMode';

interface TeamStatus {
  current: number;
  max: number;
}

// 국가별 대표 이미지 경로
const nationImages: Record<Nation, string> = {
  goguryeo: '/images/goguryeo.svg',
  baekje: '/images/baekje.svg',
  silla: '/images/silla.svg',
};

export const SinglePlayerAINationSelectPage = () => {
  const navigate = useNavigate();
  const [selectedNation, setSelectedNation] = useState<Nation | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);

  const { room, joinRoom, selectTeam, error, setError, myNation } = useGameStore();
  const [isJoining, setIsJoining] = useState(false);

  // Socket 리스너 초기화
  useEffect(() => {
    initializeSocketListeners();
  }, []);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (showNameModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showNameModal]);

  // 실제 방 데이터에서 팀 상태 가져오기
  const getTeamStatus = (nation: Nation): TeamStatus => {
    if (!room) {
      return { current: 0, max: 5 };
    }
    const players = getTeamPlayers(nation);
    return {
      current: players.length,
      max: room.settings.maxPlayersPerTeam || 5,
    };
  };

  const handleJoinTeam = async () => {
    if (selectedNation && playerName.trim() && !isJoining) {
      setIsJoining(true);
      setError(null);

      try {
        // 소켓 리스너 재초기화 (안전하게)
        initializeSocketListeners(true);

        // 소켓 연결 확인 및 대기
        const sock = socket.connectSocket();
        if (!sock.connected) {
          console.log('[SinglePlayerAINationSelect] Waiting for socket connection...');
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('소켓 연결 시간 초과'));
            }, 5000);

            if (sock.connected) {
              clearTimeout(timeout);
              resolve();
            } else {
              sock.once('connect', () => {
                clearTimeout(timeout);
                resolve();
              });
            }
          });
        }

        console.log('[SinglePlayerAINationSelect] Socket connected, joining room...');

        // 싱글플레이 AI 대전 모드: 저장된 방 코드 사용
        const roomCode = getSinglePlayerRoomCode();

        if (!roomCode) {
          setError('방 코드가 없습니다. AI 대전 설정으로 돌아갑니다.');
          setTimeout(() => navigate('/single/ai/setup'), 2000);
          return;
        }

        console.log('[SinglePlayerAINationSelect] Joining room:', {
          roomCode,
          playerName: playerName.trim()
        });

        // 방에 먼저 입장
        joinRoom(roomCode, playerName.trim());
        localStorage.setItem('pendingRoomCode', roomCode);

        // 플레이어 이름과 국가 정보 저장
        localStorage.setItem('pendingPlayerName', playerName.trim());
        localStorage.setItem('pendingNation', selectedNation);
      } catch (err) {
        console.error('[SinglePlayerAINationSelect] Join error:', err);
        setIsJoining(false);
        setError('방 입장에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 방 입장 완료 후 팀 선택 및 로비 이동
  useEffect(() => {
    if (!room || !isJoining) {
      return;
    }

    const pendingNation = localStorage.getItem('pendingNation') as Nation | null;
    const savedRoomCode = localStorage.getItem('pendingRoomCode') || room.code;

    if (!pendingNation) {
      console.log('[SinglePlayerAINationSelect] No pending nation, stopping join process');
      setIsJoining(false);
      return;
    }

    console.log('[SinglePlayerAINationSelect] Room joined, processing team selection...', {
      roomCode: room.code,
      pendingNation,
      myNation,
      playerId: room.players ? Object.keys(room.players)[0] : null
    });

    // 이미 팀이 선택되었는지 확인
    if (myNation === pendingNation) {
      console.log('[SinglePlayerAINationSelect] Team already selected, navigating to lobby');
      setIsJoining(false);
      localStorage.removeItem('pendingPlayerName');
      localStorage.removeItem('pendingNation');
      localStorage.removeItem('pendingRoomCode');
      navigate(`/lobby/${savedRoomCode}`, { replace: true });
      return;
    }

    // 팀 선택 시도
    console.log('[SinglePlayerAINationSelect] Selecting team:', pendingNation);
    selectTeam(pendingNation);

    // 팀 선택 완료 대기 (최대 3초)
    const checkInterval = setInterval(() => {
      const currentRoom = useGameStore.getState().room;
      const currentMyNation = useGameStore.getState().myNation;

      if (currentMyNation === pendingNation && currentRoom) {
        console.log('[SinglePlayerAINationSelect] Team selection complete! Navigating to lobby...');
        clearInterval(checkInterval);

        // 싱글플레이 AI 대전 모드: 바로 로비로 이동
        setIsJoining(false);
        localStorage.removeItem('pendingPlayerName');
        localStorage.removeItem('pendingNation');
        localStorage.removeItem('pendingRoomCode');
        navigate(`/lobby/${savedRoomCode}`, { replace: true });
      }
    }, 200);

    // 타임아웃 설정
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (isJoining) {
        console.warn('[SinglePlayerAINationSelect] Team selection timeout, navigating anyway...');
        setIsJoining(false);
        localStorage.removeItem('pendingPlayerName');
        localStorage.removeItem('pendingNation');
        localStorage.removeItem('pendingRoomCode');
        navigate(`/lobby/${savedRoomCode}`, { replace: true });
      }
    }, 3000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [room, isJoining, navigate, selectTeam, myNation]);

  // 에러 발생 시 처리
  useEffect(() => {
    if (error && isJoining) {
      console.error('[SinglePlayerAINationSelect] Error occurred:', error);
      setIsJoining(false);
    }
  }, [error, isJoining]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen baram-bg hanji-texture p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12"
      >
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/single')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            돌아가기
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold gold-text mb-2">
            국가를 선택하세요
          </h1>
          <p className="text-amber-200/50">
            세 나라 중 하나를 골라 역사의 주인공이 되어보세요
          </p>
        </div>
      </motion.div>

      {/* Nation Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8"
      >
        {(Object.keys(NATIONS) as Nation[]).map((nationId) => {
          const nation = NATIONS[nationId];
          const status = getTeamStatus(nationId);
          const isSelected = selectedNation === nationId;
          const isFull = status.current >= status.max;

          return (
            <motion.div key={nationId} variants={cardVariants}>
              <Card
                variant="nation"
                nation={nationId}
                hoverable={!isFull}
                padding="none"
                className={`
                  relative overflow-hidden cursor-pointer transition-all duration-300
                  ${isSelected ? 'ring-4 ring-amber-400 ring-offset-4 ring-offset-slate-900' : ''}
                  ${isFull ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => {
                  if (!isFull) {
                    setSelectedNation(nationId);
                    setShowNameModal(true);
                  }
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 0%, white 0%, transparent 50%)`,
                    }}
                  />
                </div>

                <div className="relative p-6 md:p-8">
                  {/* Nation Image */}
                  <motion.div
                    className="flex justify-center mb-6"
                    animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <img
                      src={nationImages[nationId]}
                      alt={nation.name}
                      className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
                      style={{ display: 'block' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </motion.div>

                  {/* Nation Name */}
                  <h2 className="text-3xl font-bold text-white text-center mb-1">
                    {nation.name}
                  </h2>
                  <p className="text-white/60 text-center text-sm mb-6">
                    {nation.englishName}
                  </p>

                  {/* Traits */}
                  <div className="space-y-2 mb-6">
                    {nation.traits.map((trait, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-white/80 text-sm"
                      >
                        <span>{trait}</span>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    {nation.description}
                  </p>

                  {/* Team Status */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-200 font-medium">
                      {status.current}/{status.max}명
                    </span>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-900" />
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Name Input Modal */}
      {showNameModal && selectedNation && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md scroll-card oriental-border rounded-lg p-6"
            style={{ position: 'relative' }}
          >
            <h2 className="text-2xl font-bold gold-text mb-2 text-center">
              {NATIONS[selectedNation].name} 선택
            </h2>
            <p className="text-amber-200/70 text-center mb-6">
              닉네임을 입력하고 팀에 입장하세요
            </p>

            <label className="block text-sm font-medium text-amber-200/70 mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && playerName.trim() && !isJoining) {
                  handleJoinTeam();
                }
              }}
              placeholder="닉네임을 입력하세요"
              className="w-full px-4 py-3 rounded-lg mb-4 bg-stone-800 border border-amber-900/30 text-white focus:outline-none focus:border-amber-500"
              maxLength={10}
              autoFocus
            />

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="lg"
                className="flex-1"
                onClick={() => {
                  setShowNameModal(false);
                  setSelectedNation(null);
                  setPlayerName('');
                }}
                disabled={isJoining}
              >
                취소
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleJoinTeam}
                disabled={!playerName.trim() || isJoining}
                rightIcon={<ChevronRight className="w-5 h-5" />}
              >
                {isJoining ? '입장 중...' : '입장'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
