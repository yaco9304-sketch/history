import { motion } from 'framer-motion';
import { Handshake, Swords, X, Check } from 'lucide-react';
import { Button, Card } from '../common';
import { Nation } from '../../types';
import { NATIONS } from '../../data/nations';

interface DiplomacyPanelProps {
  myNation: Nation;
  teams: Record<Nation, {
    nation: Nation;
    allies: Nation[];
    enemies: Nation[];
  }>;
  onProposeAlliance: (target: Nation) => void;
  onAcceptAlliance: (target: Nation) => void;
  onBreakAlliance: (target: Nation) => void;
  onDeclareWar: (target: Nation) => void;
  onEndWar: (target: Nation) => void;
  onInitiateBattle: (target: Nation) => void;
  onClose: () => void;
}

export const DiplomacyPanel = ({
  myNation,
  teams,
  onProposeAlliance,
  onAcceptAlliance,
  onBreakAlliance,
  onDeclareWar,
  onEndWar,
  onInitiateBattle,
  onClose,
}: DiplomacyPanelProps) => {
  const myTeam = teams[myNation];
  const otherNations = (['goguryeo', 'baekje', 'silla'] as Nation[]).filter(n => n !== myNation);

  const getNationColor = (nation: Nation) => {
    const colors = {
      goguryeo: 'text-red-400',
      baekje: 'text-blue-400',
      silla: 'text-orange-400',
    };
    return colors[nation];
  };

  const getNationBg = (nation: Nation) => {
    const colors = {
      goguryeo: 'bg-red-500/20 border-red-500/30',
      baekje: 'bg-blue-500/20 border-blue-500/30',
      silla: 'bg-orange-500/20 border-orange-500/30',
    };
    return colors[nation];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="scroll-card oriental-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-amber-100">외교 관계</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Current Relations */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-amber-200 mb-3">현재 관계</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Allies */}
            {myTeam.allies.length > 0 && (
              <Card variant="glass" padding="sm">
                <div className="flex items-center gap-2 mb-2">
                  <Handshake className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-amber-200">동맹</span>
                </div>
                <div className="space-y-1">
                  {myTeam.allies.map((ally) => (
                    <div
                      key={ally}
                      className={`flex items-center justify-between p-2 rounded ${getNationBg(ally)}`}
                    >
                      <span className={`text-sm font-medium ${getNationColor(ally)}`}>
                        {NATIONS[ally].name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBreakAlliance(ally)}
                        className="text-xs"
                      >
                        파기
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Enemies */}
            {myTeam.enemies.length > 0 && (
              <Card variant="glass" padding="sm">
                <div className="flex items-center gap-2 mb-2">
                  <Swords className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-amber-200">적대</span>
                </div>
                <div className="space-y-1">
                  {myTeam.enemies.map((enemy) => (
                    <div
                      key={enemy}
                      className={`flex items-center justify-between p-2 rounded ${getNationBg(enemy)}`}
                    >
                      <span className={`text-sm font-medium ${getNationColor(enemy)}`}>
                        {NATIONS[enemy].name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEndWar(enemy)}
                        className="text-xs"
                      >
                        종료
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {myTeam.allies.length === 0 && myTeam.enemies.length === 0 && (
              <p className="text-amber-200/50 text-sm">현재 특별한 외교 관계가 없습니다.</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div>
          <h3 className="text-lg font-medium text-amber-200 mb-3">외교 행동</h3>
          <div className="space-y-3">
            {otherNations.map((nation) => {
              const isAllied = myTeam.allies.includes(nation);
              const isEnemy = myTeam.enemies.includes(nation);
              const targetTeam = teams[nation];
              const isAlliedWithMe = targetTeam.allies.includes(myNation);

              return (
                <Card
                  key={nation}
                  variant="glass"
                  padding="sm"
                  className={`border ${getNationBg(nation)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          nation === 'goguryeo'
                            ? 'bg-red-400'
                            : nation === 'baekje'
                            ? 'bg-blue-400'
                            : 'bg-orange-400'
                        }`}
                      />
                      <div>
                        <h4 className={`font-medium ${getNationColor(nation)}`}>
                          {NATIONS[nation].name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {isAllied && (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <Handshake className="w-3 h-3" />
                              동맹
                            </span>
                          )}
                          {isEnemy && (
                            <span className="text-xs text-red-400 flex items-center gap-1">
                              <Swords className="w-3 h-3" />
                              적대
                            </span>
                          )}
                          {!isAllied && !isEnemy && (
                            <span className="text-xs text-amber-200/50">중립</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!isAllied && !isEnemy && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onProposeAlliance(nation)}
                            leftIcon={<Handshake className="w-4 h-4" />}
                          >
                            동맹 제안
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onInitiateBattle(nation)}
                            leftIcon={<Swords className="w-4 h-4" />}
                          >
                            전투 제안
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onDeclareWar(nation)}
                            leftIcon={<Swords className="w-4 h-4" />}
                          >
                            전쟁 선포
                          </Button>
                        </>
                      )}
                      {isAlliedWithMe && !isAllied && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onAcceptAlliance(nation)}
                          leftIcon={<Check className="w-4 h-4" />}
                        >
                          동맹 수락
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

