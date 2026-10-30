import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, TacticalStyle, Position } from '../../types/game';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Activity, 
  GraduationCap, 
  Compass, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign,
  ChevronDown
} from 'lucide-react';

export const SportingDirectorView: React.FC = () => {
  const { 
    state, 
    setTacticalDirective, 
    upgradeStaff, 
    renewPlayerContract, 
    sellPlayer 
  } = useGame();

  const club = state.selectedClub;
  const coach = club.headCoach;
  const staff = club.staff;

  const [posFilter, setPosFilter] = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'ATT'>('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [renewYears, setRenewYears] = useState(2);
  const [renewWage, setRenewWage] = useState(60000);

  const tacticalStyles: TacticalStyle[] = [
    'High-Intensity Press',
    'Positional Tiki-Taka',
    'Direct Counter-Attack',
    'Pragmatic Low Block',
    'Fluid Wing Play',
  ];

  const handleOpenContractModal = (player: Player) => {
    setSelectedPlayer(player);
    setRenewWage(Math.round(player.wage * 1.15));
    setRenewYears(2);
  };

  const handleConfirmRenewal = () => {
    if (!selectedPlayer) return;
    renewPlayerContract(selectedPlayer.id, renewWage, renewYears);
    setSelectedPlayer(null);
  };

  const filteredPlayers = club.players.filter(player => {
    if (posFilter === 'ALL') return true;
    if (posFilter === 'GK') return player.position === 'GK';
    if (posFilter === 'DEF') return ['CB', 'LB', 'RB'].includes(player.position);
    if (posFilter === 'MID') return ['DM', 'CM', 'AM'].includes(player.position);
    if (posFilter === 'ATT') return ['LW', 'RW', 'ST'].includes(player.position);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Head Coach Mandate & Executive Staff Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Head Coach Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Appointed Head Coach</span>
              <h3 className="text-base font-bold text-white mt-0.5">{coach.name}</h3>
              <span className="text-xs text-slate-400">{coach.nationality} · {coach.age} years old</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
              Job Security: {coach.jobSecurity}%
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1.5">Sporting Director Tactical Directive</label>
              <select
                value={club.tacticalDirective}
                onChange={e => setTacticalDirective(e.target.value as TacticalStyle)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-medium text-xs focus:ring-1 focus:ring-emerald-500"
              >
                {tacticalStyles.map(style => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                The Head Coach manages starting lineups and in-game matches adhering to this philosophy.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Tactical Acumen</span>
                <span className="text-white font-bold">{coach.tacticalAcumen}/20</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Youth Integration</span>
                <span className="text-white font-bold">{coach.youthDevelopment}/20</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Staff Departments */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sporting & Medical Department Leads</h3>
            <span className="text-xs text-slate-400">Upgrade Cost: £850,000 / department</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Chief Scout */}
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-semibold">Chief Scout</span>
                  <span className="font-mono text-white font-bold">Lvl {staff.chiefScout.level}/5</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">{staff.chiefScout.name}</div>
                <div className="text-[11px] text-slate-400 mt-1">Accuracy: {staff.chiefScout.scoutingAccuracy}%</div>
              </div>
              <button
                onClick={() => upgradeStaff('chiefScout')}
                disabled={staff.chiefScout.level >= 5 || club.finances.bankBalance < 850000}
                className="w-full py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded transition-colors"
              >
                {staff.chiefScout.level >= 5 ? 'Max Level' : 'Upgrade Scout'}
              </button>
            </div>

            {/* Head Physio */}
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-semibold">Head Physio</span>
                  <span className="font-mono text-white font-bold">Lvl {staff.headPhysio.level}/5</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">{staff.headPhysio.name}</div>
                <div className="text-[11px] text-slate-400 mt-1">Recovery Bonus: +{staff.headPhysio.recoverySpeedBonus}%</div>
              </div>
              <button
                onClick={() => upgradeStaff('headPhysio')}
                disabled={staff.headPhysio.level >= 5 || club.finances.bankBalance < 850000}
                className="w-full py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded transition-colors"
              >
                {staff.headPhysio.level >= 5 ? 'Max Level' : 'Upgrade Physio'}
              </button>
            </div>

            {/* Academy Director */}
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-semibold">Academy Director</span>
                  <span className="font-mono text-white font-bold">Lvl {staff.academyDirector.level}/5</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">{staff.academyDirector.name}</div>
                <div className="text-[11px] text-slate-400 mt-1">Intake Quality: {staff.academyDirector.talentIntakeQuality}%</div>
              </div>
              <button
                onClick={() => upgradeStaff('academyDirector')}
                disabled={staff.academyDirector.level >= 5 || club.finances.bankBalance < 850000}
                className="w-full py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded transition-colors"
              >
                {staff.academyDirector.level >= 5 ? 'Max Level' : 'Upgrade Academy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Senior Squad Roster */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">First-Team Playing Squad</h3>
            <span className="text-xs text-slate-400">{club.players.length} Registered Senior Professionals</span>
          </div>

          {/* Position Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {(['ALL', 'GK', 'DEF', 'MID', 'ATT'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setPosFilter(tab)}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  posFilter === tab ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="pb-2.5">Player</th>
                <th className="pb-2.5">Pos</th>
                <th className="pb-2.5">Age</th>
                <th className="pb-2.5">OVR / POT</th>
                <th className="pb-2.5">Weekly Wage</th>
                <th className="pb-2.5">Market Value</th>
                <th className="pb-2.5">Contract</th>
                <th className="pb-2.5">Condition</th>
                <th className="pb-2.5 text-right">Executive Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPlayers.map(player => (
                <tr key={player.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {player.academyGraduate && (
                        <span className="text-[10px] text-emerald-400 font-semibold" title="Homegrown Academy Graduate">
                          [HG]
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{player.nationality}</span>
                  </td>
                  <td className="py-2.5">
                    <span className="font-mono font-bold text-slate-300">{player.position}</span>
                  </td>
                  <td className="py-2.5 font-mono text-slate-300">{player.age}</td>
                  <td className="py-2.5 font-mono font-bold tabular-nums">
                    <span className="text-white">{player.overall}</span>
                    <span className="text-slate-500 font-normal"> / </span>
                    <span className="text-emerald-400">{player.potential}</span>
                  </td>
                  <td className="py-2.5 font-mono text-slate-300 tabular-nums">
                    £{(player.wage / 1000).toFixed(0)}k/wk
                  </td>
                  <td className="py-2.5 font-mono text-emerald-400 font-medium tabular-nums">
                    £{(player.marketValue / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-2.5 font-mono text-slate-300">
                    {player.contractYears} yrs
                  </td>
                  <td className="py-2.5">
                    {player.isInjured ? (
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Injured ({player.injuryWeeks}w)</span>
                      </span>
                    ) : (
                      <span className="text-slate-300 font-mono">{player.fitness}% Fit</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenContractModal(player)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap"
                      >
                        Renew
                      </button>
                      <button
                        onClick={() => sellPlayer(player.id, Math.round(player.marketValue * 0.95))}
                        className="px-2.5 py-1 text-xs font-semibold text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 rounded transition-colors whitespace-nowrap"
                      >
                        Cash In
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Renewal Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-xl max-w-sm w-full p-5 space-y-4">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Contract Extension</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedPlayer.name}</h3>
              <span className="text-xs text-slate-400">Current: £{(selectedPlayer.wage / 1000).toFixed(0)}k/wk · {selectedPlayer.contractYears} yrs remaining</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Proposed Weekly Wage (£)</label>
                <input
                  type="number"
                  step="5000"
                  min="10000"
                  max="300000"
                  value={renewWage}
                  onChange={e => setRenewWage(Number(e.target.value))}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Additional Years</label>
                <select
                  value={renewYears}
                  onChange={e => setRenewYears(Number(e.target.value))}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                >
                  <option value={1}>+1 Year Extension</option>
                  <option value={2}>+2 Years Extension</option>
                  <option value={3}>+3 Years Extension</option>
                  <option value={4}>+4 Years Extension</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPlayer(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRenewal}
                className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
              >
                Sign Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
