import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Gamepad2, BookOpen } from 'lucide-react';
import { Button } from '../components/common';

export const LandingPage = () => {
  const navigate = useNavigate();



  return (
    <div className="min-h-screen relative overflow-hidden baram-bg hanji-texture">
      {/* Background - 바람의 나라 스타일 */}
      <div className="absolute inset-0">
        {/* 산 실루엣 */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
          <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,200 L0,120 Q150,60 300,100 T600,80 T900,110 T1200,90 L1200,200 Z" fill="#3d3228"/>
            <path d="M0,200 L0,150 Q200,100 400,130 T800,110 T1200,140 L1200,200 Z" fill="#2a2318"/>
          </svg>
        </div>
        
        {/* 구름 효과 */}
        <div className="absolute top-20 left-10 w-32 h-16 bg-gradient-radial from-amber-900/10 to-transparent rounded-full blur-2xl floating-cloud" />
        <div className="absolute top-40 right-20 w-40 h-20 bg-gradient-radial from-amber-900/10 to-transparent rounded-full blur-2xl floating-cloud" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-60 left-1/3 w-36 h-18 bg-gradient-radial from-amber-900/10 to-transparent rounded-full blur-2xl floating-cloud" style={{ animationDelay: '-10s' }} />

        {/* 전통 문양 장식 - 코너 */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-amber-700/30" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-amber-700/30" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-amber-700/30" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-amber-700/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-black mb-4">
            <span className="gold-text drop-shadow-lg">
              역사전쟁:삼국시대
            </span>
          </h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-amber-200/80 font-medium tracking-wider"
          >
            역사를 다시 쓰다
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 mx-auto w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          />
        </motion.div>

        {/* Nation Colors Bar - 바람의 나라 스타일 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex gap-3 mb-12"
        >
          <div className="w-20 h-1.5 rounded-sm bg-gradient-to-r from-red-900 to-red-800 shadow-lg" />
          <div className="w-20 h-1.5 rounded-sm bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg" />
          <div className="w-20 h-1.5 rounded-sm bg-gradient-to-r from-amber-700 to-amber-600 shadow-lg" />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center text-amber-100/60 max-w-xl mb-12 text-lg"
        >
          고구려, 백제, 신라 중 하나를 선택하고
          <br />
          <span className="text-amber-200 font-medium">역사적 선택</span>을 직접 체험해보세요!
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          {/* Single Player Button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full text-xl py-5"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/single');
            }}
            leftIcon={<Gamepad2 className="w-6 h-6" />}
          >
            싱글 플레이
          </Button>

          {/* Multiplayer Button */}
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // 멀티플레이: 바로 국가 선택 페이지로 이동 (방 코드 없음)
              navigate('/select');
            }}
            leftIcon={<Users className="w-6 h-6" />}
          >
            멀티플레이
          </Button>

          {/* Teacher Button */}
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/teacher/MAIN/dashboard');
            }}
            leftIcon={<GraduationCap className="w-5 h-5" />}
          >
            대시보드
          </Button>

          {/* Tutorial Button */}
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="w-full border border-amber-500/30"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/tutorial');
            }}
            leftIcon={<BookOpen className="w-5 h-5" />}
          >
            튜토리얼
          </Button>
        </motion.div>
      </div>

    </div>
  );
};
