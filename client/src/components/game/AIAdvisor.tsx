import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, X, BookOpen } from 'lucide-react';
import { Button, Card } from '../common';
import { HistoricalEvent, Nation, NationStats } from '../../types';
import { requestAIAdvice } from '../../services/aiAdvisor';

interface AIAdvisorProps {
  event: HistoricalEvent;
  nation: Nation;
  stats: NationStats;
  onClose: () => void;
}

export const AIAdvisor = ({
  event,
  nation,
  stats,
  onClose,
}: AIAdvisorProps) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestAdvice = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await requestAIAdvice(event, nation, stats);
      if (result) {
        setAdvice(result.advice);
      } else {
        setError('AI 조언을 가져올 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
      setError('AI 조언 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="scroll-card oriental-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-amber-100">AI 역사 조언자</h2>
              <p className="text-sm text-amber-200/50">역사적 선택을 도와드립니다</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Event Info */}
        <Card variant="glass" className="mb-4 p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-100 mb-1">{event.title}</h3>
              <p className="text-sm text-amber-200/70">{event.description}</p>
            </div>
          </div>
        </Card>

        {/* Advice Section */}
        {!advice && !isLoading && !error && (
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <p className="text-amber-200/60 mb-4">
              AI 조언자를 통해 이 선택지에 대한<br />
              역사적 관점과 전략적 조언을 받아보세요
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleRequestAdvice}
              leftIcon={<Sparkles className="w-5 h-5" />}
            >
              AI 조언 받기
            </Button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <p className="text-amber-200/60">AI가 조언을 생성하는 중...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <Card variant="glass" className="p-4 border-red-500/30 bg-red-500/10">
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={handleRequestAdvice}
            >
              다시 시도
            </Button>
          </Card>
        )}

        {/* Advice Content */}
        {advice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card variant="glass" className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
                <h3 className="font-medium text-amber-100">AI 조언</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-amber-100/90 whitespace-pre-line leading-relaxed">
                  {advice}
                </p>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleRequestAdvice}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                다시 조언 받기
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={onClose}
              >
                확인
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};




















