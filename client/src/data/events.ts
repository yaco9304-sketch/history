import { HistoricalEvent } from '../types';

// ============================================
// 역사전쟁:삼국시대 역사 이벤트 데이터
// 교육과정 연계: 삼국의 건국, 발전, 주요 인물, 문화유산
// ============================================

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  // ============================================
  // 1. 삼국의 건국 이야기
  // ============================================
  {
    id: 'goguryeo_foundation',
    year: 37,
    targetNation: 'goguryeo',
    title: '고구려 건국',
    description: '주몽이 졸본 지역에서 새로운 나라를 세우려 합니다. 어떤 방식으로 나라의 기틀을 다지시겠습니까?',
    historicalContext: '기원전 37년, 동명성왕 주몽이 부여에서 남하하여 졸본에서 고구려를 건국했습니다. 주몽은 활을 잘 쏘아 "활을 잘 쏘는 사람"이라는 뜻의 이름을 가졌습니다.',
    choices: [
      {
        id: 'A',
        text: '주변 부족들을 정복하여 영토를 넓힌다',
        effects: { military: 40, economy: 10, diplomacy: -10 },
        isHistorical: true,
        tooltip: '주몽은 비류국, 행인국 등을 정복하며 고구려의 기틀을 다졌어요',
        risk: 'normal',
      },
      {
        id: 'B',
        text: '농사와 사냥으로 백성들의 생활을 안정시킨다',
        effects: { economy: 30, morale: 20 },
        isHistorical: false,
        tooltip: '안정적이지만 성장이 더딜 수 있어요',
        risk: 'safe',
      },
      {
        id: 'C',
        text: '주변 부족들과 동맹을 맺어 세력을 키운다',
        effects: { diplomacy: 35, military: 10 },
        isHistorical: false,
        tooltip: '평화로운 방법이지만 시간이 걸려요',
        risk: 'safe',
      },
    ],
    difficulty: 'normal',
    category: 'politics',
  },
  {
    id: 'baekje_foundation',
    year: 18,
    targetNation: 'baekje',
    title: '백제 건국',
    description: '온조가 한강 유역에서 새로운 나라를 세우려 합니다. 도읍을 어디에 정하시겠습니까?',
    historicalContext: '기원전 18년, 온조왕이 고구려에서 남하하여 위례성에 백제를 건국했습니다. 온조는 주몽의 아들로, 형 비류와 함께 남쪽으로 내려왔습니다.',
    choices: [
      {
        id: 'A',
        text: '한강 유역의 위례성에 도읍을 정한다',
        effects: { economy: 35, military: 15, morale: 20 },
        isHistorical: true,
        tooltip: '온조는 위례성을 도읍으로 정하고 백제를 건국했어요. 한강의 풍요로운 땅이었죠.',
        risk: 'safe',
      },
      {
        id: 'B',
        text: '바닷가 미추홀에 도읍을 정한다',
        effects: { economy: 20, diplomacy: 25 },
        isHistorical: false,
        tooltip: '비류가 선택한 곳이에요. 역사에서는 땅이 습해서 살기 어려웠대요.',
        risk: 'risky',
      },
    ],
    difficulty: 'easy',
    category: 'politics',
  },
  {
    id: 'silla_foundation',
    year: 57,
    targetNation: 'silla',
    title: '신라 건국',
    description: '박혁거세가 경주 지역에서 여섯 촌장들의 추대를 받았습니다. 나라를 어떻게 다스리시겠습니까?',
    historicalContext: '기원전 57년, 박혁거세가 경주 지역 여섯 마을의 추대를 받아 서라벌을 세웠습니다. 이것이 나중에 신라가 됩니다. 알에서 태어났다는 신화가 전해집니다.',
    choices: [
      {
        id: 'A',
        text: '여섯 촌장들과 함께 의논하며 다스린다',
        effects: { diplomacy: 30, morale: 25, culture: 15 },
        isHistorical: true,
        tooltip: '신라는 화백 제도로 중요한 일을 함께 의논했어요',
        risk: 'safe',
      },
      {
        id: 'B',
        text: '강력한 왕권으로 중앙집권을 이룬다',
        effects: { military: 25, economy: 20, diplomacy: -15 },
        isHistorical: false,
        tooltip: '초기 신라는 귀족들의 힘이 강했어요',
        risk: 'normal',
      },
    ],
    difficulty: 'easy',
    category: 'politics',
  },

  // ============================================
  // 2. 고대 시기 주요 인물
  // ============================================
  
  // 근초고왕 (백제)
  {
    id: 'geunchogo_expansion',
    year: 369,
    targetNation: 'baekje',
    title: '근초고왕의 전성기',
    description: '근초고왕이 즉위하여 백제의 전성기를 이끌고 있습니다. 어떤 정책을 펼치시겠습니까?',
    historicalContext: '근초고왕은 백제의 전성기를 이끈 왕입니다. 고구려 평양성을 공격하여 고국원왕을 전사시켰고, 마한을 완전히 통합했습니다. 또한 중국, 일본과 활발히 교류하며 백제의 문화를 전파했습니다.',
    choices: [
      {
        id: 'A',
        text: '고구려를 공격하여 북쪽으로 영토를 넓힌다',
        effects: { military: 45, morale: 30, diplomacy: -20 },
        isHistorical: true,
        tooltip: '근초고왕은 371년 평양성 전투에서 고국원왕을 전사시켰어요',
        risk: 'risky',
      },
      {
        id: 'B',
        text: '중국과 일본에 사신을 보내 교류를 확대한다',
        effects: { diplomacy: 40, culture: 30, economy: 25 },
        isHistorical: true,
        tooltip: '근초고왕은 동진, 왜와 활발히 교류했어요. 칠지도를 보내기도 했죠.',
        risk: 'safe',
      },
      {
        id: 'C',
        text: '남쪽 마한 지역을 완전히 통합한다',
        effects: { economy: 35, military: 20, population: 3000 },
        isHistorical: true,
        tooltip: '근초고왕 때 마한이 완전히 백제에 통합되었어요',
        risk: 'safe',
      },
    ],
    difficulty: 'normal',
    category: 'military',
  },

  // 광개토대왕 (고구려)
  {
    id: 'gwanggaeto_391',
    year: 391,
    targetNation: 'goguryeo',
    title: '광개토대왕의 정복 전쟁',
    description: '18세의 젊은 왕 광개토대왕이 즉위했습니다. "영토를 넓힌 왕"이라는 이름에 걸맞은 정책을 펼치시겠습니까?',
    historicalContext: '광개토대왕(재위 391-412)은 고구려 역사상 가장 넓은 영토를 차지한 왕입니다. 백제를 공격하고, 신라를 도와 왜구를 물리쳤으며, 만주 지역까지 영토를 넓혔습니다. 광개토대왕릉비에 그의 업적이 새겨져 있습니다.',
    choices: [
      {
        id: 'A',
        text: '대규모 정복 전쟁을 시작한다',
        effects: { military: 60, economy: -20, diplomacy: -15, morale: 30 },
        isHistorical: true,
        tooltip: '광개토대왕은 64개 성, 1,400개 마을을 정복했어요',
        risk: 'risky',
      },
      {
        id: 'B',
        text: '신라의 구원 요청에 응하여 왜구를 물리친다',
        effects: { military: 35, diplomacy: 40, morale: 25 },
        isHistorical: true,
        tooltip: '400년, 신라를 도와 왜군 5만을 물리쳤어요',
        risk: 'normal',
      },
      {
        id: 'C',
        text: '내치에 집중하며 국력을 기른다',
        effects: { economy: 40, culture: 25, morale: 15 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다',
        risk: 'safe',
      },
    ],
    difficulty: 'normal',
    category: 'military',
  },

  // 장수왕의 남하 정책
  {
    id: 'jangsu_pyongyang',
    year: 427,
    targetNation: 'goguryeo',
    title: '장수왕의 평양 천도',
    description: '장수왕이 수도를 평양으로 옮기려 합니다. 이는 남쪽 진출의 신호탄이 될 것입니다.',
    historicalContext: '장수왕(재위 413-491)은 평양으로 천도하여 남쪽 진출의 기반을 마련했습니다. 이후 백제 한성을 함락시키고 개로왕을 죽였습니다. 장수왕은 79년간 재위하며 고구려의 전성기를 이어갔습니다.',
    choices: [
      {
        id: 'A',
        text: '평양으로 천도하고 남진 정책을 추진한다',
        effects: { military: 30, economy: 25, diplomacy: -20 },
        isHistorical: true,
        tooltip: '장수왕은 475년 백제 한성을 함락시켰어요',
        risk: 'normal',
      },
      {
        id: 'B',
        text: '국내성을 유지하며 북방을 강화한다',
        effects: { military: 20, economy: 15 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다',
        risk: 'safe',
      },
    ],
    difficulty: 'normal',
    category: 'politics',
  },

  // 김유신과 김춘추 (신라)
  {
    id: 'kim_chunchu_diplomacy',
    year: 648,
    targetNation: 'silla',
    title: '김춘추의 외교 전략',
    description: '김춘추가 당나라에 가서 동맹을 제안하려 합니다. 백제와 고구려를 상대하기 위한 결정적 선택입니다.',
    historicalContext: '김춘추(604-661)는 뛰어난 외교가로, 당나라와 나당동맹을 맺어 삼국통일의 기반을 마련했습니다. 그는 나중에 태종무열왕이 되어 직접 통일 전쟁을 이끌었습니다.',
    choices: [
      {
        id: 'A',
        text: '당나라와 나당동맹을 맺는다',
        effects: { diplomacy: 50, military: 30, culture: -15 },
        isHistorical: true,
        tooltip: '나당동맹으로 신라는 삼국통일의 발판을 마련했어요',
        risk: 'risky',
      },
      {
        id: 'B',
        text: '고구려와 화친하여 백제를 견제한다',
        effects: { diplomacy: 25, military: 15 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다. 대체역사가 시작됩니다.',
        risk: 'normal',
      },
      {
        id: 'C',
        text: '자주적으로 군사력을 키워 대응한다',
        effects: { military: 35, morale: 20, diplomacy: -10 },
        isHistorical: false,
        tooltip: '독자 노선이지만 힘든 싸움이 될 거예요',
        risk: 'risky',
      },
    ],
    difficulty: 'hard',
    category: 'diplomacy',
  },
  {
    id: 'kim_yushin_hwangsanbeol',
    year: 660,
    targetNation: 'silla',
    title: '김유신의 황산벌 전투',
    description: '백제 정벌을 위해 5만 대군을 이끌고 출전했습니다. 계백의 결사대 5천 명이 막아서고 있습니다.',
    historicalContext: '김유신(595-673)은 신라의 명장으로, 삼국통일의 핵심 인물입니다. 황산벌 전투에서 계백의 결사대를 물리치고 백제를 멸망시키는 데 결정적 역할을 했습니다.',
    choices: [
      {
        id: 'A',
        text: '화랑 관창을 앞세워 결사대에 맞선다',
        effects: { military: 45, morale: 50, economy: -30 },
        isHistorical: true,
        tooltip: '관창의 희생으로 신라군의 사기가 올라 승리했어요',
        risk: 'risky',
      },
      {
        id: 'B',
        text: '우회하여 백제 수도를 직접 공격한다',
        effects: { military: 30, morale: 10 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다',
        risk: 'normal',
      },
      {
        id: 'C',
        text: '협상을 시도하여 피해를 줄인다',
        effects: { diplomacy: 20, morale: -20 },
        isHistorical: false,
        tooltip: '계백은 협상할 의사가 없었어요',
        risk: 'safe',
      },
    ],
    difficulty: 'hard',
    category: 'military',
  },

  // ============================================
  // 3. 대표적인 문화유산
  // ============================================

  // 불교 수용과 발전
  {
    id: 'buddhism_goguryeo_372',
    year: 372,
    targetNation: 'goguryeo',
    title: '고구려 불교 전래',
    description: '전진에서 승려 순도가 불상과 경문을 가지고 왔습니다. 새로운 종교를 어떻게 받아들이시겠습니까?',
    historicalContext: '소수림왕 2년(372년), 중국 전진에서 순도가 불교를 전했습니다. 고구려는 삼국 중 가장 먼저 불교를 받아들였고, 2년 뒤 초문사와 이불란사를 세웠습니다.',
    choices: [
      {
        id: 'A',
        text: '불교를 공인하고 절을 짓는다',
        effects: { culture: 35, morale: 25, gold: -150 },
        isHistorical: true,
        tooltip: '소수림왕은 불교를 공인하고 초문사를 세웠어요',
        risk: 'safe',
      },
      {
        id: 'B',
        text: '전통 신앙을 유지하고 거부한다',
        effects: { morale: 5, culture: -15 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다',
        risk: 'normal',
      },
    ],
    difficulty: 'easy',
    category: 'culture',
  },
  {
    id: 'buddhism_baekje_384',
    year: 384,
    targetNation: 'baekje',
    title: '백제 불교 수용',
    description: '인도 승려 마라난타가 동진을 거쳐 백제에 왔습니다. 침류왕이 직접 마중을 나갔습니다.',
    historicalContext: '침류왕 원년(384년), 인도 승려 마라난타가 백제에 불교를 전했습니다. 침류왕은 직접 마중하고 궁에 모셨으며, 한산에 절을 세웠습니다.',
    choices: [
      {
        id: 'A',
        text: '불교를 받아들이고 절을 짓는다',
        effects: { culture: 40, morale: 20, gold: -100 },
        isHistorical: true,
        tooltip: '백제는 불교를 받아들여 찬란한 불교 문화를 꽃피웠어요',
        risk: 'safe',
      },
      {
        id: 'B',
        text: '승려만 받아들이고 포교는 제한한다',
        effects: { culture: 15, morale: 5 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다',
        risk: 'safe',
      },
    ],
    difficulty: 'easy',
    category: 'culture',
  },
  {
    id: 'buddhism_silla_527',
    year: 527,
    targetNation: 'silla',
    title: '이차돈의 순교',
    description: '신라에서는 귀족들이 불교를 반대합니다. 이차돈이 목숨을 바쳐 불교를 전하겠다고 합니다.',
    historicalContext: '법흥왕 14년(527년), 이차돈이 순교하여 신라에 불교가 공인되었습니다. 귀족들의 반대가 심했지만, 이차돈의 희생으로 불교가 받아들여졌고 이후 신라 문화의 중심이 되었습니다.',
    choices: [
      {
        id: 'A',
        text: '이차돈의 순교를 받아들이고 불교를 공인한다',
        effects: { culture: 45, morale: 30, diplomacy: -10, gold: -200 },
        isHistorical: true,
        tooltip: '이차돈의 순교 후 흰 피가 나왔다는 전설이 있어요',
        risk: 'normal',
      },
      {
        id: 'B',
        text: '귀족들의 의견을 따라 불교를 거부한다',
        effects: { diplomacy: 20, morale: -15, culture: -20 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다. 귀족들은 좋아하겠지만...',
        risk: 'safe',
      },
    ],
    difficulty: 'normal',
    category: 'culture',
  },

  // 미륵사 (백제)
  {
    id: 'mireuksa_temple',
    year: 602,
    targetNation: 'baekje',
    title: '미륵사 건립',
    description: '무왕이 왕비와 함께 사자사로 가다가 연못에서 미륵삼존불이 나타났습니다. 이곳에 절을 세우시겠습니까?',
    historicalContext: '미륵사는 백제 무왕 때 세워진 삼국시대 최대의 절입니다. 동양 최대의 석탑인 미륵사지 석탑(국보)이 있으며, 백제의 뛰어난 건축 기술을 보여줍니다. 2009년 석탑 해체 시 금제 사리봉안기가 발견되었습니다.',
    choices: [
      {
        id: 'A',
        text: '삼국 최대의 절, 미륵사를 건립한다',
        effects: { culture: 50, morale: 35, gold: -400, economy: -20 },
        isHistorical: true,
        tooltip: '미륵사는 동양 최대 규모의 절이었어요. 미륵사지 석탑은 국보입니다.',
        risk: 'normal',
      },
      {
        id: 'B',
        text: '작은 사찰만 세우고 비용을 아낀다',
        effects: { culture: 20, gold: -100 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다',
        risk: 'safe',
      },
    ],
    difficulty: 'normal',
    category: 'culture',
  },

  // 불국사와 석굴암 (신라)
  {
    id: 'bulguksa_seokguram',
    year: 751,
    targetNation: 'silla',
    title: '불국사와 석굴암 건립',
    description: '재상 김대성이 전생의 부모를 위해 석굴암을, 현생의 부모를 위해 불국사를 짓겠다고 합니다.',
    historicalContext: '불국사와 석굴암은 경덕왕 10년(751년) 김대성이 짓기 시작했습니다. 불국사의 다보탑, 석가탑과 석굴암 본존불은 신라 불교 예술의 걸작입니다. 1995년 유네스코 세계문화유산으로 등재되었습니다.',
    choices: [
      {
        id: 'A',
        text: '국가적 지원으로 불국사와 석굴암을 건립한다',
        effects: { culture: 60, morale: 40, gold: -500, economy: -30 },
        isHistorical: true,
        tooltip: '불국사와 석굴암은 유네스코 세계문화유산이에요!',
        risk: 'normal',
      },
      {
        id: 'B',
        text: '개인 사업으로 두고 지원하지 않는다',
        effects: { culture: 25, gold: -100 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다',
        risk: 'safe',
      },
    ],
    difficulty: 'normal',
    category: 'culture',
  },

  // 첨성대 (신라)
  {
    id: 'cheomseongdae',
    year: 647,
    targetNation: 'silla',
    title: '첨성대 건립',
    description: '선덕여왕이 별을 관측할 수 있는 건축물을 세우려 합니다.',
    historicalContext: '첨성대는 선덕여왕 때 세워진 동아시아 최고(最古)의 천문대입니다. 362개의 돌로 쌓았는데, 이는 음력 1년의 날수와 같습니다. 과학적 설계와 아름다운 곡선미를 갖춘 신라의 자랑입니다.',
    choices: [
      {
        id: 'A',
        text: '첨성대를 건립하여 천문을 관측한다',
        effects: { culture: 35, economy: 15, gold: -150 },
        isHistorical: true,
        tooltip: '첨성대는 현존하는 동양 최고의 천문대예요',
        risk: 'safe',
      },
      {
        id: 'B',
        text: '군사 시설에 투자한다',
        effects: { military: 25, gold: -150 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다',
        risk: 'safe',
      },
    ],
    difficulty: 'easy',
    category: 'culture',
  },

  // ============================================
  // 4. 주요 전쟁과 외교
  // ============================================

  // 살수대첩
  {
    id: 'salsu_612',
    year: 612,
    targetNation: 'goguryeo',
    title: '살수대첩',
    description: '수나라 113만 대군이 쳐들어왔습니다! 을지문덕 장군은 어떤 전략을 펼치시겠습니까?',
    historicalContext: '영양왕 23년(612년), 수 양제가 113만 대군으로 고구려를 침공했습니다. 을지문덕은 후퇴하며 적을 유인한 뒤, 살수(청천강)에서 대승을 거두었습니다. 30만 5천 명 중 2,700명만 살아 돌아갔다고 합니다.',
    choices: [
      {
        id: 'A',
        text: '을지문덕의 유인 작전을 실행한다',
        effects: { military: 70, morale: 50, diplomacy: -25 },
        isHistorical: true,
        tooltip: '을지문덕의 "오언시"로 적을 조롱하고 유인했어요',
        risk: 'risky',
      },
      {
        id: 'B',
        text: '성을 굳게 지키며 장기전을 펼친다',
        effects: { military: 30, economy: -30, morale: 10 },
        isHistorical: false,
        tooltip: '수나라 군대는 보급이 어려웠어요',
        risk: 'normal',
      },
      {
        id: 'C',
        text: '화친을 제안하여 위기를 모면한다',
        effects: { diplomacy: 15, morale: -40, gold: -800 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다. 백성들이 실망할 거예요',
        risk: 'risky',
      },
    ],
    difficulty: 'hard',
    category: 'military',
  },

  // 안시성 전투
  {
    id: 'ansi_645',
    year: 645,
    targetNation: 'goguryeo',
    title: '안시성 전투',
    description: '당 태종이 직접 대군을 이끌고 안시성을 포위했습니다. 88일간의 항전이 시작됩니다.',
    historicalContext: '보장왕 4년(645년), 당 태종이 직접 고구려를 침공했습니다. 안시성 성주(이름 미상)는 88일간 항전하여 당군을 물리쳤습니다. 당 태종은 성주의 용맹에 감탄하여 비단 100필을 보냈다고 합니다.',
    choices: [
      {
        id: 'A',
        text: '끝까지 성을 지키며 항전한다',
        effects: { military: 55, morale: 60, economy: -40 },
        isHistorical: true,
        tooltip: '88일간의 항전 끝에 당군이 물러났어요',
        risk: 'risky',
      },
      {
        id: 'B',
        text: '야습으로 적의 허를 찌른다',
        effects: { military: 40, morale: 30 },
        isHistorical: true,
        tooltip: '안시성주는 적극적인 방어 전술도 썼어요',
        risk: 'normal',
      },
    ],
    difficulty: 'hard',
    category: 'military',
  },

  // 백제 멸망
  {
    id: 'baekje_fall_660',
    year: 660,
    targetNation: 'baekje',
    title: '나당연합군의 침공',
    description: '신라와 당나라 연합군이 쳐들어오고 있습니다. 백제의 운명이 걸린 순간입니다.',
    historicalContext: '의자왕 20년(660년), 나당연합군이 백제를 침공했습니다. 계백은 5천 결사대로 황산벌에서 싸웠지만 패했고, 사비성이 함락되어 백제가 멸망했습니다.',
    choices: [
      {
        id: 'A',
        text: '계백 장군의 결사대로 맞서 싸운다',
        effects: { military: -60, morale: 70 },
        isHistorical: true,
        tooltip: '계백은 처자식을 죽이고 나라를 위해 싸웠어요',
        risk: 'risky',
      },
      {
        id: 'B',
        text: '고구려에 급히 원군을 요청한다',
        effects: { diplomacy: 25, military: 15 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다. 시간이 부족해요',
        risk: 'normal',
      },
      {
        id: 'C',
        text: '협상을 통해 왕실만이라도 보전한다',
        effects: { morale: -80, diplomacy: 10 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다',
        risk: 'safe',
      },
    ],
    difficulty: 'hard',
    category: 'military',
  },

  // 화랑도
  {
    id: 'hwarang_576',
    year: 576,
    targetNation: 'silla',
    title: '화랑도 창설',
    description: '젊은이들을 모아 화랑도를 만들자는 제안이 있습니다. 나라의 인재를 기르는 제도입니다.',
    historicalContext: '진흥왕 37년(576년), 화랑도가 공식 창설되었습니다. 화랑들은 산천을 유람하며 심신을 단련하고, 세속오계를 지키며 나라에 충성했습니다. 김유신, 관창 등 많은 인재가 화랑 출신입니다.',
    choices: [
      {
        id: 'A',
        text: '화랑도를 창설하여 인재를 기른다',
        effects: { military: 30, culture: 35, morale: 40 },
        isHistorical: true,
        tooltip: '화랑도 출신들이 삼국통일의 주역이 되었어요',
        risk: 'safe',
      },
      {
        id: 'B',
        text: '기존 군사 훈련 제도를 강화한다',
        effects: { military: 25, gold: -50 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다',
        risk: 'safe',
      },
    ],
    difficulty: 'easy',
    category: 'culture',
  },

  // 삼국통일
  {
    id: 'unification_676',
    year: 676,
    targetNation: 'silla',
    title: '기벌포 전투와 삼국통일',
    description: '당나라가 한반도 전체를 지배하려 합니다. 신라는 당군과 싸워야 합니다.',
    historicalContext: '문무왕 16년(676년), 신라는 기벌포 해전에서 당군을 물리치고 삼국통일을 완성했습니다. 원래 동맹이었던 당나라와 전쟁을 벌여 대동강 이남의 땅을 지켜냈습니다.',
    choices: [
      {
        id: 'A',
        text: '당나라와 끝까지 싸워 영토를 지킨다',
        effects: { military: 50, morale: 60, diplomacy: -40, economy: -30 },
        isHistorical: true,
        tooltip: '기벌포 전투 승리로 삼국통일이 완성되었어요',
        risk: 'risky',
      },
      {
        id: 'B',
        text: '당나라와 협상하여 일부 영토를 양보한다',
        effects: { diplomacy: 30, morale: -30, economy: 20 },
        isHistorical: false,
        tooltip: '역사와 다른 선택입니다. 더 많은 땅을 잃을 수 있어요',
        risk: 'normal',
      },
    ],
    difficulty: 'hard',
    category: 'military',
  },
];

// 연도별 이벤트 정렬
export const getEventsByYear = () => {
  return [...HISTORICAL_EVENTS].sort((a, b) => a.year - b.year);
};

// 국가별 이벤트 필터
export const getEventsByNation = (nation: string) => {
  return HISTORICAL_EVENTS.filter(
    (event) => event.targetNation === nation || event.targetNation === 'all'
  );
};

// 카테고리별 이벤트 필터
export const getEventsByCategory = (category: string) => {
  return HISTORICAL_EVENTS.filter((event) => event.category === category);
};

// 난이도별 이벤트 필터
export const getEventsByDifficulty = (difficulty: string) => {
  return HISTORICAL_EVENTS.filter((event) => event.difficulty === difficulty);
};
