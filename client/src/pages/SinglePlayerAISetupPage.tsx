import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button, Card } from '../components/common';
import { useGameStore, initializeSocketListeners } from '../stores/gameStore';
import * as socket from '../socket';
import { setSinglePlayerAIMode } from '../utils/gameMode';

export const SinglePlayerAISetupPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useGameStore();
  const [status, setStatus] = useState<string>('대기 중...');
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    initializeSocketListeners();
  }, []);

  const handleStart = async () => {
    if (isCreating) return;

    setIsCreating(true);
    setStatus('방 생성 중...');
    setError(null);

    try {
      // 1. Socket 연결 먼저 완료
      if (!isConnected) {
        setStatus('서버 연결 중...');
        socket.connectSocket();

        // 연결 대기 (최대 5초)
        await new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 50;

          const checkConnection = () => {
            const sock = socket.connectSocket();
            if (sock.connected) {
              console.log('[SinglePlayerAI] Socket connected');
              resolve(true);
            } else if (attempts >= maxAttempts) {
              console.error('[SinglePlayerAI] Socket connection timeout');
              reject(new Error('서버 연결 시간 초과'));
            } else {
              attempts++;
              setTimeout(checkConnection, 100);
            }
          };
          checkConnection();
        });
      }

      setStatus('방 생성 중...');

      // 2. 이벤트 리스너 먼저 등록
      const sock = socket.connectSocket();

      // 3. Promise로 이벤트 대기
      const roomCreatedPromise = new Promise<any>((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.error('[SinglePlayerAI] Room creation timeout');
          reject(new Error('방 생성 시간 초과'));
        }, 10000);

        sock.once('roomCreated', (room) => {
          console.log('[SinglePlayerAI] Room created:', room.code);
          clearTimeout(timeout);
          resolve(room);
        });

        sock.once('error', (errorMsg: string) => {
          console.error('[SinglePlayerAI] Room creation error:', errorMsg);
          clearTimeout(timeout);
          reject(new Error(errorMsg));
        });
      });

      // 4. 방 생성 요청
      socket.createRoom('싱글플레이어 AI 대전', '개인', {
        maxTurns: 30,
        turnDuration: 120,
        voteDuration: 60,
        maxPlayersPerTeam: 5,
        difficulty: 'normal',
      });

      // 5. 응답 대기
      const room = await roomCreatedPromise;

      if (!room || !room.code) {
        throw new Error('방 생성에 실패했습니다. 방 정보를 받을 수 없습니다.');
      }

      // 방 코드를 대문자로 변환하여 싱글플레이 AI 대전 모드로 설정
      const normalizedRoomCode = room.code.toUpperCase().trim();
      setSinglePlayerAIMode(normalizedRoomCode);
      console.log('[SinglePlayerAI] Room created and mode set:', {
        originalCode: room.code,
        normalizedCode: normalizedRoomCode,
        roomId: room.id
      });

      // 방 생성이 완전히 완료될 때까지 약간 대기
      await new Promise(resolve => setTimeout(resolve, 500));

      navigate(`/single/ai/select`);

    } catch (err) {
      console.error('[SinglePlayerAI] Setup error:', err);
      setError(err instanceof Error ? err.message : '게임 설정 중 오류가 발생했습니다.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen baram-bg hanji-texture flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold gold-text mb-4">
            AI 대전 설정
          </h1>
          <p className="text-amber-200/80 text-lg md:text-xl font-nanum">
            각 국가에 최대 5명의 플레이어를 배치할 수 있습니다
          </p>
        </motion.div>

        <Card variant="glass" className="oriental-border p-8">
          <div className="space-y-6">

            {/* 에러 메시지 */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* 상태 메시지 */}
            {status !== '대기 중...' && !error && (
              <div className="p-4 bg-amber-500/20 border border-amber-500/50 rounded-lg">
                <p className="text-amber-300 text-sm">{status}</p>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-4">
              <Button
                variant="ghost"
                leftIcon={<ArrowLeft className="w-5 h-5" />}
                onClick={() => navigate('/single')}
                className="flex-1"
                disabled={isCreating}
              >
                돌아가기
              </Button>
              <Button
                variant="primary"
                onClick={handleStart}
                className="flex-1"
                disabled={isCreating}
              >
                {isCreating ? status : 'AI 대전 시작'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
