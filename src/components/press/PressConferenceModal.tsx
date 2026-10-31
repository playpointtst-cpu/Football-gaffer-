import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Mic,
  Camera,
  Users,
  Award,
  TrendingUp,
  TrendingDown,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Check,
  Building,
  Volume2,
} from 'lucide-react';
import { PressQuestion, PressResponseOption } from '../../types/game';

interface PressConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PressConferenceModal: React.FC<PressConferenceModalProps> = ({ isOpen, onClose }) => {
  const { state, answerPressQuestion, concludePressConference } = useGame();
  const conference = state.activePressConference;

  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  if (!isOpen || !conference) return null;

  const currentQuestion = conference.questions[activeQuestionIdx] || conference.questions[0];
  const isQuestionAnswered = !!currentQuestion?.answeredOptionId;
  const answeredOption = currentQuestion?.options.find(o => o.id === currentQuestion.answeredOptionId);
  const allQuestionsAnswered = conference.questions.every(q => !!q.answeredOptionId);

  const handleSelectOption = (option: PressResponseOption) => {
    setSelectedOptionId(option.id);
    answerPressQuestion(currentQuestion.id, option.id);
  };

  const handleNext = () => {
    if (activeQuestionIdx < conference.questions.length - 1) {
      setActiveQuestionIdx(prev => prev + 1);
      setSelectedOptionId(null);
    } else {
      setShowSummary(true);
    }
  };

  const handleConclude = () => {
    concludePressConference();
    onClose();
  };

  const getToneBadge = (tone: PressResponseOption['tone']) => {
    switch (tone) {
      case 'passionate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">Passionate</span>;
      case 'diplomatic':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">Diplomatic</span>;
      case 'defensive':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">Protective</span>;
      case 'candid':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">Candid / Direct</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0b101d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-6">
        
        {/* Step-and-repeat Press Backdrop Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-[#141d33] to-slate-900 border-b border-slate-800 p-6">
          {/* Subtle Sponsor Wall Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Press Room Live
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Week {conference.week}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                  {conference.headline}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
              >
                Exit Room
              </button>
            </div>
          </div>

          {/* Question Stepper Tabs */}
          {!showSummary && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
              {conference.questions.map((q, idx) => {
                const isAnswered = !!q.answeredOptionId;
                const isCurrent = idx === activeQuestionIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isAnswered
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>Q{idx + 1}: {q.outlet}</span>
                    {isAnswered && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Question View */}
        {!showSummary ? (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Journalist Header & Question */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentQuestion.journalistAvatar}
                    alt={currentQuestion.journalistName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {currentQuestion.journalistName}
                      <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                        {currentQuestion.outlet}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Topic: <span className="text-slate-300 font-medium">{currentQuestion.topic}</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  Question {activeQuestionIdx + 1} of {conference.questions.length}
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-100 pl-3 border-l-2 border-emerald-500 italic">
                "{currentQuestion.question}"
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Choose Executive Response</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Affects squad morale, fan trust & board confidence
                </span>
              </label>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = (currentQuestion.answeredOptionId === option.id) || (selectedOptionId === option.id);
                  const isAnsweredAlready = isQuestionAnswered;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={isAnsweredAlready}
                      onClick={() => handleSelectOption(option)}
                      className={`p-4 rounded-xl text-left transition-all border flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                          : isAnsweredAlready
                          ? 'opacity-50 bg-slate-900/60 border-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getToneBadge(option.tone)}
                          <span className="text-xs font-bold text-white">{option.label}</span>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 className="w-4 h-4" /> Selected Quote
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-slate-300 italic pl-2 border-l border-slate-700">
                        {option.quote}
                      </div>

                      {/* Effects preview pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        {option.effects.squadMoraleDelta !== 0 && (
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-semibold ${
                              option.effects.squadMoraleDelta > 0
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            Morale: {option.effects.squadMoraleDelta > 0 ? '+' : ''}{option.effects.squadMoraleDelta}%
                          </span>
                        )}
                        {option.effects.fanTrustDelta !== 0 && (
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-semibold ${
                              option.effects.fanTrustDelta > 0
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            Fan Trust: {option.effects.fanTrustDelta > 0 ? '+' : ''}{option.effects.fanTrustDelta}%
                          </span>
                        )}
                        {option.effects.boardConfidenceDelta !== 0 && (
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-semibold ${
                              option.effects.boardConfidenceDelta > 0
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            Board: {option.effects.boardConfidenceDelta > 0 ? '+' : ''}{option.effects.boardConfidenceDelta}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {isQuestionAnswered ? 'Response recorded. Media outlets updated.' : 'Select an answer to proceed.'}
              </span>

              {isQuestionAnswered && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
                >
                  <span>
                    {activeQuestionIdx < conference.questions.length - 1
                      ? 'Next Question'
                      : 'View Media Summary'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Summary View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Press Conference Successfully Concluded
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Media Outlets Publish Headlines
              </h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Your responses have shaped public narrative, player morale in the dressing room, and supporter sentiment across social channels.
              </p>
            </div>

            {/* Headlines from outlets */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Major Publication Headlines
              </div>
              <div className="space-y-2">
                {conference.questions.map((q) => {
                  const opt = q.options.find(o => o.id === q.answeredOptionId);
                  return (
                    <div
                      key={q.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-[10px] text-amber-400 font-mono font-bold uppercase">
                          {q.outlet} ({q.outletType})
                        </div>
                        <div className="text-sm font-semibold text-white mt-0.5">
                          "{opt?.effects.headlineOutcome || 'No comment provided'}"
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-xs">
                        {opt?.effects.squadMoraleDelta !== 0 && (
                          <span className={`px-2 py-0.5 rounded font-mono ${
                            (opt?.effects.squadMoraleDelta || 0) > 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                          }`}>
                            Morale {(opt?.effects.squadMoraleDelta || 0) > 0 ? '+' : ''}{opt?.effects.squadMoraleDelta}%
                          </span>
                        )}
                        {opt?.effects.fanTrustDelta !== 0 && (
                          <span className={`px-2 py-0.5 rounded font-mono ${
                            (opt?.effects.fanTrustDelta || 0) > 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                          }`}>
                            Fans {(opt?.effects.fanTrustDelta || 0) > 0 ? '+' : ''}{opt?.effects.fanTrustDelta}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conclude Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleConclude}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-colors"
              >
                <span>Return to Executive Boardroom</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
