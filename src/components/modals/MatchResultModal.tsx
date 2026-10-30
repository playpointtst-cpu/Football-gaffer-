import React from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Trophy, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  X,
  Building
} from 'lucide-react';

export const MatchResultModal: React.FC = () => {
  const { state, showMatchModal, closeMatchModal } = useGame();

  if (!showMatchModal) return null;

  const club = state.selectedClub;
  const lastReport = state.lastMatchReport;
  const currentWk = state.currentWeek > 1 ? state.currentWeek - 1 : 1;

  // Retrieve user fixture
  const fixture = lastReport?.fixture || state.fixtures.find(
    f => f.gameweek === currentWk && (f.homeTeam === club.name || f.awayTeam === club.name) && f.isPlayed
  );

  if (!fixture) {
    return null;
  }

  const isHome = fixture.homeTeam === club.name;
  const userScore = isHome ? (fixture.homeScore ?? 0) : (fixture.awayScore ?? 0);
  const oppScore = isHome ? (fixture.awayScore ?? 0) : (fixture.homeScore ?? 0);
  const opponentName = isHome ? fixture.awayTeam : fixture.homeTeam;

  const isWin = userScore > oppScore;
  const isDraw = userScore === oppScore;
  const isLoss = userScore < oppScore;

  const injuredPlayers = club.players.filter(p => p.isInjured || (p.injuryWeeks && p.injuryWeeks > 0));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Top */}
        <div className={`p-6 text-center border-b ${
          isWin ? 'bg-emerald-950/40 border-emerald-500/30' :
          isDraw ? 'bg-amber-950/40 border-amber-500/30' :
          'bg-rose-950/40 border-rose-500/30'
        }`}>
          <div className="text-[11px] font-mono tracking-widest uppercase font-semibold text-slate-400">
            Gameweek {fixture.gameweek || currentWk} Official Result
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="text-right w-5/12">
              <div className={`text-base font-bold truncate ${fixture.homeTeam === club.name ? 'text-white' : 'text-slate-300'}`}>
                {fixture.homeTeam}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">Home</div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-2xl font-bold font-mono text-white shadow-inner">
              {fixture.homeScore ?? 0} - {fixture.awayScore ?? 0}
            </div>

            <div className="text-left w-5/12">
              <div className={`text-base font-bold truncate ${fixture.awayTeam === club.name ? 'text-white' : 'text-slate-300'}`}>
                {fixture.awayTeam}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">Away</div>
            </div>
          </div>

          <div className="mt-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono ${
              isWin ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' :
              isDraw ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40' :
              'bg-rose-900/60 text-rose-300 border border-rose-500/40'
            }`}>
              {isWin ? 'VICTORY (+3 PTS)' : isDraw ? 'HONOURS EVEN (+1 PT)' : 'DEFEAT (0 PTS)'}
            </span>
          </div>
        </div>

        {/* Post-Match Debrief Details */}
        <div className="p-6 space-y-4 text-xs font-sans">
          {/* Matchday Economics (if Home) */}
          {isHome ? (
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Turnstile Attendance</span>
                <span className="text-white font-bold text-sm mt-0.5 block">
                  {(fixture.attendance || club.stadium.averageAttendance).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {Math.round(((fixture.attendance || club.stadium.averageAttendance) / club.stadium.totalCapacity) * 100)}% Stadium Fill Rate
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Gate Receipts + Hospitality</span>
                <span className="text-emerald-400 font-bold text-sm mt-0.5 block">
                  +£{((fixture.gateReceipts || club.finances.weeklyMatchdayIncomeAvg) / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-500 block font-sans">
                  Credited to club ledger
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
              Away fixture traveled to {opponentName}. Squad logistical travel and lodging expensed to operating costs.
            </div>
          )}

          {/* Head Coach Post-Match Directive Note */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">
                Head Coach Debrief ({club.headCoach.name})
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                {club.headCoach.tacticalStyle} Directive
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {lastReport?.coachQuote || (
                isWin 
                  ? 'The tactical structure was executed flawlessly. Pressing triggers forced crucial turnovers, and player morale is peaking.'
                  : isDraw
                  ? 'A disciplined contest. We contained their transition threats, though midfield penetration requires sharper coaching focus.'
                  : 'Lapses in concentration compromised defensive shape. Reviewing match recordings with senior analytics staff this week.'
              )}
            </p>
          </div>

          {/* Medical Physio Bulletin */}
          {injuredPlayers.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-rose-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Physiotherapy Department Notice</span>
              </div>
              <div className="text-[11px] space-y-0.5">
                {injuredPlayers.map(p => (
                  <div key={p.id}>
                    {p.name} sidelined ({p.injuryType || 'Muscle Strain'}, {p.injuryWeeks || 1}w left).
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dismiss CTA */}
          <div className="pt-2">
            <button
              onClick={closeMatchModal}
              className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm"
            >
              Continue Executive Duties
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
