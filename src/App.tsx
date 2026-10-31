/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { Header } from './components/layout/Header';
import { BoardroomOverview } from './components/overview/BoardroomOverview';
import { FinancialLedgerView } from './components/finances/FinancialLedgerView';
import { StadiumGroundView } from './components/stadium/StadiumGroundView';
import { YouthAcademyView } from './components/academy/YouthAcademyView';
import { SportingDirectorView } from './components/sporting/SportingDirectorView';
import { TransferMarketView } from './components/transfers/TransferMarketView';
import { SponsorshipView } from './components/commercial/SponsorshipView';
import { LeagueFixturesView } from './components/fixtures/LeagueFixturesView';
import { WorldLeaguesView } from './components/leagues/WorldLeaguesView';
import { InboxView } from './components/inbox/InboxView';
import { MatchResultModal } from './components/modals/MatchResultModal';
import { PreGameSetupModal } from './components/onboarding/PreGameSetupModal';
import { MediaAndSocialView } from './components/media/MediaAndSocialView';
import { AndroidBottomNav } from './components/layout/AndroidBottomNav';
import { MainMenu } from './components/menu/MainMenu';
import { SaveLoadModal } from './components/modals/SaveLoadModal';
import { ExecutiveDevelopmentModal } from './components/modals/ExecutiveDevelopmentModal';
import { useGame } from './context/GameContext';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { CheckCircle2 } from 'lucide-react';

function MainGame() {
  const { 
    state, 
    inMainMenu, 
    setInMainMenu, 
    startNewGame, 
    lastAutoSavedTime,
    triggerAutoSave 
  } = useGame();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showExecutiveModal, setShowExecutiveModal] = useState<boolean>(false);
  const [saveModalMode, setSaveModalMode] = useState<'save' | 'load'>('save');
  const [showAutoSaveToast, setShowAutoSaveToast] = useState<boolean>(false);

  // Android status bar theming
  React.useEffect(() => {
    try {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#070b14' }).catch(() => {});
    } catch {
      // Browser environment fallback
    }
  }, []);

  // Display Auto-Save Toast whenever auto-save triggers
  React.useEffect(() => {
    if (lastAutoSavedTime) {
      setShowAutoSaveToast(true);
      const timer = setTimeout(() => setShowAutoSaveToast(false), 2400);
      return () => clearTimeout(timer);
    }
  }, [lastAutoSavedTime]);

  // Android hardware back button handler
  React.useEffect(() => {
    let listenerPromise: any;
    try {
      listenerPromise = CapApp.addListener('backButton', () => {
        if (showExecutiveModal) {
          setShowExecutiveModal(false);
        } else if (showSaveModal) {
          setShowSaveModal(false);
        } else if (showSetupModal && state.managerProfile) {
          setShowSetupModal(false);
        } else if (!inMainMenu && activeTab !== 'overview') {
          setActiveTab('overview');
        } else if (!inMainMenu) {
          // In simulation overview -> return to Main Menu
          setInMainMenu(true);
        } else {
          CapApp.exitApp();
        }
      });
    } catch {
      // Browser environment fallback
    }

    return () => {
      if (listenerPromise) {
        listenerPromise.then((handle: { remove: () => void }) => handle.remove()).catch(() => {});
      }
    };
  }, [activeTab, showSetupModal, showSaveModal, showExecutiveModal, inMainMenu, state.managerProfile, setInMainMenu]);

  // Handler for Option 1: New Game from Main Menu
  const handleStartNewGame = () => {
    startNewGame();
    setShowSetupModal(true);
  };

  const handleOpenSaveModal = (mode: 'save' | 'load' = 'save') => {
    setSaveModalMode(mode);
    setShowSaveModal(true);
  };

  const handleReturnToMainMenu = () => {
    // Ensure state is auto-saved before switching to Main Menu
    triggerAutoSave();
    setInMainMenu(true);
  };

  // If in Main Menu, render the Main Menu screen with Options 1: New and 2: Load
  if (inMainMenu) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
        <MainMenu
          onStartNewGame={handleStartNewGame}
          onContinueGame={() => setInMainMenu(false)}
          canContinue={!!state.managerProfile}
        />

        {/* If New Game was selected and immediately triggers Name & Country selection */}
        <PreGameSetupModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          canDismiss={!!state.managerProfile}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenManagerProfile={() => setShowSetupModal(true)}
        onOpenExecutiveDevelopment={() => setShowExecutiveModal(true)}
        onOpenSaveModal={() => handleOpenSaveModal('save')}
        onReturnToMainMenu={handleReturnToMainMenu}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-28 xl:pb-8">
        {activeTab === 'overview' && (
          <BoardroomOverview
            onNavigate={setActiveTab}
            onOpenManagerProfile={() => setShowSetupModal(true)}
            onOpenExecutiveDevelopment={() => setShowExecutiveModal(true)}
          />
        )}
        {activeTab === 'finances' && <FinancialLedgerView />}
        {activeTab === 'stadium' && <StadiumGroundView />}
        {activeTab === 'academy' && <YouthAcademyView />}
        {activeTab === 'sporting' && <SportingDirectorView />}
        {activeTab === 'transfers' && <TransferMarketView />}
        {activeTab === 'sponsors' && <SponsorshipView />}
        {activeTab === 'league' && <LeagueFixturesView />}
        {activeTab === 'worldLeagues' && <WorldLeaguesView />}
        {activeTab === 'media' && <MediaAndSocialView />}
        {activeTab === 'inbox' && <InboxView />}
      </main>

      {/* Android Mobile Ergonomic Bottom Nav */}
      <AndroidBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenManagerProfile={() => setShowSetupModal(true)}
        onOpenExecutiveDevelopment={() => setShowExecutiveModal(true)}
        onOpenSaveModal={() => handleOpenSaveModal('save')}
        onReturnToMainMenu={handleReturnToMainMenu}
      />

      {/* Auto-Save Toast Banner */}
      {showAutoSaveToast && (
        <div className="fixed top-16 right-4 z-50 flex items-center gap-2 bg-slate-900/95 border border-emerald-500/40 text-emerald-300 text-xs px-3.5 py-2 rounded-xl shadow-xl backdrop-blur animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">Auto-saved</span>
          <span className="text-slate-400 text-[10px] font-mono">Week {state.currentWeek}</span>
        </div>
      )}

      {/* Executive Development & Accreditation Modal */}
      <ExecutiveDevelopmentModal
        isOpen={showExecutiveModal}
        onClose={() => setShowExecutiveModal(false)}
      />

      {/* Save / Load Modal */}
      <SaveLoadModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        initialMode={saveModalMode}
        onReturnToMainMenu={handleReturnToMainMenu}
      />

      <MatchResultModal />
      
      {/* Continental Coaching License & Manager Setup Modal (Name & Country selection point) */}
      <PreGameSetupModal
        isOpen={showSetupModal || !state.managerProfile}
        onClose={() => setShowSetupModal(false)}
        canDismiss={!!state.managerProfile}
      />
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Applet render error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-lg">
              FC
            </div>
            <h2 className="text-lg font-bold text-white">Apex Football Executive</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              A previous session conflict occurred in browser memory. Click below to refresh your executive portal and load clean club data.
            </p>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm"
            >
              Reset Session & Load Executive Suite
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <MainGame />
      </GameProvider>
    </ErrorBoundary>
  );
}
