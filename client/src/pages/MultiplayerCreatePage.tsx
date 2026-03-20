// ============================================
// 멀티플레이 방 생성 페이지 (선생님용)
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, ArrowLeft, Copy, Check } from 'lucide-react';
import { Button, Card } from '../components/common';
import { useGameStore, initializeSocketListeners } from '../stores/gameStore';
import * as socket from '../socket';

export const MultiplayerCreatePage = () => {
  const navigate = useNavigate();
  const [hostName, setHostName] = useState('');
  const [className, setClassName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { room, error, setError, createRoom } = useGameStore();

  // Socket 리스너 초기화
  useEffect(() => {
    initializeSocketListeners();
  }, []);

  // 방 생성 완료 시 처리
  useEffect(() => {
    if (room && room.code && isCreating) {
      setCreatedRoomCode(room.code);
      setIsCreating(false);
      console.log('[MultiplayerCreate] Room created:', room.code);
    }
  }, [room, isCreating]);

  const handleCreateRoom = async () => {
    if (!hostName.trim() || !className.trim()) {
      setError('선생님 성함과 학급명을 입력해주세요.');
      return;
    }

    setIsCreating(true);
    setError(null);
    setCreatedRoomCode(null);

    try {
      // 소켓 연결 확인
      const sock = socket.connectSocket();
      if (!sock.connected) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('서버 연결 시간 초과'));
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

      // 방 생성
      createRoom(hostName.trim(), className.trim());
    } catch (err) {
      console.error('[MultiplayerCreate] Create room error:', err);
      setError(err instanceof Error ? err.message : '방 생성 중 오류가 발생했습니다.');
      setIsCreating(false);
    }
  };

  const handleCopyCode = () => {
    if (createdRoomCode) {
      navigator.clipboard.writeText(createdRoomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoToLobby = () => {
    if (createdRoomCode) {
      navigate(`/lobby/${createdRoomCode}`);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden baram-bg hanji-texture">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
          <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,200 L0,120 Q150,60 300,100 T600,80 T900,110 T1200,90 L1200,200 Z" fill="#3d3228"/>
            <path d="M0,200 L0,150 Q200,100 400,130 T800,110 T1200,140 L1200,200 Z" fill="#2a2318"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={() => navigate('/')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            돌아가기
          </Button>

          <Card className="p-8">
            {!createdRoomCode ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold gold-text mb-2">방 생성</h1>
                  <p className="text-amber-200/80">게임 방을 생성하고 학생들을 초대하세요</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-amber-200 mb-2 font-medium">
                      선생님 성함
                    </label>
                    <input
                      type="text"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      placeholder="예: 홍길동"
                      className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200 mb-2 font-medium">
                      학급명
                    </label>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="예: 5학년 3반"
                      className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      disabled={isCreating}
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleCreateRoom}
                    disabled={isCreating || !hostName.trim() || !className.trim()}
                    leftIcon={<Users className="w-5 h-5" />}
                  >
                    {isCreating ? '방 생성 중...' : '방 생성하기'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold gold-text mb-2">방 생성 완료!</h1>
                  <p className="text-amber-200/80">방 코드를 학생들에게 알려주세요</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-amber-200 mb-2 font-medium text-center">
                      방 코드
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={createdRoomCode}
                        readOnly
                        className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border-2 border-amber-500 text-white text-center text-2xl font-mono tracking-widest"
                      />
                      <Button
                        variant={copied ? 'secondary' : 'primary'}
                        onClick={handleCopyCode}
                        leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      >
                        {copied ? '복사됨' : '복사'}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-700/50">
                    <p className="text-amber-200 text-sm text-center">
                      학생들은 메인 화면에서 "멀티플레이"를 선택하고<br />
                      이 방 코드를 입력하여 입장할 수 있습니다.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleGoToLobby}
                    leftIcon={<GraduationCap className="w-5 h-5" />}
                  >
                    로비로 이동
                  </Button>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};










