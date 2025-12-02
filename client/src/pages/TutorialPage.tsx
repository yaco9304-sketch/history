// ============================================
// 튜토리얼 페이지
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Gamepad2, 
  BookOpen, 
  Target,
  Handshake,
  Swords,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { Button, Card } from '../components/common';

interface TutorialStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'intro',
    title: '게임 소개',
    icon: <BookOpen className="w-8 h-8" />,
    content: (
      <div className="space-y-4">
        <p className="text-amber-100 text-lg leading-relaxed">
          <span className="font-bold gold-text">역사전쟁:삼국시대</span>는 고구려, 백제, 신라 삼국시대를 배경으로 한 
          교육용 전략 게임입니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card variant="glass" padding="md" className="text-center">
            <Users className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-amber-100 mb-2">멀티플레이</h3>
            <p className="text-amber-200/70 text-sm">친구들과 함께 팀을 이루어 역사를 체험해요</p>
          </Card>
          <Card variant="glass" padding="md" className="text-center">
            <Gamepad2 className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-amber-100 mb-2">싱글플레이</h3>
            <p className="text-amber-200/70 text-sm">혼자서도 즐길 수 있는 모드</p>
          </Card>
          <Card variant="glass" padding="md" className="text-center">
            <Target className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-amber-100 mb-2">역사적 선택</h3>
            <p className="text-amber-200/70 text-sm">나의 선택이 역사를 바꿔요</p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'multiplayer',
    title: '멀티플레이 방법',
    icon: <Users className="w-8 h-8" />,
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold">1</span>
            </div>
            <div>
              <h4 className="font-bold text-amber-100 mb-1">게임 시작</h4>
              <p className="text-amber-200/70">메인 화면에서 <span className="font-semibold">"멀티플레이 (학생)"</span> 버튼을 클릭하세요.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold">2</span>
            </div>
            <div>
              <h4 className="font-bold text-amber-100 mb-1">국가 선택</h4>
              <p className="text-amber-200/70">고구려, 백제, 신라 중 하나를 선택하고 닉네임을 입력하세요.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold">3</span>
            </div>
            <div>
              <h4 className="font-bold text-amber-100 mb-1">대기실</h4>
              <p className="text-amber-200/70">다른 플레이어들이 입장할 때까지 대기하고, <span className="font-semibold">"준비 완료"</span> 버튼을 눌러주세요.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold">4</span>
            </div>
            <div>
              <h4 className="font-bold text-amber-100 mb-1">게임 시작</h4>
              <p className="text-amber-200/70">모든 플레이어가 준비 완료하고 각 팀에 최소 1명씩 있으면 방장이 <span className="font-semibold">"게임 시작"</span> 버튼을 누를 수 있어요.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'gameplay',
    title: '게임 플레이',
    icon: <Gamepad2 className="w-8 h-8" />,
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold">1</span>
            </div>
            <div>
              <h4 className="font-bold text-amber-100 mb-1">역사 이벤트 발생</h4>
              <p className="text-amber-200/70">매 턴마다 역사적 사건이 발생합니다. 이벤트 모달을 확인하세요.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold">2</span>
            </div>
            <div>
              <h4 className="font-bold text-amber-100 mb-1">선택지 결정</h4>
              <p className="text-amber-200/70">팀원들과 협의하여 최선의 선택지를 결정하고 투표하세요.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold">3</span>
            </div>
            <div>
              <h4 className="font-bold text-amber-100 mb-1">결과 확인</h4>
              <p className="text-amber-200/70">선택한 결과에 따라 국가 스탯(군사력, 경제력, 외교력, 문화력 등)이 변경됩니다.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold">4</span>
            </div>
            <div>
              <h4 className="font-bold text-amber-100 mb-1">스탯 관리</h4>
              <p className="text-amber-200/70">왼쪽 패널에서 국가 스탯을 실시간으로 확인할 수 있어요.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'diplomacy',
    title: '외교 시스템',
    icon: <Handshake className="w-8 h-8" />,
    content: (
      <div className="space-y-4">
        <p className="text-amber-100 text-lg leading-relaxed mb-4">
          다른 국가와의 관계를 관리하여 게임을 유리하게 이끌어가세요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="glass" padding="md">
            <h4 className="font-bold text-amber-100 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              동맹
            </h4>
            <p className="text-amber-200/70 text-sm">
              다른 국가와 동맹을 맺으면 전투 시 지원을 받을 수 있어요. 
              외교 패널에서 동맹을 제안하고 수락할 수 있습니다.
            </p>
          </Card>
          <Card variant="glass" padding="md">
            <h4 className="font-bold text-amber-100 mb-2 flex items-center gap-2">
              <Swords className="w-5 h-5 text-red-400" />
              적대 관계
            </h4>
            <p className="text-amber-200/70 text-sm">
              적대 관계를 선포하면 전투를 시작할 수 있어요. 
              전투에서 승리하면 상대방의 스탯을 약화시킬 수 있습니다.
            </p>
          </Card>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-200/80 text-sm">
            💡 <span className="font-semibold">팁:</span> 외교 채팅을 통해 다른 국가와 협상을 할 수 있어요!
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'victory',
    title: '승리 조건',
    icon: <Trophy className="w-8 h-8" />,
    content: (
      <div className="space-y-4">
        <p className="text-amber-100 text-lg leading-relaxed mb-4">
          게임은 다음 조건 중 하나를 만족하면 종료됩니다.
        </p>
        <div className="space-y-3">
          <Card variant="glass" padding="md">
            <h4 className="font-bold text-amber-100 mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              통일 승리
            </h4>
            <p className="text-amber-200/70 text-sm">
              다른 두 국가의 군사력과 민심이 모두 0 이하로 떨어지면 통일 승리입니다.
            </p>
          </Card>
          <Card variant="glass" padding="md">
            <h4 className="font-bold text-amber-100 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              점수 승리
            </h4>
            <p className="text-amber-200/70 text-sm">
              최대 턴(30턴)이 지나면 모든 국가의 점수를 계산하여 가장 높은 점수를 가진 국가가 승리합니다.
              점수는 군사력, 경제력, 외교력, 문화력, 민심 등을 종합하여 계산됩니다.
            </p>
          </Card>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-200/80 text-sm">
            💡 <span className="font-semibold">전략:</span> 단순히 군사력만 높이는 것보다 균형잡힌 발전이 중요해요!
          </p>
        </div>
      </div>
    ),
  },
];

export const TutorialPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const currentTutorial = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStart = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen baram-bg hanji-texture p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="mb-4"
          >
            메인으로
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold gold-text mb-2">
            게임 튜토리얼
          </h1>
          <p className="text-amber-200/70">
            역사전쟁:삼국시대를 즐기는 방법을 알아보세요
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-amber-200/70">
              {currentStep + 1} / {tutorialSteps.length}
            </span>
            <span className="text-sm text-amber-200/70">
              {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
            />
          </div>
        </motion.div>

        {/* Tutorial Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="glass" padding="lg" className="mb-6">
              {/* Step Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-amber-900/30">
                <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  {currentTutorial.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-amber-100">
                    {currentTutorial.title}
                  </h2>
                  <p className="text-amber-200/50 text-sm">
                    단계 {currentStep + 1}
                  </p>
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px]">
                {currentTutorial.content}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={isFirstStep}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            이전
          </Button>

          <div className="flex gap-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-amber-500 w-8'
                    : 'bg-amber-500/30 hover:bg-amber-500/50'
                }`}
                aria-label={`Step ${index + 1}`}
              />
            ))}
          </div>

          {isLastStep ? (
            <Button
              variant="primary"
              onClick={handleStart}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              시작하기
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              다음
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

















