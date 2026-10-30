import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { TOP_10_WORLD_LEAGUES } from '../../data/worldLeagues';
import { WorldClubInfo, DivisionData } from '../../types/game';
import { 
  Globe2, 
  Trophy, 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Search, 
  ArrowUpDown, 
  ChevronRight, 
  Shield, 
  ExternalLink,
  Award,
  Layers
} from 'lucide-react';

export const WorldLeaguesView: React.FC = () => {
  const { state, selectClub } = useGame();
  
  const [selectedCountryId, setSelectedCountryId] = useState<string>('england');
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWorldClub, setSelectedWorldClub] = useState<WorldClubInfo | null>(null);
  const [showTakeoverConfirm, setShowTakeoverConfirm] = useState<boolean>(false);

  const selectedCountry = useMemo(() => {
    return TOP_10_WORLD_LEAGUES.find(c => c.id === selectedCountryId) || TOP_10_WORLD_LEAGUES[0];
  }, [selectedCountryId]);

  const activeDivision = useMemo(() => {
    return selectedCountry.divisions.find(d => d.tier === selectedTier) || selectedCountry.divisions[0];
  }, [selectedCountry, selectedTier]);

  const filteredClubs = useMemo(() => {
    if (!searchQuery.trim()) return activeDivision.clubs;
    const q = searchQuery.toLowerCase();
    return activeDivision.clubs.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.stadiumName.toLowerCase().includes(q)
    );
  }, [activeDivision, searchQuery]);

  // Aggregate stats across all 10 countries and 40 divisions
  const totalClubsCount = useMemo(() => {
    return TOP_10_WORLD_LEAGUES.reduce((acc, country) => {
      return acc + country.divisions.reduce((dAcc, div) => dAcc + div.clubs.length, 0);
    }, 0);
  }, []);

  const handleTakeover = (club: WorldClubInfo) => {
    setSelectedWorldClub(club);
    setShowTakeoverConfirm(true);
  };

  const confirmTakeover = () => {
    if (!selectedWorldClub) return;
    // Map to an executive profile or switch
    selectClub(selectedWorldClub.id);
    setShowTakeoverConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="border border-slate-800 bg-[#111827] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Global Football Pyramid & League Database
                </h1>
                <p className="text-xs text-slate-400">
                  Top 10 International Football Nations • 4 Divisions Per Country • {totalClubsCount} Real-Life Verified Clubs
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Explore domestic league structures, promotional thresholds, authentic stadium capacities, and real-world executive balance sheets across Europe and South America.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Current Club</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {state.selectedClub.name}
              </div>
              <div className="text-[10px] text-slate-500">
                {state.selectedClub.stadium.name} ({state.selectedClub.stadium.totalCapacity.toLocaleString()} cap)
              </div>
            </div>
          </div>
        </div>

        {/* 10 Countries Selector Horizontal Rail */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Select Country
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {TOP_10_WORLD_LEAGUES.map(country => {
              const isSelected = country.id === selectedCountryId;
              return (
                <button
                  key={country.id}
                  onClick={() => {
                    setSelectedCountryId(country.id);
                    setSelectedTier(1);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-sky-600/20 border-sky-500/50 text-white font-semibold shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({country.confederation})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Division Navigation Strip & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 bg-[#111827] rounded-xl p-4">
        {/* Tier 1 - 4 Selector */}
        <div className="flex items-center gap-2">
          {selectedCountry.divisions.map(division => {
            const isSelected = division.tier === selectedTier;
            return (
              <button
                key={division.tier}
                onClick={() => setSelectedTier(division.tier)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tier {division.tier}: {division.shortName || division.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search clubs, cities, stadiums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Division Overview & Statistics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-slate-800 bg-[#111827] rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Division Full Name</div>
          <div className="text-sm font-bold text-white mt-1">
            {activeDivision.name}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {activeDivision.teamsCount} Competing Clubs
          </div>
        </div>

        <div className="border border-slate-800 bg-[#111827] rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Promotion Rules</div>
          <div className="text-sm font-bold text-emerald-400 mt-1 font-mono">
            {activeDivision.promotionSpots > 0 ? `Top ${activeDivision.promotionSpots} Clubs Promoted` : 'Apex Tier (Continental Qual.)'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {activeDivision.tier === 1 ? 'Champions League / Libertadores' : `Ascent to Tier ${activeDivision.tier - 1}`}
          </div>
        </div>

        <div className="border border-slate-800 bg-[#111827] rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Relegation Rules</div>
          <div className="text-sm font-bold text-rose-400 mt-1 font-mono">
            {activeDivision.relegationSpots > 0 ? `Bottom ${activeDivision.relegationSpots} Clubs Relegated` : 'Base Tier (No drop)'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Drop to Tier {activeDivision.tier + 1}
          </div>
        </div>

        <div className="border border-slate-800 bg-[#111827] rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Average Stadium Size</div>
          <div className="text-sm font-bold text-amber-400 mt-1 font-mono">
            {Math.round(activeDivision.clubs.reduce((acc, c) => acc + c.stadiumCapacity, 0) / (activeDivision.clubs.length || 1)).toLocaleString()} seats
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Based on verified municipal grounds
          </div>
        </div>
      </div>

      {/* Verified Real-Life Clubs Table */}
      <div className="border border-slate-800 bg-[#111827] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {selectedCountry.flag} {selectedCountry.name} — {activeDivision.name} Roster ({filteredClubs.length} Clubs)
            </h3>
            <p className="text-xs text-slate-400">
              Live ground capacity, wage bills, and executive financial estimates.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold pb-2">
                <th className="py-2.5 px-3">Club & City</th>
                <th className="py-2.5 px-3">Home Stadium</th>
                <th className="py-2.5 px-3 text-right">Capacity</th>
                <th className="py-2.5 px-3 text-center">Reputation</th>
                <th className="py-2.5 px-3 text-right">Est. Transfer Budget</th>
                <th className="py-2.5 px-3 text-right">Weekly Wage Bill</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredClubs.map(club => {
                const isSelected = selectedWorldClub?.id === club.id;
                const isCurrentlyControlled = state.selectedClub.id === club.id;

                return (
                  <tr
                    key={club.id}
                    onClick={() => setSelectedWorldClub(club)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-950/30' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                          style={{ backgroundColor: club.primaryColor || '#10b981' }}
                        />
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{club.name}</span>
                            {isCurrentlyControlled && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded font-mono">
                                Active Club
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {club.city} • [{club.shortName}]
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <div className="text-slate-200 font-medium">{club.stadiumName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Tier {activeDivision.tier} Approved Ground</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                      {club.stadiumCapacity.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="text-amber-400 font-bold">{club.reputation}</span>
                      <span className="text-slate-500 text-[10px]">/100</span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-emerald-400 font-semibold">
                      £{(club.transferBudgetEstimate / 1000000).toFixed(1)}M
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      £{(club.wageBillWeeklyEstimate / 1000).toFixed(0)}k/wk
                    </td>

                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTakeover(club);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-sky-400 hover:text-white bg-sky-950/40 hover:bg-sky-600 border border-sky-800/60 hover:border-sky-500 rounded transition-colors"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Club Inspection & Takeover Modal */}
      {showTakeoverConfirm && selectedWorldClub && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: selectedWorldClub.primaryColor || '#10b981' }}
                />
                <h3 className="text-base font-bold text-white">
                  {selectedWorldClub.name} Executive Dossier
                </h3>
              </div>
              <button onClick={() => setShowTakeoverConfirm(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Home Stadium</span>
                <span className="text-white font-medium text-xs mt-1 block font-sans">
                  {selectedWorldClub.stadiumName}
                </span>
                <span className="text-emerald-400 font-bold block mt-0.5">
                  {selectedWorldClub.stadiumCapacity.toLocaleString()} seats
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Domestic Tier</span>
                <span className="text-white font-medium text-xs mt-1 block font-sans">
                  {activeDivision.name}
                </span>
                <span className="text-sky-400 font-bold block mt-0.5">
                  Tier {activeDivision.tier} • {selectedCountry.name}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Est. Transfer Budget</span>
                <span className="text-emerald-400 font-bold text-base mt-1 block">
                  £{(selectedWorldClub.transferBudgetEstimate / 1000000).toFixed(1)}M
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Est. Wage Outlay</span>
                <span className="text-slate-200 font-bold text-base mt-1 block">
                  £{(selectedWorldClub.wageBillWeeklyEstimate / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-normal">/wk</span>
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
              <div className="font-semibold text-slate-200">Boardroom Governance Notice</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Taking command of this club would appoint you as Chief Executive Officer and Sporting Director at {selectedWorldClub.name}. You will manage ground development at {selectedWorldClub.stadiumName}, contract renewals, debt structure, and the youth academy.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowTakeoverConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close Dossier
              </button>
              <button
                onClick={confirmTakeover}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center gap-2"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Assume Executive Command</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
