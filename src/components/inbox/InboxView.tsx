import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ExecutiveMessage } from '../../types/game';
import { 
  Inbox as InboxIcon, 
  Mail, 
  MailOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  ShieldCheck, 
  Award,
  ChevronRight
} from 'lucide-react';

export const InboxView: React.FC = () => {
  const { state, resolveDilemma } = useGame();
  const messages = state.inbox;

  const [selectedMessageId, setSelectedMessageId] = useState<string>(
    messages[0]?.id || ''
  );
  const [resolutionNotice, setResolutionNotice] = useState<string | null>(null);

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || messages[0];

  const handleChoice = (choice: 'A' | 'B') => {
    if (!selectedMessage) return;
    resolveDilemma(selectedMessage.id, choice);
    const chosenText = choice === 'A' ? selectedMessage.decision?.choiceA.label : selectedMessage.decision?.choiceB.label;
    setResolutionNotice(`Executive decision ratified: "${chosenText}"`);
    setTimeout(() => setResolutionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {resolutionNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{resolutionNotice}</span>
          </div>
          <button onClick={() => setResolutionNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Overview Card */}
      <div className="border border-slate-800 bg-[#111827] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <InboxIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Executive Briefing & Strategic Dilemmas
                </h1>
                <p className="text-xs text-slate-400">
                  Board Directives • Groundskeeping Audits • Scouting Briefs • Commercial Dispatches
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Every executive decision carries governance consequences. Balance short-term matchday pressures with the long-term balance sheet stability demanded by the Boardroom.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              {messages.filter(m => !m.isRead).length} Unread Memos
            </div>
          </div>
        </div>
      </div>

      {/* Main Mailbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Email List */}
        <div className="border border-slate-800 bg-[#111827] rounded-xl p-4 space-y-2 divide-y divide-slate-800/60">
          <div className="pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Executive In-Tray
          </div>

          <div className="space-y-1.5 pt-2 max-h-[600px] overflow-y-auto no-scrollbar">
            {messages.map(msg => {
              const isSelected = selectedMessage?.id === msg.id;

              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? 'bg-emerald-950/40 border border-emerald-500/40'
                      : 'hover:bg-slate-800/50 bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-emerald-400 truncate max-w-[150px]">
                      {msg.senderRole}
                    </span>
                    <span className="font-mono text-slate-500">
                      Wk {msg.week}
                    </span>
                  </div>

                  <div className={`font-medium ${msg.isRead ? 'text-slate-300' : 'text-white font-bold'}`}>
                    {msg.subject}
                  </div>

                  <p className="text-slate-400 line-clamp-1 mt-1 text-[11px]">
                    {msg.preview}
                  </p>

                  {msg.decision && !msg.decision.resolved && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 font-mono">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Executive Decision Required</span>
                    </div>
                  )}

                  {msg.decision?.resolved && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Resolved</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Full Memorandum & Dilemma Controls */}
        <div className="lg:col-span-2 border border-slate-800 bg-[#111827] rounded-xl p-6 flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-400">
                    Week {selectedMessage.week}, Season {selectedMessage.season}
                  </div>
                  {selectedMessage.urgent && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                      Priority Dispatch
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-white mt-1">
                  {selectedMessage.subject}
                </h2>

                <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                  <span className="text-slate-400">From:</span>
                  <span className="font-semibold text-white">{selectedMessage.sender}</span>
                  <span className="text-slate-500">({selectedMessage.senderRole})</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-4 font-sans">
                {selectedMessage.body}
              </div>

              {/* Dilemma Decision Box */}
              {selectedMessage.decision && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 mt-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Chairman / Sporting Director Executive Decision
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400">
                    Select a resolution to instruct the club's administration:
                  </p>

                  {selectedMessage.decision.resolved ? (
                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Resolution ratified by executive order. Changes have been executed.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={() => handleChoice('A')}
                        className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors flex flex-col justify-between space-y-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">
                            Option A: {selectedMessage.decision.choiceA.label}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {selectedMessage.decision.choiceA.description}
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                          Click to Enact Option A →
                        </span>
                      </button>

                      <button
                        onClick={() => handleChoice('B')}
                        className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors flex flex-col justify-between space-y-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">
                            Option B: {selectedMessage.decision.choiceB.label}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {selectedMessage.decision.choiceB.description}
                          </div>
                        </div>
                        <span className="text-[10px] text-sky-400 font-mono font-semibold">
                          Click to Enact Option B →
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select a message from your executive in-tray.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
