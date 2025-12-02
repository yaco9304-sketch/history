import { HistoricalEvent } from './types';

export const SAMPLE_EVENTS: HistoricalEvent[] = [
  {
    "id": "goguryeo_낙랑군_정복_313",
    "year": 313,
    "targetNation": "goguryeo",
    "title": "낙랑군 정복",
    "description": "중국 한나라가 설치한 낙랑군이 약해졌습니다. 이 기회에 낙랑군을 공격하여 한반도에서 중국 세력을 몰아낼 수 있습니다.",
    "historicalContext": "313년 미천왕은 낙랑군을 정복하여 400년 넘게 한반도에 있던 중국의 직접 지배를 종식시켰습니다. 이는 고구려가 한반도의 주인임을 선언한 역사적 사건입니다.",
    "choices": [
      {
        "id": "A",
        "text": "대군을 동원하여 낙랑군을 공격한다",
        "effects": {
          "military": 35,
          "economy": 20,
          "gold": -300
        },
        "isHistorical": true,
        "tooltip": "낙랑군 정복 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "낙랑군과 협상하여 조공을 받는다",
        "effects": {
          "diplomacy": 15,
          "gold": 100
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "시기상조라 판단하고 내정에 집중한다",
        "effects": {
          "economy": 20,
          "morale": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "military"
  },
  {
    "id": "goguryeo_불교_전래_372",
    "year": 372,
    "targetNation": "goguryeo",
    "title": "불교 전래",
    "description": "전진(前秦)에서 승려 순도가 불상과 경문을 가지고 왔습니다. 이 새로운 종교를 어떻게 받아들이시겠습니까?",
    "historicalContext": "소수림왕 2년, 중국 전진에서 순도가 불교를 전파했습니다. 이는 고구려 최초의 공식적인 불교 수용으로, 2년 뒤 초문사와 이불란사가 건립되었습니다. 이 사찰들은 고구려 불교 문화의 시작을 알리는 중요한 문화재입니다.",
    "choices": [
      {
        "id": "A",
        "text": "불교를 국가 종교로 받아들이고 절을 건립한다",
        "effects": {
          "culture": 30,
          "morale": 20,
          "gold": -200
        },
        "isHistorical": true,
        "tooltip": "불교 전래 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "불교를 거부하고 전통 신앙을 고수한다",
        "effects": {
          "military": 15,
          "morale": -10,
          "culture": -10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "순도를 머물게 하고 신중히 검토한다",
        "effects": {
          "diplomacy": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "easy",
    "category": "culture"
  },
  {
    "id": "goguryeo_태학_설립_373",
    "year": 373,
    "targetNation": "goguryeo",
    "title": "태학 설립",
    "description": "소수림왕이 귀족 자제들을 교육하는 교육 기관 '태학'을 설립하려 합니다.",
    "historicalContext": "373년 소수림왕은 태학을 설립하여 유교 경전과 역사를 가르쳤습니다. 이는 한국 최초의 국립 대학이자 관리 양성 기관이었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "태학을 설립하고 인재를 양성한다",
        "effects": {
          "culture": 30,
          "diplomacy": 15,
          "gold": -150
        },
        "isHistorical": true,
        "tooltip": "태학 설립 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "전통적인 교육 방식을 유지한다",
        "effects": {
          "military": 10,
          "culture": -5
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "무술 훈련 기관을 우선 설립한다",
        "effects": {
          "military": 25,
          "gold": -100
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "easy",
    "category": "culture"
  },
  {
    "id": "goguryeo_광개토대왕_즉위_391",
    "year": 391,
    "targetNation": "goguryeo",
    "title": "광개토대왕 즉위",
    "description": "18세의 젊은 왕이 즉위했습니다. 새 왕으로서 첫 번째 정책 방향을 정해야 합니다.",
    "historicalContext": "광개토대왕(담덕)은 18세에 즉위하여 정복 군주로서 고구려 역사상 가장 넓은 영토를 확보했습니다. 그의 업적은 광개토대왕릉비에 기록되어 있습니다. 이 비석은 414년에 세워진 것으로, 1,775자의 한문으로 고구려의 역사와 광개토대왕의 정복 사업을 상세히 기록한 세계적인 문화재입니다. 현재 중국 지안(集安)에 있으며, 고구려 역사 연구의 핵심 자료입니다.",
    "choices": [
      {
        "id": "A",
        "text": "대규모 정복 전쟁을 계획한다",
        "effects": {
          "military": 40,
          "economy": -20,
          "morale": 25
        },
        "isHistorical": true,
        "tooltip": "광개토대왕 즉위 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "내치에 집중하고 국력을 기른다",
        "effects": {
          "economy": 30,
          "culture": 15,
          "military": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "외교를 통해 동맹 세력을 확보한다",
        "effects": {
          "diplomacy": 35,
          "military": 15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "military"
  },
  {
    "id": "goguryeo_신라_구원_출병_400",
    "year": 400,
    "targetNation": "goguryeo",
    "title": "신라 구원 출병",
    "description": "왜(倭)와 가야 연합군이 신라를 침공했습니다. 신라 내물왕이 고구려에 구원을 요청했습니다.",
    "historicalContext": "광개토대왕은 5만 대군을 보내 신라를 구원하고 왜군을 물리쳤습니다. 이로써 신라는 고구려의 영향권에 들어갔고, 신라 왕자 실성이 고구려에 볼모로 갔습니다.",
    "choices": [
      {
        "id": "A",
        "text": "5만 대군을 보내 신라를 구원한다",
        "effects": {
          "military": -15,
          "diplomacy": 40,
          "gold": -300
        },
        "isHistorical": true,
        "tooltip": "신라 구원 출병 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "신라의 요청을 거절한다",
        "effects": {
          "military": 10,
          "diplomacy": -30
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "소규모 지원군만 보낸다",
        "effects": {
          "diplomacy": 15,
          "military": -5,
          "gold": -100
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "diplomacy"
  },
  {
    "id": "goguryeo_평양_천도_427",
    "year": 427,
    "targetNation": "goguryeo",
    "title": "평양 천도",
    "description": "장수왕이 수도를 국내성에서 평양으로 옮기려 합니다. 남진 정책의 전초가 될 중대한 결정입니다.",
    "historicalContext": "427년 장수왕은 평양으로 천도하여 남진 정책의 기반을 마련했습니다. 평양은 교통의 요지이자 비옥한 평야 지대로 고구려 발전의 중심이 되었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "평양으로 천도하고 남진 정책을 준비한다",
        "effects": {
          "economy": 35,
          "military": 20,
          "gold": -400
        },
        "isHistorical": true,
        "tooltip": "평양 천도 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "국내성을 유지하고 북방을 강화한다",
        "effects": {
          "military": 25,
          "gold": 100
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "천도는 미루고 점진적으로 개발한다",
        "effects": {
          "economy": 15,
          "gold": -150
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "economy"
  },
  {
    "id": "goguryeo_수나라_1차_침입_대비_598",
    "year": 598,
    "targetNation": "goguryeo",
    "title": "수나라 1차 침입 대비",
    "description": "중국을 통일한 수나라가 30만 대군으로 고구려를 침공하려 합니다. 어떻게 대응하시겠습니까?",
    "historicalContext": "598년 수 문제가 30만 대군으로 고구려를 침공했으나, 장마와 질병으로 크게 패하고 물러났습니다. 이는 고구려-수나라 전쟁의 시작이었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "요동 방어선을 강화하고 결사 항전한다",
        "effects": {
          "military": 35,
          "morale": 25,
          "gold": -300
        },
        "isHistorical": true,
        "tooltip": "수나라 1차 침입 대비 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "수나라에 사신을 보내 화친을 청한다",
        "effects": {
          "diplomacy": 20,
          "morale": -20,
          "gold": -200
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "선제공격으로 수나라 국경을 친다",
        "effects": {
          "military": 20,
          "morale": 30,
          "diplomacy": -30
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "military"
  },
  {
    "id": "goguryeo_살수대첩_612",
    "year": 612,
    "targetNation": "goguryeo",
    "title": "살수대첩",
    "description": "수 양제의 113만 대군이 침공했습니다! 을지문덕 장군이 유인 작전을 제안합니다.",
    "historicalContext": "612년 을지문덕은 수나라 별동대 30만을 살수(청천강)까지 유인한 후, 수공과 매복 공격으로 궤멸시켰습니다. 살아 돌아간 자는 2,700명에 불과했습니다.",
    "choices": [
      {
        "id": "A",
        "text": "을지문덕의 유인 작전을 승인한다",
        "effects": {
          "military": 50,
          "morale": 40,
          "culture": 20
        },
        "isHistorical": true,
        "tooltip": "살수대첩 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "요동성에서 농성전을 펼친다",
        "effects": {
          "military": 25,
          "morale": 15,
          "gold": -200
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "평양성으로 후퇴하여 방어한다",
        "effects": {
          "military": 10,
          "morale": -20,
          "economy": -30
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "military"
  },
  {
    "id": "goguryeo_천리장성_건설_631",
    "year": 631,
    "targetNation": "goguryeo",
    "title": "천리장성 건설",
    "description": "당나라의 위협에 대비해 연개소문이 요동에서 부여성까지 천리장성 건설을 제안합니다.",
    "historicalContext": "631년부터 647년까지 고구려는 천리장성을 쌓았습니다. 이 성은 당나라의 침입에 대비한 것으로, 16년에 걸쳐 완성되었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "천리장성 건설을 승인한다",
        "effects": {
          "military": 30,
          "economy": -25,
          "gold": -500,
          "morale": -10
        },
        "isHistorical": true,
        "tooltip": "천리장성 건설 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "기존 성곽 보수에 집중한다",
        "effects": {
          "military": 15,
          "economy": -10,
          "gold": -200
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "군사력 증강에 자원을 투입한다",
        "effects": {
          "military": 25,
          "gold": -300,
          "morale": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "economy"
  },
  {
    "id": "goguryeo_연개소문의_정변_642",
    "year": 642,
    "targetNation": "goguryeo",
    "title": "연개소문의 정변",
    "description": "대막리지 연개소문이 귀족들과 영류왕을 제거하고 실권을 장악하려 합니다. 이를 허용할 것인가?",
    "historicalContext": "642년 연개소문은 쿠데타를 일으켜 영류왕과 귀족 180여 명을 살해하고 보장왕을 옹립했습니다. 이후 그는 막리지(재상)로서 고구려를 통치했습니다.",
    "choices": [
      {
        "id": "A",
        "text": "연개소문의 정변을 지지한다",
        "effects": {
          "military": 40,
          "diplomacy": -20,
          "morale": -15
        },
        "isHistorical": true,
        "tooltip": "연개소문의 정변 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "왕을 보호하고 연개소문을 토벌한다",
        "effects": {
          "diplomacy": 20,
          "military": -30
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "중립을 지키며 상황을 관망한다",
        "effects": {
          "economy": 10,
          "morale": 5
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "politics"
  },
  {
    "id": "goguryeo_안시성_전투_645",
    "year": 645,
    "targetNation": "goguryeo",
    "title": "안시성 전투",
    "description": "당 태종이 직접 이끄는 대군이 안시성을 88일간 포위하고 있습니다. 성주 양만춘이 결사 항전 중입니다.",
    "historicalContext": "645년 당 태종의 고구려 원정에서 안시성은 88일간 버텨 당군을 물리쳤습니다. 전설에 따르면 당 태종이 양만춘의 화살에 눈을 맞았다고 합니다.",
    "choices": [
      {
        "id": "A",
        "text": "안시성 수비대에 지원군을 보낸다",
        "effects": {
          "military": 40,
          "morale": 35,
          "gold": -200
        },
        "isHistorical": true,
        "tooltip": "안시성 전투 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "안시성을 포기하고 평양 방어에 집중한다",
        "effects": {
          "military": 15,
          "morale": -25,
          "economy": -20
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "당나라와 협상을 시도한다",
        "effects": {
          "diplomacy": 20,
          "morale": -15,
          "gold": -300
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "military"
  },
  {
    "id": "goguryeo_나당연합군의_침공_668",
    "year": 668,
    "targetNation": "goguryeo",
    "title": "나당연합군의 침공",
    "description": "신라와 당나라가 연합하여 고구려를 협공하고 있습니다. 연개소문 사후 내분이 일어나 위기가 가중되었습니다.",
    "historicalContext": "668년 나당연합군의 공격으로 평양성이 함락되고 고구려가 멸망했습니다. 연개소문 사후 아들들 간의 권력 다툼이 멸망을 앞당겼습니다.",
    "choices": [
      {
        "id": "A",
        "text": "평양성에서 끝까지 항전한다",
        "effects": {
          "military": -50,
          "morale": 40,
          "population": -10000
        },
        "isHistorical": true,
        "tooltip": "나당연합군의 침공 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "북방으로 후퇴하여 부흥을 도모한다",
        "effects": {
          "military": -20,
          "economy": -30,
          "morale": 15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "당나라와 조건부 항복을 협상한다",
        "effects": {
          "diplomacy": 15,
          "morale": -30,
          "gold": -500
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "military"
  },
  {
    "id": "baekje_근초고왕_즉위_346",
    "year": 346,
    "targetNation": "baekje",
    "title": "근초고왕 즉위",
    "description": "근초고왕이 즉위했습니다. 백제를 강대국으로 만들 기회입니다.",
    "historicalContext": "근초고왕(재위 346-375)은 백제의 전성기를 이끈 왕입니다. 그는 북으로는 고구려를, 남으로는 가야를, 바다 건너 왜까지 영향력을 행사했습니다.",
    "choices": [
      {
        "id": "A",
        "text": "적극적인 대외 확장 정책을 추진한다",
        "effects": {
          "military": 35,
          "diplomacy": 20,
          "gold": -250
        },
        "isHistorical": true,
        "tooltip": "근초고왕 즉위 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "내정 개혁에 집중한다",
        "effects": {
          "economy": 30,
          "culture": 20
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "균형 있는 발전을 추구한다",
        "effects": {
          "military": 15,
          "economy": 15,
          "diplomacy": 15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "easy",
    "category": "politics"
  },
  {
    "id": "baekje_백제의_전성기_369",
    "year": 369,
    "targetNation": "baekje",
    "title": "백제의 전성기",
    "description": "근초고왕이 군사를 이끌고 고구려를 공격하려 합니다. 고국원왕과의 결전이 예상됩니다.",
    "historicalContext": "369년 근초고왕은 고구려 고국원왕을 공격하여 전사시켰습니다. 이는 백제가 고구려를 압도한 전성기의 상징적 사건입니다.",
    "choices": [
      {
        "id": "A",
        "text": "대군을 이끌고 고구려를 공격한다",
        "effects": {
          "military": 45,
          "morale": 30,
          "gold": -300
        },
        "isHistorical": true,
        "tooltip": "백제의 전성기 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "방어에 충실하고 국력을 비축한다",
        "effects": {
          "economy": 25,
          "gold": 150
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "가야 지역 확장에 집중한다",
        "effects": {
          "military": 20,
          "economy": 20,
          "population": 3000
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "military"
  },
  {
    "id": "baekje_침류왕의_불교_수용_384",
    "year": 384,
    "targetNation": "baekje",
    "title": "침류왕의 불교 수용",
    "description": "동진(東晉)에서 인도 승려 마라난타가 바닷길을 통해 백제에 도착했습니다. 왕은 어떻게 하시겠습니까?",
    "historicalContext": "침류왕 원년, 마라난타가 동진에서 백제로 왔습니다. 침류왕은 그를 궁중에서 맞이하고 예를 갖추어 공경하였으며, 이듬해 한산에 절을 짓고 승려 10명을 출가시켰습니다. 이는 백제 불교의 시작으로, 이후 백제는 불교 문화가 크게 발달하여 일본에 불교를 전파하는 등 동아시아 문화 교류의 중심이 되었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "마라난타를 환대하고 불교를 공인한다",
        "effects": {
          "culture": 25,
          "diplomacy": 15,
          "gold": -150
        },
        "isHistorical": true,
        "tooltip": "침류왕의 불교 수용 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "외래 종교라며 마라난타를 돌려보낸다",
        "effects": {
          "military": 10,
          "diplomacy": -20,
          "culture": -15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "귀족들의 의견을 먼저 듣는다",
        "effects": {
          "diplomacy": 5,
          "morale": 5
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "easy",
    "category": "culture"
  },
  {
    "id": "baekje_나제동맹_체결_433",
    "year": 433,
    "targetNation": "baekje",
    "title": "나제동맹 체결",
    "description": "고구려의 남진 압박이 심해지고 있습니다. 신라 눌지왕이 비밀리에 동맹을 제안해왔습니다.",
    "historicalContext": "433년 백제 비유왕과 신라 눌지왕은 고구려에 대항하기 위해 나제동맹을 맺었습니다. 이 동맹은 약 120년간 유지되며 양국의 생존에 큰 역할을 했습니다.",
    "choices": [
      {
        "id": "A",
        "text": "신라와 동맹을 맺어 고구려에 대항한다",
        "effects": {
          "diplomacy": 35,
          "military": 20,
          "morale": 15
        },
        "isHistorical": true,
        "tooltip": "나제동맹 체결 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "신라 대신 고구려와 화친을 시도한다",
        "effects": {
          "diplomacy": 20,
          "morale": -10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "어느 쪽과도 동맹하지 않고 독자 노선을 간다",
        "effects": {
          "military": 15,
          "diplomacy": -15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "diplomacy"
  },
  {
    "id": "baekje_한성_함락_위기_475",
    "year": 475,
    "targetNation": "baekje",
    "title": "한성 함락 위기",
    "description": "고구려 장수왕의 3만 대군이 백제 수도 한성을 포위했습니다! 개로왕과 백제의 운명이 경각에 달렸습니다.",
    "historicalContext": "475년 고구려 장수왕은 직접 3만 군을 이끌고 백제를 공격했습니다. 한성이 함락되고 개로왕이 전사했으며, 백제는 웅진으로 천도해야 했습니다.",
    "choices": [
      {
        "id": "A",
        "text": "끝까지 한성을 사수한다",
        "effects": {
          "military": -30,
          "morale": 20,
          "population": -5000
        },
        "isHistorical": true,
        "tooltip": "한성 함락 위기 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "신속히 웅진으로 천도한다",
        "effects": {
          "economy": -20,
          "morale": -15,
          "gold": -500
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "신라에 긴급 구원을 요청한다",
        "effects": {
          "diplomacy": 25,
          "military": 10,
          "morale": -5
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "military"
  },
  {
    "id": "baekje_사비_천도_538",
    "year": 538,
    "targetNation": "baekje",
    "title": "사비 천도",
    "description": "성왕이 웅진에서 사비(부여)로 수도를 옮기고 국호를 '남부여'로 바꾸려 합니다.",
    "historicalContext": "538년 성왕은 백제 중흥을 위해 사비로 천도하고 국호를 남부여로 고쳤습니다. 이는 부여의 후예임을 강조하고 새로운 도약을 위한 것이었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "사비로 천도하고 국호를 남부여로 바꾼다",
        "effects": {
          "economy": 30,
          "culture": 20,
          "gold": -400,
          "morale": 25
        },
        "isHistorical": true,
        "tooltip": "사비 천도 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "웅진에서 내실을 다지며 천도를 미룬다",
        "effects": {
          "economy": 15,
          "gold": 100
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "천도는 하되 국호는 유지한다",
        "effects": {
          "economy": 20,
          "gold": -300,
          "morale": 15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "economy"
  },
  {
    "id": "baekje_일본과의_문화_교류_541",
    "year": 541,
    "targetNation": "baekje",
    "title": "일본과의 문화 교류",
    "description": "일본(왜)에서 불교와 선진 문물을 요청해왔습니다. 문화 교류를 통해 동맹을 강화할 수 있습니다.",
    "historicalContext": "6세기 백제는 일본에 불교, 유학, 건축, 회화 등 선진 문화를 전파했습니다. 특히 성왕은 552년 불교 경전과 불상을 일본에 전했습니다. 백제의 문화 전파는 일본 고대 문화 발전에 지대한 영향을 미쳤으며, 백제 금동대향로(국보 제287호)와 같은 정교한 공예품들은 백제 문화의 우수성을 보여주는 대표적인 문화재입니다.",
    "choices": [
      {
        "id": "A",
        "text": "승려와 기술자를 파견하여 문화를 전파한다",
        "effects": {
          "diplomacy": 30,
          "culture": 20,
          "gold": 200
        },
        "isHistorical": true,
        "tooltip": "일본과의 문화 교류 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "군사 동맹에만 집중한다",
        "effects": {
          "military": 20,
          "diplomacy": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "최소한의 교류만 유지한다",
        "effects": {
          "diplomacy": 10,
          "gold": 50
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "easy",
    "category": "diplomacy"
  },
  {
    "id": "baekje_한강_유역_탈환_551",
    "year": 551,
    "targetNation": "baekje",
    "title": "한강 유역 탈환",
    "description": "성왕이 신라와 연합하여 고구려로부터 한강 유역을 되찾으려 합니다.",
    "historicalContext": "551년 백제는 신라와 연합하여 한강 유역을 탈환했습니다. 그러나 553년 신라가 백제 몫까지 독차지하면서 나제동맹이 깨지고 백제는 큰 배신감을 느꼈습니다.",
    "choices": [
      {
        "id": "A",
        "text": "신라와 연합하여 한강 유역을 공격한다",
        "effects": {
          "military": 30,
          "economy": 25,
          "gold": -300
        },
        "isHistorical": true,
        "tooltip": "한강 유역 탈환 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "단독으로 한강 유역을 공격한다",
        "effects": {
          "military": 20,
          "gold": -400
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "시기를 기다리며 국력을 비축한다",
        "effects": {
          "economy": 20,
          "gold": 150
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "military"
  },
  {
    "id": "baekje_관산성_전투_554",
    "year": 554,
    "targetNation": "baekje",
    "title": "관산성 전투",
    "description": "신라가 한강 유역을 독차지했습니다! 성왕이 친정하여 관산성을 공격하려 합니다.",
    "historicalContext": "554년 성왕은 신라를 공격했으나 관산성 전투에서 패배하고 전사했습니다. 이는 백제에게 큰 타격이었고, 백제-신라 관계는 돌이킬 수 없게 악화되었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "왕이 직접 군사를 이끌고 신라를 공격한다",
        "effects": {
          "military": -40,
          "morale": -25,
          "population": -4000
        },
        "isHistorical": true,
        "tooltip": "관산성 전투 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "장군에게 맡기고 왕은 후방에 머문다",
        "effects": {
          "military": 15,
          "morale": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "외교로 한강 유역 반환을 협상한다",
        "effects": {
          "diplomacy": 20,
          "gold": -200
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "military"
  },
  {
    "id": "baekje_아신왕의_개혁_600",
    "year": 600,
    "targetNation": "baekje",
    "title": "아신왕의 개혁",
    "description": "무왕이 즉위하여 백제를 다시 일으키려 합니다. 강력한 왕권 확립이 필요합니다.",
    "historicalContext": "600년대 초 무왕은 강력한 왕권을 구축하고 익산 천도를 시도하는 등 개혁을 추진했습니다. 미륵사를 창건하여 불교 진흥에도 힘썼습니다. 미륵사는 백제 최대 규모의 사찰로, 3개의 금당과 3개의 탑이 배치된 독특한 구조를 가진 문화재입니다. 현재 미륵사지 석탑은 국보 제11호로 지정되어 있으며, 백제 건축 기술의 정수를 보여줍니다.",
    "choices": [
      {
        "id": "A",
        "text": "왕권을 강화하고 대규모 개혁을 단행한다",
        "effects": {
          "economy": 25,
          "culture": 20,
          "morale": -10
        },
        "isHistorical": true,
        "tooltip": "아신왕의 개혁 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "귀족과의 협력 체제를 유지한다",
        "effects": {
          "diplomacy": 20,
          "morale": 15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "군사력 강화에 집중한다",
        "effects": {
          "military": 30,
          "gold": -250
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "politics"
  },
  {
    "id": "baekje_의자왕의_초기_개혁_642",
    "year": 642,
    "targetNation": "baekje",
    "title": "의자왕의 초기 개혁",
    "description": "의자왕이 즉위 초기 강력한 개혁 정치를 펼치려 합니다. 신라에 대한 대공세도 준비 중입니다.",
    "historicalContext": "642년 의자왕은 즉위 초기 '해동증자'로 불릴 만큼 효성이 깊었고, 신라의 40여 성을 빼앗는 등 강력한 정치를 펼쳤습니다.",
    "choices": [
      {
        "id": "A",
        "text": "신라를 적극 공격하여 영토를 확장한다",
        "effects": {
          "military": 35,
          "economy": 20,
          "gold": -300
        },
        "isHistorical": true,
        "tooltip": "의자왕의 초기 개혁 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "내정 개혁에 집중한다",
        "effects": {
          "economy": 30,
          "morale": 20
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "고구려와 동맹하여 신라를 견제한다",
        "effects": {
          "diplomacy": 30,
          "military": 15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "politics"
  },
  {
    "id": "baekje_나당연합군_침공_660",
    "year": 660,
    "targetNation": "baekje",
    "title": "나당연합군 침공",
    "description": "신라와 당나라 연합군 18만이 백제를 침공했습니다! 의자왕은 결단을 내려야 합니다.",
    "historicalContext": "660년 나당연합군이 백제를 공격했습니다. 계백 장군은 5천 결사대로 황산벌에서 저항했으나 패하고, 사비성이 함락되어 백제는 멸망했습니다.",
    "choices": [
      {
        "id": "A",
        "text": "계백 장군을 보내 황산벌에서 결사 항전한다",
        "effects": {
          "military": 30,
          "morale": 40,
          "population": -3000
        },
        "isHistorical": true,
        "tooltip": "나당연합군 침공 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "사비성을 버리고 남쪽으로 피신한다",
        "effects": {
          "morale": -30,
          "economy": -40,
          "gold": -500
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "고구려에 급히 구원을 요청한다",
        "effects": {
          "diplomacy": 25,
          "morale": 15,
          "gold": -200
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "military"
  },
  {
    "id": "silla_내물_마립간_즉위_356",
    "year": 356,
    "targetNation": "silla",
    "title": "내물 마립간 즉위",
    "description": "내물 마립간이 즉위하여 김씨 왕위 세습을 확립했습니다.",
    "historicalContext": "356년 내물 마립간 즉위 이후 신라 왕위는 김씨가 세습하게 되었습니다. 그는 고구려의 도움으로 왜의 침입을 막고 신라를 안정시켰습니다.",
    "choices": [
      {
        "id": "A",
        "text": "김씨 왕위 세습 체제를 확립한다",
        "effects": {
          "diplomacy": 25,
          "morale": 20
        },
        "isHistorical": true,
        "tooltip": "내물 마립간 즉위 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "귀족 연합 체제를 유지한다",
        "effects": {
          "diplomacy": 15,
          "morale": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "군사력 강화에 집중한다",
        "effects": {
          "military": 30,
          "gold": -200
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "easy",
    "category": "politics"
  },
  {
    "id": "silla_나제동맹_가입_433",
    "year": 433,
    "targetNation": "silla",
    "title": "나제동맹 가입",
    "description": "백제가 고구려에 대항하기 위한 동맹을 제안했습니다. 신라도 고구려의 압박을 받고 있는 상황입니다.",
    "historicalContext": "433년 신라 눌지왕과 백제 비유왕은 고구려의 위협에 맞서기 위해 나제동맹을 체결했습니다. 이 동맹은 양국의 생존 전략이었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "백제와 동맹을 맺어 고구려에 대항한다",
        "effects": {
          "diplomacy": 35,
          "military": 20,
          "morale": 15
        },
        "isHistorical": true,
        "tooltip": "나제동맹 가입 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "고구려에 계속 복속된다",
        "effects": {
          "diplomacy": -20,
          "morale": -15,
          "military": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "중립을 유지한다",
        "effects": {
          "diplomacy": 10,
          "economy": 15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "diplomacy"
  },
  {
    "id": "silla_국호_'신라'_확정_503",
    "year": 503,
    "targetNation": "silla",
    "title": "국호 '신라' 확정",
    "description": "지증왕이 국호를 정식으로 '신라(新羅)'로 정하고 왕의 칭호도 '마립간'에서 '왕'으로 바꾸려 합니다.",
    "historicalContext": "503년 지증왕은 국호를 '신라'로 확정하고, 중국식 왕호인 '왕'을 사용했습니다. '신라'는 '덕업이 날로 새로워지고, 사방을 망라한다'는 의미입니다.",
    "choices": [
      {
        "id": "A",
        "text": "국호를 '신라'로 정하고 왕호를 사용한다",
        "effects": {
          "culture": 25,
          "diplomacy": 20,
          "morale": 15
        },
        "isHistorical": true,
        "tooltip": "국호 '신라' 확정 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "전통적인 국호와 마립간 칭호를 유지한다",
        "effects": {
          "morale": 10,
          "culture": -10,
          "diplomacy": -15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "국호만 바꾸고 왕호는 유지한다",
        "effects": {
          "culture": 10,
          "diplomacy": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "easy",
    "category": "culture"
  },
  {
    "id": "silla_이사부의_우산국_정복_512",
    "year": 512,
    "targetNation": "silla",
    "title": "이사부의 우산국 정복",
    "description": "장군 이사부가 우산국(울릉도) 정복을 건의했습니다. 그는 나무 사자를 만들어 위협하는 기발한 계책을 제안합니다.",
    "historicalContext": "512년 이사부는 나무로 만든 사자를 배에 싣고 가서 우산국 사람들을 위협해 항복을 받아냈습니다. 이로써 울릉도는 신라 영토가 되었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "이사부의 계책을 승인하고 출병한다",
        "effects": {
          "military": 20,
          "diplomacy": 10,
          "gold": -100
        },
        "isHistorical": true,
        "tooltip": "이사부의 우산국 정복 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "해상 원정은 위험하니 보류한다",
        "effects": {
          "gold": 50,
          "military": -5
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "외교 사절을 먼저 보내 협상한다",
        "effects": {
          "diplomacy": 15,
          "gold": -50
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "military"
  },
  {
    "id": "silla_율령_반포_520",
    "year": 520,
    "targetNation": "silla",
    "title": "율령 반포",
    "description": "법흥왕이 국가 통치의 기본 법전인 율령을 반포하려 합니다.",
    "historicalContext": "520년 법흥왕은 율령을 반포하여 중앙집권 체제를 강화했습니다. 이는 신라가 고대 국가로 발전하는 중요한 계기였습니다.",
    "choices": [
      {
        "id": "A",
        "text": "율령을 반포하고 중앙집권을 강화한다",
        "effects": {
          "economy": 25,
          "diplomacy": 20,
          "morale": 15
        },
        "isHistorical": true,
        "tooltip": "율령 반포 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "귀족의 반발을 고려해 점진적으로 추진한다",
        "effects": {
          "diplomacy": 15,
          "morale": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "군사 개혁을 우선한다",
        "effects": {
          "military": 30,
          "gold": -200
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "politics"
  },
  {
    "id": "silla_이차돈의_순교_527",
    "year": 527,
    "targetNation": "silla",
    "title": "이차돈의 순교",
    "description": "법흥왕이 불교를 공인하려 하지만 귀족들의 반대가 심합니다. 신하 이차돈이 자신을 희생하여 불교의 신비함을 증명하겠다고 나섭니다.",
    "historicalContext": "527년 이차돈은 자발적으로 처형당하며 흰 피가 흐르는 기적을 보여주었습니다. 이 사건으로 귀족들의 반대가 무너지고 신라에서 불교가 공인되었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "이차돈의 희생을 받아들여 불교를 공인한다",
        "effects": {
          "culture": 40,
          "morale": 25,
          "diplomacy": 15
        },
        "isHistorical": true,
        "tooltip": "이차돈의 순교 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "귀족들의 뜻을 따라 불교 공인을 포기한다",
        "effects": {
          "morale": 10,
          "culture": -20,
          "diplomacy": -10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "이차돈을 말리고 다른 방법을 찾는다",
        "effects": {
          "culture": 10,
          "morale": 5
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "culture"
  },
  {
    "id": "silla_금관가야_병합_532",
    "year": 532,
    "targetNation": "silla",
    "title": "금관가야 병합",
    "description": "금관가야의 마지막 왕 구형왕이 신라에 항복을 청해왔습니다. 어떻게 처리하시겠습니까?",
    "historicalContext": "532년 금관가야 구형왕이 나라를 들어 신라에 항복했습니다. 법흥왕은 그를 진골 귀족으로 대우하고 금관가야 영토를 금관군으로 삼았습니다. 이는 신라의 가야 병합 시작이었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "항복을 받아들이고 구형왕을 귀족으로 예우한다",
        "effects": {
          "diplomacy": 30,
          "economy": 25,
          "population": 3000
        },
        "isHistorical": true,
        "tooltip": "금관가야 병합 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "금관가야를 무력으로 정복한다",
        "effects": {
          "military": 20,
          "morale": -10,
          "diplomacy": -20
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "항복을 거절하고 독립을 유지하게 한다",
        "effects": {
          "diplomacy": 10,
          "economy": -10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "easy",
    "category": "diplomacy"
  },
  {
    "id": "silla_대가야_정복_562",
    "year": 562,
    "targetNation": "silla",
    "title": "대가야 정복",
    "description": "가야 연맹의 마지막 강자 대가야가 신라에 저항하고 있습니다. 이사부 장군이 정복을 건의합니다.",
    "historicalContext": "562년 신라 진흥왕은 이사부와 사다함을 보내 대가야를 멸망시켰습니다. 이로써 가야 연맹은 완전히 역사 속으로 사라지고, 그 영토는 신라에 편입되었습니다.",
    "choices": [
      {
        "id": "A",
        "text": "이사부를 보내 대가야를 정복한다",
        "effects": {
          "military": 30,
          "economy": 25,
          "population": 5000,
          "gold": -150
        },
        "isHistorical": true,
        "tooltip": "대가야 정복 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "대가야를 속국으로 두고 조공만 받는다",
        "effects": {
          "diplomacy": 15,
          "economy": 15,
          "gold": 100
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "대가야와 결혼 동맹을 맺는다",
        "effects": {
          "diplomacy": 25,
          "culture": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "military"
  },
  {
    "id": "silla_화랑도_창설_576",
    "year": 576,
    "targetNation": "silla",
    "title": "화랑도 창설",
    "description": "진흥왕이 귀족 청년들을 모아 '화랑'이라는 인재 양성 조직을 만들려 합니다.",
    "historicalContext": "576년 진흥왕은 화랑도를 창설했습니다. 화랑도는 원광법사의 세속오계를 바탕으로 충성, 효도, 신의, 용기, 살생유택을 가르쳤으며, 김유신, 관창 등 명장들을 배출했습니다.",
    "choices": [
      {
        "id": "A",
        "text": "화랑도를 창설하여 인재를 양성한다",
        "effects": {
          "military": 25,
          "culture": 30,
          "morale": 20
        },
        "isHistorical": true,
        "tooltip": "화랑도 창설 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "전통적인 군사 훈련 체계를 유지한다",
        "effects": {
          "military": 15,
          "culture": -5
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "귀족만이 아닌 평민도 포함시킨다",
        "effects": {
          "military": 20,
          "morale": 30,
          "diplomacy": -10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "easy",
    "category": "culture"
  },
  {
    "id": "silla_선덕여왕_즉위_632",
    "year": 632,
    "targetNation": "silla",
    "title": "선덕여왕 즉위",
    "description": "진평왕이 후사 없이 사망하여 딸 덕만이 왕위에 오르려 합니다. 신라 최초의 여왕 탄생입니다.",
    "historicalContext": "632년 선덕여왕은 신라 최초의 여왕으로 즉위했습니다. 그녀는 황룡사 9층탑과 첨성대를 건립하고, 김춘추와 김유신을 등용하여 삼국통일의 기반을 마련했습니다. 황룡사 9층목탑은 645년에 완성된 것으로, 당나라를 상징하는 9층으로 쌓아 당의 위협을 상징적으로 막으려는 의도였습니다. 이 탑은 신라 건축 기술의 정수였으나 현재는 터만 남아있습니다.",
    "choices": [
      {
        "id": "A",
        "text": "선덕을 여왕으로 즉위시킨다",
        "effects": {
          "culture": 35,
          "diplomacy": 20,
          "military": -10
        },
        "isHistorical": true,
        "tooltip": "선덕여왕 즉위 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "왕족 남성을 왕으로 추대한다",
        "effects": {
          "military": 20,
          "morale": 15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "선덕을 섭정으로 하고 어린 왕을 세운다",
        "effects": {
          "diplomacy": 15,
          "morale": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "normal",
    "category": "politics"
  },
  {
    "id": "silla_나당동맹_체결_648",
    "year": 648,
    "targetNation": "silla",
    "title": "나당동맹 체결",
    "description": "김춘추가 당나라에 가서 동맹을 제안하려 합니다. 당의 힘을 빌려 고구려와 백제를 치는 위험한 도박입니다.",
    "historicalContext": "648년 김춘추는 당 태종을 만나 나당동맹을 성사시켰습니다. 당은 백제와 고구려 정복 후 대동강 이남을 신라에 주겠다고 약속했습니다.",
    "choices": [
      {
        "id": "A",
        "text": "당나라와 동맹을 맺는다",
        "effects": {
          "diplomacy": 40,
          "military": 30,
          "culture": -10
        },
        "isHistorical": true,
        "tooltip": "나당동맹 체결 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "독자적인 힘으로 통일을 추진한다",
        "effects": {
          "military": 20,
          "morale": 25,
          "diplomacy": -15
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "고구려, 백제와 화해를 모색한다",
        "effects": {
          "diplomacy": 25,
          "morale": 10
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "diplomacy"
  },
  {
    "id": "silla_백제_정벌_660",
    "year": 660,
    "targetNation": "silla",
    "title": "백제 정벌",
    "description": "나당연합군을 편성하여 백제를 공격할 시기입니다. 백제를 멸망시키고 통일의 첫 단계를 완수하시겠습니까?",
    "historicalContext": "660년 신라는 당나라와 연합하여 백제를 공격했습니다. 김유신이 황산벌에서 계백의 결사대를 격파하고, 사비성이 함락되어 백제가 멸망했습니다.",
    "choices": [
      {
        "id": "A",
        "text": "나당연합군을 이끌고 백제를 공격한다",
        "effects": {
          "military": 40,
          "economy": 30,
          "population": 8000,
          "gold": -400
        },
        "isHistorical": true,
        "tooltip": "백제 정벌 역사적 선택",
        "risk": "safe"
      },
      {
        "id": "B",
        "text": "고구려를 먼저 공격한다",
        "effects": {
          "military": 25,
          "gold": -500
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      },
      {
        "id": "C",
        "text": "외교로 백제의 항복을 받아낸다",
        "effects": {
          "diplomacy": 30,
          "economy": 20
        },
        "isHistorical": false,
        "tooltip": "역사와 다른 선택입니다",
        "risk": "normal"
      }
    ],
    "difficulty": "hard",
    "category": "military"
  }
];
