import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Users, ArrowLeft } from 'lucide-react';
import { Button, Card } from '../components/common';

export const SinglePlayerModeSelectPage = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'personal' | 'ai' | null>(null);

  return (
    <div className="min-h-screen baram-bg hanji-texture flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gold-text mb-4">
            싱글 플레이 모드 선택
          </h1>
          <p className="text-amber-200/80 text-lg md:text-xl font-nanum">
            원하는 플레이 방식을 선택하세요
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 개인 모드 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              variant="glass"
              className="oriental-border cursor-pointer hover:scale-105 transition-transform h-full"
              onClick={() => setSelectedMode('personal')}
            >
              <div className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <User className="w-10 h-10 text-amber-400" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-amber-100 mb-4 font-hoguk">
                  개인 모드
                </h2>
                <p className="text-amber-200/80 mb-6 text-base leading-relaxed">
                  혼자서 조용히 역사를 체험하며 배우는 모드입니다.
                  <br className="hidden md:block" />
                  <span className="md:inline"> </span>다른 플레이어와의 경쟁 없이 나만의 속도로 진행할 수 있습니다.
                </p>
                <ul className="text-center md:text-left text-sm text-amber-200/70 space-y-1.5 mb-6 font-nanum">
                  <li>• 혼자서 플레이</li>
                  <li>• 속도 조절 가능</li>
                  <li>• 점수 시스템</li>
                  <li>• 역사 학습에 집중</li>
                </ul>
                <Button
                  variant={selectedMode === 'personal' ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/single/personal');
                  }}
                >
                  개인 모드 시작
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* AI 대전 모드 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              variant="glass"
              className="oriental-border cursor-pointer hover:scale-105 transition-transform h-full"
              onClick={() => setSelectedMode('ai')}
            >
              <div className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-10 h-10 text-blue-400" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-amber-100 mb-4 font-hoguk">
                  AI 대전
                </h2>
                <p className="text-amber-200/80 mb-6 text-base leading-relaxed">
                  국가별로 최대 5명씩 플레이어를 배치하고 AI와 대결합니다.
                  <br className="hidden md:block" />
                  <span className="md:inline"> </span>전략적 선택으로 삼국시대를 통일하세요.
                </p>
                <ul className="text-center md:text-left text-sm text-amber-200/70 space-y-1.5 mb-6 font-nanum">
                  <li>• 각 국가당 최대 5명</li>
                  <li>• AI 플레이어 추가 가능</li>
                  <li>• 협력과 경쟁</li>
                  <li>• 전략적 선택</li>
                </ul>
                <Button
                  variant={selectedMode === 'ai' ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/single/ai/setup');
                  }}
                >
                  AI 대전 시작
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/')}
          >
            돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};
