import { Nation, NationStats, HistoricalEvent, Choice, Player, GameRoom } from './types.js';
export type AIDifficulty = 'easy' | 'normal' | 'hard';
export declare function createAIPlayer(nation: Nation, difficulty?: AIDifficulty): Player;
export declare function evaluateChoice(choice: Choice, nation: Nation, currentStats: NationStats, event: HistoricalEvent, difficulty?: AIDifficulty): number;
export declare function selectBestChoice(event: HistoricalEvent, nation: Nation, currentStats: NationStats, difficulty?: AIDifficulty): Choice;
export declare function shouldAIAct(room: GameRoom, playerId: string): boolean;
//# sourceMappingURL=aiPlayer.d.ts.map