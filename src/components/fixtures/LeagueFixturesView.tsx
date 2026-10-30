import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, Calendar, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export const LeagueFixturesView: React.FC = () => {
  const { state } = useGame();
  const { leagueTable, fixtures, currentWeek, selectedClub } = state;
  const [viewWeek, setViewWeek] = useState<number>(currentWeek > 1 ? currentWeek - 1 : 1);

  // Sort league table by points DESC, goalDifference DESC, goalsFor DESC
  const sortedTable = [...leagueTable].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  const weekFixtures = fixtures.filter(f => f.gameweek === viewWeek);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border border-slate-800 bg-[#111827] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Championship League Standings & Fixtures
                </h1>
                <p className="text-xs text-slate-400">
                  Tier 1 Domestic Competition • Season {state.currentSeason}/{state.currentSeason + 1 - 2000} • Week {currentWeek} of 38
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Track the sporting performance of your Head Coach and squad. Match simulation proceeds automatically each gameweek tick while you command commercial, stadium, and financial strategy.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800 shrink-0">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Club Position</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                #{sortedTable.findIndex(c => c.id === selectedClub.id) + 1}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Points Total</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {sortedTable.find(c => c.id === selectedClub.id)?.points || 0} pts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: League Table and Fixtures Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Table */}
        <div className="lg:col-span-2 border border-slate-800 bg-[#111827] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Official League Table
              </h2>
              <p className="text-xs text-slate-400">
                Top 4 European qualification • Bottom 3 relegation threshold
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold pb-2">
                  <th className="py-2.5 px-2 text-center w-8">#</th>
                  <th className="py-2.5 px-3">Club</th>
                  <th className="py-2.5 px-2 text-center">PL</th>
                  <th className="py-2.5 px-2 text-center">W</th>
                  <th className="py-2.5 px-2 text-center">D</th>
                  <th className="py-2.5 px-2 text-center">L</th>
                  <th className="py-2.5 px-2 text-center">GF</th>
                  <th className="py-2.5 px-2 text-center">GA</th>
                  <th className="py-2.5 px-2 text-center">GD</th>
                  <th className="py-2.5 px-3 text-center font-bold">PTS</th>
                  <th className="py-2.5 px-3 text-center">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {sortedTable.map((row, index) => {
                  const isUserClub = row.id === selectedClub.id;
                  const isPromotion = index < 4;
                  const isRelegation = index >= sortedTable.length - 3;

                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors ${
                        isUserClub
                          ? 'bg-emerald-950/40 font-semibold text-white'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="py-3 px-2 text-center font-mono">
                        <span className={`inline-block w-5 h-5 rounded text-center leading-5 text-[11px] ${
                          isPromotion ? 'bg-emerald-900/60 text-emerald-300' :
                          isRelegation ? 'bg-rose-900/60 text-rose-300' :
                          'text-slate-400'
                        }`}>
                          {index + 1}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-sans">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500"
                          />
                          <span className={`text-xs ${isUserClub ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                            {row.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-2 text-center">{row.played}</td>
                      <td className="py-3 px-2 text-center">{row.won}</td>
                      <td className="py-3 px-2 text-center">{row.drawn}</td>
                      <td className="py-3 px-2 text-center">{row.lost}</td>
                      <td className="py-3 px-2 text-center text-slate-400">{row.goalsFor}</td>
                      <td className="py-3 px-2 text-center text-slate-400">{row.goalsAgainst}</td>
                      <td className={`py-3 px-2 text-center font-semibold ${
                        row.goalDifference > 0 ? 'text-emerald-400' : row.goalDifference < 0 ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-white text-sm">
                        {row.points}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {(row.form || []).slice(-5).map((result, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                                result === 'W' ? 'bg-emerald-600 text-white' :
                                result === 'D' ? 'bg-amber-600 text-white' :
                                'bg-rose-600 text-white'
                              }`}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Weekly Schedule & Fixtures Log */}
        <div className="border border-slate-800 bg-[#111827] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                Gameweek {viewWeek} Fixtures
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewWeek(prev => Math.max(1, prev - 1))}
                disabled={viewWeek <= 1}
                className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-300 font-mono">Wk {viewWeek}</span>
              <button
                onClick={() => setViewWeek(prev => Math.min(38, prev + 1))}
                disabled={viewWeek >= 38}
                className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {weekFixtures.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No fixtures scheduled for gameweek {viewWeek}.
              </div>
            ) : (
              weekFixtures.map(fixture => {
                const isUserMatch = fixture.homeTeam === selectedClub.name || fixture.awayTeam === selectedClub.name;

                return (
                  <div
                    key={fixture.id}
                    className={`p-3 rounded-lg border text-xs transition-colors ${
                      isUserMatch
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-sans">
                      <div className={`w-5/12 text-right truncate ${fixture.homeTeam === selectedClub.name ? 'font-bold text-emerald-400' : 'text-slate-200'}`}>
                        {fixture.homeTeam}
                      </div>

                      <div className="w-2/12 text-center font-mono font-bold text-sm">
                        {fixture.isPlayed ? (
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-white">
                            {fixture.homeScore} - {fixture.awayScore}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs font-normal">
                            vs
                          </span>
                        )}
                      </div>

                      <div className={`w-5/12 text-left truncate ${fixture.awayTeam === selectedClub.name ? 'font-bold text-emerald-400' : 'text-slate-200'}`}>
                        {fixture.awayTeam}
                      </div>
                    </div>

                    {fixture.isPlayed && fixture.attendance && (
                      <div className="text-[10px] text-slate-500 text-center font-mono mt-2 pt-1 border-t border-slate-800/60">
                        Attendance: {fixture.attendance.toLocaleString()} spectators
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
