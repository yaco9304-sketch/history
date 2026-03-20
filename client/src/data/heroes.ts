// ============================================
// 역사전쟁: 삼국시대 - 위인 시스템 데이터
// ============================================

import { Nation } from '../types';

// 위인 효과 타입
export type HeroEffectType = 
  | 'military_boost'    // 군사력 증가
  | 'economy_boost'     // 경제력 증가
  | 'culture_boost'     // 문화력 증가
  | 'diplomacy_boost'   // 외교력 증가
  | 'defense_boost'     // 방어력 증가
  | 'morale_boost'      // 민심 증가
  | 'gold_boost';       // 금 수입 증가

export interface HeroEffect {
  type: HeroEffectType;
  value: number; // 퍼센트 또는 고정값
  isPercent: boolean;
}

export interface HistoricalHero {
  id: string;
  name: string;
  nation: Nation;
  era: string;
  title: string;
  portrait?: string; // 추후 이미지 추가
  specialAbility: {
    name: string;
    description: string;
    effect: HeroEffect;
    duration: number; // 지속 턴
    cooldown: number; // 재사용 대기 턴
  };
  historicalFact: string;
  unlockCondition: {
    type: 'turn' | 'event' | 'stat';
    requirement: number | string;
  };
}

// ============================================
// 삼국 위인 데이터 (국가별 2명씩, 총 6명)
// ============================================

export const HEROES: HistoricalHero[] = [
  // ============================================
  // 고구려 위인
  // ============================================
  {
    id: 'gwanggaeto',
    name: '광개토대왕',
    nation: 'goguryeo',
    era: '391-413년',
    title: '정복왕',
    specialAbility: {
      name: '정복왕의 기상',
      description: '전투 시 군사력 25% 증가. 영토 확장의 위대한 기운이 군대를 고무시킵니다.',
      effect: { type: 'military_boost', value: 25, isPercent: true },
      duration: 3,
      cooldown: 10,
    },
    historicalFact: '고구려 제19대 왕. 영토를 크게 확장하여 만주와 한반도 북부를 지배했습니다. 광개토대왕비에 그의 위대한 업적이 기록되어 있습니다. "영락대왕"이라고도 불립니다.',
    unlockCondition: { type: 'turn', requirement: 5 },
  },
  {
    id: 'eulji',
    name: '을지문덕',
    nation: 'goguryeo',
    era: '6세기 말-7세기 초',
    title: '살수대첩의 영웅',
    specialAbility: {
      name: '청야전술',
      description: '방어 시 적에게 주는 피해 100% 증가. 지형과 전략을 활용한 완벽한 방어전입니다.',
      effect: { type: 'defense_boost', value: 100, isPercent: true },
      duration: 2,
      cooldown: 8,
    },
    historicalFact: '612년 수나라 양제의 113만 대군을 살수(청천강)에서 격파했습니다. 수나라 30만 별동대 중 2,700명만이 살아 돌아갔다고 전해집니다. "여수장우중문시(與隋將于仲文詩)"라는 시로도 유명합니다.',
    unlockCondition: { type: 'turn', requirement: 10 },
  },
  
  // ============================================
  // 백제 위인
  // ============================================
  {
    id: 'geunchogo',
    name: '근초고왕',
    nation: 'baekje',
    era: '346-375년',
    title: '해상왕',
    specialAbility: {
      name: '해상 무역로',
      description: '경제력 30% 증가. 중국, 일본과의 활발한 해상 무역으로 부를 축적합니다.',
      effect: { type: 'economy_boost', value: 30, isPercent: true },
      duration: 5,
      cooldown: 12,
    },
    historicalFact: '백제 제13대 왕. 백제의 전성기를 이끌었습니다. 고구려를 공격하여 고국원왕을 전사시켰고, 마한을 완전히 통합했습니다. 일본에 칠지도를 하사하고 중국 동진과 활발히 교류했습니다.',
    unlockCondition: { type: 'turn', requirement: 5 },
  },
  {
    id: 'gyebaek',
    name: '계백',
    nation: 'baekje',
    era: '?-660년',
    title: '결사대장',
    specialAbility: {
      name: '결사 항전',
      description: '전투 시 군사력 50% 증가 (위기 상황에서 더 강력). 죽음을 각오한 결사대의 힘입니다.',
      effect: { type: 'military_boost', value: 50, isPercent: true },
      duration: 2,
      cooldown: 15,
    },
    historicalFact: '백제의 마지막 충신. 황산벌 전투에서 5천 결사대를 이끌고 5만 신라군에 맞서 4번이나 승리한 뒤 장렬히 전사했습니다. 출전 전 처자식을 자신의 손으로 죽이고 나갔다는 일화가 전해집니다.',
    unlockCondition: { type: 'stat', requirement: 50 }, // 군사력 50 이하일 때 해금
  },
  
  // ============================================
  // 신라 위인
  // ============================================
  {
    id: 'kimyushin',
    name: '김유신',
    nation: 'silla',
    era: '595-673년',
    title: '삼국통일의 주역',
    specialAbility: {
      name: '통일의 의지',
      description: '외교 성공률 50% 증가. 강력한 리더십으로 동맹과 협력을 이끌어냅니다.',
      effect: { type: 'diplomacy_boost', value: 50, isPercent: true },
      duration: 3,
      cooldown: 10,
    },
    historicalFact: '금관가야 왕족 출신으로 화랑 출신의 장군. 삼국통일의 핵심 인물입니다. 태대각간이라는 신라 최고 관직에 올랐으며, 사후 흥무대왕으로 추존되었습니다.',
    unlockCondition: { type: 'turn', requirement: 5 },
  },
  {
    id: 'seondeok',
    name: '선덕여왕',
    nation: 'silla',
    era: '632-647년',
    title: '최초의 여왕',
    specialAbility: {
      name: '문화 부흥',
      description: '문화 점수 획득 40% 증가. 학문과 예술을 장려하여 문화적 발전을 이룹니다.',
      effect: { type: 'culture_boost', value: 40, isPercent: true },
      duration: 5,
      cooldown: 12,
    },
    historicalFact: '신라 제27대 왕, 한국 역사상 최초의 여왕. 첨성대를 건립하고 황룡사 9층 목탑을 세웠습니다. 김춘추, 김유신 등 인재를 등용하여 삼국통일의 기틀을 마련했습니다.',
    unlockCondition: { type: 'turn', requirement: 8 },
  },
];

// ============================================
// 위인 관련 유틸리티 함수
// ============================================

// 국가별 위인 가져오기
export const getHeroesByNation = (nation: Nation): HistoricalHero[] => {
  return HEROES.filter(hero => hero.nation === nation);
};

// 해금된 위인 확인
export const isHeroUnlocked = (
  hero: HistoricalHero,
  currentTurn: number,
  nationStats: { military: number }
): boolean => {
  switch (hero.unlockCondition.type) {
    case 'turn':
      return currentTurn >= (hero.unlockCondition.requirement as number);
    case 'stat':
      // 계백은 군사력이 낮을 때 해금 (위기 상황)
      if (hero.id === 'gyebaek') {
        return nationStats.military <= (hero.unlockCondition.requirement as number);
      }
      return true;
    default:
      return false;
  }
};

// 위인 ID로 위인 찾기
export const getHeroById = (id: string): HistoricalHero | undefined => {
  return HEROES.find(hero => hero.id === id);
};

// 위인 효과 적용 계산
export const calculateHeroEffect = (
  baseValue: number,
  effect: HeroEffect
): number => {
  if (effect.isPercent) {
    return Math.floor(baseValue * (1 + effect.value / 100));
  }
  return baseValue + effect.value;
};
