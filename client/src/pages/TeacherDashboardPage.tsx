// ============================================
// 교사용 대시보드 페이지
// ============================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Users,
  RefreshCw,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  XCircle,
  History,
} from 'lucide-react';
import { Button, Card } from '../components/common';
import { NATIONS } from '../data/nations';
import { ChatMessage, Nation } from '../types';
import { initializeSocketListeners } from '../stores/gameStore';
import * as socket from '../socket';

interface DashboardData {
  room: {
    code: string;
    className: string;
    hostName: string;
    createdAt: number;
  };
  chatMessages: ChatMessage[];
  nationProgress: Array<{
    nation: Nation;
    nationName: string;
    stats: {
      military: number;
      economy: number;
      diplomacy: number;
      culture: number;
      gold: number;
      population: number;
      morale: number;
    };
    players: Array<{
      id: string;
      name: string;
      role?: string;
      isReady: boolean;
      isOnline: boolean;
    }>;
    allies: Nation[];
    enemies: Nation[];
    progress?: {
      completedTurns: number;
      totalTurns: number;
      correctChoices: number;
      incorrectChoices: number;
      totalChoices: number;
      eventHistory: Array<{
        turn: number;
        year: number;
        eventId: string;
        eventTitle: string;
        choiceId: string;
        choiceText: string;
        isHistorical: boolean;
        timestamp: number;
      }>;
    };
  }>;
  gameInfo: {
    status: string;
    currentTurn: number;
    currentYear: number;
    maxTurns: number;
    currentEvent?: any;
    turnDeadline?: number;
    startedAt?: number;
  };
  totalPlayers: number;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export const TeacherDashboardPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  // roomCode가 없으면 MAIN을 기본으로 사용
  const effectiveRoomCode = roomCode || 'MAIN';
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNation, setSelectedNation] = useState<Nation | 'all'>('all');
  const [groupByEvent, setGroupByEvent] = useState(true); // 기본값을 true로 변경
  const [error, setError] = useState<string | null>(null);

  // const { isConnected } = useGameStore();

  // roomCode가 없으면 MAIN으로 리다이렉트
  useEffect(() => {
    if (!roomCode) {
      navigate('/teacher/MAIN/dashboard', { replace: true });
    }
  }, [roomCode, navigate]);

  // Socket 리스너 초기화
  useEffect(() => {
    initializeSocketListeners();
    const sock = socket.connectSocket();

    // 채팅 메시지 수신 시 대시보드 데이터 업데이트
    sock.on('chatMessage', () => {
      fetchDashboardData();
    });

    // 방 업데이트 수신 시 대시보드 데이터 업데이트
    sock.on('roomUpdated', () => {
      fetchDashboardData();
    });

    return () => {
      sock.off('chatMessage');
      sock.off('roomUpdated');
    };
  }, [effectiveRoomCode]);

  // 대시보드 데이터 가져오기
  const fetchDashboardData = useCallback(async () => {
    if (!effectiveRoomCode) return;

    try {
      setRefreshing(true);
      setError(null);
      console.log(`[Dashboard] Fetching data for room: ${effectiveRoomCode}`);
      const response = await fetch(`${SERVER_URL}/api/teacher/dashboard/${effectiveRoomCode}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = '대시보드 데이터를 가져올 수 없습니다.';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // JSON 파싱 실패 시 원본 텍스트 사용
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[Dashboard] Data loaded:', {
        roomCode: data.room?.code,
        chatCount: data.chatMessages?.length || 0,
        totalPlayers: data.totalPlayers,
        nationCount: data.nationProgress?.length || 0,
      });
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : '데이터를 가져오는 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [effectiveRoomCode]);

  // 초기 로드
  useEffect(() => {
    if (effectiveRoomCode) {
      fetchDashboardData();
      
      // 5초마다 자동 갱신
      const interval = setInterval(fetchDashboardData, 5000);
      
      return () => clearInterval(interval);
    }
  }, [effectiveRoomCode, fetchDashboardData]);

  // 채팅 메시지 필터링
  const filteredChatMessages = useMemo(() => {
    if (!dashboardData?.chatMessages) return [];

    let messages = dashboardData.chatMessages;

    // 국가별 필터링
    if (selectedNation !== 'all') {
      messages = messages.filter(msg => msg.team === selectedNation);
    }

    return messages;
  }, [dashboardData?.chatMessages, selectedNation]);

  // 이벤트별로 채팅 그룹화
  const groupedByEvent = useMemo(() => {
    if (!groupByEvent || !dashboardData) return null;

    const groups: Record<string, { event: any; messages: ChatMessage[] }> = {};

    // 각 국가의 이벤트 히스토리 가져오기
    dashboardData.nationProgress.forEach(nation => {
      if (!nation.progress?.eventHistory) return;

      nation.progress.eventHistory.forEach((event) => {
        const key = `${event.turn}-${event.eventId}`;
        if (!groups[key]) {
          groups[key] = {
            event,
            messages: [],
          };
        }
      });
    });

    // 각 채팅 메시지를 이벤트에 매핑
    filteredChatMessages.forEach(msg => {
      // 메시지 시간과 가장 가까운 이벤트 찾기
      let closestEvent: any = null;
      let minTimeDiff = Infinity;

      Object.values(groups).forEach(group => {
        const timeDiff = Math.abs(msg.timestamp - group.event.timestamp);
        if (timeDiff < minTimeDiff) {
          minTimeDiff = timeDiff;
          closestEvent = group;
        }
      });

      // 5분 이내의 채팅만 해당 이벤트에 연결
      if (closestEvent && minTimeDiff < 5 * 60 * 1000) {
        closestEvent.messages.push(msg);
      }
    });

    // 턴 순서대로 정렬
    return Object.values(groups).sort((a, b) => a.event.turn - b.event.turn);
  }, [groupByEvent, dashboardData, filteredChatMessages]);

  // 국가 색상 가져오기
  const getNationColor = (nation: Nation) => {
    const colors = {
      goguryeo: 'text-red-400',
      baekje: 'text-blue-400',
      silla: 'text-orange-400',
    };
    return colors[nation];
  };

  const getNationBg = (nation: Nation) => {
    const colors = {
      goguryeo: 'bg-red-500/20 border-red-500/30',
      baekje: 'bg-blue-500/20 border-blue-500/30',
      silla: 'bg-orange-500/20 border-orange-500/30',
    };
    return colors[nation];
  };

  if (loading) {
    return (
      <div className="min-h-screen baram-bg hanji-texture flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-amber-100 text-lg">대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen baram-bg hanji-texture flex items-center justify-center p-4">
        <Card variant="glass" className="max-w-md w-full">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || '대시보드 데이터를 불러올 수 없습니다.'}</p>
            <Button variant="primary" onClick={fetchDashboardData}>
              다시 시도
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="mt-2">
              홈으로 돌아가기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen baram-bg hanji-texture">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-black/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              돌아가기
            </Button>
            <div>
              <h1 className="text-xl font-bold text-amber-100">교사용 대시보드</h1>
              <p className="text-amber-200/50 text-sm">
                {dashboardData.room.className} {dashboardData.room.code !== 'MAIN' && `- 방 코드: ${dashboardData.room.code}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-amber-200/70 text-sm">
              <Users className="w-4 h-4" />
              <span>{dashboardData.totalPlayers}명 접속</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchDashboardData}
              disabled={refreshing}
              leftIcon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
            >
              새로고침
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* 게임 정보 카드 */}
        <div className="mb-6">
          <Card variant="glass" padding="sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-amber-200/50 text-sm mb-1">게임 상태</p>
                <p className="text-amber-100 font-bold">
                  {dashboardData.gameInfo.status === 'waiting' && '대기 중'}
                  {dashboardData.gameInfo.status === 'playing' && '진행 중'}
                  {dashboardData.gameInfo.status === 'voting' && '투표 중'}
                  {dashboardData.gameInfo.status === 'finished' && '종료'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-amber-200/50 text-sm mb-1">현재 턴</p>
                <p className="text-amber-100 font-bold">
                  {dashboardData.gameInfo.currentTurn}/{dashboardData.gameInfo.maxTurns}
                </p>
              </div>
              <div className="text-center">
                <p className="text-amber-200/50 text-sm mb-1">연도</p>
                <p className="text-amber-100 font-bold">{dashboardData.gameInfo.currentYear}년</p>
              </div>
              <div className="text-center">
                <p className="text-amber-200/50 text-sm mb-1">접속 인원</p>
                <p className="text-amber-100 font-bold">{dashboardData.totalPlayers}명</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 국가별 진행상황 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-amber-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                국가별 진행상황
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData.nationProgress.map((nation) => (
                <Card
                  key={nation.nation}
                  variant="glass"
                  padding="sm"
                  className={`border ${getNationBg(nation.nation)}`}
                >
                  <h3 className={`font-bold text-lg mb-3 ${getNationColor(nation.nation)}`}>
                    {nation.nationName}
                  </h3>

                  {/* 플레이어 목록 */}
                  <div className="mb-4">
                    <p className="text-xs text-amber-200/50 mb-2">플레이어 ({nation.players.length}명)</p>
                    <div className="space-y-1">
                      {nation.players.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center gap-2 text-sm text-amber-100/70"
                        >
                          <div className={`w-2 h-2 rounded-full ${player.isOnline ? 'bg-green-400' : 'bg-slate-500'}`} />
                          <span className="truncate">{player.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 진행 이력 */}
                  {nation.progress && (
                    <div className="mb-4 p-3 rounded-lg bg-black/20 border border-amber-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <History className="w-4 h-4 text-amber-400" />
                        <p className="text-xs font-medium text-amber-200/70">진행 이력</p>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-200/50">진행 턴</span>
                          <span className="text-amber-100 font-bold">
                            {nation.progress.completedTurns}/{nation.progress.totalTurns}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-200/50 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                            맞힌 선택
                          </span>
                          <span className="text-green-400 font-bold">
                            {nation.progress.correctChoices}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-200/50 flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-red-400" />
                            틀린 선택
                          </span>
                          <span className="text-red-400 font-bold">
                            {nation.progress.incorrectChoices}
                          </span>
                        </div>
                        {nation.progress.totalChoices > 0 && (
                          <div className="mt-2 pt-2 border-t border-amber-900/30">
                            <div className="flex items-center justify-between">
                              <span className="text-amber-200/50">정답률</span>
                              <span className="text-amber-100 font-bold">
                                {Math.round((nation.progress.correctChoices / nation.progress.totalChoices) * 100)}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 스탯 */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-amber-200/50">🗡️ 군사력</p>
                        <p className="text-amber-100 font-bold">{nation.stats.military}</p>
                      </div>
                      <div>
                        <p className="text-amber-200/50">🌾 경제력</p>
                        <p className="text-amber-100 font-bold">{nation.stats.economy}</p>
                      </div>
                      <div>
                        <p className="text-amber-200/50">🤝 외교력</p>
                        <p className="text-amber-100 font-bold">{nation.stats.diplomacy}</p>
                      </div>
                      <div>
                        <p className="text-amber-200/50">📚 문화력</p>
                        <p className="text-amber-100 font-bold">{nation.stats.culture}</p>
                      </div>
                      <div>
                        <p className="text-amber-200/50">💰 재화</p>
                        <p className="text-amber-100 font-bold">{nation.stats.gold}</p>
                      </div>
                      <div>
                        <p className="text-amber-200/50">😊 민심</p>
                        <p className="text-amber-100 font-bold">{nation.stats.morale}</p>
                      </div>
                    </div>
                  </div>

                  {/* 진행 이력 */}
                  {nation.progress && (
                    <div className="mt-3 pt-3 border-t border-amber-900/30 space-y-2">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-amber-200/50">진행 턴</span>
                        <span className="text-amber-100 font-bold">
                          {nation.progress.completedTurns}/{nation.progress.totalTurns}
                        </span>
                      </div>
                      {nation.progress.totalChoices > 0 ? (
                        <>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-green-400">✓ 맞힌 선택</span>
                              <span className="text-amber-100 font-bold">{nation.progress.correctChoices}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-red-400">✗ 틀린 선택</span>
                              <span className="text-amber-100 font-bold">{nation.progress.incorrectChoices}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-amber-200/50">정답률</span>
                            <span className="text-amber-100 font-bold">
                              {Math.round((nation.progress.correctChoices / nation.progress.totalChoices) * 100)}%
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-amber-200/40">아직 선택한 이벤트가 없습니다.</p>
                      )}
                      {nation.progress.totalChoices > 0 && (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-amber-200/50">맞힌 선택</span>
                            <span className="text-green-400 font-bold">
                              {nation.progress.correctChoices}개
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-amber-200/50">틀린 선택</span>
                            <span className="text-red-400 font-bold">
                              {nation.progress.incorrectChoices}개
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-amber-200/50">정답률</span>
                            <span className="text-amber-100 font-bold">
                              {Math.round((nation.progress.correctChoices / nation.progress.totalChoices) * 100)}%
                            </span>
                          </div>
                        </>
                      )}
                      {nation.progress.eventHistory && nation.progress.eventHistory.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-amber-900/20">
                          <p className="text-xs text-amber-200/50 mb-1">최근 선택</p>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {nation.progress.eventHistory.slice().reverse().map((history, idx) => (
                              <div key={idx} className="text-xs">
                                <div className="flex items-center gap-1">
                                  <span className={`w-2 h-2 rounded-full ${history.isHistorical ? 'bg-green-400' : 'bg-red-400'}`} />
                                  <span className="text-amber-100/70 truncate">
                                    턴{history.turn}: {history.eventTitle}
                                  </span>
                                </div>
                                <div className="text-amber-200/50 ml-3 text-xs truncate">
                                  {history.choiceText}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 최근 이벤트 이력 */}
                  {nation.progress && nation.progress.eventHistory && nation.progress.eventHistory.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-amber-900/30">
                      <p className="text-xs text-amber-200/50 mb-2">최근 선택 이력</p>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {nation.progress.eventHistory.slice().reverse().map((event, idx) => (
                          <div
                            key={`${event.eventId}-${event.turn}-${idx}`}
                            className="text-xs p-2 rounded bg-black/20 border border-amber-900/20"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-amber-200/70 font-medium truncate">
                                {event.eventTitle}
                              </span>
                              {event.isHistorical ? (
                                <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-amber-100/60 truncate">{event.choiceText}</p>
                            <p className="text-amber-200/40 text-[10px] mt-1">
                              턴 {event.turn} ({event.year}년)
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 외교 관계 */}
                  {(nation.allies.length > 0 || nation.enemies.length > 0) && (
                    <div className="mt-3 pt-3 border-t border-amber-900/30">
                      {nation.allies.length > 0 && (
                        <p className="text-xs text-green-400">
                          동맹: {nation.allies.map(a => NATIONS[a].name).join(', ')}
                        </p>
                      )}
                      {nation.enemies.length > 0 && (
                        <p className="text-xs text-red-400">
                          적대: {nation.enemies.map(e => NATIONS[e].name).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* 채팅 로그 */}
          <div className="lg:col-span-1">
            <Card variant="glass" padding="none" className="h-[800px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-amber-900/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-amber-100 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    학생 채팅 로그
                  </h3>
                </div>

                {/* 필터 */}
                <div className="space-y-3">
                  {/* 국가별 탭 */}
                  <div>
                    <label className="text-xs text-amber-200/50 mb-1.5 block">국가 선택</label>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedNation('all')}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                          selectedNation === 'all'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-800 text-amber-200/70 hover:bg-slate-700'
                        }`}
                      >
                        전체
                      </button>
                      {(['goguryeo', 'baekje', 'silla'] as Nation[]).map((nation) => (
                        <button
                          key={nation}
                          onClick={() => setSelectedNation(nation)}
                          className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                            selectedNation === nation
                              ? nation === 'goguryeo'
                                ? 'bg-red-600 text-white'
                                : nation === 'baekje'
                                ? 'bg-blue-600 text-white'
                                : 'bg-orange-600 text-white'
                              : 'bg-slate-800 text-amber-200/70 hover:bg-slate-700'
                          }`}
                        >
                          {NATIONS[nation].name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 이벤트별 그룹화 토글 */}
                  <div className="flex items-center justify-between p-2 rounded bg-slate-800/50">
                    <span className="text-xs text-amber-200/70">이벤트별로 보기</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={groupByEvent}
                        onChange={(e) => setGroupByEvent(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:ring-2 peer-focus:ring-amber-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {groupByEvent && groupedByEvent ? (
                  // 이벤트별 그룹화된 메시지
                  groupedByEvent.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center mt-8">채팅 메시지가 없습니다.</p>
                  ) : (
                    groupedByEvent.map((group, idx) => (
                      <div
                        key={`${group.event.turn}-${group.event.eventId}-${idx}`}
                        className="border border-amber-900/30 rounded-lg p-3 bg-black/20"
                      >
                        {/* 이벤트 헤더 */}
                        <div className="mb-3 pb-2 border-b border-amber-900/20">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-amber-100 mb-1">
                                턴 {group.event.turn}: {group.event.eventTitle}
                              </h4>
                              <p className="text-xs text-amber-200/50">
                                {group.event.year}년 · {group.event.choiceText}
                              </p>
                            </div>
                            {group.event.isHistorical ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            )}
                          </div>
                        </div>

                        {/* 이벤트 관련 채팅 */}
                        {group.messages.length === 0 ? (
                          <p className="text-xs text-amber-200/30 text-center py-2">
                            이 이벤트 동안 채팅이 없었습니다.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {group.messages.map((msg) => {
                              const isSystem = msg.type === 'system';
                              return (
                                <div key={msg.id} className="flex gap-2">
                                  {!isSystem && (
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0 ${
                                        msg.team === 'goguryeo'
                                          ? 'bg-red-600'
                                          : msg.team === 'baekje'
                                          ? 'bg-blue-600'
                                          : 'bg-orange-500'
                                      }`}
                                    >
                                      {msg.senderName[0]}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    {!isSystem && (
                                      <div className="flex items-baseline gap-1.5 mb-0.5">
                                        <span className={`text-xs font-medium ${getNationColor(msg.team)}`}>
                                          {msg.senderName}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                          {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </span>
                                      </div>
                                    )}
                                    <p className="text-xs text-amber-100/70 break-words">
                                      {msg.message}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))
                  )
                ) : (
                  // 일반 메시지 목록
                  filteredChatMessages.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center mt-8">채팅 메시지가 없습니다.</p>
                  ) : (
                    filteredChatMessages.map((msg) => {
                      const isSystem = msg.type === 'system';
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-2"
                        >
                          {!isSystem && (
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 ${
                                msg.team === 'goguryeo'
                                  ? 'bg-red-600'
                                  : msg.team === 'baekje'
                                  ? 'bg-blue-600'
                                  : 'bg-orange-500'
                              }`}
                            >
                              {msg.senderName[0]}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            {!isSystem && (
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className={`text-sm font-medium ${getNationColor(msg.team)}`}>
                                  {msg.senderName}
                                </span>
                                <span className="text-xs text-amber-200/50">
                                  ({NATIONS[msg.team].name})
                                </span>
                                <span className="text-xs text-slate-500">
                                  {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            )}
                            <p
                              className={`text-sm ${
                                isSystem
                                  ? 'text-amber-400/80 italic'
                                  : 'text-amber-100/80'
                              } break-words`}
                            >
                              {msg.message}
                            </p>
                            {msg.type === 'team' && (
                              <span className="text-xs text-amber-400/50">(팀 채팅)</span>
                            )}
                            {msg.type === 'diplomacy' && msg.target && (
                              <span className="text-xs text-amber-400/50">
                                (→ {NATIONS[msg.target].name})
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

