import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play, FastForward, Shield, TrendingUp, Building2, Briefcase, Award, Save, Home, BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenManagerProfile?: () => void;
  onOpenExecutiveDevelopment?: () => void;
  onOpenSaveModal?: () => void;
  onReturnToMainMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenManagerProfile,
  onOpenExecutiveDevelopment,
  onOpenSaveModal,
  onReturnToMainMenu,
}) => {
  const { state, advanceWeek, advanceMonth, isSimulating } = useGame();
  const club = state.selectedClub;

  const unreadCount = state.inbox.filter(m => !m.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a] border-b border-slate-800/80 px-6 py-3">
      {/* Strict Top Bar Contract: 3 Zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark & Manager Accreditation Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
            {club.nickname?.slice(0, 2).toUpperCase() || 'FC'}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap leading-tight">
              {club.name}
            </span>
            <span className="text-[10px] text-slate-400 whitespace-nowrap leading-tight">
              {club.leagueName}
            </span>
          </div>

          {/* Manager Accreditation Badge */}
          {state.managerProfile ? (
            <button
              onClick={onOpenManagerProfile}
              className="hidden sm:flex items-center gap-2 bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 px-2.5 py-1 rounded-lg text-xs transition-colors ml-1 shadow-sm cursor-pointer"
              title="Click to view Official Continental Coaching License & Credentials"
            >
              <span className="text-sm">{state.managerProfile.nationalityFlag}</span>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-slate-200 text-[11px] leading-tight truncate max-w-[120px]">
                  {state.managerProfile.fullName}
                </span>
                <span className="text-[9px] text-amber-400 font-mono leading-tight font-bold">
                  {state.managerProfile.licenseName}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenManagerProfile}
              className="hidden sm:flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ml-1 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Coaching Exam</span>
            </button>
          )}

          {/* Executive Development & Credentials Button */}
          {state.managerProfile && (
            <button
              onClick={onOpenExecutiveDevelopment}
              className="hidden lg:flex items-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
              title="Open Executive Development Curriculum & Formal Qualifications"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-emerald-300 leading-tight">
                  {state.managerProfile.currentExecutiveQualificationId ? 'IPFE Certified' : 'Executive Academy'}
                </span>
                <span className="text-[9px] font-mono text-emerald-400/90 leading-tight">
                  {state.managerProfile.executiveExperience || 0} XP
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'overview' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            Boardroom
          </button>
          <button
            onClick={() => setActiveTab('finances')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'finances' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            Finances
          </button>
          <button
            onClick={() => setActiveTab('stadium')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'stadium' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            Ground & Stadium
          </button>
          <button
            onClick={() => setActiveTab('academy')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'academy' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            Youth Academy
          </button>
          <button
            onClick={() => setActiveTab('sporting')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'sporting' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            Sporting
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'transfers' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            Transfers
          </button>
          <button
            onClick={() => setActiveTab('sponsors')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'sponsors' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            Commercial
          </button>
          <button
            onClick={() => setActiveTab('league')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'league' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            League
          </button>
          <button
            onClick={() => setActiveTab('worldLeagues')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'worldLeagues' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            World Leagues
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'media' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            Press & Social
            {state.activePressConference && !state.activePressConference.isCompleted && (
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-1 animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'inbox' ? 'text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-white'
            }`}
          >
            Inbox {unreadCount > 0 && <span className="text-amber-400 font-bold ml-1 font-mono">({unreadCount})</span>}
          </button>
        </nav>

        {/* Zone 3: Save Slots, Progression Status, & Advance Week */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSaveModal}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-750 hover:text-white border border-slate-700/80 rounded-lg transition-colors cursor-pointer shadow-sm"
            title="Save Game, Auto-Save Slots & Load Point"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Save / Load</span>
          </button>

          <button
            onClick={onReturnToMainMenu}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Return to Main Menu"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>

          <div className="hidden md:flex flex-col text-right text-xs">
            <span className="font-mono text-slate-300 font-medium">Week {state.currentWeek} of 38</span>
            <span className="text-slate-500 text-[11px] font-mono">Season {state.currentSeason}/{state.currentSeason + 1 - 2000}</span>
          </div>

          <button
            onClick={advanceWeek}
            disabled={isSimulating}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm shadow-emerald-950/40"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? 'Simulating...' : 'Advance Week'}</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet secondary navigation strip */}
      <div className="xl:hidden flex items-center gap-4 overflow-x-auto pt-3 border-t border-slate-800/60 mt-2 text-xs font-medium text-slate-400 no-scrollbar">
        <button onClick={onOpenSaveModal} className="whitespace-nowrap py-1 text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
          <Save className="w-3.5 h-3.5" />
          <span>Save/Load</span>
        </button>
        <button onClick={onReturnToMainMenu} className="whitespace-nowrap py-1 text-slate-400 hover:text-white flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Menu</span>
        </button>
        <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap py-1 ${activeTab === 'overview' ? 'text-emerald-400 font-bold' : ''}`}>Boardroom</button>
        <button onClick={() => setActiveTab('finances')} className={`whitespace-nowrap py-1 ${activeTab === 'finances' ? 'text-emerald-400 font-bold' : ''}`}>Finances</button>
        <button onClick={() => setActiveTab('stadium')} className={`whitespace-nowrap py-1 ${activeTab === 'stadium' ? 'text-emerald-400 font-bold' : ''}`}>Ground & Stadium</button>
        <button onClick={() => setActiveTab('academy')} className={`whitespace-nowrap py-1 ${activeTab === 'academy' ? 'text-emerald-400 font-bold' : ''}`}>Youth Academy</button>
        <button onClick={() => setActiveTab('sporting')} className={`whitespace-nowrap py-1 ${activeTab === 'sporting' ? 'text-emerald-400 font-bold' : ''}`}>Sporting</button>
        <button onClick={() => setActiveTab('transfers')} className={`whitespace-nowrap py-1 ${activeTab === 'transfers' ? 'text-emerald-400 font-bold' : ''}`}>Transfers</button>
        <button onClick={() => setActiveTab('sponsors')} className={`whitespace-nowrap py-1 ${activeTab === 'sponsors' ? 'text-emerald-400 font-bold' : ''}`}>Commercial</button>
        <button onClick={() => setActiveTab('league')} className={`whitespace-nowrap py-1 ${activeTab === 'league' ? 'text-emerald-400 font-bold' : ''}`}>League</button>
        <button onClick={() => setActiveTab('worldLeagues')} className={`whitespace-nowrap py-1 ${activeTab === 'worldLeagues' ? 'text-emerald-400 font-bold' : ''}`}>World Leagues</button>
        <button onClick={() => setActiveTab('media')} className={`whitespace-nowrap py-1 relative ${activeTab === 'media' ? 'text-emerald-400 font-bold' : ''}`}>
          Press & Social
          {state.activePressConference && !state.activePressConference.isCompleted && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block ml-1 animate-pulse" />
          )}
        </button>
        <button onClick={() => setActiveTab('inbox')} className={`whitespace-nowrap py-1 ${activeTab === 'inbox' ? 'text-emerald-400 font-bold' : ''}`}>Inbox {unreadCount > 0 ? `(${unreadCount})` : ''}</button>
        <button
          onClick={onOpenManagerProfile}
          className="whitespace-nowrap py-1 text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
        >
          <Award className="w-3.5 h-3.5" />
          <span>{state.managerProfile ? state.managerProfile.licenseName : 'Coaching License'}</span>
        </button>
        <button
          onClick={onOpenExecutiveDevelopment}
          className="whitespace-nowrap py-1 text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Exec Academy</span>
        </button>
      </div>
    </header>
  );
};
