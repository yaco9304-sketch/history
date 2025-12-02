import { motion, AnimatePresence } from 'framer-motion';
import { Swords, X, Check, XCircle, Shield } from 'lucide-react';
import { Button } from '../common';
import { Nation, NationStats } from '../../types';
import { NATIONS } from '../../data/nations';

interface BattleModalProps {
  isOpen: boolean;
  attackerNation: Nation;
  defenderNation: Nation;
  battleId: string;
  myNation: Nation | null;
  attackerStats: NationStats;
  defenderStats: NationStats;
  onAccept: (battleId: string) => void;
  onReject: (battleId: string) => void;
  onClose: () => void;
}

export const BattleModal = ({
  isOpen,
  attackerNation,
  defenderNation,
  battleId,
  myNation,
  attackerStats,
  defenderStats,
  onAccept,
  onReject,
  onClose,
}: BattleModalProps) => {
  const isDefender = myNation === defenderNation;
  const attackerInfo = NATIONS[attackerNation];
  const defenderInfo = NATIONS[defenderNation];

  const attackerPower = attackerStats.military + attackerStats.morale * 0.5;
  const defenderPower = defenderStats.military + defenderStats.morale * 0.5;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="scroll-card oriental-border rounded-lg p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Swords className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-amber-100">전투 제안</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Battle Info */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2 ${
                    attackerNation === 'goguryeo' ? 'bg-red-600' :
                    attackerNation === 'baekje' ? 'bg-blue-600' : 'bg-orange-500'
                  }`}>
                    {attackerInfo.name[0]}
                  </div>
                  <p className="font-medium text-amber-100">{attackerInfo.name}</p>
                  <p className="text-sm text-amber-200/50">공격자</p>
                </div>

                <Swords className="w-8 h-8 text-red-400" />

                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2 ${
                    defenderNation === 'goguryeo' ? 'bg-red-600' :
                    defenderNation === 'baekje' ? 'bg-blue-600' : 'bg-orange-500'
                  }`}>
                    {defenderInfo.name[0]}
                  </div>
                  <p className="font-medium text-amber-100">{defenderInfo.name}</p>
                  <p className="text-sm text-amber-200/50">방어자</p>
                </div>
              </div>

              {/* Power Comparison */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-stone-800/50 border border-amber-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-200">공격력</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-100">{Math.round(attackerPower)}</p>
                  <div className="mt-2 space-y-1 text-xs text-amber-200/60">
                    <p>군사력: {attackerStats.military}</p>
                    <p>민심 보너스: +{Math.round(attackerStats.morale * 0.5)}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-stone-800/50 border border-amber-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-200">방어력</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-100">{Math.round(defenderPower)}</p>
                  <div className="mt-2 space-y-1 text-xs text-amber-200/60">
                    <p>군사력: {defenderStats.military}</p>
                    <p>민심 보너스: +{Math.round(defenderStats.morale * 0.5)}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-900/20 border border-amber-700/30">
                <p className="text-sm text-amber-200/80">
                  <strong className="text-amber-100">전투 결과:</strong> 전투력이 높은 쪽이 유리하지만, 
                  랜덤 요소와 동맹 지원이 결과에 영향을 미칩니다. 패배 시 큰 손실을 입을 수 있습니다.
                </p>
              </div>
            </div>

            {/* Actions */}
            {isDefender && (
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    onReject(battleId);
                    onClose();
                  }}
                  leftIcon={<XCircle className="w-5 h-5" />}
                >
                  거절
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    onAccept(battleId);
                    onClose();
                  }}
                  leftIcon={<Check className="w-5 h-5" />}
                >
                  수락
                </Button>
              </div>
            )}

            {!isDefender && (
              <div className="text-center">
                <p className="text-amber-200/60 text-sm">
                  {defenderInfo.name}의 응답을 기다리는 중...
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};




















