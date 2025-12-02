import { NationInfo, NationStats } from '../types';

// 국가 정보
export const NATIONS: Record<string, NationInfo> = {
  goguryeo: {
    id: 'goguryeo',
    name: '고구려',
    englishName: 'Goguryeo',
    color: '#D32F2F',
    colorDark: '#C2185B',
    traits: ['💪 군사 강국', '🏔️ 북방의 패자', '⚔️ 대륙 정복'],
    description: '강력한 군사력과 드넓은 영토를 자랑하는 북방의 강국. 광개토대왕의 정복 정신을 이어받아 대륙을 호령합니다.',
  },
  baekje: {
    id: 'baekje',
    name: '백제',
    englishName: 'Baekje',
    color: '#1976D2',
    colorDark: '#1565C0',
    traits: ['🎨 문화 선진국', '🚢 해상 무역', '🤝 외교의 달인'],
    description: '세련된 문화와 해상 무역으로 번영한 나라. 일본, 중국과의 활발한 교류로 동아시아 문화 발전에 기여했습니다.',
  },
  silla: {
    id: 'silla',
    name: '신라',
    englishName: 'Silla',
    color: '#F57C00',
    colorDark: '#EF6C00',
    traits: ['👑 화랑도 정신', '💎 금관의 나라', '🏆 삼국통일'],
    description: '화랑도의 충성심과 결속력으로 뭉친 나라. 끊임없는 노력으로 결국 삼국통일의 위업을 달성합니다.',
  },
};

// 초기 스탯
export const INITIAL_STATS: Record<string, NationStats> = {
  goguryeo: {
    military: 150,
    economy: 100,
    diplomacy: 80,
    culture: 90,
    gold: 1000,
    population: 80000,
    morale: 70,
  },
  baekje: {
    military: 100,
    economy: 130,
    diplomacy: 120,
    culture: 120,
    gold: 1200,
    population: 60000,
    morale: 75,
  },
  silla: {
    military: 90,
    economy: 110,
    diplomacy: 100,
    culture: 100,
    gold: 800,
    population: 50000,
    morale: 80,
  },
};

// 스탯 이름 (한글)
export const STAT_NAMES: Record<string, string> = {
  military: '군사력',
  economy: '경제력',
  diplomacy: '외교력',
  culture: '문화력',
  gold: '재화',
  population: '인구',
  morale: '민심',
};

// 스탯 아이콘
export const STAT_ICONS: Record<string, string> = {
  military: '🗡️',
  economy: '🌾',
  diplomacy: '🤝',
  culture: '📚',
  gold: '💰',
  population: '👥',
  morale: '😊',
};

// 스탯 색상
export const STAT_COLORS: Record<string, string> = {
  military: '#F44336',
  economy: '#4CAF50',
  diplomacy: '#2196F3',
  culture: '#9C27B0',
  gold: '#FFD700',
  population: '#607D8B',
  morale: '#FF9800',
};
