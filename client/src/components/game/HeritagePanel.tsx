import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Landmark, Lock, Check, Sparkles, Clock, Coins, Star, Info, Hammer } from 'lucide-react';
import { Nation } from '../../types';
import { 
  CulturalHeritage, 
  getHeritagesByNation, 
  canBuildHeritage,
  TYPE_NAMES,
  TYPE_ICONS
} from '../../data/culturalHeritage';
import { NATION_COLORS, NATION_NAMES } from '../../data/constants';

interface HeritagePanelProps {
  nation: Nation;
  currentGold: number;
  currentCulturePoints: number;
  completedTechs: string[];
  builtHeritages: string[];
  buildingHeritage?: { heritageId: string; turnsRemaining: number };
  onBuildHeritage: (heritageId: string) => void;
  onClose: () => void;
}

export const HeritagePanel = ({
  nation,
  currentGold,
  currentCulturePoints,
  completedTechs,
  builtHeritages,
  buildingHeritage,
  onBuildHeritage,
  onClose,
}: HeritagePanelProps) => {
  const [selectedHeritage, setSelectedHeritage] = useState<CulturalHeritage | null>(null);
  const heritages = getHeritagesByNation(nation);

  const getHeritageStatus = (heritage: CulturalHeritage): 'built' | 'building' | 'available' | 'locked' => {
    if (builtHeritages.includes(heritage.id)) return 'built';
    if (buildingHeritage?.heritageId === heritage.id) return 'building';
    const { canBuild } = canBuildHeritage(
      heritage.id, 
      completedTechs, 
      currentGold, 
      currentCulturePoints, 
      builtHeritages
    );
    return canBuild ? 'available' : 'locked';
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
        className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={`bg-gradient-to-r ${NATION_COLORS[nation]} p-4 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Landmark className="w-8 h-8 text-amber-200" />
              <div>
                <h2 className="text-2xl font-bold text-white">{NATION_NAMES[nation]} 문화유산</h2>
                <p className="text-sm text-white/70">역사적인 유산을 건설하세요</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full">
                <Coins className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-amber-200">{currentGold}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full">
                <Star className="w-4 h-4 text-purple-300" />
                <span className="font-bold text-purple-200">{currentCulturePoints}</span>
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
            <span className="text-sm text-stone-400">건설 완료: {builtHeritages.length}/{heritages.length}</span>
            {buildingHeritage && (
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
                <Hammer className="w-4 h-4 text-purple-400 animate-bounce" />
                <span className="text-sm text-purple-300">
                  건설 중: {heritages.find(h => h.id === buildingHeritage.heritageId)?.name} ({buildingHeritage.turnsRemaining}턴 남음)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heritages.map((heritage) => {
              const status = getHeritageStatus(heritage);
              const isSelected = selectedHeritage?.id === heritage.id;

              return (
                <motion.div
                  key={heritage.id}
                  whileHover={status !== 'built' ? { scale: 1.02 } : {}}
                  className={`relative rounded-xl border-2 cursor-pointer transition-all ${
                    status === 'built'
                      ? 'border-green-500/50 bg-green-900/20'
                      : status === 'building'
                      ? 'border-purple-400 bg-purple-500/20'
                      : isSelected
                      ? 'border-amber-500/50 bg-stone-800/80'
                      : status === 'available'
                      ? 'border-stone-600 bg-stone-800/50 hover:border-amber-500/30'
                      : 'border-stone-700 bg-stone-900/50 opacity-60'
                  }`}
                  onClick={() => status !== 'built' && setSelectedHeritage(heritage)}
                >
                  {/* 상태 표시 */}
                  {status === 'built' && (
                    <div className="absolute top-2 right-2 p-1 bg-green-500 rounded-full">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {status === 'locked' && (
                    <div className="absolute top-2 right-2 p-1 bg-stone-600 rounded-full">
                      <Lock className="w-4 h-4 text-stone-400" />
                    </div>
                  )}
                  {status === 'building' && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-purple-500 rounded-full">
                      <Hammer className="w-3 h-3 text-white animate-bounce" />
                      <span className="text-xs font-bold text-white">
                        {buildingHeritage?.turnsRemaining}턴
                      </span>
                    </div>
                  )}

                  <div className="p-4">
                    {/* 문화유산 정보 */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-3xl">
                        {TYPE_ICONS[heritage.type]}
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-100">{heritage.name}</h4>
                        <p className="text-xs text-amber-200/60">{TYPE_NAMES[heritage.type]}</p>
                      </div>
                    </div>

                    {/* 효과 */}
                    <div className="p-2 bg-stone-900/50 rounded-lg mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-stone-300">문화 점수 +{heritage.effect.cultureBonus}</span>
                      </div>
                      {heritage.effect.specialEffect && (
                        <p className="text-xs text-amber-300 ml-6">{heritage.effect.specialEffect}</p>
                      )}
                    </div>

                    {/* 비용 */}
                    <div className="flex items-center gap-4 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {heritage.constructionCost.turns}턴
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {heritage.constructionCost.gold}금
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {heritage.constructionCost.culturePoints}문화
                      </span>
                    </div>

                    {/* 선행 기술 */}
                    {heritage.unlockTech && (
                      <div className="mt-2 pt-2 border-t border-stone-700">
                        <div className="flex items-center gap-1 text-xs text-stone-500">
                          <Lock className="w-3 h-3" />
                          <span>필요 기술: {heritage.unlockTech}</span>
                          {completedTechs.includes(heritage.unlockTech) && (
                            <Check className="w-3 h-3 text-green-400" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 선택된 문화유산 상세 정보 */}
        <AnimatePresence>
          {selectedHeritage && (
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
                    <h4 className="font-bold text-amber-200 mb-2">{selectedHeritage.name} - 역사적 배경</h4>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {selectedHeritage.historicalInfo}
                    </p>
                  </div>
                </div>

                {/* 건설 버튼 */}
                <div className="flex justify-end">
                  {(() => {
                    const status = getHeritageStatus(selectedHeritage);
                    const { canBuild, reason } = canBuildHeritage(
                      selectedHeritage.id, 
                      completedTechs, 
                      currentGold,
                      currentCulturePoints,
                      builtHeritages
                    );

                    if (status === 'built') {
                      return (
                        <div className="px-6 py-3 bg-green-500/20 rounded-lg text-green-400 font-bold flex items-center gap-2">
                          <Check className="w-5 h-5" />
                          건설 완료
                        </div>
                      );
                    }

                    if (status === 'building') {
                      return (
                        <div className="px-6 py-3 bg-purple-500/20 rounded-lg text-purple-400 font-bold flex items-center gap-2">
                          <Hammer className="w-5 h-5 animate-bounce" />
                          건설 중... ({buildingHeritage?.turnsRemaining}턴 남음)
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-4">
                        {!canBuild && (
                          <span className="text-sm text-red-400">{reason}</span>
                        )}
                        <motion.button
                          whileHover={canBuild ? { scale: 1.02 } : {}}
                          whileTap={canBuild ? { scale: 0.98 } : {}}
                          onClick={() => {
                            if (canBuild && !buildingHeritage) {
                              onBuildHeritage(selectedHeritage.id);
                              setSelectedHeritage(null);
                            }
                          }}
                          disabled={!canBuild || !!buildingHeritage}
                          className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                            canBuild && !buildingHeritage
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-400 hover:to-purple-500'
                              : 'bg-stone-700 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <Hammer className="w-5 h-5" />
                          {buildingHeritage ? '다른 건설 진행 중' : `건설 시작`}
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
            💡 문화유산 건설에는 금과 문화 점수가 필요합니다. 일부 유산은 기술 연구가 선행되어야 합니다.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeritagePanel;
