import { memo } from 'react';
import { motion } from 'framer-motion';
import { Crown, Coins, Users as UsersIcon, Heart } from 'lucide-react';
import { StatBar } from '../common';
import { NationStats, Nation } from '../../types';
import { NATIONS } from '../../data/nations';

interface StatsPanelProps {
  nation: Nation;
  stats: NationStats;
  kingName?: string;
}

export const StatsPanel = memo(({ nation, stats, kingName }: StatsPanelProps) => {
  const nationInfo = NATIONS[nation];

  const getNationGradient = () => {
    const gradients = {
      goguryeo: 'from-red-600/20 to-red-800/20 border-red-500/30',
      baekje: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
      silla: 'from-orange-500/20 to-orange-700/20 border-orange-500/30',
    };
    return gradients[nation];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        p-4 rounded-lg border backdrop-blur-sm scroll-card oriental-border
        bg-gradient-to-br ${getNationGradient()}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-900/30">
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${nation === 'goguryeo' ? 'bg-red-600' : nation === 'baekje' ? 'bg-blue-600' : 'bg-orange-500'}
          `}
        >
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber-100">{nationInfo.name}</h3>
          {kingName && (
            <p className="text-sm text-amber-200/50">{kingName}의 왕국</p>
          )}
        </div>
      </div>

      {/* Main Stats */}
      <div className="space-y-3 mb-4">
        <StatBar stat="military" value={stats.military} />
        <StatBar stat="economy" value={stats.economy} />
        <StatBar stat="diplomacy" value={stats.diplomacy} />
        <StatBar stat="culture" value={stats.culture} />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-amber-900/30">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-900/50">
          <Coins className="w-4 h-4 text-amber-500" />
          <div>
            <p className="text-xs text-amber-200/50">재화</p>
            <p className="text-sm font-bold text-amber-100">
              {stats.gold.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-900/50">
          <UsersIcon className="w-4 h-4 text-amber-200/60" />
          <div>
            <p className="text-xs text-amber-200/50">인구</p>
            <p className="text-sm font-bold text-amber-100">
              {(stats.population / 1000).toFixed(0)}k
            </p>
          </div>
        </div>

        <div className="col-span-2 flex items-center gap-2 p-2 rounded-lg bg-stone-900/50">
          <Heart className="w-4 h-4 text-red-400" />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-xs text-amber-200/50">민심</p>
              <p className="text-sm font-bold text-amber-100">{stats.morale}%</p>
            </div>
            <div className="mt-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  stats.morale > 70
                    ? 'bg-green-500'
                    : stats.morale > 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${stats.morale}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
