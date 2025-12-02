// ============================================
// 게임 모드 유틸리티
// 싱글플레이(AI 대전)와 멀티플레이 모드를 명확히 구분
// ============================================

/**
 * 현재 게임 모드 타입
 */
export type GameMode = 'singlePlayerAI' | 'multiplayer';

/**
 * 현재 게임 모드 확인
 * @returns 'singlePlayerAI' (싱글플레이 AI 대전) 또는 'multiplayer' (멀티플레이)
 */
export const getGameMode = (): GameMode => {
  const singlePlayerRoomCode = localStorage.getItem('singlePlayerRoomCode');
  return singlePlayerRoomCode ? 'singlePlayerAI' : 'multiplayer';
};

/**
 * 싱글플레이 AI 대전 모드인지 확인
 * @returns true면 싱글플레이 AI 대전 모드, false면 멀티플레이 모드
 */
export const isSinglePlayerAIMode = (): boolean => {
  return getGameMode() === 'singlePlayerAI';
};

/**
 * 멀티플레이 모드인지 확인
 * @returns true면 멀티플레이 모드, false면 싱글플레이 AI 대전 모드
 */
export const isMultiplayerMode = (): boolean => {
  return getGameMode() === 'multiplayer';
};

/**
 * 싱글플레이 AI 대전 모드의 방 코드 가져오기
 * @returns 싱글플레이 AI 대전 모드의 방 코드 또는 null
 */
export const getSinglePlayerRoomCode = (): string | null => {
  if (!isSinglePlayerAIMode()) return null;
  return localStorage.getItem('singlePlayerRoomCode');
};

/**
 * 싱글플레이 AI 대전 모드 설정
 * @param roomCode 방 코드
 */
export const setSinglePlayerAIMode = (roomCode: string): void => {
  localStorage.setItem('singlePlayerRoomCode', roomCode.toUpperCase().trim());
};

/**
 * 싱글플레이 AI 대전 모드 해제
 */
export const clearSinglePlayerAIMode = (): void => {
  localStorage.removeItem('singlePlayerRoomCode');
};


