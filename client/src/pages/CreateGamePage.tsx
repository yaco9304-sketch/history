// ============================================
// 게임 생성 페이지 (선생님용) - 대시보드로 리다이렉트
// ============================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateGamePage = () => {
  const navigate = useNavigate();

  // 대시보드로 바로 리다이렉트
  useEffect(() => {
    navigate('/teacher/MAIN/dashboard', { replace: true });
  }, [navigate]);

  // 리다이렉트 중 로딩 화면
  return (
    <div className="min-h-screen baram-bg hanji-texture flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-amber-100 text-lg">대시보드로 이동 중...</p>
      </div>
    </div>
  );
};
