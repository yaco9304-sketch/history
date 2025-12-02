// ============================================
// AI 조언자 서비스 (클라이언트)
// ============================================

import { HistoricalEvent, Nation, NationStats } from '../types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export interface AIAdviceResponse {
  advice: string;
  isFallback?: boolean;
}

// AI 조언 요청
export async function requestAIAdvice(
  event: HistoricalEvent,
  nation: Nation,
  stats: NationStats
): Promise<AIAdviceResponse | null> {
  try {
    // 입력 검증
    if (!event || !nation || !stats) {
      console.error('[AI Advisor] Invalid parameters');
      return null;
    }

    const response = await fetch(`${SERVER_URL}/api/ai/advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        nation,
        stats,
      }),
      // 타임아웃 설정 (10초)
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Advisor] Request failed:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    
    // 응답 검증
    if (!data || typeof data !== 'object') {
      console.error('[AI Advisor] Invalid response format');
      return null;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[AI Advisor] Request timeout');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('[AI Advisor] Network error - 서버에 연결할 수 없습니다');
      } else {
        console.error('[AI Advisor] Error:', error.message);
      }
    } else {
      console.error('[AI Advisor] Unknown error:', error);
    }
    return null;
  }
}




