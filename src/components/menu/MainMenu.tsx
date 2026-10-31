import React, { useState } from 'react';
import { 
  Play, 
  FolderOpen, 
  Clock, 
  Trash2, 
  Building2, 
  Award, 
  Shield, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  Wallet,
  Users,
  Trophy,
  Globe2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { DEFAULT_MANUAL_SLOT_IDS, SaveSlotMetadata } from '../../services/saveGameService';

interface MainMenuProps {
  onStartNewGame: () => void;
  onContinueGame?: () => void;
  canContinue?: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartNewGame,
  onContinueGame,
  canContinue = false,
}) => {
  const { 
    state, 
    loadGame, 
    deleteSave, 
    getSaveSlots, 
    setInMainMenu 
  } = useGame();

  // View state: 'root' (Options 1: New, 2: Load) or 'load_browser' (inspected save slots)
  const [view, setView] = useState<'root' | 'load_browser'>('root');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const slots = getSaveSlots();
  const autoSaveSlot = slots.find(s => s.id === 'autosave' || s.isAutoSave);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSelectSlotToLoad = (slotId: string) => {
    const success = loadGame(slotId);
    if (success) {
      showNotification('Game state loaded successfully! Entering simulation...', 'success');
      setTimeout(() => {
        setInMainMenu(false);
      }, 250);
    } else {
      showNotification('Unable to load selected save slot.', 'error');
    }
  };

  const handleDeleteSlot = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this save slot permanently?')) {
      const ok = deleteSave(slotId);
      if (ok) {
        showNotification('Save slot removed.', 'success');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden font-sans">
      {/* Background Ambience & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Top Bar Branding */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-base shadow-lg shadow-emerald-950/50">
            FC
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wider text-white uppercase">
              Apex Football Executive
            </h1>
            <p className="text-[10px] text-emerald-400/90 font-mono tracking-widest uppercase">
              CEO & Sporting Director Simulation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
            v2.4 • Android Edition
          </span>
        </div>
      </header>

      {/* Main Interactive Centerpiece */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto px-6 py-4 flex flex-col justify-center">
        {feedback && (
          <div className={`mb-6 p-3.5 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in ${
            feedback.type === 'success' 
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {view === 'root' ? (
          <div className="space-y-6">
            {/* Hero Title & Subtext */}
            <div className="text-center space-y-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Management Portal</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Main Menu
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Take full boardroom command. Expand infrastructure, manage continental coaching credentials, negotiate transfers, and lead your club to global glory.
              </p>
            </div>

            {/* Quick Resume Pill if active session exists */}
            {canContinue && state?.managerProfile && (
              <button
                onClick={onContinueGame}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/50 hover:border-emerald-400 text-left transition-all duration-200 group shadow-lg hover:shadow-emerald-950/40 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow group-hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                        Resume Active Session
                      </div>
                      <div className="text-sm font-bold text-white">
                        {state.selectedClub.name} • Week {state.currentWeek}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{state.managerProfile.nationalityFlag} {state.managerProfile.fullName}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-amber-400 font-mono text-[10px]">{state.managerProfile.licenseName}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            )}

            {/* The 2 Primary Options Requested: 1: New , 2: Load */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: NEW */}
              <button
                onClick={onStartNewGame}
                className="p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 text-left transition-all duration-200 group relative flex flex-col justify-between shadow-xl cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-extrabold text-lg group-hover:scale-105 transition-transform">
                      1
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      New Dynasty
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      1: New Game
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Start fresh. Enter your managerial name, choose your worldwide nationality, and pass the Continental Coaching Exam (UEFA, AFC, CONMEBOL, etc.).
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                  <span>Name & Country Selection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: LOAD */}
              <button
                onClick={() => setView('load_browser')}
                className="p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 text-left transition-all duration-200 group relative flex flex-col justify-between shadow-xl cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-extrabold text-lg group-hover:scale-105 transition-transform">
                      2
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full">
                      {slots.length} Save Files
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      2: Load Game
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Access your Auto-Save and manual save slots. Resume your managerial career from your exact saved checkpoint.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                  <span>Open Save Dossiers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* View: Load Game Browser (Option 2 Content) */
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('root')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  ← Back to Main Menu
                </button>
                <div className="h-4 w-px bg-slate-700" />
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    2: Load Game — Executive Save Slots
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select any save file to start playing immediately from that point
                  </p>
                </div>
              </div>
            </div>

            {/* Save Slots List */}
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {/* Auto-Save Slot (Prominent) */}
              <div 
                onClick={() => autoSaveSlot && handleSelectSlotToLoad('autosave')}
                className={`p-4 rounded-2xl border transition-all ${
                  autoSaveSlot
                    ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/40 hover:border-emerald-400 cursor-pointer shadow-md'
                    : 'bg-slate-900/40 border-slate-800 border-dashed opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                        Auto-Save Slot
                      </span>
                      {autoSaveSlot && (
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {autoSaveSlot.dateFormatted}
                        </span>
                      )}
                    </div>

                    {autoSaveSlot ? (
                      <>
                        <div className="text-sm font-bold text-white pt-1">
                          {autoSaveSlot.clubName} • Week {autoSaveSlot.currentWeek}, Season {autoSaveSlot.currentSeason}
                        </div>
                        <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 pt-0.5">
                          {autoSaveSlot.managerNationalityFlag && <span>{autoSaveSlot.managerNationalityFlag}</span>}
                          <span>{autoSaveSlot.managerName || 'Chief Executive'}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-amber-400 font-mono text-[11px] font-semibold">
                            {autoSaveSlot.managerLicense || 'Licensed'}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-emerald-400 font-mono text-[11px]">
                            £{(autoSaveSlot.balance / 1000000).toFixed(1)}M
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400 text-[11px]">
                            {autoSaveSlot.squadCount} Players
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-slate-500 italic pt-1">
                        No auto-save recorded yet. Advance a week in-game to generate auto-saves.
                      </div>
                    )}
                  </div>

                  {autoSaveSlot && (
                    <button
                      onClick={() => handleSelectSlotToLoad('autosave')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow cursor-pointer shrink-0 ml-3"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start From Save</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Manual Slots */}
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
                  Manual Slots
                </div>
                <div className="space-y-2.5">
                  {DEFAULT_MANUAL_SLOT_IDS.map((slotId, index) => {
                    const slotMetadata = slots.find(s => s.id === slotId);
                    const slotNum = index + 1;

                    return (
                      <div
                        key={slotId}
                        onClick={() => slotMetadata && handleSelectSlotToLoad(slotId)}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          slotMetadata
                            ? 'bg-slate-900 border-slate-700 hover:border-slate-600 cursor-pointer shadow-sm'
                            : 'bg-slate-900/30 border-slate-800 border-dashed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                              #{slotNum}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-2">
                                {slotMetadata ? slotMetadata.name : `Manual Slot ${slotNum} (Empty)`}
                              </div>
                              {slotMetadata ? (
                                <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 font-mono mt-0.5">
                                  <span>{slotMetadata.clubName}</span>
                                  <span>•</span>
                                  <span>Wk {slotMetadata.currentWeek}, {slotMetadata.currentSeason}</span>
                                  <span>•</span>
                                  <span>{slotMetadata.dateFormatted}</span>
                                </div>
                              ) : (
                                <div className="text-[10px] text-slate-500">
                                  Save your progress here during the simulation
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {slotMetadata ? (
                              <>
                                <button
                                  onClick={() => handleSelectSlotToLoad(slotId)}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Load</span>
                                </button>
                                <button
                                  onClick={e => handleDeleteSlot(slotId, e)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Save"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-600 uppercase font-mono px-2 py-1">
                                Empty
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer in Load Browser */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Saved files are stored locally on your device for offline play.</span>
              <button
                onClick={onStartNewGame}
                className="text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Or Start New Game →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer System Info */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 border-t border-slate-900">
        <div>
          Apex Football Executive Simulation System • Android Ready
        </div>
        <div className="flex items-center gap-4">
          <span>Auto-Save Enabled</span>
          <span>Offline Capable</span>
        </div>
      </footer>
    </div>
  );
};
