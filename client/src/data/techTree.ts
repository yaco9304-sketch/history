// ============================================
// 역사전쟁: 삼국시대 - 테크 트리 시스템
// ============================================

export type TechCategory = 'military' | 'economy' | 'culture' | 'diplomacy';

export interface Technology {
  id: string;
  name: string;
  category: TechCategory;
  era: 1 | 2 | 3; // 1: 초기, 2: 중기, 3: 후기
  cost: {
    turns: number;
    gold: number;
  };
  prerequisites: string[]; // 선행 기술 ID
  effect: {
    type: 'stat_boost' | 'special';
    stat?: string;
    value?: number;
    description: string;
  };
  historicalInfo: string;
  icon: string;
}

// ============================================
// 테크 트리 데이터 (8개 기술)
// ============================================

export const TECH_TREE: Technology[] = [
  // ============================================
  // 1시대 - 초기 (선행 기술 없음)
  // ============================================
  {
    id: 'iron_working',
    name: '철기 기술',
    category: 'military',
    era: 1,
    cost: { turns: 2, gold: 100 },
    prerequisites: [],
    effect: {
      type: 'stat_boost',
      stat: 'military',
      value: 10,
      description: '군사력 +10',
    },
    historicalInfo: '철제 무기와 농기구를 제작하는 기술입니다. 고구려는 일찍이 철기 문화가 발달하여 강력한 군사력을 갖출 수 있었습니다.',
    icon: '⚔️',
  },
  {
    id: 'agriculture',
    name: '관개 농업',
    category: 'economy',
    era: 1,
    cost: { turns: 2, gold: 80 },
    prerequisites: [],
    effect: {
      type: 'stat_boost',
      stat: 'economy',
      value: 15,
      description: '경제력 +15',
    },
    historicalInfo: '저수지와 수로를 건설하여 농업 생산량을 높이는 기술입니다. 백제의 벽골제는 한국 최초의 저수지로 알려져 있습니다.',
    icon: '🌾',
  },
  {
    id: 'buddhism',
    name: '불교 수용',
    category: 'culture',
    era: 1,
    cost: { turns: 3, gold: 120 },
    prerequisites: [],
    effect: {
      type: 'stat_boost',
      stat: 'culture',
      value: 20,
      description: '문화력 +20',
    },
    historicalInfo: '불교는 4세기에 고구려, 백제에 전래되었습니다. 왕실의 후원 아래 급속히 발전하여 삼국의 정신문화에 큰 영향을 미쳤습니다.',
    icon: '☸️',
  },
  
  // ============================================
  // 2시대 - 중기 (1시대 기술 필요)
  // ============================================
  {
    id: 'cavalry',
    name: '기병 양성',
    category: 'military',
    era: 2,
    cost: { turns: 3, gold: 150 },
    prerequisites: ['iron_working'],
    effect: {
      type: 'stat_boost',
      stat: 'military',
      value: 20,
      description: '군사력 +20',
    },
    historicalInfo: '말을 타고 싸우는 기병을 양성합니다. 고구려의 철갑기병(개마무사)은 동아시아 최강의 기병대로 유명했습니다.',
    icon: '🐴',
  },
  {
    id: 'maritime_trade',
    name: '해상 무역',
    category: 'economy',
    era: 2,
    cost: { turns: 3, gold: 180 },
    prerequisites: ['agriculture'],
    effect: {
      type: 'stat_boost',
      stat: 'economy',
      value: 25,
      description: '경제력 +25',
    },
    historicalInfo: '배를 이용한 해상 무역로를 개척합니다. 백제는 중국, 일본과의 해상 교류로 큰 부를 축적했습니다.',
    icon: '⛵',
  },
  {
    id: 'temple_building',
    name: '사찰 건축',
    category: 'culture',
    era: 2,
    cost: { turns: 4, gold: 200 },
    prerequisites: ['buddhism'],
    effect: {
      type: 'stat_boost',
      stat: 'culture',
      value: 30,
      description: '문화력 +30',
    },
    historicalInfo: '대규모 사찰을 건립하여 불교를 발전시킵니다. 황룡사, 미륵사 등 거대한 사찰이 이 시기에 세워졌습니다.',
    icon: '🏛️',
  },
  
  // ============================================
  // 3시대 - 후기 (2시대 기술 필요)
  // ============================================
  {
    id: 'fortification',
    name: '성곽 기술',
    category: 'military',
    era: 3,
    cost: { turns: 4, gold: 250 },
    prerequisites: ['cavalry'],
    effect: {
      type: 'stat_boost',
      stat: 'military',
      value: 15,
      description: '군사력 +15, 방어 강화',
    },
    historicalInfo: '산성을 축조하여 방어력을 높입니다. 고구려는 수많은 산성을 쌓아 외적의 침입을 막았습니다.',
    icon: '🏰',
  },
  {
    id: 'writing_system',
    name: '기록 문화',
    category: 'culture',
    era: 3,
    cost: { turns: 5, gold: 300 },
    prerequisites: ['temple_building'],
    effect: {
      type: 'special',
      description: '역사 기록, 문화 점수 +50',
    },
    historicalInfo: '역사서를 편찬하고 기록을 남기는 문화입니다. 삼국사기, 삼국유사 등 귀중한 역사서가 후대에 편찬되었습니다.',
    icon: '📜',
  },
];

// ============================================
// 유틸리티 함수
// ============================================

// 카테고리별 기술 가져오기
export const getTechsByCategory = (category: TechCategory): Technology[] => {
  return TECH_TREE.filter(tech => tech.category === category);
};

// 시대별 기술 가져오기
export const getTechsByEra = (era: 1 | 2 | 3): Technology[] => {
  return TECH_TREE.filter(tech => tech.era === era);
};

// 기술 ID로 찾기
export const getTechById = (id: string): Technology | undefined => {
  return TECH_TREE.find(tech => tech.id === id);
};

// 기술 연구 가능 여부 확인
export const canResearchTech = (
  techId: string,
  completedTechs: string[],
  currentGold: number
): { canResearch: boolean; reason?: string } => {
  const tech = getTechById(techId);
  if (!tech) {
    return { canResearch: false, reason: '존재하지 않는 기술입니다.' };
  }
  
  if (completedTechs.includes(techId)) {
    return { canResearch: false, reason: '이미 연구한 기술입니다.' };
  }
  
  // 선행 기술 확인
  for (const prereq of tech.prerequisites) {
    if (!completedTechs.includes(prereq)) {
      const prereqTech = getTechById(prereq);
      return { 
        canResearch: false, 
        reason: `선행 기술 필요: ${prereqTech?.name || prereq}` 
      };
    }
  }
  
  if (currentGold < tech.cost.gold) {
    return { canResearch: false, reason: `금 부족 (필요: ${tech.cost.gold})` };
  }
  
  return { canResearch: true };
};

// 카테고리 이름
export const CATEGORY_NAMES: Record<TechCategory, string> = {
  military: '군사',
  economy: '경제',
  culture: '문화',
  diplomacy: '외교',
};

// 카테고리 색상
export const CATEGORY_COLORS: Record<TechCategory, string> = {
  military: 'from-red-500 to-red-700',
  economy: 'from-green-500 to-green-700',
  culture: 'from-purple-500 to-purple-700',
  diplomacy: 'from-blue-500 to-blue-700',
};

// 시대 이름
export const ERA_NAMES: Record<1 | 2 | 3, string> = {
  1: '초기 (300-400년)',
  2: '중기 (400-500년)',
  3: '후기 (500-660년)',
};
