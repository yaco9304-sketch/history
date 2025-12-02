// ============================================
// AI 조언자 (Gemini API)
// ============================================
import { GoogleGenerativeAI } from '@google/generative-ai';
// Gemini API 클라이언트 (지연 초기화)
let genAI = null;
let initialized = false;
// API 클라이언트 초기화 함수 (실제 사용 시 호출)
function getGenAI() {
    if (!initialized) {
        initialized = true;
        const API_KEY = process.env.GEMINI_API_KEY || '';
        if (API_KEY) {
            genAI = new GoogleGenerativeAI(API_KEY);
            console.log('[AI Advisor] Gemini API 초기화 완료');
            console.log('[AI Advisor] API Key length:', API_KEY.length);
        }
        else {
            console.warn('[AI Advisor] GEMINI_API_KEY가 설정되지 않았습니다. AI 조언자 기능이 비활성화됩니다.');
        }
    }
    return genAI;
}
// Gemini API 연결 테스트 함수
export async function testGeminiAPI() {
    const ai = getGenAI();
    if (!ai) {
        console.error('[AI Advisor] Gemini API not initialized');
        return false;
    }
    try {
        console.log('[AI Advisor] Testing Gemini API connection...');
        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent('테스트');
        await result.response;
        console.log('[AI Advisor] ✓ Gemini API 테스트 성공');
        return true;
    }
    catch (error) {
        console.error('[AI Advisor] ✗ Gemini API 테스트 실패:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : undefined,
        });
        return false;
    }
}
// AI 조언자 프롬프트 생성
function createAdvisorPrompt(event, nation, currentStats, choices) {
    const nationNames = {
        goguryeo: '고구려',
        baekje: '백제',
        silla: '신라',
    };
    return `당신은 삼국시대 역사 교육 게임의 AI 조언자입니다. 
학생들이 역사적 선택을 할 때 도움을 주는 역할입니다.

현재 상황:
- 국가: ${nationNames[nation]}
- 현재 스탯: 군사력 ${currentStats.military}, 경제력 ${currentStats.economy}, 외교력 ${currentStats.diplomacy}, 문화력 ${currentStats.culture}, 민심 ${currentStats.morale}

역사 이벤트:
- 제목: ${event.title}
- 설명: ${event.description}
- 역사적 배경: ${event.historicalContext}

선택지:
${choices.map((choice, i) => `${i + 1}. ${choice.text} (효과: ${JSON.stringify(choice.effects)}, 위험도: ${choice.risk})`).join('\n')}

다음과 같은 형식으로 조언을 제공해주세요:
1. 각 선택지의 장단점을 간단히 설명 (2-3줄)
2. 현재 국가의 상황을 고려한 추천 (1-2줄)
3. 역사적 관점에서의 설명 (1-2줄)

답변은 친근하고 교육적인 톤으로, 총 5-7줄 정도로 작성해주세요.`;
}
// AI 조언 요청
export async function getAIAdvice(event, nation, currentStats) {
    const ai = getGenAI();
    if (!ai) {
        return null;
    }
    try {
        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const prompt = createAdvisorPrompt(event, nation, currentStats, event.choices.map(c => ({
            id: c.id,
            text: c.text,
            effects: c.effects,
            risk: c.risk,
        })));
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('[AI Advisor] AI 조언 생성 성공');
        return text;
    }
    catch (error) {
        console.error('[AI Advisor] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : undefined,
            stack: error instanceof Error ? error.stack : undefined,
            fullError: error
        });
        return null;
    }
}
// 간단한 조언 (API 실패 시 폴백)
export function getFallbackAdvice(event, nation, currentStats) {
    const nationNames = {
        goguryeo: '고구려',
        baekje: '백제',
        silla: '신라',
    };
    // 간단한 조언 생성
    const advice = `현재 ${nationNames[nation]}의 상황을 고려하면, 각 선택지의 효과를 신중히 비교해보세요. 
역사적 배경(${event.historicalContext})을 참고하여 결정하시기 바랍니다.
안전한 선택이 항상 최선은 아니지만, 위험한 선택은 큰 손실을 가져올 수 있습니다.`;
    return advice;
}
//# sourceMappingURL=aiAdvisor.js.map