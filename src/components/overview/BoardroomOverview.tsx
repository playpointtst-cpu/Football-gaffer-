import React from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Building2, 
  TrendingUp, 
  Award, 
  Users, 
  Play, 
  FastForward, 
  ShieldAlert, 
  ArrowRight, 
  Calendar,
  Zap,
  Briefcase,
  MessageSquare,
  Mic,
} from 'lucide-react';
import { IndustryNewsWidget } from './IndustryNewsWidget';

interface BoardroomOverviewProps {
  onNavigate: (tab: string) => void;
  onOpenManagerProfile?: () => void;
}

export const BoardroomOverview: React.FC<BoardroomOverviewProps> = ({ onNavigate, onOpenManagerProfile }) => {
  const { state, advanceWeek, advanceMonth, isSimulating } = useGame();
  const club = state.selectedClub;
  const nextFixture = state.fixtures.find(f => f.gameweek === state.currentWeek && !f.isPlayed);

  const leaguePos = state.leagueTable.findIndex(c => c.name === club.name) + 1 || 5;

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a]">
        <div className="h-64 sm:h-72 w-full relative">
          <img
            src="/src/assets/images/executive_boardroom_view_1793397950785.jpg"
            alt="Club Executive Boardroom"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/70 to-transparent" />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">Chief Executive & Sporting Direction</span>
              <span aria-hidden="true">·</span>
              <span>Gameweek {state.currentWeek} of 38</span>
              <span aria-hidden="true">·</span>
              <span>{club.city}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {club.name} Executive Boardroom
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Mandate: {club.boardMandate.sportingTarget}. Maintain strict wage discipline while developing ground infrastructure and youth assets.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={advanceMonth}
              disabled={isSimulating}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <FastForward className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Month</span>
            </button>
            <button
              onClick={advanceWeek}
              disabled={isSimulating}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm shadow-emerald-950"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Advance Week</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manager Profile & Confederation Accreditation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#121c33] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-inner shrink-0">
            {state.managerProfile ? state.managerProfile.nationalityFlag : '👔'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                Sporting Director & Manager Profile
              </span>
              {state.managerProfile && (
                <span className="text-[11px] font-mono font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                  {state.managerProfile.confederation} Accredited
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{state.managerProfile ? state.managerProfile.fullName : 'Unregistered Manager'}</span>
              {state.managerProfile && (
                <span className="text-xs text-slate-400 font-normal">
                  ({state.managerProfile.nationality})
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-300">
              {state.managerProfile ? (
                <>
                  Official License: <strong className="text-amber-300">{state.managerProfile.licenseName}</strong> • {state.managerProfile.licenseDescription}
                </>
              ) : (
                'Complete your official coaching license examination to receive continental recognition.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {state.managerProfile ? (
            <button
              onClick={onOpenManagerProfile}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>View Coaching Diploma & Credentials</span>
            </button>
          ) : (
            <button
              onClick={onOpenManagerProfile}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Take Confederation Coaching Exam</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Board Confidence */}
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Board Confidence</span>
            <span className="font-mono text-emerald-400 font-bold">{club.boardMandate.boardConfidence}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${club.boardMandate.boardConfidence}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">Mandate stability: High</span>
        </div>

        {/* Fan Trust Rating */}
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Fan Trust Rating</span>
            <span className="font-mono text-emerald-400 font-bold">{club.boardMandate.fanTrustRating}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${club.boardMandate.fanTrustRating}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">Based on ticket fairness & heritage</span>
        </div>

        {/* League Standing */}
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Current League Rank</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            {leaguePos === 1 ? '1st' : `${leaguePos}th`}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <span>Points: {state.leagueTable.find(c => c.name === club.name)?.points || 0}</span>
            <span aria-hidden="true">·</span>
            <span>GD: {state.leagueTable.find(c => c.name === club.name)?.goalDifference || 0}</span>
          </div>
        </div>

        {/* Financial Cash Reserves */}
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Liquid Bank Reserves</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
            £{(club.finances.bankBalance / 1000000).toFixed(1)}M
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <span>Transfer: £{(club.finances.transferBudget / 1000000).toFixed(1)}M</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">PSR Compliant</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Next Fixture Preview & Strategic Mandates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Match Fixture */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Upcoming Matchday</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">Gameweek {state.currentWeek}</span>
          </div>

          {nextFixture ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center space-y-2">
                <div className="text-xs text-slate-400">
                  {nextFixture.homeTeam === club.name ? 'HOME FIXTURE' : 'AWAY FIXTURE'}
                </div>
                <div className="text-base font-bold text-white flex items-center justify-center gap-3">
                  <span className={nextFixture.homeTeam === club.name ? 'text-emerald-400' : 'text-slate-300'}>
                    {nextFixture.homeTeam}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">VS</span>
                  <span className={nextFixture.awayTeam === club.name ? 'text-emerald-400' : 'text-slate-300'}>
                    {nextFixture.awayTeam}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Venue: {nextFixture.homeTeam === club.name ? club.stadium.name : 'Opponent Stadium'}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-1">
                <span className="font-bold text-white block">Head Coach Briefing ({club.headCoach.name}):</span>
                <p className="text-slate-400">
                  "Lineup and game plan are locked in following your {club.tacticalDirective} mandate. Squad physical readiness is optimal."
                </p>
              </div>

              <button
                onClick={advanceWeek}
                disabled={isSimulating}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Matchday Fixture</span>
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              Season fixtures concluded. Review end-of-season financial distributions.
            </div>
          )}
        </div>

        {/* Board Mandates & Club Infrastructure Status */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Board Directives & Strategic Pillars</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">Sporting Mandate</span>
                <div className="text-xs font-bold text-white">{club.boardMandate.sportingTarget}</div>
                <span className="text-[11px] text-slate-400 block mt-1">Directs Head Coach tactical philosophy</span>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
                <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">Financial Mandate</span>
                <div className="text-xs font-bold text-white">{club.boardMandate.financialTarget}</div>
                <span className="text-[11px] text-slate-400 block mt-1">Wage ratio target: {club.finances.budgetAllocation.targetWageToTurnoverRatio}%</span>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">Ground Mandate</span>
                <div className="text-xs font-bold text-white">{club.boardMandate.sustainabilityTarget}</div>
                <span className="text-[11px] text-slate-400 block mt-1">Green Rating: {club.stadium.sustainability.greenRatingScore}/100</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">Quick Department Shortcuts:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('finances')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Financial Ledger
                </button>
                <button
                  onClick={() => onNavigate('stadium')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Ground & Academy
                </button>
                <button
                  onClick={() => onNavigate('transfers')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Transfer Market
                </button>
              </div>
            </div>
          </div>

          {/* Infrastructure Campus Feature Spotlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => onNavigate('stadium')}
              className="group cursor-pointer bg-[#111827] hover:bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
            >
              <div className="h-28 w-full relative">
                <img
                  src="/src/assets/images/stadium_aerial_view_1793397949949.jpg"
                  alt="Stadium Ground Expansion"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
              </div>
              <div className="p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{club.stadium.name}</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">{club.stadium.totalCapacity.toLocaleString()} seats</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Stands capacity, safe standing rails, VIP suites, and hybrid pitch drainage.
                </p>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('stadium')}
              className="group cursor-pointer bg-[#111827] hover:bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
            >
              <div className="h-28 w-full relative">
                <img
                  src="/src/assets/images/training_ground_campus_1793397950684.jpg"
                  alt="Training Campus & Academy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
              </div>
              <div className="p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{club.trainingGround?.name || 'Training Campus'}</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">Level {club.trainingGround?.level || 4}/5</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Sports science rehabilitation, hydrotherapy, and youth academy wonderkids incubator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Room & Social Buzz Widget */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Press Room & FanZone Wire
                {state.activePressConference && !state.activePressConference.isCompleted && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                    Media Waiting
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                Live player quotes, journalist reactions, and supporter sentiment following matchday action.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('media')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Open Social Feed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Active Press Conference Alert Banner if any */}
        {state.activePressConference && !state.activePressConference.isCompleted && (
          <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-slate-900 border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-amber-300">
                  {state.activePressConference.headline}
                </div>
                <div className="text-[11px] text-slate-300">
                  {state.activePressConference.questions.length} media questions awaiting your executive response.
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('media')}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 transition-colors shadow-sm cursor-pointer"
            >
              Enter Media Suite
            </button>
          </div>
        )}

        {/* 2 Latest Social Posts Snippets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(state.socialFeed || []).slice(0, 2).map(post => (
            <div
              key={post.id}
              onClick={() => onNavigate('media')}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 rounded-xl p-3.5 space-y-2 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      {post.authorName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {post.authorHandle}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{post.timeAgo}</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                "{post.content}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="text-sky-400 font-medium">{post.tags[0] || '#Football'}</span>
                <span>❤️ {post.likes.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Football Industry News & Live Wire Widget */}
      <IndustryNewsWidget onNavigate={onNavigate} />
    </div>
  );
};
