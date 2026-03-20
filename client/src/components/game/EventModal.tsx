import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, AlertTriangle, Check, History, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '../common';
import { HistoricalEvent, Choice, Nation, NationStats, ChatMessage } from '../../types';
import { STAT_ICONS } from '../../data/nations';
import { AIAdvisor } from './AIAdvisor';

interface EventModalProps {
  event: HistoricalEvent;
  isOpen: boolean;
  onClose: () => void;
  onVote: (choiceId: string) => void;
  currentVotes: Record<string, string>; // playerId -> choiceId
  myVote?: string;
  teamPlayers: { id: string; name: string }[];
  timeRemaining: number;
  nation?: Nation;
  stats?: NationStats;
  roomStatus?: 'waiting' | 'countdown' | 'playing' | 'discussion' | 'voting' | 'finished';
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  isSinglePlayerMode?: boolean;
}

export const EventModal = ({
  event,
  isOpen,
  onVote,
  currentVotes,
  myVote,
  teamPlayers,
  timeRemaining,
  nation,
  stats,
  roomStatus,
  messages = [],
  onSendMessage,
  isSinglePlayerMode = false,
}: EventModalProps) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(myVote || null);
  const [showAIAdvisor, setShowAIAdvisor] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedChoiceForHistory, setSelectedChoiceForHistory] = useState<Choice | null>(null);
  const [chatMessage, setChatMessage] = useState('');

  // 선택지 순서를 랜덤하게 섞기 (이벤트별로 한 번만 섞음)
  const [shuffledChoices] = useState<Choice[]>(() => {
    const choices = [...event.choices];
    // Fisher-Yates shuffle algorithm
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices;
  });

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 선택지별 투표 수 계산
  const getVoteCounts = () => {
    const counts: Record<string, string[]> = {};
    shuffledChoices.forEach((choice) => {
      counts[choice.id] = [];
    });

    Object.entries(currentVotes).forEach(([playerId, choiceId]) => {
      if (counts[choiceId]) {
        const player = teamPlayers.find((p) => p.id === playerId);
        if (player) {
          counts[choiceId].push(player.name);
        }
      }
    });

    return counts;
  };

  const voteCounts = getVoteCounts();

  const handleVote = () => {
    if (selectedChoice) {
      // 선택한 선택지 정보 저장
      const choice = shuffledChoices.find(c => c.id === selectedChoice);
      if (choice) {
        setSelectedChoiceForHistory(choice);
        // 투표 제출
        onVote(selectedChoice);
        // 역사적 사실 모달 표시
        setShowHistoryModal(true);
      }
    }
  };

  const getRiskColor = (risk: Choice['risk']) => {
    switch (risk) {
      case 'safe':
        return 'text-green-400';
      case 'normal':
        return 'text-yellow-400';
      case 'risky':
        return 'text-red-400';
    }
  };

  const getRiskText = (risk: Choice['risk']) => {
    switch (risk) {
      case 'safe':
        return '안전';
      case 'normal':
        return '보통';
      case 'risky':
        return '위험';
    }
  };

  // 투표 완료 여부
  const hasVoted = !!myVote;

  // 토론 단계인지 확인 (멀티플레이용)
  const isDiscussionPhase = roomStatus === 'discussion';

  // 투표 단계인지 확인 (멀티플레이 및 기타)
  const isVotingPhase = roomStatus === 'voting' || !roomStatus; // roomStatus가 없으면 싱글플레이로 간주

  return (
    <>
      <AnimatePresence>
        {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto scroll-card oriental-border rounded-lg shadow-2xl z-[10000]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-stone-900/95 backdrop-blur border-b border-amber-900/30">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 font-medium">{event.year}년</span>
                {isDiscussionPhase && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    💬 토론 중
                  </span>
                )}
                {isVotingPhase && !isDiscussionPhase && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    ✅ 투표 중
                  </span>
                )}
              </div>
              {/* 싱글플레이 AI 대전에서는 타이머 숨김 */}
              {!isSinglePlayerMode && (
                <motion.div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                    timeRemaining <= 10
                      ? 'bg-red-500/20 text-red-400'
                      : timeRemaining <= 30
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-slate-700 text-white'
                  }`}
                  animate={timeRemaining <= 10 ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-bold">{timeRemaining}초</span>
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title */}
              <h2 className="text-2xl font-bold gold-text mb-4 flex items-center gap-3">
                📜 {event.title}
              </h2>

              {/* Description */}
              <div className="mb-6">
                <p className="text-amber-100/80 mb-3 leading-relaxed">
                  {event.description}
                </p>
                {nation && stats && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAIAdvisor(true)}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    className="text-xs"
                  >
                    AI 조언 받기
                  </Button>
                )}
              </div>

              {/* 토론 단계: 채팅창 표시 (멀티플레이만) */}
              {isDiscussionPhase && onSendMessage ? (
                <div className="mb-6">
                  <div className="bg-stone-800/50 rounded-lg border border-amber-900/30 p-4 mb-4">
                    <h3 className="text-amber-100 font-semibold mb-3 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      팀 채팅 - 의견을 나눠보세요
                    </h3>

                    {/* 채팅 메시지 영역 */}
                    <div className="h-48 overflow-y-auto mb-3 space-y-2 bg-stone-900/50 rounded p-3">
                      {messages.length === 0 ? (
                        <p className="text-amber-200/50 text-sm text-center py-8">
                          아직 메시지가 없습니다. 팀원들과 이야기를 시작해보세요!
                        </p>
                      ) : (
                        messages.map((msg) => (
                          <div key={msg.id} className="mb-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-amber-400 font-medium text-sm">
                                {msg.senderName}
                              </span>
                              <span className="text-amber-200/30 text-xs">
                                {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-amber-100/90 text-sm ml-1">
                              {msg.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* 채팅 입력 영역 */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && chatMessage.trim() && onSendMessage) {
                            onSendMessage(chatMessage);
                            setChatMessage('');
                          }
                        }}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 px-3 py-2 rounded bg-stone-900 border border-amber-900/30 text-amber-100 placeholder:text-amber-200/30 focus:outline-none focus:border-amber-500/50"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          console.log('[EventModal] Send button clicked, message:', chatMessage, 'onSendMessage exists:', !!onSendMessage);
                          if (chatMessage.trim() && onSendMessage) {
                            console.log('[EventModal] Sending message:', chatMessage);
                            onSendMessage(chatMessage);
                            setChatMessage('');
                          }
                        }}
                        disabled={!chatMessage.trim()}
                      >
                        전송
                      </Button>
                    </div>
                  </div>

                  {/* 선택지 미리보기 (효과만 표시) */}
                  <div className="bg-amber-900/10 rounded-lg border border-amber-900/30 p-4">
                    <h4 className="text-amber-200/70 text-sm font-medium mb-2">선택지 미리보기</h4>
                    <div className="space-y-2">
                      {shuffledChoices.map((choice) => (
                        <div key={choice.id} className="text-sm text-amber-200/60">
                          <span className="font-medium">{choice.id}.</span> {choice.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* 투표 단계: 선택지 표시 */
                <div className="space-y-3 mb-6">
                  {shuffledChoices.map((choice) => {
                    const isSelected = selectedChoice === choice.id;
                    const voters = voteCounts[choice.id] || [];

                    return (
                      <motion.div
                        key={choice.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => !myVote && setSelectedChoice(choice.id)}
                        className={`
                          relative p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${
                            isSelected
                              ? 'border-amber-500 bg-amber-900/30'
                              : 'border-amber-900/30 bg-stone-800/50 hover:border-amber-700/50'
                          }
                          ${myVote && myVote !== choice.id ? 'opacity-50' : ''}
                        `}
                      >
                        {/* Choice Header */}
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-amber-100 font-medium">
                            {choice.id}. {choice.text}
                          </span>
                          {/* 투표 완료 후에만 역사적 선택 표시 */}
                          {hasVoted && choice.isHistorical && (
                            <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/20 px-2 py-1 rounded-full">
                              <Sparkles className="w-3 h-3" />
                              역사적 선택
                            </span>
                          )}
                        </div>

                        {/* Effects */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Object.entries(choice.effects).map(([stat, value]) => {
                            if (value === undefined || value === 0) return null;
                            const icon = STAT_ICONS[stat] || '📊';
                            const color = value > 0 ? 'text-green-400' : 'text-red-400';
                            return (
                              <span
                                key={stat}
                                className={`text-sm ${color} bg-stone-900/80 px-2 py-0.5 rounded`}
                              >
                                {icon} {value > 0 ? '+' : ''}{value}
                              </span>
                            );
                          })}
                        </div>

                        {/* Risk 표시 - 투표 완료 후에만 */}
                        {hasVoted && (
                          <div className="flex items-center justify-end text-sm">
                            <span className={`flex items-center gap-1 ${getRiskColor(choice.risk)}`}>
                              <AlertTriangle className="w-3 h-3" />
                              {getRiskText(choice.risk)}
                            </span>
                          </div>
                        )}

                        {/* Voters */}
                        {voters.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-amber-900/30">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-amber-200/50">투표:</span>
                              <div className="flex -space-x-1">
                                {voters.slice(0, 4).map((name, i) => (
                                  <div
                                    key={i}
                                    className="w-6 h-6 rounded-full bg-amber-900/50 flex items-center justify-center text-xs text-amber-100 border-2 border-stone-800"
                                    title={name}
                                  >
                                    {name[0]}
                                  </div>
                                ))}
                                {voters.length > 4 && (
                                  <div className="w-6 h-6 rounded-full bg-amber-900/50 flex items-center justify-center text-xs text-amber-100 border-2 border-stone-800">
                                    +{voters.length - 4}
                                  </div>
                                )}
                              </div>
                              <span className="text-sm font-bold text-amber-100">
                                ({voters.length}표)
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Selection indicator */}
                        {isSelected && !hasVoted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-stone-900" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Vote Button */}
              {isDiscussionPhase && onSendMessage ? (
                <div className="text-center p-4 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <MessageCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-400 font-medium mb-1">
                    토론 중입니다
                  </p>
                  <p className="text-blue-300/70 text-sm">
                    팀원들과 채팅으로 의견을 나눈 후 투표 단계에서 선택하세요
                  </p>
                </div>
              ) : !myVote ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleVote}
                  disabled={!selectedChoice}
                >
                  {selectedChoice ? '투표하기' : '선택지를 고르세요'}
                </Button>
              ) : (
                <div className="text-center p-4 rounded-xl bg-green-500/20 border border-green-500/30">
                  <Check className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-medium">
                    선택 완료!
                  </p>
                </div>
              )}
            </div>

            {/* Historical Context는 모달로 표시하므로 여기서는 제거 */}
          </motion.div>
        </div>
        )}
      </AnimatePresence>

      {/* AI Advisor Modal */}
      {showAIAdvisor && nation && stats && (
        <AIAdvisor
          event={event}
          nation={nation}
          stats={stats}
          onClose={() => setShowAIAdvisor(false)}
        />
      )}

      {/* History Modal - 투표 후 역사적 사실 표시 */}
      <AnimatePresence>
        {showHistoryModal && selectedChoiceForHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl scroll-card oriental-border rounded-lg shadow-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-amber-100 mb-2">📚 역사 배경</h3>
                  <p className="text-amber-200/80 leading-relaxed">{event.historicalContext}</p>
                </div>
              </div>

              {selectedChoiceForHistory.isHistorical && (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 font-semibold">역사적 선택</span>
                  </div>
                  <p className="text-amber-100/90 text-sm">
                    당신이 선택한 "{selectedChoiceForHistory.text}"는 실제 역사에서 일어난 선택입니다.
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setShowHistoryModal(false)}
                >
                  확인
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
