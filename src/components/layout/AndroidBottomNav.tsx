import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ArrowLeftRight, 
  MessageSquare, 
  MoreHorizontal, 
  X, 
  Wallet, 
  Landmark, 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  Globe2, 
  Mail,
  Award,
  Play,
  Save,
  Home,
  BookOpen
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface AndroidBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenManagerProfile?: () => void;
  onOpenExecutiveDevelopment?: () => void;
  onOpenSaveModal?: () => void;
  onReturnToMainMenu?: () => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenManagerProfile,
  onOpenExecutiveDevelopment,
  onOpenSaveModal,
  onReturnToMainMenu,
}) => {
  const { state, advanceWeek, isSimulating } = useGame();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const unreadCount = state.inbox.filter(m => !m.isRead).length;
  const hasPressConference = state.activePressConference && !state.activePressConference.isCompleted;

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Drawer / Full Sheet for "More" Navigation on Android */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm xl:hidden animate-in fade-in duration-200">
          <div 
            className="flex-1"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="bg-[#0f172a] border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto space-y-4 pb-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">Club Operations & Portals</h3>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Manager Accreditation Info */}
            {state.managerProfile && (
              <div 
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenManagerProfile?.();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{state.managerProfile.nationalityFlag}</span>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">{state.managerProfile.fullName}</div>
                    <div className="text-[10px] text-amber-400 font-mono font-bold leading-tight">{state.managerProfile.licenseName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  <Award className="w-3 h-3" />
                  Exam Dossier
                </div>
              </div>
            )}

            {/* Grid of Department Portals */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSelectTab('finances')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  activeTab === 'finances'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Finances</div>
                  <div className="text-[10px] text-slate-500">P&L & Budgets</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('stadium')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  activeTab === 'stadium'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <Landmark className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Stadium & Ground</div>
                  <div className="text-[10px] text-slate-500">Facilities & Stands</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('academy')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  activeTab === 'academy'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Youth Academy</div>
                  <div className="text-[10px] text-slate-500">Scouts & Pipeline</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('sponsors')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  activeTab === 'sponsors'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <Briefcase className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Commercial</div>
                  <div className="text-[10px] text-slate-500">Sponsors & Deals</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('league')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  activeTab === 'league'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Domestic League</div>
                  <div className="text-[10px] text-slate-500">Fixtures & Table</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('worldLeagues')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  activeTab === 'worldLeagues'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold">World Leagues</div>
                  <div className="text-[10px] text-slate-500">Top 10 Nations</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('inbox')}
                className={`col-span-2 flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  activeTab === 'inbox'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Executive Inbox</div>
                    <div className="text-[10px] text-slate-500">Board resolutions & reports</div>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2 py-0.5 rounded-full font-bold font-mono">
                    {unreadCount} new
                  </span>
                )}
              </button>

              {/* Save & Main Menu Actions for Mobile */}
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenSaveModal?.();
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-left text-emerald-300 hover:bg-emerald-900/30 transition-all"
              >
                <Save className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Save / Load</div>
                  <div className="text-[10px] text-emerald-400/80">Auto-save & Slots</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenExecutiveDevelopment?.();
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-blue-500/30 bg-blue-950/20 text-left text-blue-300 hover:bg-blue-900/30 transition-all"
              >
                <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Exec Academy</div>
                  <div className="text-[10px] text-blue-400/80">IPFE Diplomas & XP</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onReturnToMainMenu?.();
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-900/80 text-left text-slate-300 hover:bg-slate-800 transition-all"
              >
                <Home className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Main Menu</div>
                  <div className="text-[10px] text-slate-500">New / Load Screen</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar (Android Touch Ergonomics) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 xl:hidden flex items-center justify-around px-2 py-2"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* 1. Boardroom */}
        <button
          onClick={() => handleSelectTab('overview')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'overview' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Boardroom</span>
        </button>

        {/* 2. Squad / Sporting */}
        <button
          onClick={() => handleSelectTab('sporting')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'sporting' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Squad</span>
        </button>

        {/* 3. Advance Week Floating Touch Center */}
        <button
          onClick={advanceWeek}
          disabled={isSimulating}
          className="flex flex-col items-center justify-center px-2 py-1 -mt-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-950/60 border border-emerald-400/30 transition-transform active:scale-95 disabled:opacity-50"
          title="Advance to next match week"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <span className="text-[9px] font-bold mt-0.5 text-emerald-100 whitespace-nowrap">
            {isSimulating ? 'Sim...' : `Wk ${state.currentWeek}`}
          </span>
        </button>

        {/* 4. Transfers */}
        <button
          onClick={() => handleSelectTab('transfers')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'transfers' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Transfers</span>
        </button>

        {/* 5. Press & FanZone */}
        <button
          onClick={() => handleSelectTab('media')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
            activeTab === 'media' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 mb-0.5" />
            {hasPressConference && (
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 animate-ping" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Press</span>
        </button>

        {/* 6. Operations More Menu */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
            showMoreMenu || ['finances', 'stadium', 'academy', 'sponsors', 'league', 'worldLeagues', 'inbox'].includes(activeTab)
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>
    </>
  );
};
