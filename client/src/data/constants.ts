// ============================================
// 공통 상수 정의
// ============================================

import { Nation } from '../types';

// 국가 색상 (그라데이션)
export const NATION_COLORS: Record<Nation, string> = {
  goguryeo: 'from-red-600 to-red-800',
  baekje: 'from-blue-600 to-blue-800',
  silla: 'from-amber-600 to-amber-800',
};

// 국가 단일 색상
export const NATION_SOLID_COLORS: Record<Nation, string> = {
  goguryeo: '#D32F2F',
  baekje: '#1976D2',
  silla: '#F57C00',
};

// 국가 이름
export const NATION_NAMES: Record<Nation, string> = {
  goguryeo: '고구려',
  baekje: '백제',
  silla: '신라',
};

// 국가 영어 이름
export const NATION_ENGLISH_NAMES: Record<Nation, string> = {
  goguryeo: 'Goguryeo',
  baekje: 'Baekje',
  silla: 'Silla',
};

// 국가 아이콘
export const NATION_ICONS: Record<Nation, string> = {
  goguryeo: '🏔️',
  baekje: '🌊',
  silla: '👑',
};
