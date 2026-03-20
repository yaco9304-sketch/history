import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, Globe, Handshake, X } from 'lucide-react';
import { Button } from '../common';
import { ChatMessage, Nation } from '../../types';
import { NATIONS } from '../../data/nations';

interface ChatPanelProps {
  messages: ChatMessage[];
  myNation: Nation | null;
  roomPlayers?: Record<string, { team: Nation | null }>;
  onSendMessage: (message: string, type: 'team' | 'public' | 'diplomacy', target?: Nation) => void;
  onClose: () => void;
}

type ChatChannel = 'team' | 'public' | 'diplomacy';

export const ChatPanel = ({
  messages,
  myNation,
  roomPlayers,
  onSendMessage,
  onClose,
}: ChatPanelProps) => {
  const [activeChannel, setActiveChannel] = useState<ChatChannel>('team');
  const [inputMessage, setInputMessage] = useState('');

  const getNationColor = (nation: Nation | null | undefined) => {
    if (!nation) return 'text-slate-400';
    const colors = {
      goguryeo: 'text-red-400',
      baekje: 'text-blue-400',
      silla: 'text-orange-400',
    };
    return colors[nation];
  };

  const getNationBg = (nation: Nation | null | undefined) => {
    if (!nation) return 'bg-slate-600';
    const colors = {
      goguryeo: 'bg-red-600',
      baekje: 'bg-blue-600',
      silla: 'bg-orange-500',
    };
    return colors[nation];
  };

  // 채널별 메시지 필터링
  const getFilteredMessages = (): ChatMessage[] => {
    if (activeChannel === 'team') {
      return messages.filter(msg => msg.type === 'team' && msg.team === myNation);
    } else if (activeChannel === 'public') {
      return messages.filter(msg => msg.type === 'public');
    } else if (activeChannel === 'diplomacy') {
      return messages.filter(msg => msg.type === 'diplomacy');
    }
    return [];
  };

  const filteredMessages = getFilteredMessages();

  const handleSend = () => {
    if (!inputMessage.trim() || !myNation) return;

    let target: Nation | undefined;
    if (activeChannel === 'diplomacy') {
      // 외교 채널에서는 첫 번째 다른 국가를 타겟으로 설정 (실제로는 선택 UI 필요)
      const otherNations = (['goguryeo', 'baekje', 'silla'] as Nation[]).filter(n => n !== myNation);
      target = otherNations[0];
    }

    onSendMessage(inputMessage, activeChannel, target);
    setInputMessage('');
  };

  const channels: { id: ChatChannel; label: string; icon: typeof Users }[] = [
    { id: 'team', label: '팀', icon: Users },
    { id: 'public', label: '공개', icon: Globe },
    { id: 'diplomacy', label: '외교', icon: Handshake },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed right-0 top-0 bottom-0 w-80 scroll-card border-l border-amber-900/30 z-[100] flex flex-col bg-stone-900/95 shadow-2xl"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-amber-900/30 flex items-center justify-between">
        <h3 className="font-medium text-amber-100">채팅</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Channel Tabs */}
      <div className="flex border-b border-amber-900/30">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const isActive = activeChannel === channel.id;
          return (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-amber-100 bg-amber-900/20 border-b-2 border-amber-500'
                  : 'text-amber-200/50 hover:text-amber-200 hover:bg-amber-900/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{channel.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredMessages.length === 0 ? (
          <p className="text-slate-500 text-sm text-center mt-8">
            {activeChannel === 'team' && '팀 메시지가 없습니다.'}
            {activeChannel === 'public' && '공개 메시지가 없습니다.'}
            {activeChannel === 'diplomacy' && '외교 메시지가 없습니다.'}
          </p>
        ) : (
          filteredMessages.map((msg) => {
            const senderNation = roomPlayers?.[msg.senderId]?.team;
            const isSystem = msg.type === 'system';
            const isDiplomacy = msg.type === 'diplomacy' && msg.target;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2"
              >
                {!isSystem && (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 ${getNationBg(senderNation)}`}
                  >
                    {msg.senderName[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {!isSystem && (
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-sm font-medium ${getNationColor(senderNation)}`}>
                        {msg.senderName}
                      </span>
                      {isDiplomacy && msg.target && (
                        <span className="text-xs text-amber-400">
                          → {NATIONS[msg.target].name}
                        </span>
                      )}
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
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-amber-900/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              activeChannel === 'team'
                ? '팀에게 메시지 보내기...'
                : activeChannel === 'public'
                ? '모두에게 메시지 보내기...'
                : '외교 메시지 보내기...'
            }
            className="flex-1 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            disabled={!myNation}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!myNation || !inputMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {activeChannel === 'diplomacy' && (
          <p className="text-xs text-amber-200/50 mt-2">
            외교 메시지는 선택한 국가와만 공유됩니다.
          </p>
        )}
      </div>
    </motion.div>
  );
};




























