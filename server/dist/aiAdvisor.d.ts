import { HistoricalEvent, Nation, NationStats } from './types.js';
export declare function testGeminiAPI(): Promise<boolean>;
export declare function getAIAdvice(event: HistoricalEvent, nation: Nation, currentStats: NationStats): Promise<string | null>;
export declare function getFallbackAdvice(event: HistoricalEvent, nation: Nation, currentStats: NationStats): string;
//# sourceMappingURL=aiAdvisor.d.ts.map