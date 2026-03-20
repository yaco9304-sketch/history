import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/common';
import { NATIONS } from '../data/nations';
import { Nation, NationStats } from '../types';
import { Crown, Swords, Coins, Users, BookOpen, Heart, Star } from 'lucide-react';

// 초기 스탯
const INITIAL_STATS: Record<Nation, NationStats> = {
  goguryeo: {
    military: 150,
    economy: 100,
    diplomacy: 80,
    culture: 90,
    gold: 1000,
    population: 80000,
    morale: 70,
    culturePoints: 0,
    techProgress: 0,
    peaceTurns: 0,
  },
  baekje: {
    military: 100,
    economy: 130,
    diplomacy: 120,
    culture: 120,
    gold: 1200,
    population: 60000,
    morale: 75,
    culturePoints: 0,
    techProgress: 0,
    peaceTurns: 0,
  },
  silla: {
    military: 90,
    economy: 110,
    diplomacy: 100,
    culture: 100,
    gold: 800,
    population: 50000,
    morale: 80,
    culturePoints: 0,
    techProgress: 0,
    peaceTurns: 0,
  },
};

// 역사 이벤트 목록 (국가별 12개씩, 총 36개)
const EVENTS_BY_NATION: Record<Nation, Array<{
  id: string;
  year: number;
  title: string;
  description: string;
  historicalContext: string;
  category: 'military' | 'economy' | 'diplomacy' | 'culture';
  choices: Array<{
    id: string;
    text: string;
    effects: Partial<NationStats>;
    isHistorical: boolean;
    tooltip: string;
  }>;
}>> = {
  goguryeo: [
    {
      id: 'nakrang_313',
      year: 313,
      title: '낙랑군 정복',
      description: '중국 한나라가 설치한 낙랑군이 약해졌습니다. 이 기회에 낙랑군을 공격하여 한반도에서 중국 세력을 몰아낼 수 있습니다.',
      historicalContext: '313년 미천왕은 낙랑군을 정복하여 400년 넘게 한반도에 있던 중국의 직접 지배를 종식시켰습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '대군을 동원하여 낙랑군을 공격한다',
          effects: { military: 35, economy: 20, gold: -300 },
          isHistorical: true,
          tooltip: '미천왕은 낙랑군을 정복하여 고구려가 한반도의 주인임을 선언했습니다',
        },
        {
          id: 'B',
          text: '낙랑군과 협상하여 조공을 받는다',
          effects: { diplomacy: 15, gold: 100 },
          isHistorical: false,
          tooltip: '외교적 해결을 선택했지만 근본적 해결은 아닙니다',
        },
      ],
    },
    {
      id: 'buddhism_goguryeo_372',
      year: 372,
      title: '불교 전래',
      description: '전진(前秦)에서 승려 순도가 불상과 경문을 가지고 왔습니다. 이 새로운 종교를 어떻게 받아들이시겠습니까?',
      historicalContext: '소수림왕 2년, 중국 전진에서 순도가 불교를 전파했습니다. 이는 고구려 최초의 공식적인 불교 수용으로, 2년 뒤 초문사와 이불란사가 건립되었습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '불교를 국가 종교로 받아들이고 절을 건립한다',
          effects: { culture: 30, morale: 20, gold: -200 },
          isHistorical: true,
          tooltip: '실제 소수림왕은 불교를 수용하고 초문사, 이불란사를 건립했습니다',
        },
        {
          id: 'B',
          text: '불교를 거부하고 전통 신앙을 고수한다',
          effects: { military: 15, morale: -10, culture: -10 },
          isHistorical: false,
          tooltip: '전통을 지키지만, 새로운 사상의 발전 기회를 놓쳤습니다',
        },
      ],
    },
    {
      id: 'taehak_373',
      year: 373,
      title: '태학 설립',
      description: '소수림왕이 귀족 자제들을 교육하는 교육 기관 태학을 설립하려 합니다.',
      historicalContext: '373년 소수림왕은 태학을 설립하여 유교 경전과 역사를 가르쳤습니다. 이는 한국 최초의 국립 대학이었습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '태학을 설립하고 인재를 양성한다',
          effects: { culture: 30, diplomacy: 15, gold: -150 },
          isHistorical: true,
          tooltip: '태학은 한국 최초의 국립 대학이자 관리 양성 기관이었습니다',
        },
        {
          id: 'B',
          text: '전통적인 교육 방식을 유지한다',
          effects: { military: 10, culture: -5 },
          isHistorical: false,
          tooltip: '전통을 고수했지만 인재 양성이 늦어졌습니다',
        },
      ],
    },
    {
      id: 'gwanggaeto_391',
      year: 391,
      title: '광개토대왕 즉위',
      description: '18세의 젊은 왕이 즉위했습니다. 새 왕으로서 첫 번째 정책 방향을 정해야 합니다.',
      historicalContext: '광개토대왕은 18세에 즉위하여 정복 군주로서 고구려 역사상 가장 넓은 영토를 확보했습니다. 그의 업적은 광개토대왕릉비에 기록되어 있습니다. 이 비석은 414년에 세워진 것으로, 1,775자의 한문으로 고구려의 역사와 광개토대왕의 정복 사업을 상세히 기록한 세계적인 문화재입니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '대규모 정복 전쟁을 계획한다',
          effects: { military: 40, economy: -20, morale: 25 },
          isHistorical: true,
          tooltip: '광개토대왕은 즉위 후 활발한 정복 활동을 펼쳤습니다',
        },
        {
          id: 'B',
          text: '내치에 집중하고 국력을 기른다',
          effects: { economy: 30, culture: 15, military: 10 },
          isHistorical: false,
          tooltip: '안정적이지만 팽창의 기회를 놓칠 수 있습니다',
        },
      ],
    },
    {
      id: 'silla_rescue_400',
      year: 400,
      title: '신라 구원 출병',
      description: '왜(倭)와 가야 연합군이 신라를 침공했습니다. 신라 내물왕이 고구려에 구원을 요청했습니다.',
      historicalContext: '광개토대왕은 5만 대군을 보내 신라를 구원하고 왜군을 물리쳤습니다.',
      category: 'diplomacy',
      choices: [
        {
          id: 'A',
          text: '5만 대군을 보내 신라를 구원한다',
          effects: { military: -15, diplomacy: 40, gold: -300 },
          isHistorical: true,
          tooltip: '광개토대왕은 5만 군대를 파견해 왜군을 격퇴했습니다',
        },
        {
          id: 'B',
          text: '신라의 요청을 거절한다',
          effects: { military: 10, diplomacy: -30 },
          isHistorical: false,
          tooltip: '당장은 편하지만 한반도 영향력을 잃을 수 있습니다',
        },
      ],
    },
    {
      id: 'pyongyang_427',
      year: 427,
      title: '평양 천도',
      description: '장수왕이 수도를 국내성에서 평양으로 옮기려 합니다. 남진 정책의 전초가 될 중대한 결정입니다.',
      historicalContext: '427년 장수왕은 평양으로 천도하여 남진 정책의 기반을 마련했습니다.',
      category: 'economy',
      choices: [
        {
          id: 'A',
          text: '평양으로 천도하고 남진 정책을 준비한다',
          effects: { economy: 35, military: 20, gold: -400 },
          isHistorical: true,
          tooltip: '평양은 교통의 요지이자 비옥한 평야 지대로 고구려 발전의 중심이 되었습니다',
        },
        {
          id: 'B',
          text: '국내성을 유지하고 북방을 강화한다',
          effects: { military: 25, gold: 100 },
          isHistorical: false,
          tooltip: '전통적 거점을 유지했지만 남진 기회를 놓쳤습니다',
        },
      ],
    },
    {
      id: 'sui_598',
      year: 598,
      title: '수나라 1차 침입 대비',
      description: '중국을 통일한 수나라가 30만 대군으로 고구려를 침공하려 합니다. 어떻게 대응하시겠습니까?',
      historicalContext: '598년 수 문제가 30만 대군으로 고구려를 침공했으나, 장마와 질병으로 크게 패하고 물러났습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '요동 방어선을 강화하고 결사 항전한다',
          effects: { military: 35, morale: 25, gold: -300 },
          isHistorical: true,
          tooltip: '고구려는 수나라의 침공을 성공적으로 막아냈습니다',
        },
        {
          id: 'B',
          text: '수나라에 사신을 보내 화친을 청한다',
          effects: { diplomacy: 20, morale: -20, gold: -200 },
          isHistorical: false,
          tooltip: '당장의 전쟁은 피하지만 굴욕적일 수 있습니다',
        },
      ],
    },
    {
      id: 'salsu_612',
      year: 612,
      title: '살수대첩',
      description: '수 양제의 113만 대군이 침공했습니다! 을지문덕 장군이 유인 작전을 제안합니다.',
      historicalContext: '612년 을지문덕은 수나라 별동대 30만을 살수까지 유인한 후 궤멸시켰습니다. 살아 돌아간 자는 2,700명에 불과했습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '을지문덕의 유인 작전을 승인한다',
          effects: { military: 50, morale: 40, culture: 20 },
          isHistorical: true,
          tooltip: '살수대첩은 한국 역사상 가장 위대한 승리 중 하나입니다',
        },
        {
          id: 'B',
          text: '요동성에서 농성전을 펼친다',
          effects: { military: 25, morale: 15, gold: -200 },
          isHistorical: false,
          tooltip: '안전한 방어지만 결정적 승리를 거두기 어렵습니다',
        },
      ],
    },
    {
      id: 'wall_631',
      year: 631,
      title: '천리장성 건설',
      description: '당나라의 위협에 대비해 연개소문이 요동에서 부여성까지 천리장성 건설을 제안합니다.',
      historicalContext: '631년부터 647년까지 고구려는 천리장성을 쌓았습니다. 이 성은 당나라의 침입에 대비한 것으로 16년에 걸쳐 완성되었습니다.',
      category: 'economy',
      choices: [
        {
          id: 'A',
          text: '천리장성 건설을 승인한다',
          effects: { military: 30, economy: -25, gold: -500, morale: -10 },
          isHistorical: true,
          tooltip: '천리장성은 당나라 침입에 중요한 방어선이 되었습니다',
        },
        {
          id: 'B',
          text: '기존 성곽 보수에 집중한다',
          effects: { military: 15, economy: -10, gold: -200 },
          isHistorical: false,
          tooltip: '적은 비용으로 방어력을 유지합니다',
        },
      ],
    },
    {
      id: 'yeon_642',
      year: 642,
      title: '연개소문의 정변',
      description: '대막리지 연개소문이 귀족들과 영류왕을 제거하고 실권을 장악하려 합니다.',
      historicalContext: '642년 연개소문은 쿠데타를 일으켜 영류왕과 귀족 180여 명을 살해하고 보장왕을 옹립했습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '연개소문의 정변을 지지한다',
          effects: { military: 40, diplomacy: -20, morale: -15 },
          isHistorical: true,
          tooltip: '연개소문은 막리지로서 고구려를 강력히 통치했습니다',
        },
        {
          id: 'B',
          text: '왕을 보호하고 연개소문을 토벌한다',
          effects: { diplomacy: 20, military: -30 },
          isHistorical: false,
          tooltip: '정통성을 지켰지만 내란의 위험이 있습니다',
        },
      ],
    },
    {
      id: 'ansi_645',
      year: 645,
      title: '안시성 전투',
      description: '당 태종이 직접 이끄는 대군이 안시성을 88일간 포위하고 있습니다. 성주 양만춘이 결사 항전 중입니다.',
      historicalContext: '645년 당 태종의 고구려 원정에서 안시성은 88일간 버텨 당군을 물리쳤습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '안시성 수비대에 지원군을 보낸다',
          effects: { military: 40, morale: 35, gold: -200 },
          isHistorical: true,
          tooltip: '안시성의 승리는 고구려의 위대한 저항 정신을 보여줍니다',
        },
        {
          id: 'B',
          text: '안시성을 포기하고 평양 방어에 집중한다',
          effects: { military: 15, morale: -25, economy: -20 },
          isHistorical: false,
          tooltip: '전략적 후퇴지만 사기에 큰 타격을 줍니다',
        },
      ],
    },
    {
      id: 'goguryeo_tomb_murals_500',
      year: 500,
      title: '고분벽화 제작',
      description: '고구려의 예술가들이 왕릉에 벽화를 그리려 합니다. 어떤 주제와 스타일로 그릴지 결정해야 합니다.',
      historicalContext: '고구려 고분벽화는 안악3호분, 덕흥리 고분, 쌍영총, 무용총 등에 그려진 벽화로, 사신도(四神圖), 수렵도, 무용도 등이 있습니다. 이는 고구려 회화 예술의 정수로, 동아시아 고대 회화사에서 중요한 위치를 차지하며 일부 고분은 유네스코 세계문화유산으로 등재되었습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '사신도와 종교적 상징을 중심으로 그린다',
          effects: { culture: 40, morale: 20, gold: -300 },
          isHistorical: true,
          tooltip: '사신도는 고구려의 우주관과 종교적 사상을 보여주는 대표 작품입니다',
        },
        {
          id: 'B',
          text: '수렵도와 무용도 등 생활 모습을 중심으로 그린다',
          effects: { culture: 35, morale: 25, gold: -250 },
          isHistorical: true,
          tooltip: '생활 벽화는 고구려인의 일상과 문화를 생생하게 보여줍니다',
        },
        {
          id: 'C',
          text: '군사적 위용을 강조한 전투 장면을 그린다',
          effects: { culture: 25, military: 20, gold: -200 },
          isHistorical: false,
          tooltip: '군사력을 강조했지만 예술적 다양성은 줄어듭니다',
        },
      ],
    },
    {
      id: 'goguryeo_668',
      year: 668,
      title: '나당연합군의 침공',
      description: '신라와 당나라가 연합하여 고구려를 협공하고 있습니다. 연개소문 사후 내분이 일어나 위기가 가중되었습니다.',
      historicalContext: '668년 나당연합군의 공격으로 평양성이 함락되고 고구려가 멸망했습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '평양성에서 끝까지 항전한다',
          effects: { military: -50, morale: 40, population: -10000 },
          isHistorical: true,
          tooltip: '고구려는 멸망했지만 그 저항 정신은 역사에 길이 남았습니다',
        },
        {
          id: 'B',
          text: '북방으로 후퇴하여 부흥을 도모한다',
          effects: { military: -20, economy: -30, morale: 15 },
          isHistorical: false,
          tooltip: '생존을 선택했지만 국가의 기반을 잃었습니다',
        },
      ],
    },
  ],
  baekje: [
    {
      id: 'geunchogo_346',
      year: 346,
      title: '근초고왕 즉위',
      description: '근초고왕이 즉위했습니다. 백제를 강대국으로 만들 기회입니다.',
      historicalContext: '근초고왕(재위 346-375)은 백제의 전성기를 이끈 왕입니다.',
      category: 'diplomacy',
      choices: [
        {
          id: 'A',
          text: '적극적인 대외 확장 정책을 추진한다',
          effects: { military: 35, diplomacy: 20, gold: -250 },
          isHistorical: true,
          tooltip: '근초고왕은 북으로 고구려를, 남으로 가야를, 바다 건너 왜까지 영향력을 행사했습니다',
        },
        {
          id: 'B',
          text: '내정 개혁에 집중한다',
          effects: { economy: 30, culture: 20 },
          isHistorical: false,
          tooltip: '안정적이지만 팽창 기회를 놓쳤습니다',
        },
      ],
    },
    {
      id: 'baekje_369',
      year: 369,
      title: '백제의 전성기',
      description: '근초고왕이 군사를 이끌고 고구려를 공격하려 합니다. 고국원왕과의 결전이 예상됩니다.',
      historicalContext: '369년 근초고왕은 고구려 고국원왕을 공격하여 전사시켰습니다. 이는 백제가 고구려를 압도한 전성기의 상징적 사건입니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '대군을 이끌고 고구려를 공격한다',
          effects: { military: 45, morale: 30, gold: -300 },
          isHistorical: true,
          tooltip: '백제는 고구려 왕을 전사시키는 대승을 거두었습니다',
        },
        {
          id: 'B',
          text: '방어에 충실하고 국력을 비축한다',
          effects: { economy: 25, gold: 150 },
          isHistorical: false,
          tooltip: '안전했지만 전성기를 놓쳤습니다',
        },
      ],
    },
    {
      id: 'buddhism_baekje_384',
      year: 384,
      title: '침류왕의 불교 수용',
      description: '동진에서 인도 승려 마라난타가 바닷길을 통해 백제에 도착했습니다.',
      historicalContext: '침류왕은 마라난타를 궁중에서 맞이하고 예를 갖추어 공경하였으며, 이듬해 한산에 절을 지었습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '마라난타를 환대하고 불교를 공인한다',
          effects: { culture: 25, diplomacy: 15, gold: -150 },
          isHistorical: true,
          tooltip: '침류왕은 마라난타를 맞이하고 한산에 절을 지었습니다',
        },
        {
          id: 'B',
          text: '외래 종교라며 마라난타를 돌려보낸다',
          effects: { military: 10, diplomacy: -20, culture: -15 },
          isHistorical: false,
          tooltip: '외국과의 관계가 악화될 수 있습니다',
        },
      ],
    },
    {
      id: 'naje_433',
      year: 433,
      title: '나제동맹 체결',
      description: '고구려의 남진 압박이 심해지고 있습니다. 신라 눌지왕이 비밀리에 동맹을 제안해왔습니다.',
      historicalContext: '433년 백제 비유왕과 신라 눌지왕은 고구려에 대항하기 위해 나제동맹을 맺었습니다. 이 동맹은 약 120년간 유지되었습니다.',
      category: 'diplomacy',
      choices: [
        {
          id: 'A',
          text: '신라와 동맹을 맺어 고구려에 대항한다',
          effects: { diplomacy: 35, military: 20, morale: 15 },
          isHistorical: true,
          tooltip: '나제동맹은 120년간 이어지며 두 나라의 생존을 보장했습니다',
        },
        {
          id: 'B',
          text: '신라 대신 고구려와 화친을 시도한다',
          effects: { diplomacy: 20, morale: -10 },
          isHistorical: false,
          tooltip: '강대국과의 화친이지만 굴복으로 비칠 수 있습니다',
        },
      ],
    },
    {
      id: 'hanseong_475',
      year: 475,
      title: '한성 함락 위기',
      description: '고구려 장수왕의 3만 대군이 백제 수도 한성을 포위했습니다! 개로왕과 백제의 운명이 경각에 달렸습니다.',
      historicalContext: '475년 고구려 장수왕은 직접 3만 군을 이끌고 백제를 공격했습니다. 한성이 함락되고 개로왕이 전사했으며, 백제는 웅진으로 천도해야 했습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '끝까지 한성을 사수한다',
          effects: { military: -30, morale: 20, population: -5000 },
          isHistorical: true,
          tooltip: '실제 역사에서 개로왕은 성을 지키다 전사했습니다',
        },
        {
          id: 'B',
          text: '신속히 웅진으로 천도한다',
          effects: { economy: -20, morale: -15, gold: -500 },
          isHistorical: false,
          tooltip: '왕은 살릴 수 있지만 많은 것을 잃습니다',
        },
      ],
    },
    {
      id: 'sabi_538',
      year: 538,
      title: '사비 천도',
      description: '성왕이 웅진에서 사비(부여)로 수도를 옮기고 국호를 남부여로 바꾸려 합니다.',
      historicalContext: '538년 성왕은 백제 중흥을 위해 사비로 천도하고 국호를 남부여로 고쳤습니다.',
      category: 'economy',
      choices: [
        {
          id: 'A',
          text: '사비로 천도하고 국호를 남부여로 바꾼다',
          effects: { economy: 30, culture: 20, gold: -400, morale: 25 },
          isHistorical: true,
          tooltip: '성왕은 사비 천도로 백제 중흥의 기틀을 마련했습니다',
        },
        {
          id: 'B',
          text: '웅진에서 내실을 다지며 천도를 미룬다',
          effects: { economy: 15, gold: 100 },
          isHistorical: false,
          tooltip: '안정적이지만 발전의 기회가 줄어듭니다',
        },
      ],
    },
    {
      id: 'japan_541',
      year: 541,
      title: '일본과의 문화 교류',
      description: '일본(왜)에서 불교와 선진 문물을 요청해왔습니다. 문화 교류를 통해 동맹을 강화할 수 있습니다.',
      historicalContext: '6세기 백제는 일본에 불교, 유학, 건축, 회화 등 선진 문화를 전파했습니다.',
      category: 'diplomacy',
      choices: [
        {
          id: 'A',
          text: '승려와 기술자를 파견하여 문화를 전파한다',
          effects: { diplomacy: 30, culture: 20, gold: 200 },
          isHistorical: true,
          tooltip: '백제는 일본에 선진 문화를 전파하며 강력한 동맹을 구축했습니다',
        },
        {
          id: 'B',
          text: '군사 동맹에만 집중한다',
          effects: { military: 20, diplomacy: 10 },
          isHistorical: false,
          tooltip: '실리적이지만 문화적 영향력을 놓쳤습니다',
        },
      ],
    },
    {
      id: 'hangang_551',
      year: 551,
      title: '한강 유역 탈환',
      description: '성왕이 신라와 연합하여 고구려로부터 한강 유역을 되찾으려 합니다.',
      historicalContext: '551년 백제는 신라와 연합하여 한강 유역을 탈환했습니다. 그러나 553년 신라가 백제 몫까지 독차지하면서 나제동맹이 깨졌습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '신라와 연합하여 한강 유역을 공격한다',
          effects: { military: 30, economy: 25, gold: -300 },
          isHistorical: true,
          tooltip: '한강 유역을 탈환했지만 곧 신라에게 배신당했습니다',
        },
        {
          id: 'B',
          text: '단독으로 한강 유역을 공격한다',
          effects: { military: 20, gold: -400 },
          isHistorical: false,
          tooltip: '독자적이지만 성공하기 어렵습니다',
        },
      ],
    },
    {
      id: 'gwansan_554',
      year: 554,
      title: '관산성 전투',
      description: '신라가 한강 유역을 독차지했습니다! 성왕이 친정하여 관산성을 공격하려 합니다.',
      historicalContext: '554년 성왕은 신라를 공격했으나 관산성 전투에서 패배하고 전사했습니다. 이는 백제에게 큰 타격이었습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '왕이 직접 군사를 이끌고 신라를 공격한다',
          effects: { military: -40, morale: -25, population: -4000 },
          isHistorical: true,
          tooltip: '성왕은 전사했고 백제는 큰 타격을 입었습니다',
        },
        {
          id: 'B',
          text: '장군에게 맡기고 왕은 후방에 머문다',
          effects: { military: 15, morale: 10 },
          isHistorical: false,
          tooltip: '안전했지만 사기를 높이지 못했습니다',
        },
      ],
    },
    {
      id: 'muwang_600',
      year: 600,
      title: '무왕의 개혁',
      description: '무왕이 즉위하여 백제를 다시 일으키려 합니다. 강력한 왕권 확립이 필요합니다.',
      historicalContext: '600년대 초 무왕은 강력한 왕권을 구축하고 익산 천도를 시도하는 등 개혁을 추진했습니다. 미륵사를 창건하여 불교 진흥에도 힘썼습니다. 미륵사는 백제 최대 규모의 사찰로, 3개의 금당과 3개의 탑이 배치된 독특한 구조를 가진 문화재입니다. 현재 미륵사지 석탑은 국보 제11호로 지정되어 있으며, 백제 건축 기술의 정수를 보여줍니다.',
      category: 'economy',
      choices: [
        {
          id: 'A',
          text: '왕권을 강화하고 대규모 개혁을 단행한다',
          effects: { economy: 25, culture: 20, morale: -10 },
          isHistorical: true,
          tooltip: '무왕은 미륵사를 창건하는 등 대규모 개혁을 추진했습니다',
        },
        {
          id: 'B',
          text: '귀족과의 협력 체제를 유지한다',
          effects: { diplomacy: 20, morale: 15 },
          isHistorical: false,
          tooltip: '안정적이지만 혁신이 부족합니다',
        },
      ],
    },
    {
      id: 'jungnimsa_550',
      year: 550,
      title: '정림사지 5층석탑 건립',
      description: '사비 천도 후 백제의 건축 기술을 보여줄 대표적인 석탑을 건립하려 합니다. 규모와 설계 방향을 결정해야 합니다.',
      historicalContext: '정림사지 5층석탑은 백제 석탑의 대표작으로, 우아한 비례와 정교한 조각이 특징입니다. 국보 제9호로 지정되어 있으며, 백제 석탑 건축의 표준을 보여주는 문화재입니다. 현재까지 보존되어 있으며, 백제 문화의 우수성을 증명합니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '5층 석탑을 정교하게 건립하여 백제 건축의 정수를 보여준다',
          effects: { culture: 35, morale: 20, gold: -250 },
          isHistorical: true,
          tooltip: '정림사지 5층석탑은 국보 제9호로 지정된 백제의 대표 문화재입니다',
        },
        {
          id: 'B',
          text: '더 높은 7층 석탑을 건립하여 위엄을 드러낸다',
          effects: { culture: 30, morale: 25, gold: -400, economy: -15 },
          isHistorical: false,
          tooltip: '더 화려하지만 비용이 많이 들고 건축 난이도가 높습니다',
        },
        {
          id: 'C',
          text: '3층 석탑으로 건립하여 비용을 절감한다',
          effects: { culture: 20, gold: -150 },
          isHistorical: false,
          tooltip: '비용은 절약했지만 백제 건축 기술의 우수성을 충분히 보여주지 못합니다',
        },
      ],
    },
    {
      id: 'muryeong_tomb_525',
      year: 525,
      title: '무령왕릉 조성',
      description: '무령왕과 왕비의 무덤을 조성하려 합니다. 무덤의 규모와 부장품, 그리고 후세를 위한 기록 방식을 결정해야 합니다.',
      historicalContext: '무령왕릉은 백제 무령왕과 왕비의 무덤으로, 묘지석이 발견되어 정확한 연대(525년)를 알 수 있습니다. 백제 왕릉 중 유일하게 도굴되지 않은 무덤으로, 백제 문화 연구의 핵심 자료입니다. 국보 제163호로 지정되어 있으며, 출토 유물은 국립공주박물관에 보관되어 있습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '묘지석을 넣고 정교하게 무덤을 조성하여 후세에 기록을 남긴다',
          effects: { culture: 30, morale: 15, gold: -200 },
          isHistorical: true,
          tooltip: '묘지석 덕분에 정확한 연대를 알 수 있어 백제 문화 연구의 핵심 자료가 되었습니다',
        },
        {
          id: 'B',
          text: '화려한 부장품에 집중하여 왕의 위엄을 드러낸다',
          effects: { culture: 25, morale: 20, gold: -350 },
          isHistorical: false,
          tooltip: '당장의 위엄은 높아지지만 후세 연구에 필요한 기록이 부족합니다',
        },
        {
          id: 'C',
          text: '간소하게 조성하고 비용을 절약한다',
          effects: { culture: 10, gold: -80 },
          isHistorical: false,
          tooltip: '비용은 절약했지만 후세에 전해질 문화재의 가치가 크게 줄어듭니다',
        },
      ],
    },
    {
      id: 'baekje_gold_incense_500',
      year: 500,
      title: '백제 금동대향로 제작',
      description: '백제의 뛰어난 공예 기술을 보여줄 금동대향로를 제작하려 합니다. 용도와 디자인 방향을 결정해야 합니다.',
      historicalContext: '백제 금동대향로는 높이 61.8cm의 정교한 공예품으로, 산악과 동물, 인물이 입체적으로 조각되어 있습니다. 국보 제287호로 지정되어 있으며, 백제 공예 기술의 최고 수준을 보여주는 문화재입니다. 현재 국립부여박물관에 보관되어 있습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '산악과 동물을 입체적으로 조각한 정교한 향로를 제작한다',
          effects: { culture: 40, diplomacy: 15, gold: -300 },
          isHistorical: true,
          tooltip: '백제 금동대향로는 국보 제287호로 지정된 백제 공예의 정수입니다',
        },
        {
          id: 'B',
          text: '외교 선물용으로 더 화려하게 제작하여 외국에 선물한다',
          effects: { culture: 30, diplomacy: 30, gold: -400 },
          isHistorical: false,
          tooltip: '외교적 효과는 크지만 국내 사용은 줄어듭니다',
        },
        {
          id: 'C',
          text: '실용적인 간단한 향로를 여러 개 제작한다',
          effects: { culture: 20, morale: 15, gold: -200 },
          isHistorical: false,
          tooltip: '많은 사람이 사용할 수 있지만 예술적 가치는 떨어집니다',
        },
      ],
    },
    {
      id: 'uija_642',
      year: 642,
      title: '의자왕의 초기 개혁',
      description: '의자왕이 즉위 초기 강력한 개혁 정치를 펼치려 합니다. 신라에 대한 대공세도 준비 중입니다.',
      historicalContext: '642년 의자왕은 즉위 초기 신라의 40여 성을 빼앗는 등 강력한 정치를 펼쳤습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '신라를 적극 공격하여 영토를 확장한다',
          effects: { military: 35, economy: 20, gold: -300 },
          isHistorical: true,
          tooltip: '의자왕은 초기에 신라를 압박하며 40여 성을 빼앗았습니다',
        },
        {
          id: 'B',
          text: '내정 개혁에 집중한다',
          effects: { economy: 30, morale: 20 },
          isHistorical: false,
          tooltip: '안정적이지만 확장 기회를 놓쳤습니다',
        },
      ],
    },
    {
      id: 'baekje_660',
      year: 660,
      title: '나당연합군 침공',
      description: '신라와 당나라 연합군 18만이 백제를 침공했습니다! 의자왕은 결단을 내려야 합니다.',
      historicalContext: '660년 나당연합군이 백제를 공격했습니다. 계백 장군은 5천 결사대로 황산벌에서 저항했으나 패하고, 사비성이 함락되어 백제는 멸망했습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '계백 장군을 보내 황산벌에서 결사 항전한다',
          effects: { military: 30, morale: 40, population: -3000 },
          isHistorical: true,
          tooltip: '계백의 5천 결사대는 백제의 마지막 자존심이었습니다',
        },
        {
          id: 'B',
          text: '사비성을 버리고 남쪽으로 피신한다',
          effects: { morale: -30, economy: -40, gold: -500 },
          isHistorical: false,
          tooltip: '생존을 택하지만 나라를 잃을 수 있습니다',
        },
      ],
    },
  ],
  silla: [
    {
      id: 'naemul_356',
      year: 356,
      title: '내물 마립간 즉위',
      description: '내물 마립간이 즉위하여 김씨 왕위 세습을 확립했습니다.',
      historicalContext: '356년 내물 마립간 즉위 이후 신라 왕위는 김씨가 세습하게 되었습니다.',
      category: 'diplomacy',
      choices: [
        {
          id: 'A',
          text: '김씨 왕위 세습 체제를 확립한다',
          effects: { diplomacy: 25, morale: 20 },
          isHistorical: true,
          tooltip: '이후 신라 왕위는 김씨가 세습하게 되었습니다',
        },
        {
          id: 'B',
          text: '귀족 연합 체제를 유지한다',
          effects: { diplomacy: 15, morale: 10 },
          isHistorical: false,
          tooltip: '전통을 유지했지만 왕권이 약했습니다',
        },
      ],
    },
    {
      id: 'naje_silla_433',
      year: 433,
      title: '나제동맹 가입',
      description: '백제가 고구려에 대항하기 위한 동맹을 제안했습니다. 신라도 고구려의 압박을 받고 있는 상황입니다.',
      historicalContext: '433년 신라 눌지왕과 백제 비유왕은 고구려의 위협에 맞서기 위해 나제동맹을 체결했습니다.',
      category: 'diplomacy',
      choices: [
        {
          id: 'A',
          text: '백제와 동맹을 맺어 고구려에 대항한다',
          effects: { diplomacy: 35, military: 20, morale: 15 },
          isHistorical: true,
          tooltip: '나제동맹은 양국의 생존 전략이었습니다',
        },
        {
          id: 'B',
          text: '고구려에 계속 복속된다',
          effects: { diplomacy: -20, morale: -15, military: 10 },
          isHistorical: false,
          tooltip: '안전하지만 자주권을 잃습니다',
        },
      ],
    },
    {
      id: 'silla_rename_503',
      year: 503,
      title: '국호 신라 확정',
      description: '지증왕이 국호를 정식으로 신라로 정하고 왕의 칭호도 마립간에서 왕으로 바꾸려 합니다.',
      historicalContext: '503년 지증왕은 국호를 신라로 확정하고, 중국식 왕호인 왕을 사용했습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '국호를 신라로 정하고 왕호를 사용한다',
          effects: { culture: 25, diplomacy: 20, morale: 15 },
          isHistorical: true,
          tooltip: '지증왕은 체제 정비를 통해 국가 발전의 기틀을 마련했습니다',
        },
        {
          id: 'B',
          text: '전통적인 국호와 마립간 칭호를 유지한다',
          effects: { morale: 10, culture: -10, diplomacy: -15 },
          isHistorical: false,
          tooltip: '전통을 지키지만 국제적 위상에 불리할 수 있습니다',
        },
      ],
    },
    {
      id: 'usan_512',
      year: 512,
      title: '이사부의 우산국 정복',
      description: '장군 이사부가 우산국(울릉도) 정복을 건의했습니다. 그는 나무 사자를 만들어 위협하는 기발한 계책을 제안합니다.',
      historicalContext: '512년 이사부는 나무로 만든 사자를 배에 싣고 가서 우산국 사람들을 위협해 항복을 받아냈습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '이사부의 계책을 승인하고 출병한다',
          effects: { military: 20, diplomacy: 10, gold: -100 },
          isHistorical: true,
          tooltip: '이사부는 목우사자 전술로 피 한 방울 흘리지 않고 정복했습니다',
        },
        {
          id: 'B',
          text: '해상 원정은 위험하니 보류한다',
          effects: { gold: 50, military: -5 },
          isHistorical: false,
          tooltip: '안전하지만 영토 확장 기회를 놓칩니다',
        },
      ],
    },
    {
      id: 'law_520',
      year: 520,
      title: '율령 반포',
      description: '법흥왕이 국가 통치의 기본 법전인 율령을 반포하려 합니다.',
      historicalContext: '520년 법흥왕은 율령을 반포하여 중앙집권 체제를 강화했습니다.',
      category: 'economy',
      choices: [
        {
          id: 'A',
          text: '율령을 반포하고 중앙집권을 강화한다',
          effects: { economy: 25, diplomacy: 20, morale: 15 },
          isHistorical: true,
          tooltip: '율령 반포는 신라가 고대 국가로 발전하는 중요한 계기였습니다',
        },
        {
          id: 'B',
          text: '귀족의 반발을 고려해 점진적으로 추진한다',
          effects: { diplomacy: 15, morale: 10 },
          isHistorical: false,
          tooltip: '안전하지만 개혁이 늦어집니다',
        },
      ],
    },
    {
      id: 'ichadon_527',
      year: 527,
      title: '이차돈의 순교',
      description: '법흥왕이 불교를 공인하려 하지만 귀족들의 반대가 심합니다. 신하 이차돈이 자신을 희생하여 불교의 신비함을 증명하겠다고 나섭니다.',
      historicalContext: '527년 이차돈은 자발적으로 처형당하며 흰 피가 흐르는 기적을 보여주었습니다. 이 사건으로 귀족들의 반대가 무너지고 신라에서 불교가 공인되었습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '이차돈의 희생을 받아들여 불교를 공인한다',
          effects: { culture: 40, morale: 25, diplomacy: 15 },
          isHistorical: true,
          tooltip: '이차돈의 순교 후 신라 불교는 크게 융성했습니다',
        },
        {
          id: 'B',
          text: '귀족들의 뜻을 따라 불교 공인을 포기한다',
          effects: { morale: 10, culture: -20, diplomacy: -10 },
          isHistorical: false,
          tooltip: '당장의 정치적 안정을 택하지만 문화 발전이 늦어집니다',
        },
      ],
    },
    {
      id: 'gaya_532',
      year: 532,
      title: '금관가야 병합',
      description: '금관가야의 마지막 왕 구형왕이 신라에 항복을 청해왔습니다. 어떻게 처리하시겠습니까?',
      historicalContext: '532년 금관가야 구형왕이 나라를 들어 신라에 항복했습니다. 법흥왕은 그를 진골 귀족으로 대우했습니다.',
      category: 'diplomacy',
      choices: [
        {
          id: 'A',
          text: '항복을 받아들이고 구형왕을 귀족으로 예우한다',
          effects: { diplomacy: 30, economy: 25, population: 3000 },
          isHistorical: true,
          tooltip: '구형왕은 진골 귀족이 되었고, 후손 김유신이 배출되었습니다',
        },
        {
          id: 'B',
          text: '금관가야를 무력으로 정복한다',
          effects: { military: 20, morale: -10, diplomacy: -20 },
          isHistorical: false,
          tooltip: '무력 정복은 다른 가야국들의 반발을 살 수 있습니다',
        },
      ],
    },
    {
      id: 'daegaya_562',
      year: 562,
      title: '대가야 정복',
      description: '가야 연맹의 마지막 강자 대가야가 신라에 저항하고 있습니다. 이사부 장군이 정복을 건의합니다.',
      historicalContext: '562년 신라 진흥왕은 이사부와 사다함을 보내 대가야를 멸망시켰습니다. 이로써 가야 연맹은 완전히 역사 속으로 사라졌습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '이사부를 보내 대가야를 정복한다',
          effects: { military: 30, economy: 25, population: 5000, gold: -150 },
          isHistorical: true,
          tooltip: '대가야 정복으로 신라는 낙동강 유역을 완전히 장악했습니다',
        },
        {
          id: 'B',
          text: '대가야를 속국으로 두고 조공만 받는다',
          effects: { diplomacy: 15, economy: 15, gold: 100 },
          isHistorical: false,
          tooltip: '평화적이지만 불안정한 관계가 지속됩니다',
        },
      ],
    },
    {
      id: 'hwarang_576',
      year: 576,
      title: '화랑도 창설',
      description: '진흥왕이 귀족 청년들을 모아 화랑이라는 인재 양성 조직을 만들려 합니다.',
      historicalContext: '576년 진흥왕은 화랑도를 창설했습니다. 화랑도는 김유신, 관창 등 명장들을 배출했습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '화랑도를 창설하여 인재를 양성한다',
          effects: { military: 25, culture: 30, morale: 20 },
          isHistorical: true,
          tooltip: '화랑도는 삼국통일의 원동력이 된 인재들을 배출했습니다',
        },
        {
          id: 'B',
          text: '전통적인 군사 훈련 체계를 유지한다',
          effects: { military: 15, culture: -5 },
          isHistorical: false,
          tooltip: '기존 방식을 고수하면 혁신이 늦어질 수 있습니다',
        },
      ],
    },
    {
      id: 'seondeok_632',
      year: 632,
      title: '선덕여왕 즉위',
      description: '진평왕이 후사 없이 사망하여 딸 덕만이 왕위에 오르려 합니다. 신라 최초의 여왕 탄생입니다.',
      historicalContext: '632년 선덕여왕은 신라 최초의 여왕으로 즉위했습니다. 그녀는 황룡사 9층탑과 첨성대를 건립하고, 김춘추와 김유신을 등용하여 삼국통일의 기반을 마련했습니다. 황룡사 9층목탑은 645년에 완성된 것으로, 당나라를 상징하는 9층으로 쌓아 당의 위협을 상징적으로 막으려는 의도였습니다. 이 탑은 신라 건축 기술의 정수였으나 현재는 터만 남아있습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '선덕을 여왕으로 즉위시킨다',
          effects: { culture: 35, diplomacy: 20, military: -10 },
          isHistorical: true,
          tooltip: '선덕여왕은 김춘추와 김유신을 등용하여 삼국통일의 기반을 마련했습니다',
        },
        {
          id: 'B',
          text: '왕족 남성을 왕으로 추대한다',
          effects: { military: 20, morale: 15 },
          isHistorical: false,
          tooltip: '전통을 지켰지만 현명한 지도자를 놓쳤습니다',
        },
      ],
    },
    {
      id: 'tang_alliance_648',
      year: 648,
      title: '나당동맹 체결',
      description: '김춘추가 당나라에 가서 동맹을 제안하려 합니다. 당의 힘을 빌려 고구려와 백제를 치는 위험한 도박입니다.',
      historicalContext: '648년 김춘추는 당 태종을 만나 나당동맹을 성사시켰습니다. 당은 백제와 고구려 정복 후 대동강 이남을 신라에 주겠다고 약속했습니다.',
      category: 'diplomacy',
      choices: [
        {
          id: 'A',
          text: '당나라와 동맹을 맺는다',
          effects: { diplomacy: 40, military: 30, culture: -10 },
          isHistorical: true,
          tooltip: '나당동맹은 삼국통일의 결정적 계기가 되었습니다',
        },
        {
          id: 'B',
          text: '독자적인 힘으로 통일을 추진한다',
          effects: { military: 20, morale: 25, diplomacy: -15 },
          isHistorical: false,
          tooltip: '자주적이지만 힘이 부족할 수 있습니다',
        },
      ],
    },
    {
      id: 'baekje_conquest_660',
      year: 660,
      title: '백제 정벌',
      description: '나당연합군을 편성하여 백제를 공격할 시기입니다. 백제를 멸망시키고 통일의 첫 단계를 완수하시겠습니까?',
      historicalContext: '660년 신라는 당나라와 연합하여 백제를 공격했습니다. 김유신이 황산벌에서 계백의 결사대를 격파하고, 사비성이 함락되어 백제가 멸망했습니다.',
      category: 'military',
      choices: [
        {
          id: 'A',
          text: '나당연합군을 이끌고 백제를 공격한다',
          effects: { military: 40, economy: 30, population: 8000, gold: -400 },
          isHistorical: true,
          tooltip: '신라는 백제를 멸망시키고 삼국통일의 첫 단계를 완수했습니다',
        },
        {
          id: 'B',
          text: '고구려를 먼저 공격한다',
          effects: { military: 25, gold: -500 },
          isHistorical: false,
          tooltip: '전략을 바꿨지만 더 어려운 길을 선택했습니다',
        },
      ],
    },
    {
      id: 'silla_gold_crown_500',
      year: 500,
      title: '경주 금관 제작',
      description: '신라 왕족의 권위를 상징하는 화려한 금관을 제작하려 합니다. 디자인과 용도를 결정해야 합니다.',
      historicalContext: '경주 금관총 금관은 신라 금관 가야 중 가장 화려한 금관으로, 나뭇가지와 사슴뿔 모양의 장식이 특징입니다. 국보 제138호로 지정되어 있으며, 신라 금관 문화의 정수를 보여주는 문화재입니다. 현재 국립경주박물관에 보관되어 있습니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '나뭇가지와 사슴뿔 장식이 있는 전통적 금관을 제작한다',
          effects: { culture: 35, morale: 20, gold: -250 },
          isHistorical: true,
          tooltip: '경주 금관총 금관은 국보 제138호로 지정된 신라 금관의 대표작입니다',
        },
        {
          id: 'B',
          text: '더 화려한 보석 장식을 추가하여 왕권을 강조한다',
          effects: { culture: 30, morale: 25, gold: -400, diplomacy: -10 },
          isHistorical: false,
          tooltip: '왕권은 강화되지만 귀족들의 반발이 있을 수 있습니다',
        },
        {
          id: 'C',
          text: '간소한 디자인으로 여러 개 제작하여 귀족들에게도 하사한다',
          effects: { culture: 20, diplomacy: 20, gold: -300 },
          isHistorical: false,
          tooltip: '귀족들의 지지는 얻지만 왕권의 독특함은 줄어듭니다',
        },
      ],
    },
    {
      id: 'anapji_674',
      year: 674,
      title: '안압지 조성',
      description: '문무왕이 신라 궁궐의 정원으로 인공 연못을 만들려 합니다. 규모와 설계 방향을 결정해야 합니다.',
      historicalContext: '안압지는 신라 문무왕이 만든 인공 연못으로, 신라 궁궐의 정원이었습니다. 신라 정원 예술의 대표작으로, 동서남북에 섬을 배치한 독특한 설계를 가집니다. 현재까지 보존되어 있으며, 경주를 대표하는 관광지입니다.',
      category: 'culture',
      choices: [
        {
          id: 'A',
          text: '동서남북에 섬을 배치한 정교한 설계로 안압지를 조성한다',
          effects: { culture: 30, morale: 20, gold: -200 },
          isHistorical: true,
          tooltip: '안압지는 신라 정원 예술의 대표작으로 현재까지 보존되어 있습니다',
        },
        {
          id: 'B',
          text: '더 큰 규모로 확장하여 왕의 위엄을 드러낸다',
          effects: { culture: 25, morale: 25, gold: -350, economy: -15 },
          isHistorical: false,
          tooltip: '더 화려하지만 비용이 많이 들고 관리가 어렵습니다',
        },
        {
          id: 'C',
          text: '실용적인 정원으로 조성하여 궁궐의 생활을 편리하게 한다',
          effects: { culture: 20, morale: 15, economy: 10, gold: -150 },
          isHistorical: false,
          tooltip: '실용적이지만 예술적 가치는 떨어집니다',
        },
      ],
    },
  ],
};

export const SinglePlayerPage = () => {
  const navigate = useNavigate();
  const [selectedNation, setSelectedNation] = useState<Nation | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [turn, setTurn] = useState(1);
  const [year, setYear] = useState(300);
  const [stats, setStats] = useState<NationStats | null>(null);
  const [currentEvent, setCurrentEvent] = useState<typeof EVENTS_BY_NATION['goguryeo'][0] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [usedEventIds, setUsedEventIds] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  // 연도 순서대로 다음 이벤트 선택
  const getNextEvent = (nation: Nation) => {
    const nationEvents = EVENTS_BY_NATION[nation];
    // 연도 순서대로 정렬
    const sortedEvents = [...nationEvents].sort((a, b) => a.year - b.year);
    
    // 사용되지 않은 이벤트 중 가장 이른 연도의 이벤트 선택
    const availableEvents = sortedEvents.filter(event => !usedEventIds.has(event.id));
    
    // 모든 이벤트를 다 사용했으면 null 반환 (게임 종료)
    if (availableEvents.length === 0) {
      return null;
    }
    
    // 가장 이른 연도의 이벤트 반환 (선택지 랜덤 배열)
    const event = { ...availableEvents[0] };
    // 선택지 배열을 랜덤으로 섞기
    const shuffledChoices = [...event.choices].sort(() => Math.random() - 0.5);
    event.choices = shuffledChoices;
    return event;
  };

  const handleStartGame = (nation: Nation) => {
    setSelectedNation(nation);
    setStats({ ...INITIAL_STATS[nation] });
    setGameStarted(true);
    setUsedEventIds(new Set());
    setScore(0);
    setTurn(1);
    setGameFinished(false);
    // 연도 순서대로 첫 번째 이벤트 선택
    const firstEvent = getNextEvent(nation);
    if (firstEvent) {
      setCurrentEvent(firstEvent);
      setYear(firstEvent.year); // 이벤트의 실제 연도로 설정
      setUsedEventIds(new Set([firstEvent.id]));
    }
  };

  // 점수 계산 함수 (감점 포함)
  const calculateScore = (choice: typeof EVENTS_BY_NATION['goguryeo'][0]['choices'][0]) => {
    let points = 0;
    
    // 1. 역사적 선택이면 기본 점수 부여
    if (choice.isHistorical) {
      points += 10;
    }
    
    // 2. 선택 효과 계산 (긍정/부정 모두)
    const effects = choice.effects;
    let totalPositiveEffect = 0;
    let totalNegativeEffect = 0;
    
    // 긍정 효과 계산
    if (effects.military && effects.military > 0) totalPositiveEffect += effects.military;
    if (effects.economy && effects.economy > 0) totalPositiveEffect += effects.economy;
    if (effects.diplomacy && effects.diplomacy > 0) totalPositiveEffect += effects.diplomacy;
    if (effects.culture && effects.culture > 0) totalPositiveEffect += effects.culture;
    if (effects.gold && effects.gold > 0) totalPositiveEffect += effects.gold / 10;
    if (effects.population && effects.population > 0) totalPositiveEffect += effects.population / 100;
    if (effects.morale && effects.morale > 0) totalPositiveEffect += effects.morale;
    
    // 부정 효과 계산 (나라 발전 저해)
    if (effects.military && effects.military < 0) totalNegativeEffect += Math.abs(effects.military);
    if (effects.economy && effects.economy < 0) totalNegativeEffect += Math.abs(effects.economy);
    if (effects.diplomacy && effects.diplomacy < 0) totalNegativeEffect += Math.abs(effects.diplomacy);
    if (effects.culture && effects.culture < 0) totalNegativeEffect += Math.abs(effects.culture);
    if (effects.gold && effects.gold < 0) totalNegativeEffect += Math.abs(effects.gold) / 10;
    if (effects.population && effects.population < 0) totalNegativeEffect += Math.abs(effects.population) / 100;
    if (effects.morale && effects.morale < 0) totalNegativeEffect += Math.abs(effects.morale);
    
    // 총 긍정 효과가 50 이상이면 추가 점수
    if (totalPositiveEffect >= 50) {
      points += 5;
    }
    // 총 긍정 효과가 80 이상이면 더 많은 점수
    if (totalPositiveEffect >= 80) {
      points += 5;
    }
    
    // 부정 효과가 30 이상이면 감점 (나라 발전 저해)
    if (totalNegativeEffect >= 30) {
      points -= 5;
    }
    // 부정 효과가 50 이상이면 더 많은 감점
    if (totalNegativeEffect >= 50) {
      points -= 5;
    }
    
    return points;
  };

  const handleChoice = (choiceId: string) => {
    if (!currentEvent || !stats) return;

    const choice = currentEvent.choices.find(c => c.id === choiceId);
    if (!choice) return;

    setSelectedChoice(choiceId);

    // 효과 적용
    const newStats = { ...stats };
    if (choice.effects.military) newStats.military += choice.effects.military;
    if (choice.effects.economy) newStats.economy += choice.effects.economy;
    if (choice.effects.diplomacy) newStats.diplomacy += choice.effects.diplomacy;
    if (choice.effects.culture) newStats.culture += choice.effects.culture;
    if (choice.effects.gold) newStats.gold += choice.effects.gold;
    if (choice.effects.population) newStats.population += choice.effects.population;
    if (choice.effects.morale) newStats.morale += choice.effects.morale;

    setStats(newStats);
    
    // 점수 계산 및 추가
    const points = calculateScore(choice);
    setScore(prev => prev + points);
    
    setShowResult(true);
  };

  const handleNextTurn = () => {
    setTurn(turn + 1);
    // 연도 순서대로 다음 이벤트 선택
    if (selectedNation) {
      const nextEvent = getNextEvent(selectedNation);
      
      // 모든 이벤트가 끝났으면 게임 종료
      if (!nextEvent) {
        setGameFinished(true);
        setCurrentEvent(null);
        setShowResult(false);
        return;
      }
      
      setCurrentEvent(nextEvent);
      setYear(nextEvent.year); // 이벤트의 실제 연도로 설정
      setUsedEventIds(prev => new Set([...prev, nextEvent.id]));
    }
    setShowResult(false);
    setSelectedChoice(null);
  };

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'military': return <Swords className="w-4 h-4" />;
      case 'economy': return <Coins className="w-4 h-4" />;
      case 'diplomacy': return <Users className="w-4 h-4" />;
      case 'culture': return <BookOpen className="w-4 h-4" />;
      case 'morale': return <Heart className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatColor = (stat: string) => {
    switch (stat) {
      case 'military': return 'text-red-400';
      case 'economy': return 'text-yellow-400';
      case 'diplomacy': return 'text-blue-400';
      case 'culture': return 'text-purple-400';
      case 'morale': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  // 국가 선택 화면
  if (!gameStarted) {
    return (
      <div className="min-h-screen baram-bg hanji-texture flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold gold-text mb-4">
              싱글 플레이
            </h1>
            <p className="text-amber-200/70 text-lg">
              국가를 선택하고 역사의 주인공이 되어보세요
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.keys(NATIONS) as Nation[]).map((nationId) => {
              const nation = NATIONS[nationId];
              return (
                <motion.div
                  key={nationId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card
                    variant="nation"
                    nation={nationId}
                    hoverable
                    className="cursor-pointer"
                    onClick={() => handleStartGame(nationId)}
                  >
                    <div className="text-center p-6">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {nation.name}
                      </h2>
                      <p className="text-white/60 mb-4">{nation.englishName}</p>
                      <div className="space-y-2 mb-6">
                        {nation.traits.map((trait, i) => (
                          <p key={i} className="text-white/80 text-sm">{trait}</p>
                        ))}
                      </div>
                      <Button variant={nationId} className="w-full">
                        선택하기
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button variant="ghost" onClick={() => navigate('/')}>
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 게임 화면
  return (
    <div className="min-h-screen baram-bg hanji-texture p-4">
      {/* 상단 정보 */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="scroll-card oriental-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold gold-text flex items-center gap-2">
              <Crown className="w-6 h-6" />
              {selectedNation && NATIONS[selectedNation].name}
            </h2>
            <p className="text-amber-200/70">서기 {year}년 · 턴 {turn}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-5 h-5" />
              <span className="text-xl font-bold">점수: {score}</span>
            </div>
            <Button variant="ghost" onClick={() => {
              setGameStarted(false);
              setSelectedNation(null);
              setStats(null);
              setTurn(1);
              setYear(300);
              setUsedEventIds(new Set());
              setScore(0);
            }}>
              게임 종료
            </Button>
          </div>
        </div>
      </div>

      {/* 스탯 패널 */}
      {stats && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { key: 'military', label: '군사력', value: stats.military },
              { key: 'economy', label: '경제력', value: stats.economy },
              { key: 'diplomacy', label: '외교력', value: stats.diplomacy },
              { key: 'culture', label: '문화력', value: stats.culture },
              { key: 'morale', label: '민심', value: stats.morale },
            ].map(({ key, label, value }) => (
              <div key={key} className="scroll-card oriental-border rounded-lg p-4">
                <div className={`flex items-center gap-2 mb-2 ${getStatColor(key)}`}>
                  {getStatIcon(key)}
                  <span className="text-sm text-amber-200/70">{label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="scroll-card oriental-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2 text-yellow-400">
                <Coins className="w-4 h-4" />
                <span className="text-sm text-amber-200/70">재화</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.gold}</div>
            </div>
            <div className="scroll-card oriental-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2 text-green-400">
                <Users className="w-4 h-4" />
                <span className="text-sm text-amber-200/70">인구</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.population.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* 게임 종료 화면 */}
      <AnimatePresence>
        {gameFinished && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card variant="glass" className="oriental-border">
                <div className="p-8 text-center">
                  <h2 className="text-4xl font-bold gold-text mb-6">
                    게임 완료!
                  </h2>
                  
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Star className="w-12 h-12 text-yellow-400" />
                      <span className="text-5xl font-bold text-yellow-400">
                        최종 점수: {score}점
                      </span>
                    </div>
                    
                    {/* 점수 평가 */}
                    <div className="mt-6">
                      {score >= 100 && (
                        <p className="text-2xl text-green-400 font-bold">역사에 길이 남을 위대한 선택이었습니다!</p>
                      )}
                      {score >= 70 && score < 100 && (
                        <p className="text-2xl text-blue-400 font-bold">훌륭한 통치자였습니다!</p>
                      )}
                      {score >= 40 && score < 70 && (
                        <p className="text-2xl text-amber-400 font-bold">무난한 선택이었습니다.</p>
                      )}
                      {score >= 0 && score < 40 && (
                        <p className="text-2xl text-orange-400 font-bold">더 나은 선택이 있었을 수도 있습니다.</p>
                      )}
                      {score < 0 && (
                        <p className="text-2xl text-red-400 font-bold">역사는 다른 길을 택했습니다.</p>
                      )}
                    </div>
                  </div>

                  {/* 최종 스탯 요약 */}
                  {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="scroll-card rounded-lg p-4">
                        <div className="text-sm text-amber-200/70 mb-1">군사력</div>
                        <div className="text-2xl font-bold text-white">{stats.military}</div>
                      </div>
                      <div className="scroll-card rounded-lg p-4">
                        <div className="text-sm text-amber-200/70 mb-1">경제력</div>
                        <div className="text-2xl font-bold text-white">{stats.economy}</div>
                      </div>
                      <div className="scroll-card rounded-lg p-4">
                        <div className="text-sm text-amber-200/70 mb-1">외교력</div>
                        <div className="text-2xl font-bold text-white">{stats.diplomacy}</div>
                      </div>
                      <div className="scroll-card rounded-lg p-4">
                        <div className="text-sm text-amber-200/70 mb-1">문화력</div>
                        <div className="text-2xl font-bold text-white">{stats.culture}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => {
                        setGameStarted(false);
                        setSelectedNation(null);
                        setStats(null);
                        setTurn(1);
                        setYear(300);
                        setUsedEventIds(new Set());
                        setScore(0);
                        setGameFinished(false);
                        setCurrentEvent(null);
                      }}
                    >
                      다시 시작
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="lg"
                      onClick={() => navigate('/')}
                    >
                      대기실로 돌아가기
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 이벤트 모달 */}
      <AnimatePresence>
        {currentEvent && !showResult && !gameFinished && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card variant="glass" className="oriental-border">
                <div className="p-8">
                  <h2 className="text-3xl font-bold gold-text mb-4 text-center">
                    {currentEvent.title}
                  </h2>
                  <p className="text-amber-100 text-lg mb-6 leading-relaxed">
                    {currentEvent.description}
                  </p>

                  <div className="space-y-4">
                    {currentEvent.choices.map((choice) => (
                      <Button
                        key={choice.id}
                        variant="primary"
                        size="lg"
                        className="w-full text-left justify-start"
                        onClick={() => handleChoice(choice.id)}
                      >
                        {choice.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* 결과 화면 */}
        {showResult && selectedChoice && currentEvent && !gameFinished && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card variant="glass" className="oriental-border">
                <div className="p-8">
                  <h2 className="text-3xl font-bold gold-text mb-4 text-center">
                    선택 결과
                  </h2>

                  {/* 선택한 내용 */}
                  <div className="scroll-card rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-amber-100">당신의 선택</h3>
                      {(() => {
                        const choice = currentEvent.choices.find(c => c.id === selectedChoice);
                        const points = choice ? calculateScore(choice) : 0;
                        if (points > 0) {
                          return (
                            <div className="flex items-center gap-2 text-yellow-400">
                              <Star className="w-5 h-5" />
                              <span className="font-bold">+{points}점</span>
                            </div>
                          );
                        } else if (points < 0) {
                          return (
                            <div className="flex items-center gap-2 text-red-400">
                              <Star className="w-5 h-5" />
                              <span className="font-bold">{points}점</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <p className="text-amber-200/80 leading-relaxed mb-3">
                      {currentEvent.choices.find(c => c.id === selectedChoice)?.text}
                    </p>
                    <div className={`text-sm ${currentEvent.choices.find(c => c.id === selectedChoice)?.isHistorical ? 'text-green-400' : 'text-yellow-400'}`}>
                      {currentEvent.choices.find(c => c.id === selectedChoice)?.tooltip}
                    </div>
                  </div>

                  {/* 역사적 배경 */}
                  <div className="scroll-card rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-amber-100 mb-2">역사적 배경</h3>
                    <p className="text-amber-200/80 leading-relaxed">
                      {currentEvent.historicalContext}
                    </p>
                  </div>

                  <div className="text-center">
                    <Button variant="primary" size="lg" onClick={handleNextTurn}>
                      다음 턴 진행
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
