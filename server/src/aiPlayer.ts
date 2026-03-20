// ============================================
// AI 플레이어 시스템
// 스타크래프트처럼 컴퓨터 플레이어가 자동으로 게임을 플레이
// ============================================

import { v4 as uuidv4 } from 'uuid';
import { Nation, NationStats, HistoricalEvent, Choice, Player, GameRoom } from './types.js';

// AI 플레이어 이름 목록
const AI_NAMES: Record<Nation, string[]> = {
  goguryeo: ['광개토대왕', '장수왕', '태조대왕', '고국천왕'],
  baekje: ['근초고왕', '무령왕', '성왕', '의자왕'],
  silla: ['진흥왕', '진평왕', '선덕여왕', '태종무열왕'],
};

// AI 난이도 타입
export type AIDifficulty = 'easy' | 'normal' | 'hard';

// AI 플레이어 생성
export function createAIPlayer(nation: Nation, difficulty: AIDifficulty = 'normal'): Player {
  const names = AI_NAMES[nation];
  const name = names[Math.floor(Math.random() * names.length)];
  const playerId = `dummy-${uuidv4()}`;
  
  return {
    id: playerId,
    socketId: '', // AI는 소켓이 없음
    name: `${name}(AI)`,
    team: nation,
    isReady: false,
    isOnline: true,
    joinedAt: Date.now(),
    isAI: true,
    aiDifficulty: difficulty,
  };
}

// AI가 선택지를 평가하는 함수
export function evaluateChoice(
  choice: Choice,
  nation: Nation,
  currentStats: NationStats,
  event: HistoricalEvent,
  difficulty: AIDifficulty = 'normal'
): number {
  let score = 0;
  
  // 1. 스탯 변화 평가
  const statWeights: Record<keyof NationStats, number> = {
    military: nation === 'goguryeo' ? 1.5 : nation === 'baekje' ? 0.8 : 0.7, // 고구려는 군사력 선호
    economy: nation === 'baekje' ? 1.5 : nation === 'silla' ? 1.2 : 1.0, // 백제는 경제력 선호
    diplomacy: nation === 'baekje' ? 1.3 : nation === 'silla' ? 1.1 : 1.0, // 백제와 신라는 외교력 선호
    culture: nation === 'baekje' ? 1.4 : nation === 'silla' ? 1.3 : 1.0, // 백제와 신라는 문화력 선호
    gold: 0.8, // 금은 중요하지만 덜 중요
    population: 0.6,
    morale: 1.2, // 민심은 중요
  };
  
  Object.entries(choice.effects).forEach(([stat, value]) => {
    if (value === undefined || value === 0) return;
    const weight = statWeights[stat as keyof NationStats] || 1.0;
    score += value * weight;

    // 현재 스탯이 낮으면 보너스 점수
    const currentValue = currentStats[stat as keyof NationStats] as number || 0;
    if (value > 0 && currentValue < 100) {
      score += value * 0.5; // 보정 보너스
    }
  });
  
  // 2. 역사적 선택 보너스 (난이도에 따라)
  if (choice.isHistorical) {
    const historicalBonus = difficulty === 'hard' ? 50 : difficulty === 'normal' ? 30 : 10;
    score += historicalBonus;
  }
  
  // 3. 리스크 패널티
  switch (choice.risk) {
    case 'safe':
      score += 20;
      break;
    case 'normal':
      score += 0;
      break;
    case 'risky':
      score -= difficulty === 'easy' ? 30 : difficulty === 'normal' ? 15 : 0;
      break;
  }
  
  // 4. 현재 스탯 균형 고려 (한쪽이 너무 낮으면 보정)
  const minStat = Math.min(
    currentStats.military,
    currentStats.economy,
    currentStats.diplomacy,
    currentStats.culture
  );
  if (minStat < 50) {
    // 가장 낮은 스탯을 올리는 선택지에 보너스
    const effects = choice.effects;
    if (currentStats.military === minStat && (effects.military || 0) > 0) score += 30;
    if (currentStats.economy === minStat && (effects.economy || 0) > 0) score += 30;
    if (currentStats.diplomacy === minStat && (effects.diplomacy || 0) > 0) score += 30;
    if (currentStats.culture === minStat && (effects.culture || 0) > 0) score += 30;
  }
  
  // 5. 난이도별 랜덤성 추가
  const randomFactor = difficulty === 'easy' 
    ? Math.random() * 30 - 15  // -15 ~ +15
    : difficulty === 'normal'
    ? Math.random() * 15 - 7.5  // -7.5 ~ +7.5
    : Math.random() * 5 - 2.5;  // -2.5 ~ +2.5
  score += randomFactor;
  
  return score;
}

// AI가 최선의 선택지를 선택하는 함수
export function selectBestChoice(
  event: HistoricalEvent,
  nation: Nation,
  currentStats: NationStats,
  difficulty: AIDifficulty = 'normal'
): Choice {
  const evaluatedChoices = event.choices.map(choice => ({
    choice,
    score: evaluateChoice(choice, nation, currentStats, event, difficulty),
  }));
  
  // 점수 순으로 정렬
  evaluatedChoices.sort((a, b) => b.score - a.score);
  
  // 최고 점수 선택지 반환 (약간의 랜덤성 포함)
  const topChoices = evaluatedChoices.slice(0, 2); // 상위 2개 중에서 선택
  const selected = topChoices[Math.floor(Math.random() * Math.min(2, topChoices.length))];
  
  return selected.choice;
}

// AI가 자동으로 행동할지 결정
export function shouldAIAct(room: GameRoom, playerId: string): boolean {
  const player = room.players[playerId];
  if (!player || !player.isAI) return false;
  
  // 게임이 진행 중이고, 플레이어의 턴이면 true
  return room.status === 'playing' || room.status === 'voting';
}
























