// ============================================
// 역사전쟁:삼국시대 서버 타입 정의
// ============================================
// 승리 조건 상수
export const VICTORY_CONDITIONS = [
    {
        type: 'military',
        name: '삼국통일',
        description: '다른 두 국가를 모두 정복하여 삼국을 통일합니다.',
        icon: '🏆',
        requirement: { military: { conqueredNations: 2 } },
    },
    {
        type: 'cultural',
        name: '문화대국',
        description: '문화 점수 500점을 달성하여 문화적 우위를 점합니다.',
        icon: '🏛️',
        requirement: { cultural: { culturePoints: 500 } },
    },
    {
        type: 'diplomatic',
        name: '평화의 시대',
        description: '두 국가와 동맹을 맺고 10턴간 평화를 유지합니다.',
        icon: '📜',
        requirement: { diplomatic: { alliances: 2, peaceTurns: 10 } },
    },
    {
        type: 'technological',
        name: '기술 선진국',
        description: '모든 기술을 연구하여 기술적 우위를 달성합니다.',
        icon: '🔬',
        requirement: { technological: { completedTechs: 8 } },
    },
    {
        type: 'score',
        name: '최강국',
        description: '30턴이 지났을 때 가장 높은 총점을 획득합니다.',
        icon: '⏰',
        requirement: { score: { minTurns: 30 } },
    },
];
//# sourceMappingURL=types.js.map