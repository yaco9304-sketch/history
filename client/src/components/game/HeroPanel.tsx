import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Zap, Clock, Lock, Info, Sparkles } from 'lucide-react';
import { Nation } from '../../types';
import { HistoricalHero, getHeroesByNation, isHeroUnlocked } from '../../data/heroes';
import { NATION_COLORS, NATION_NAMES } from '../../data/constants';

interface HeroPanelProps {
  nation: Nation;
  currentTurn: number;
  nationStats: { military: number };
  activeHero?: { heroId: string; turnsRemaining: number };
  onActivateHero: (heroId: string) => void;
  onClose: () => void;
}

export const HeroPanel = ({
  nation,
  currentTurn,
  nationStats,
  activeHero,
  onActivateHero,
  onClose,
}: HeroPanelProps) => {
  const [selectedHero, setSelectedHero] = useState<HistoricalHero | null>(null);
  const heroes = getHeroesByNation(nation);

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
        className="w-full max-w-4xl bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={`bg-gradient-to-r ${NATION_COLORS[nation]} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-200" />
              <div>
                <h2 className="text-2xl font-bold text-white">{NATION_NAMES[nation]}의 위인</h2>
                <p className="text-sm text-white/70">역사 속 영웅의 힘을 빌려보세요</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroes.map((hero) => {
              const unlocked = isHeroUnlocked(hero, currentTurn, nationStats);
              const isActive = activeHero?.heroId === hero.id;
              const isSelected = selectedHero?.id === hero.id;

              return (
                <motion.div
                  key={hero.id}
                  whileHover={unlocked ? { scale: 1.02 } : {}}
                  className={`relative rounded-xl border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-amber-400 bg-amber-500/20'
                      : isSelected
                      ? 'border-amber-500/50 bg-stone-800/80'
                      : unlocked
                      ? 'border-stone-600 bg-stone-800/50 hover:border-amber-500/30'
                      : 'border-stone-700 bg-stone-900/50 opacity-60'
                  }`}
                  onClick={() => unlocked && setSelectedHero(hero)}
                >
                  {/* 잠금 오버레이 */}
                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
                      <div className="text-center">
                        <Lock className="w-8 h-8 text-stone-500 mx-auto mb-2" />
                        <p className="text-sm text-stone-400">
                          {hero.unlockCondition.type === 'turn'
                            ? `${hero.unlockCondition.requirement}턴 후 해금`
                            : '조건 미충족'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 활성 표시 */}
                  {isActive && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-amber-500 rounded-full">
                      <Sparkles className="w-3 h-3 text-white" />
                      <span className="text-xs font-bold text-white">
                        {activeHero.turnsRemaining}턴 남음
                      </span>
                    </div>
                  )}

                  <div className="p-4">
                    {/* 위인 정보 */}
                    <div className="flex items-start gap-4">
                      {/* 초상화 (임시 아이콘) */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${NATION_COLORS[nation]} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-3xl">
                          {hero.id === 'gwanggaeto' && '👑'}
                          {hero.id === 'eulji' && '⚔️'}
                          {hero.id === 'geunchogo' && '🚢'}
                          {hero.id === 'gyebaek' && '🛡️'}
                          {hero.id === 'kimyushin' && '🎖️'}
                          {hero.id === 'seondeok' && '👸'}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-amber-100">{hero.name}</h3>
                        <p className="text-sm text-amber-200/60">{hero.title}</p>
                        <p className="text-xs text-stone-400 mt-1">{hero.era}</p>
                      </div>
                    </div>

                    {/* 능력 정보 */}
                    <div className="mt-4 p-3 bg-stone-900/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-amber-200">{hero.specialAbility.name}</span>
                      </div>
                      <p className="text-sm text-stone-300">{hero.specialAbility.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          지속: {hero.specialAbility.duration}턴
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          재사용: {hero.specialAbility.cooldown}턴
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 선택된 위인 상세 정보 */}
          <AnimatePresence>
            {selectedHero && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="p-4 bg-stone-800/50 rounded-xl border border-amber-500/20">
                  <div className="flex items-start gap-3 mb-4">
                    <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-amber-200 mb-2">역사 속 {selectedHero.name}</h4>
                      <p className="text-sm text-stone-300 leading-relaxed">
                        {selectedHero.historicalFact}
                      </p>
                    </div>
                  </div>

                  {/* 능력 발동 버튼 */}
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onActivateHero(selectedHero.id);
                        setSelectedHero(null);
                      }}
                      disabled={activeHero?.heroId === selectedHero.id}
                      className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                        activeHero?.heroId === selectedHero.id
                          ? 'bg-stone-700 text-stone-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 hover:from-amber-400 hover:to-amber-500'
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                      {activeHero?.heroId === selectedHero.id ? '이미 활성화됨' : '능력 발동'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 bg-stone-900/50 border-t border-amber-500/20">
          <p className="text-sm text-stone-400 text-center">
            💡 위인의 능력은 한 번에 하나만 활성화할 수 있습니다. 전략적으로 사용하세요!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroPanel;
