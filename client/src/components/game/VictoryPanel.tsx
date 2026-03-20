import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Crown, Book, Handshake, Microscope, Clock } from 'lucide-react';
import { useState } from 'react';
import { VictoryProgress, VictoryType, VICTORY_CONDITIONS } from '../../types';

interface VictoryPanelProps {
  victoryProgress?: VictoryProgress;
  currentTurn: number;
  maxTurns: number;
  allianceCount: number;
  isCompact?: boolean;
}

const VICTORY_ICONS: Record<VictoryType, React.ReactNode> = {
  military: <Crown className="w-5 h-5" />,
  cultural: <Book className="w-5 h-5" />,
  diplomatic: <Handshake className="w-5 h-5" />,
  technological: <Microscope className="w-5 h-5" />,
  score: <Clock className="w-5 h-5" />,
};

const VICTORY_COLORS: Record<VictoryType, string> = {
  military: 'from-red-500 to-red-700',
  cultural: 'from-purple-500 to-purple-700',
  diplomatic: 'from-blue-500 to-blue-700',
  technological: 'from-green-500 to-green-700',
  score: 'from-amber-500 to-amber-700',
};

export const VictoryPanel = ({
  victoryProgress,
  currentTurn,
  maxTurns,
  allianceCount,
  isCompact = false,
}: VictoryPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 기본 진행 상황 (victoryProgress가 없을 때)
  const defaultProgress: VictoryProgress = {
    military: { conqueredNations: [], progress: 0 },
    cultural: { culturePoints: 0, progress: 0 },
    diplomatic: { alliances: allianceCount, peaceTurns: 0, progress: (allianceCount / 2) * 50 },
    technological: { completedTechs: [], progress: 0 },
    score: { totalScore: 0, progress: (currentTurn / maxTurns) * 100 },
  };

  const progress = victoryProgress || defaultProgress;

  const getProgressValue = (type: VictoryType): number => {
    switch (type) {
      case 'military':
        return progress.military.progress;
      case 'cultural':
        return progress.cultural.progress;
      case 'diplomatic':
        return progress.diplomatic.progress;
      case 'technological':
        return progress.technological.progress;
      case 'score':
        return progress.score.progress;
      default:
        return 0;
    }
  };

  const getProgressText = (type: VictoryType): string => {
    switch (type) {
      case 'military':
        return `${progress.military.conqueredNations.length}/2 국가 정복`;
      case 'cultural':
        return `${progress.cultural.culturePoints}/500 문화 점수`;
      case 'diplomatic':
        return `동맹 ${progress.diplomatic.alliances}/2, 평화 ${progress.diplomatic.peaceTurns}/10턴`;
      case 'technological':
        return `${progress.technological.completedTechs.length}/8 기술 연구`;
      case 'score':
        return `${currentTurn}/${maxTurns}턴 (${progress.score.totalScore}점)`;
      default:
        return '';
    }
  };

  // 컴팩트 모드 (미니 표시)
  if (isCompact && !isExpanded) {
    return (
      <motion.button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-2 px-3 py-2 bg-amber-900/50 border border-amber-500/30 rounded-lg hover:bg-amber-900/70 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Trophy className="w-4 h-4 text-amber-400" />
        <span className="text-sm text-amber-200">승리 조건</span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-gradient-to-br from-stone-900/95 to-stone-800/95 border border-amber-500/30 rounded-xl shadow-xl ${
          isCompact ? 'fixed top-20 right-4 z-50 w-80' : 'w-full'
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-amber-200">승리 조건</h3>
          </div>
          {isCompact && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-amber-500/20 rounded transition-colors"
            >
              <X className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>

        {/* 승리 조건 목록 */}
        <div className="p-4 space-y-3">
          {VICTORY_CONDITIONS.map((condition) => {
            const progressValue = getProgressValue(condition.type);
            const progressText = getProgressText(condition.type);
            const isNearVictory = progressValue >= 75;

            return (
              <motion.div
                key={condition.type}
                className={`relative p-3 rounded-lg border ${
                  isNearVictory
                    ? 'border-amber-400/50 bg-amber-500/10'
                    : 'border-stone-600/50 bg-stone-800/50'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                {/* 승리 조건 정보 */}
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${VICTORY_COLORS[condition.type]} text-white`}
                  >
                    {VICTORY_ICONS[condition.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-100">{condition.icon}</span>
                      <span className="font-bold text-amber-100">{condition.name}</span>
                      {isNearVictory && (
                        <span className="px-2 py-0.5 text-xs bg-amber-500/30 text-amber-300 rounded-full animate-pulse">
                          달성 임박!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                      {condition.description}
                    </p>
                    <p className="text-xs text-amber-300/80 mt-1">{progressText}</p>
                  </div>
                </div>

                {/* 진행 바 */}
                <div className="mt-2 h-2 bg-stone-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${VICTORY_COLORS[condition.type]} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, progressValue)}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>

                {/* 퍼센트 표시 */}
                <div className="absolute top-3 right-3 text-sm font-bold text-amber-300">
                  {Math.round(progressValue)}%
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 푸터 */}
        <div className="px-4 py-3 border-t border-amber-500/20 bg-stone-900/50">
          <p className="text-xs text-stone-400 text-center">
            다양한 방법으로 승리할 수 있습니다. 전략을 세우세요!
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VictoryPanel;
