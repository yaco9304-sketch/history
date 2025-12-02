import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Star,
  History,
  Home,
  RotateCcw,
  Download,
  BookOpen,
} from 'lucide-react';
import { Button, Card } from '../components/common';
import { NATIONS, STAT_ICONS } from '../data/nations';
import { Nation, NationStats } from '../types';
import { useGameStore } from '../stores/gameStore';

interface GameResult {
  winner: Nation | null;
  reason: string;
  turns: number;
  duration: string;
  teams: Record<Nation, {
    finalStats: NationStats;
    achievements: string[];
  }>;
}

export const ResultPage = () => {
  const navigate = useNavigate();
  const { room } = useGameStore();
  
  // 게임 결과 계산
  const result: GameResult | null = useMemo(() => {
    if (!room || room.status !== 'finished') {
      return null;
    }

    // 승자 결정 (점수 기반)
    const calculateScore = (stats: NationStats) => {
      return Math.round(
        stats.military * 1.5 +
        stats.economy +
        stats.diplomacy +
        stats.culture * 2 +
        stats.morale * 2
      );
    };

    let maxScore = 0;
    let winner: Nation = 'goguryeo';
    for (const nation of ['goguryeo', 'baekje', 'silla'] as Nation[]) {
      const score = calculateScore(room.teams[nation].stats);
      if (score > maxScore) {
        maxScore = score;
        winner = nation;
      }
    }

    // 게임 지속 시간 계산
    const duration = room.startedAt
      ? `${Math.floor((Date.now() - room.startedAt) / 60000)}분`
      : '0분';

    // 업적 계산 (간단한 버전)
    const getAchievements = (nation: Nation): string[] => {
      const stats = room.teams[nation].stats;
      const achievements: string[] = [];
      
      if (stats.military >= 200) achievements.push('군사 강국');
      if (stats.economy >= 200) achievements.push('경제 대국');
      if (stats.diplomacy >= 200) achievements.push('외교의 달인');
      if (stats.culture >= 200) achievements.push('문화 강국');
      if (stats.morale >= 90) achievements.push('민심의 승리');
      if (room.teams[nation].allies.length >= 2) achievements.push('동맹의 달인');
      
      return achievements.length > 0 ? achievements : ['노력한 나라'];
    };

    return {
      winner,
      reason: 'score', // TODO: 실제 승리 이유 저장
      turns: room.currentTurn,
      duration,
      teams: {
        goguryeo: {
          finalStats: room.teams.goguryeo.stats,
          achievements: getAchievements('goguryeo'),
        },
        baekje: {
          finalStats: room.teams.baekje.stats,
          achievements: getAchievements('baekje'),
        },
        silla: {
          finalStats: room.teams.silla.stats,
          achievements: getAchievements('silla'),
        },
      },
    };
  }, [room]);

  // 방이 없거나 게임이 끝나지 않았으면 대기
  useEffect(() => {
    if (!room) {
      // 잠시 대기 후 확인
      const timer = setTimeout(() => {
        if (!room) {
          navigate('/');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [room, navigate]);

  if (!result || !room) {
    return (
      <div className="min-h-screen baram-bg hanji-texture flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-100 text-lg mb-2">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const winnerInfo = result.winner ? NATIONS[result.winner] : null;

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'conquest': return '삼국 통일 달성!';
      case 'turns': return '최고 점수 달성!';
      case 'score': return '최고 점수 달성!';
      case 'survival': return '생존 승리!';
      case 'culture': return '문화 승리!';
      default: return '승리!';
    }
  };

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
      goguryeo: 'from-red-600/20 to-red-800/20 border-red-500/30',
      baekje: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
      silla: 'from-orange-500/20 to-orange-700/20 border-orange-500/30',
    };
    return colors[nation];
  };

  // Calculate total score
  const calculateScore = (stats: NationStats) => {
    return Math.round(
      stats.military * 1.5 +
      stats.economy +
      stats.diplomacy +
      stats.culture * 2 +
      stats.morale * 2
    );
  };

  if (!winnerInfo || !result.winner) {
    return (
      <div className="min-h-screen baram-bg hanji-texture flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-100 text-lg mb-2">승자를 결정할 수 없습니다.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            홈으로
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen baram-bg hanji-texture p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Winner Announcement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-4"
          >
            🎉 🏆 🎉
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black mb-2 gold-text">
            {winnerInfo.name}, {getReasonText(result.reason)}
          </h1>

          <p className="text-amber-200/60 text-lg">
            {result.turns}턴 · {result.duration} 플레이
          </p>
        </motion.div>

        {/* Game Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass" className="mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <History className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-100">게임 요약</h3>
                <p className="text-amber-200/60">
                  {result.turns}턴 동안 삼국시대의 역사를 체험했습니다!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Final Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            최종 순위
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['goguryeo', 'baekje', 'silla'] as Nation[])
              .map(nation => ({
                nation,
                score: calculateScore(result.teams[nation].finalStats),
              }))
              .sort((a, b) => b.score - a.score)
              .map((item, rank) => {
                const nation = item.nation;
                const nationInfo = NATIONS[nation];
                const teamData = result.teams[nation];
                const score = calculateScore(teamData.finalStats);
                const isWinner = nation === result.winner;

                return (
                  <motion.div
                    key={nation}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + rank * 0.1 }}
                  >
                    <Card
                      variant="glass"
                      className={`
                        relative overflow-hidden
                        ${isWinner ? `bg-gradient-to-br ${getNationBg(nation)} ring-2 ring-amber-400` : ''}
                      `}
                    >
                      {/* Rank Badge */}
                      <div className={`
                        absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold
                        ${rank === 0 ? 'bg-amber-400 text-slate-900' : rank === 1 ? 'bg-slate-400 text-slate-900' : 'bg-orange-700 text-white'}
                      `}>
                        {rank + 1}
                      </div>

                      {/* Nation Name */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center
                          ${nation === 'goguryeo' ? 'bg-red-600' : nation === 'baekje' ? 'bg-blue-600' : 'bg-orange-500'}
                        `}>
                          {isWinner ? <Trophy className="w-5 h-5 text-white" /> : <Star className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <h3 className={`font-bold ${getNationColor(nation)}`}>{nationInfo.name}</h3>
                          <p className="text-2xl font-black text-amber-100">{score.toLocaleString()}점</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-2 text-center mb-4">
                        {(['military', 'economy', 'diplomacy', 'culture'] as const).map((stat) => (
                          <div key={stat} className="p-2 rounded-lg bg-black/20">
                            <p className="text-xs text-slate-400">{STAT_ICONS[stat]}</p>
                            <p className="font-bold text-amber-100">{teamData.finalStats[stat]}</p>
                          </div>
                        ))}
                      </div>

                      {/* Achievements */}
                      <div className="flex flex-wrap gap-1">
                        {teamData.achievements.map((achievement, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-amber-400/20 text-amber-400"
                          >
                            ⭐ {achievement}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            주요 결정들
          </h2>

          <Card variant="glass">
            <div className="space-y-4">
              {(Object.keys(result.teams) as Nation[]).map((nation) => {
                const teamData = result.teams[nation];
                const nationInfo = NATIONS[nation];

                return (
                  <div key={nation} className="pb-4 border-b border-amber-900/30 last:border-0 last:pb-0">
                    <h4 className={`font-medium ${getNationColor(nation)} mb-2`}>
                      {nationInfo.name}의 선택
                    </h4>
                    <p className="text-amber-200/60 text-sm">
                      {teamData.achievements.length > 0 
                        ? teamData.achievements.join(', ')
                        : '노력한 나라'}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/')}
            leftIcon={<Home className="w-5 h-5" />}
          >
            홈으로
          </Button>
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<RotateCcw className="w-5 h-5" />}
          >
            다시 하기
          </Button>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Download className="w-5 h-5" />}
          >
            결과 저장하기
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
