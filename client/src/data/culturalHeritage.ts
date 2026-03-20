// ============================================
// 역사전쟁: 삼국시대 - 문화유산 시스템
// ============================================

import { Nation } from '../types';

export type HeritageType = 'architecture' | 'artifact' | 'monument';

export interface CulturalHeritage {
  id: string;
  name: string;
  nation: Nation;
  type: HeritageType;
  constructionCost: {
    turns: number;
    gold: number;
    culturePoints: number;
  };
  effect: {
    cultureBonus: number;
    specialEffect?: string;
  };
  historicalInfo: string;
  imageUrl?: string;
  unlockTech?: string; // 선행 기술 ID
}

// ============================================
// 문화유산 데이터 (국가별 2개씩, 총 6개)
// ============================================

export const CULTURAL_HERITAGES: CulturalHeritage[] = [
  // ============================================
  // 고구려 문화유산
  // ============================================
  {
    id: 'gwanggaeto_stele',
    name: '광개토대왕비',
    nation: 'goguryeo',
    type: 'monument',
    constructionCost: { turns: 3, gold: 200, culturePoints: 50 },
    effect: { 
      cultureBonus: 30, 
      specialEffect: '군사력 +10%' 
    },
    historicalInfo: '414년 광개토대왕의 아들 장수왕이 아버지의 업적을 기리기 위해 건립했습니다. 높이 6.39m의 거대한 비석에는 고구려의 건국 설화와 광개토대왕의 정복 업적이 1,775자로 새겨져 있습니다. 현재 중국 지린성 지안시에 있으며, 한국 고대사 연구의 귀중한 사료입니다.',
  },
  {
    id: 'anak_tomb',
    name: '안악 3호분 벽화',
    nation: 'goguryeo',
    type: 'artifact',
    constructionCost: { turns: 2, gold: 150, culturePoints: 30 },
    effect: { 
      cultureBonus: 25 
    },
    historicalInfo: '357년에 만들어진 고구려 고분입니다. 무덤 주인의 초상, 행렬도, 부엌 그림 등 당시 귀족의 생활상이 생생하게 그려져 있습니다. 고구려 벽화 중 제작 연대가 확실한 가장 오래된 것으로, 고구려인의 복식, 음식, 생활 모습을 알 수 있는 귀중한 자료입니다.',
  },
  
  // ============================================
  // 백제 문화유산
  // ============================================
  {
    id: 'mireuksa',
    name: '미륵사',
    nation: 'baekje',
    type: 'architecture',
    constructionCost: { turns: 5, gold: 350, culturePoints: 80 },
    effect: { 
      cultureBonus: 50, 
      specialEffect: '문화 승리 요구 -50점' 
    },
    historicalInfo: '639년 무왕이 창건한 동아시아 최대 규모의 사찰입니다. "서동 설화"의 주인공 무왕이 왕비의 소원을 들어 지었다고 전해집니다. 서탑(국보 제11호)이 현재까지 남아 있으며, 2009년 해체 복원 과정에서 사리장엄구가 발견되어 큰 주목을 받았습니다.',
    unlockTech: 'temple_building',
  },
  {
    id: 'chiljido',
    name: '칠지도',
    nation: 'baekje',
    type: 'artifact',
    constructionCost: { turns: 2, gold: 180, culturePoints: 40 },
    effect: { 
      cultureBonus: 20, 
      specialEffect: '외교 성공률 +15%' 
    },
    historicalInfo: '369년 근초고왕 시대에 제작된 것으로 추정되는 철제 칼입니다. 일곱 개의 가지가 뻗어 나온 독특한 모양으로, 현재 일본 이소노카미 신궁에 보관되어 있습니다. 칼날에 새겨진 61자의 명문은 백제와 왜의 관계를 보여주는 귀중한 사료입니다.',
  },
  
  // ============================================
  // 신라 문화유산
  // ============================================
  {
    id: 'hwangnyongsa',
    name: '황룡사 9층 목탑',
    nation: 'silla',
    type: 'architecture',
    constructionCost: { turns: 6, gold: 400, culturePoints: 100 },
    effect: { 
      cultureBonus: 60, 
      specialEffect: '문화 승리 요구 -100점' 
    },
    historicalInfo: '645년 선덕여왕 시대에 완공되었습니다. 높이 약 80m로 당시 동아시아에서 가장 높은 건축물이었습니다. 자장율사의 건의로 삼국통일의 염원을 담아 세워졌으며, 백제의 장인 아비지가 건설을 지휘했습니다. 1238년 몽골 침입 때 소실되었습니다.',
    unlockTech: 'temple_building',
  },
  {
    id: 'cheomseongdae',
    name: '첨성대',
    nation: 'silla',
    type: 'architecture',
    constructionCost: { turns: 3, gold: 250, culturePoints: 60 },
    effect: { 
      cultureBonus: 35, 
      specialEffect: '기술 연구 속도 +20%' 
    },
    historicalInfo: '634년 선덕여왕 시대에 건립된 천문 관측대입니다. 높이 약 9.17m로 362개의 돌로 쌓았는데, 이는 음력 1년의 날수와 같습니다. 현재까지 남아 있는 동아시아 최고(最古)의 천문대로, 과학 기술의 발전을 보여주는 국보 제31호입니다.',
    unlockTech: 'writing_system',
  },
];

// ============================================
// 유틸리티 함수
// ============================================

// 국가별 문화유산 가져오기
export const getHeritagesByNation = (nation: Nation): CulturalHeritage[] => {
  return CULTURAL_HERITAGES.filter(h => h.nation === nation);
};

// 문화유산 ID로 찾기
export const getHeritageById = (id: string): CulturalHeritage | undefined => {
  return CULTURAL_HERITAGES.find(h => h.id === id);
};

// 문화유산 건설 가능 여부 확인
export const canBuildHeritage = (
  heritageId: string,
  completedTechs: string[],
  currentGold: number,
  currentCulturePoints: number,
  builtHeritages: string[]
): { canBuild: boolean; reason?: string } => {
  const heritage = getHeritageById(heritageId);
  if (!heritage) {
    return { canBuild: false, reason: '존재하지 않는 문화유산입니다.' };
  }
  
  if (builtHeritages.includes(heritageId)) {
    return { canBuild: false, reason: '이미 건설한 문화유산입니다.' };
  }
  
  // 선행 기술 확인
  if (heritage.unlockTech && !completedTechs.includes(heritage.unlockTech)) {
    return { 
      canBuild: false, 
      reason: `선행 기술 필요: ${heritage.unlockTech}` 
    };
  }
  
  if (currentGold < heritage.constructionCost.gold) {
    return { canBuild: false, reason: `금 부족 (필요: ${heritage.constructionCost.gold})` };
  }
  
  if (currentCulturePoints < heritage.constructionCost.culturePoints) {
    return { canBuild: false, reason: `문화 점수 부족 (필요: ${heritage.constructionCost.culturePoints})` };
  }
  
  return { canBuild: true };
};

// 유형 이름
export const TYPE_NAMES: Record<HeritageType, string> = {
  architecture: '건축물',
  artifact: '유물',
  monument: '기념물',
};

// 유형 아이콘
export const TYPE_ICONS: Record<HeritageType, string> = {
  architecture: '🏛️',
  artifact: '🏺',
  monument: '🗿',
};
