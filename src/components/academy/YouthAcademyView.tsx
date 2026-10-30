import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AcademyProspect, YouthScoutingMission } from '../../types/game';
import { 
  GraduationCap, 
  Compass, 
  TrendingUp, 
  ShieldAlert, 
  ArrowUpRight, 
  RefreshCw, 
  Award, 
  ChevronRight, 
  Plane, 
  Timer, 
  CheckCircle2, 
  Sparkles,
  Briefcase
} from 'lucide-react';

export const YouthAcademyView: React.FC = () => {
  const { 
    state, 
    upgradeYouthAcademy, 
    dispatchYouthMission, 
    setProspectTrainingFocus, 
    promoteProspectToSenior, 
    loanOutProspect, 
    recallProspectFromLoan, 
    releaseProspect, 
    triggerYouthIntake 
  } = useGame();

  const club = state.selectedClub;
  const academy = club.youthAcademy;
  const prospects = club.academyProspects;
  const missions = club.youthScoutingMissions;
  
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'ALL' | 'U16' | 'U18' | 'U21'>('ALL');
  const [selectedProspect, setSelectedProspect] = useState<AcademyProspect | null>(
    prospects[0] || null
  );
  const [promoteWage, setPromoteWage] = useState<number>(1500);
  const [promoteYears, setPromoteYears] = useState<number>(3);
  const [showPromoteModal, setShowPromoteModal] = useState<boolean>(false);
  const [loanClubInput, setLoanClubInput] = useState<string>('Rotherham United');
  const [showLoanModal, setShowLoanModal] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredProspects = prospects.filter(p => {
    if (selectedAgeGroup === 'ALL') return true;
    return p.ageGroup === selectedAgeGroup;
  });

  const u16Count = prospects.filter(p => p.ageGroup === 'U16').length;
  const u18Count = prospects.filter(p => p.ageGroup === 'U18').length;
  const u21Count = prospects.filter(p => p.ageGroup === 'U21').length;

  const handleFocusChange = (prospectId: string, focus: AcademyProspect['trainingFocus']) => {
    setProspectTrainingFocus(prospectId, focus);
    if (selectedProspect?.id === prospectId) {
      setSelectedProspect(prev => prev ? { ...prev, trainingFocus: focus } : null);
    }
    setActionNotice(`Training regime updated for player`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handlePromoteConfirm = () => {
    if (!selectedProspect) return;
    const success = promoteProspectToSenior(selectedProspect.id, promoteWage, promoteYears);
    if (success) {
      setShowPromoteModal(false);
      setActionNotice(`Graduated ${selectedProspect.name} to senior first team squad!`);
      setSelectedProspect(prospects.find(p => p.id !== selectedProspect.id) || null);
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleLoanConfirm = () => {
    if (!selectedProspect) return;
    const success = loanOutProspect(selectedProspect.id, loanClubInput);
    if (success) {
      setShowLoanModal(false);
      setActionNotice(`Dispatched ${selectedProspect.name} on developmental loan to ${loanClubInput}.`);
      setSelectedProspect(prev => prev ? { ...prev, isOnLoan: true, loanClub: loanClubInput } : null);
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRecallLoan = (prospectId: string) => {
    recallProspectFromLoan(prospectId);
    setActionNotice(`Recalled prospect back to youth training campus.`);
    if (selectedProspect?.id === prospectId) {
      setSelectedProspect(prev => prev ? { ...prev, isOnLoan: false, loanClub: undefined } : null);
    }
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleRelease = (prospectId: string) => {
    if (window.confirm('Release this prospect from the academy?')) {
      releaseProspect(prospectId);
      setActionNotice(`Prospect contract mutually terminated.`);
      setSelectedProspect(prospects.find(p => p.id !== prospectId) || null);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleIntakeClick = () => {
    const newBatch = triggerYouthIntake();
    setActionNotice(`Generated annual youth recruitment trial batch (${newBatch.length} promising prospects evaluated)!`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      {actionNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Academy Facilities & Infrastructure Header */}
      <div className="border border-slate-800 bg-[#111827] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {club.name} Youth Academy Campus
                </h1>
                <p className="text-xs text-slate-400">
                  Category {academy.categoryGrade} Academy • Under-16 to Under-21 High Performance Development Pathway
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              As Sporting Director and Chairman, your academy investments nurture sustainable home-grown assets. Upgrading campus infrastructure amplifies talent generation, improves scout accuracy, and reduces reliance on inflated transfer market fees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleIntakeClick}
              className="px-3.5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Host Youth Trials</span>
            </button>

            <button
              onClick={upgradeYouthAcademy}
              disabled={Boolean(academy.isUpgrading) || club.finances.bankBalance < academy.upgradeCost || academy.academyLevel >= 5}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <TrendingUp className="w-4 h-4" />
              <span>
                {academy.isUpgrading
                  ? `Campus Expansion (${academy.upgradeWeeksRemaining || 0}w left)`
                  : academy.academyLevel >= 5
                  ? 'Max Academy Level (5/5)'
                  : `Upgrade to Lvl ${academy.academyLevel + 1} (£${(academy.upgradeCost / 1000000).toFixed(1)}M)`}
              </span>
            </button>
          </div>
        </div>

        {/* Academy Key Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Facility Quality</div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              Level {academy.academyLevel} <span className="text-xs text-slate-500 font-normal">/ 5</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all" 
                style={{ width: `${(academy.academyLevel / 5) * 100}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 font-medium">Scouting Network Reach</div>
            <div className="text-sm font-bold text-white mt-1 truncate">
              {academy.scoutingNetworkReach}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">
              Category {academy.categoryGrade} Certified
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 font-medium">Campus Condition</div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {academy.condition}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              £{(academy.weeklyOperatingCost / 1000).toFixed(0)}k/wk upkeep
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 font-medium">Recent First-Team Graduates</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-1">
              {academy.recentGraduatesCount} <span className="text-xs text-slate-500 font-normal">Graduates</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Education Campus: {academy.educationCampus ? 'Operational' : 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Prospects Roster & Selected Profile + Scouting Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Prospects Squad by Age Group */}
        <div className="lg:col-span-2 border border-slate-800 bg-[#111827] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Academy Cohort Pipeline ({prospects.length} Active Talents)
              </h2>
              <p className="text-xs text-slate-400">
                Graduates train under specialized regimens to reach senior football threshold.
              </p>
            </div>

            {/* Age Group Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedAgeGroup('ALL')}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedAgeGroup === 'ALL' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({prospects.length})
              </button>
              <button
                onClick={() => setSelectedAgeGroup('U16')}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedAgeGroup === 'U16' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                U16 ({u16Count})
              </button>
              <button
                onClick={() => setSelectedAgeGroup('U18')}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedAgeGroup === 'U18' ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                U18 ({u18Count})
              </button>
              <button
                onClick={() => setSelectedAgeGroup('U21')}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedAgeGroup === 'U21' ? 'bg-slate-800 text-purple-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                U21 ({u21Count})
              </button>
            </div>
          </div>

          {/* Prospects Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold pb-2">
                  <th className="py-2.5 px-3">Player</th>
                  <th className="py-2.5 px-2">Age / Group</th>
                  <th className="py-2.5 px-2">Pos</th>
                  <th className="py-2.5 px-2 text-center">CA</th>
                  <th className="py-2.5 px-2 text-center">Potential Range</th>
                  <th className="py-2.5 px-2">Training Focus</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredProspects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                      No prospects in this age bracket. Host youth trials or dispatch scouting missions to find new recruits.
                    </td>
                  </tr>
                ) : (
                  filteredProspects.map(prospect => {
                    const isSelected = selectedProspect?.id === prospect.id;
                    return (
                      <tr
                        key={prospect.id}
                        onClick={() => setSelectedProspect(prospect)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-950/30' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-3 font-sans">
                          <div className="font-semibold text-white">{prospect.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <span>{prospect.nationality}</span>
                            <span>•</span>
                            <span className="text-slate-500">{prospect.personality}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-mono">
                          <span className="text-slate-300 font-semibold">{prospect.age} y/o</span>
                          <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            prospect.ageGroup === 'U16' ? 'bg-emerald-900/40 text-emerald-300' :
                            prospect.ageGroup === 'U18' ? 'bg-sky-900/40 text-sky-300' :
                            'bg-purple-900/40 text-purple-300'
                          }`}>
                            {prospect.ageGroup}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-slate-200">
                            {prospect.position}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-emerald-400">
                          {prospect.currentAbility}
                        </td>
                        <td className="py-3 px-2 text-center font-mono">
                          <span className="text-amber-400 font-bold">
                            {prospect.potentialMin}-{prospect.potentialMax}
                          </span>
                          <div className="w-16 mx-auto bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                            <div 
                              className="bg-amber-400 h-full" 
                              style={{ width: `${(prospect.potentialMax / 100) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-2 font-sans">
                          <select
                            value={prospect.trainingFocus}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleFocusChange(prospect.id, e.target.value as AcademyProspect['trainingFocus'])}
                            className="bg-slate-900 border border-slate-700 text-[11px] text-slate-200 rounded px-2 py-1 outline-none focus:border-emerald-500"
                          >
                            <option value="Balanced">Balanced</option>
                            <option value="Technical Mastery">Technical Mastery</option>
                            <option value="Physical Conditioning">Physical Conditioning</option>
                            <option value="Tactical Discipline">Tactical Discipline</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 font-sans">
                          {prospect.isOnLoan ? (
                            <span className="text-[11px] text-sky-400 font-mono">
                              Loan: {prospect.loanClub}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Active Campus
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <ChevronRight className="w-4 h-4 text-slate-500 inline" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Selected Prospect Profile Card & Executive Controls */}
        <div className="space-y-6">
          {selectedProspect ? (
            <div className="border border-slate-800 bg-[#111827] rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-mono text-emerald-400 tracking-wider uppercase font-semibold">
                    {selectedProspect.ageGroup} Prospect Dossier
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {selectedProspect.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedProspect.age} years old • {selectedProspect.nationality} • {selectedProspect.position}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Scouted Ceiling</div>
                  <div className="text-base font-bold font-mono text-amber-400">
                    {selectedProspect.potentialMin}-{selectedProspect.potentialMax} PA
                  </div>
                </div>
              </div>

              {/* Progress & Development Attributes */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Ability (CA):</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedProspect.currentAbility} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all" 
                    style={{ width: `${selectedProspect.currentAbility}%` }} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Personality</span>
                    <span className="text-white font-medium text-xs mt-0.5 block">{selectedProspect.personality}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Archetype</span>
                    <span className="text-emerald-400 font-mono text-xs mt-0.5 block font-bold">
                      {selectedProspect.archetype}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-300">Academy Director Assessment</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {selectedProspect.currentAbility >= 65 
                      ? 'Possesses immediate first-team utility. Ready to transition from academy football to senior championship standards.'
                      : selectedProspect.potentialMax >= 82
                      ? 'Elite generational ceiling. Needs high-intensity training and potential senior loan spell to accelerate progression.'
                      : 'Solid technical fundamentals. Suited to further age-group coaching before evaluating professional graduation.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setShowPromoteModal(true)}
                  disabled={selectedProspect.isOnLoan}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Promote to Senior First Team</span>
                </button>

                {selectedProspect.isOnLoan ? (
                  <button
                    onClick={() => handleRecallLoan(selectedProspect.id)}
                    className="w-full py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 text-sky-400" />
                    <span>Recall from Loan ({selectedProspect.loanClub})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoanModal(true)}
                    className="w-full py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>Send on Developmental Loan</span>
                  </button>
                )}

                <button
                  onClick={() => handleRelease(selectedProspect.id)}
                  className="w-full py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
                >
                  Release Player
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-slate-800 bg-[#111827] rounded-xl p-8 text-center text-slate-500 text-xs">
              Select a player from the academy cohort to view development assessment and manage career pathway.
            </div>
          )}

          {/* Youth Scouting Expeditions Card */}
          <div className="border border-slate-800 bg-[#111827] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Youth Scouting Missions
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {missions.length} active
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Dispatch international talent scouts to discover wonderkids before they enter elite European transfer radars.
            </p>

            {/* Active missions list */}
            {missions.length > 0 && (
              <div className="space-y-2">
                {missions.map(m => (
                  <div key={m.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white capitalize">{m.region}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <Timer className="w-3.5 h-3.5 text-amber-400" />
                        <span>{m.weeksRemaining} weeks remaining</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-medium">
                      In Progress
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Dispatch Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => dispatchYouthMission('Local Grassroots')}
                disabled={club.finances.bankBalance < 50000}
                className="p-2 text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              >
                <div className="text-xs font-semibold text-white">Local Grassroots</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">£50k • 4 Weeks</div>
              </button>

              <button
                onClick={() => dispatchYouthMission('National Academy Network')}
                disabled={club.finances.bankBalance < 150000}
                className="p-2 text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              >
                <div className="text-xs font-semibold text-white">National Network</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">£150k • 6 Weeks</div>
              </button>

              <button
                onClick={() => dispatchYouthMission('Continental Europe')}
                disabled={club.finances.bankBalance < 400000}
                className="p-2 text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              >
                <div className="text-xs font-semibold text-white">Continental Europe</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">£400k • 8 Weeks</div>
              </button>

              <button
                onClick={() => dispatchYouthMission('Global Wonderkid Expedition')}
                disabled={club.finances.bankBalance < 850000}
                className="p-2 text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              >
                <div className="text-xs font-semibold text-amber-400">Global Wonderkids</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">£850k • 10 Weeks</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Modal */}
      {showPromoteModal && selectedProspect && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Graduate to Senior Squad
              </h3>
              <button onClick={() => setShowPromoteModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Offer a professional first-team contract to <strong className="text-white">{selectedProspect.name}</strong> ({selectedProspect.position}, CA: {selectedProspect.currentAbility}).
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Weekly Wage (£):</label>
                <input
                  type="number"
                  step="500"
                  min="500"
                  value={promoteWage}
                  onChange={(e) => setPromoteWage(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Contract Duration (Years):</label>
                <select
                  value={promoteYears}
                  onChange={(e) => setPromoteYears(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono"
                >
                  <option value={2}>2 Years</option>
                  <option value={3}>3 Years</option>
                  <option value={4}>4 Years</option>
                  <option value={5}>5 Years</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowPromoteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePromoteConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Sign First-Team Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loan Modal */}
      {showLoanModal && selectedProspect && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Arrange Developmental Loan
              </h3>
              <button onClick={() => setShowLoanModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Send <strong className="text-white">{selectedProspect.name}</strong> out on loan to gain crucial first-team competitive minutes.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Borrowing Club:</label>
                <input
                  type="text"
                  value={loanClubInput}
                  onChange={(e) => setLoanClubInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-sans"
                  placeholder="e.g. Carlisle United, Blackpool, Plymouth Argyle"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowLoanModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleLoanConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg"
              >
                Confirm Loan Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
