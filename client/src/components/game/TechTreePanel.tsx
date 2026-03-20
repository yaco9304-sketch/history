import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Lock, Check, Zap, Clock, Coins, Info, ArrowRight } from 'lucide-react';
import { Nation } from '../../types';
import { 
  TECH_TREE, 
  Technology, 
  canResearchTech, 
  CATEGORY_COLORS, 
  CATEGORY_NAMES,
  ERA_NAMES,
  getTechById
} from '../../data/techTree';
import { NATION_COLORS, NATION_NAMES } from '../../data/constants';

interface TechTreePanelProps {
  nation: Nation;
  currentGold: number;
  completedTechs: string[];
  researchingTech?: { techId: string; turnsRemaining: number };
  onResearchTech: (techId: string) => void;
  onClose: () => void;
}

export const TechTreePanel = ({
  nation,
  currentGold,
  completedTechs,
  researchingTech,
  onResearchTech,
  onClose,
}: TechTreePanelProps) => {
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);

  // 시대별로 기술 그룹화
  const techsByEra = {
    1: TECH_TREE.filter(t => t.era === 1),
    2: TECH_TREE.filter(t => t.era === 2),
    3: TECH_TREE.filter(t => t.era === 3),
  };

  const getTechStatus = (tech: Technology): 'completed' | 'researching' | 'available' | 'locked' => {
    if (completedTechs.includes(tech.id)) return 'completed';
    if (researchingTech?.techId === tech.id) return 'researching';
    const { canResearch } = canResearchTech(tech.id, completedTechs, currentGold);
    return canResearch ? 'available' : 'locked';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={`bg-gradient-to-r ${NATION_COLORS[nation]} p-4 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-amber-200" />
              <div>
                <h2 className="text-2xl font-bold text-white">{NATION_NAMES[nation]} 기술 연구</h2>
                <p className="text-sm text-white/70">삼국시대의 기술을 연구하세요</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full">
                <Coins className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-amber-200">{currentGold}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* 진행 상황 */}
        <div className="px-6 py-3 bg-stone-800/50 border-b border-amber-500/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-400">연구 완료: {completedTechs.length}/{TECH_TREE.length}</span>
            {researchingTech && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-sm text-amber-300">
                  연구 중: {getTechById(researchingTech.techId)?.name} ({researchingTech.turnsRemaining}턴 남음)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 메인 콘텐츠 - 테크 트리 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {([1, 2, 3] as const).map(era => (
              <div key={era}>
                <h3 className="text-lg font-bold text-amber-200 mb-4 flex items-center gap-2">
                  <span className="px-2 py-1 bg-amber-500/20 rounded text-sm">{era}시대</span>
                  {ERA_NAMES[era]}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {techsByEra[era].map((tech) => {
                    const status = getTechStatus(tech);
                    const isSelected = selectedTech?.id === tech.id;

                    return (
                      <motion.div
                        key={tech.id}
                        whileHover={status !== 'completed' ? { scale: 1.02 } : {}}
                        className={`relative rounded-xl border-2 cursor-pointer transition-all ${
                          status === 'completed'
                            ? 'border-green-500/50 bg-green-900/20'
                            : status === 'researching'
                            ? 'border-amber-400 bg-amber-500/20'
                            : isSelected
                            ? 'border-amber-500/50 bg-stone-800/80'
                            : status === 'available'
                            ? 'border-stone-600 bg-stone-800/50 hover:border-amber-500/30'
                            : 'border-stone-700 bg-stone-900/50 opacity-60'
                        }`}
                        onClick={() => status !== 'completed' && setSelectedTech(tech)}
                      >
                        {/* 상태 표시 */}
                        {status === 'completed' && (
                          <div className="absolute top-2 right-2 p-1 bg-green-500 rounded-full">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {status === 'locked' && (
                          <div className="absolute top-2 right-2 p-1 bg-stone-600 rounded-full">
                            <Lock className="w-4 h-4 text-stone-400" />
                          </div>
                        )}
                        {status === 'researching' && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-amber-500 rounded-full">
                            <Clock className="w-3 h-3 text-white animate-spin" />
                            <span className="text-xs font-bold text-white">
                              {researchingTech?.turnsRemaining}턴
                            </span>
                          </div>
                        )}

                        <div className="p-4">
                          {/* 기술 정보 */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${CATEGORY_COLORS[tech.category]} flex items-center justify-center text-2xl`}>
                              {tech.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-amber-100">{tech.name}</h4>
                              <p className="text-xs text-amber-200/60">{CATEGORY_NAMES[tech.category]}</p>
                            </div>
                          </div>

                          {/* 효과 */}
                          <div className="p-2 bg-stone-900/50 rounded-lg mb-3">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-400" />
                              <span className="text-sm text-stone-300">{tech.effect.description}</span>
                            </div>
                          </div>

                          {/* 비용 */}
                          <div className="flex items-center gap-4 text-xs text-stone-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {tech.cost.turns}턴
                            </span>
                            <span className="flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              {tech.cost.gold}금
                            </span>
                          </div>

                          {/* 선행 기술 */}
                          {tech.prerequisites.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-stone-700">
                              <div className="flex items-center gap-1 text-xs text-stone-500">
                                <ArrowRight className="w-3 h-3" />
                                <span>
                                  필요: {tech.prerequisites.map(p => getTechById(p)?.name).join(', ')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 선택된 기술 상세 정보 */}
        <AnimatePresence>
          {selectedTech && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-amber-500/20 bg-stone-800/50 flex-shrink-0"
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-amber-200 mb-2">{selectedTech.name} - 역사적 배경</h4>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {selectedTech.historicalInfo}
                    </p>
                  </div>
                </div>

                {/* 연구 버튼 */}
                <div className="flex justify-end">
                  {(() => {
                    const status = getTechStatus(selectedTech);
                    const { canResearch, reason } = canResearchTech(
                      selectedTech.id, 
                      completedTechs, 
                      currentGold
                    );

                    if (status === 'completed') {
                      return (
                        <div className="px-6 py-3 bg-green-500/20 rounded-lg text-green-400 font-bold flex items-center gap-2">
                          <Check className="w-5 h-5" />
                          연구 완료
                        </div>
                      );
                    }

                    if (status === 'researching') {
                      return (
                        <div className="px-6 py-3 bg-amber-500/20 rounded-lg text-amber-400 font-bold flex items-center gap-2">
                          <Clock className="w-5 h-5 animate-spin" />
                          연구 중... ({researchingTech?.turnsRemaining}턴 남음)
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-4">
                        {!canResearch && (
                          <span className="text-sm text-red-400">{reason}</span>
                        )}
                        <motion.button
                          whileHover={canResearch ? { scale: 1.02 } : {}}
                          whileTap={canResearch ? { scale: 0.98 } : {}}
                          onClick={() => {
                            if (canResearch && !researchingTech) {
                              onResearchTech(selectedTech.id);
                              setSelectedTech(null);
                            }
                          }}
                          disabled={!canResearch || !!researchingTech}
                          className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                            canResearch && !researchingTech
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 hover:from-amber-400 hover:to-amber-500'
                              : 'bg-stone-700 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <BookOpen className="w-5 h-5" />
                          {researchingTech ? '다른 연구 진행 중' : `연구 시작 (${selectedTech.cost.gold}금)`}
                        </motion.button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 푸터 */}
        <div className="px-6 py-3 bg-stone-900/50 border-t border-amber-500/20 flex-shrink-0">
          <p className="text-xs text-stone-400 text-center">
            💡 기술 연구는 한 번에 하나씩만 가능합니다. 선행 기술을 먼저 연구하세요!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TechTreePanel;
