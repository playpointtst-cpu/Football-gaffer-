import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player } from '../../types/game';
import { 
  Building2, 
  Sparkles, 
  Sun, 
  Droplets, 
  Lightbulb, 
  Zap, 
  GraduationCap, 
  Activity, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Ticket, 
  Store,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const StadiumGroundView: React.FC = () => {
  const { 
    state, 
    commissionStandUpgrade, 
    investInSustainability, 
    investInAmenity, 
    updateTicketPrices,
    upgradeTrainingGround,
    upgradeYouthAcademy,
    promoteYouthPlayer,
    triggerYouthIntake
  } = useGame();

  const club = state.selectedClub;
  const stadium = club.stadium;
  const sust = stadium.sustainability;
  const amenities = stadium.amenities;
  const tg = club.trainingGround;
  const ya = club.youthAcademy;

  const [activeTab, setActiveTab] = useState<'stands' | 'training' | 'academy' | 'sustainability' | 'amenities' | 'tickets'>('stands');
  const [ticketGenInput, setTicketGenInput] = useState(stadium.ticketPrices.generalAdmission);
  const [ticketSeasonInput, setTicketSeasonInput] = useState(stadium.ticketPrices.seasonTicket);
  const [ticketVipInput, setTicketVipInput] = useState(stadium.ticketPrices.vipHospitality);

  // Youth intake reveal modal
  const [intakeProdigies, setIntakeProdigies] = useState<Player[] | null>(null);

  const handleSaveTickets = () => {
    updateTicketPrices(ticketGenInput, ticketSeasonInput, ticketVipInput);
  };

  const handleOpenYouthIntake = () => {
    const batch = triggerYouthIntake();
    setIntakeProdigies(batch);
  };

  const handlePromoteKid = (kid: Player) => {
    promoteYouthPlayer(kid);
    setIntakeProdigies(prev => prev ? prev.filter(p => p.id !== kid.id) : null);
  };

  return (
    <div className="space-y-6">
      {/* Infrastructure Top Overview Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#111827] to-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
              <span>{club.city} Sporting Campus</span>
              <span aria-hidden="true">·</span>
              <span>Total Ground Capacity: {stadium.totalCapacity.toLocaleString()} Seats</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{stadium.name}</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Centralized stadium, training campus, and academy operations. Balance matchday capacity expansions with sports science facilities and eco-infrastructure sustainability.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Pitch Quality</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{stadium.pitchCondition}%</span>
              <span className="text-[10px] text-slate-500 block">{sust.hybridTurfSystem ? 'Hybrid Grass' : 'Standard'}</span>
            </div>
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Green Rating</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{sust.greenRatingScore}/100</span>
              <span className="text-[10px] text-slate-500 block">£{(sust.weeklyUtilityCostReduction / 1000).toFixed(1)}k/wk saved</span>
            </div>
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Academy Grade</span>
              <span className="text-lg font-bold font-mono text-emerald-400">Cat {ya?.categoryGrade || 1}</span>
              <span className="text-[10px] text-slate-500 block">Level {ya?.academyLevel || 4} of 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ground Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('stands')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'stands' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Stadium Stands & Capacity
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'training' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          First-Team Training Ground
        </button>
        <button
          onClick={() => setActiveTab('academy')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'academy' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Youth Academy Incubator
        </button>
        <button
          onClick={() => setActiveTab('sustainability')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'sustainability' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Pitch & Eco-Sustainability
        </button>
        <button
          onClick={() => setActiveTab('amenities')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'amenities' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Commercial Ground Assets
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'tickets' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Ticket & Pricing Strategy
        </button>
      </div>

      {/* TAB 1: Stadium Stands & Capacity */}
      {activeTab === 'stands' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stadium.stands.map(stand => {
              const canAfford = club.finances.bankBalance >= stand.upgradeCost;
              const isMax = stand.capacity >= stand.maxCapacity;

              return (
                <div key={stand.id} className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{stand.name}</h4>
                      <span className="text-xs text-slate-400 mt-0.5 block">
                        Condition: <span className="font-mono text-emerald-400 font-semibold">{stand.condition}%</span>
                      </span>
                    </div>

                    {stand.isUpgrading ? (
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Work underway ({stand.upgradeWeeksRemaining}w left)</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                        {stand.vipBoxes} VIP Boxes
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Seated Capacity:</span>
                      <span className="font-mono font-bold text-white">{stand.capacity.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Architectural Max Ceiling:</span>
                      <span className="font-mono text-slate-400">{stand.maxCapacity.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Safe Standing Rails:</span>
                      <span className={stand.safeStandingEnabled ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                        {stand.safeStandingEnabled ? 'Enabled' : 'All-Seater'}
                      </span>
                    </div>
                    {/* Capacity progress */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div 
                        className="bg-emerald-500 h-full rounded-full" 
                        style={{ width: `${(stand.capacity / stand.maxCapacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Expansion Cost (+2,500 seats)</span>
                      <span className="font-mono text-xs font-bold text-white">
                        £{(stand.upgradeCost / 1000000).toFixed(1)}M
                      </span>
                    </div>

                    <button
                      onClick={() => commissionStandUpgrade(stand.id)}
                      disabled={isMax || stand.isUpgrading || !canAfford}
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg transition-colors"
                    >
                      {isMax ? 'Max Capacity Reached' : stand.isUpgrading ? 'Under Construction' : 'Commission Expansion'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: First-Team Training Ground */}
      {activeTab === 'training' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">High-Performance Center</span>
                <h3 className="text-base font-bold text-white mt-0.5">{tg?.name || 'Club Training Campus'}</h3>
              </div>

              {tg?.isUpgrading ? (
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Upgrading ({tg.upgradeWeeksRemaining}w left)</span>
                </span>
              ) : (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-lg">
                  Level {tg?.level || 3} of 5
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300">
              Investing in elite sports science recovery suites and tactical video auditoriums directly accelerates injured player rehabilitation velocity, raises baseline squad matchday fitness, and elevates dressing room morale.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400 font-medium">Sports Science & Hydrotherapy</span>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  Grade {tg?.sportsScienceLevel || 3} / 5
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Cuts muscular recovery times by +{((tg?.sportsScienceLevel || 1) * 6)}%
                </span>
              </div>

              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400 font-medium">Tactical Video Analysis Suite</span>
                <div className="text-lg font-bold text-white mt-1">
                  {tg?.tacticalAnalysisSuite ? 'Full Biometric Lab' : 'Standard'}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Boosts Head Coach tactical execution rating
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Campus Modernization Project (Level {(tg?.level || 3) + 1})</span>
                <div className="font-mono text-sm font-bold text-white mt-0.5">
                  Cost: £{((tg?.upgradeCost || 7000000) / 1000000).toFixed(1)}M · Duration: {tg?.upgradeWeeks || 6} weeks
                </div>
              </div>

              <button
                onClick={upgradeTrainingGround}
                disabled={tg?.isUpgrading || (tg?.level || 0) >= 5 || club.finances.bankBalance < (tg?.upgradeCost || 0)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap"
              >
                {(tg?.level || 0) >= 5 ? 'Max Level Reached' : tg?.isUpgrading ? 'Upgrade in Progress' : 'Upgrade Training Complex'}
              </button>
            </div>
          </div>

          {/* Tangible benefits panel */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Tangible Squad Impact</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Accelerated Rehabilitation</span>
                </div>
                <p className="text-slate-400">
                  Players return from soft-tissue and ligament injuries 20-35% faster, reducing games missed.
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Dressing Room Morale</span>
                </div>
                <p className="text-slate-400">
                  Elite hydrotherapy and cryo recovery facilities provide permanent +8 squad morale boosts.
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Weekly Operating Overhead</span>
                </div>
                <p className="text-slate-400 font-mono">
                  £{(tg?.weeklyOperatingCost || 30000).toLocaleString()} / week
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Youth Academy Incubator */}
      {activeTab === 'academy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Academy & Education Campus</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{ya?.name || 'Club Academy'}</h3>
                </div>

                {ya?.isUpgrading ? (
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-lg flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Upgrading ({ya.upgradeWeeksRemaining}w left)</span>
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-lg">
                    Category {ya?.categoryGrade || 1} Elite
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300">
                The lifeblood of club financial sustainability. High-tier academy facilities accelerate development curves for players under 21, produce generational wonderkids, and provide homegrown quota compliance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Academy Level</span>
                  <span className="font-mono font-bold text-white text-base">Level {ya?.academyLevel || 4} of 5</span>
                </div>
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Scouting Reach</span>
                  <span className="font-medium text-emerald-400 text-xs block truncate mt-1">{ya?.scoutingNetworkReach}</span>
                </div>
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Senior Graduates</span>
                  <span className="font-mono font-bold text-white text-base">{ya?.recentGraduatesCount || 6} Players</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Expand Academy Campus (Level {(ya?.academyLevel || 4) + 1})</span>
                  <div className="font-mono text-sm font-bold text-white mt-0.5">
                    Cost: £{((ya?.upgradeCost || 9000000) / 1000000).toFixed(1)}M · Duration: {ya?.upgradeWeeks || 8} weeks
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenYouthIntake}
                    className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Review Youth Intake
                  </button>

                  <button
                    onClick={upgradeYouthAcademy}
                    disabled={ya?.isUpgrading || (ya?.academyLevel || 0) >= 5 || club.finances.bankBalance < (ya?.upgradeCost || 0)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Upgrade Academy
                  </button>
                </div>
              </div>
            </div>

            {/* Active Homegrown Graduates */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Homegrown First-Team Talent</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {club.players.filter(p => p.academyGraduate).map(grad => (
                  <div key={grad.id} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{grad.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {grad.position} · {grad.age}yo · OVR: <span className="font-mono text-white font-bold">{grad.overall}</span> (Pot: {grad.potential})
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">£{(grad.marketValue / 1000000).toFixed(1)}M</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Pitch & Eco-Sustainability */}
      {activeTab === 'sustainability' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pitch Technology */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white">Pitch Technology & Drainage</h4>
                <span className="text-xs text-emerald-400 font-mono font-bold">{stadium.pitchCondition}% Rating</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                  <div>
                    <div className="font-bold text-white">Hybrid Desso GrassMaster Turf</div>
                    <span className="text-slate-400 text-[11px]">Reinforced synthetic-natural turf fibers. Cuts player injury risk by 50%.</span>
                  </div>
                  {sust.hybridTurfSystem ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <button
                      onClick={() => investInSustainability('hybridTurf')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0"
                    >
                      Install (£3.8M)
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                  <div>
                    <div className="font-bold text-white">Geothermal Undersoil Heating</div>
                    <span className="text-slate-400 text-[11px]">Prevents pitch freezing during sub-zero winter fixtures.</span>
                  </div>
                  {sust.undersoilHeating ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <button
                      onClick={() => investInSustainability('undersoil')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0"
                    >
                      Install (£2.2M)
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                  <div>
                    <div className="font-bold text-white">Vacuum Sub-Air Aeration Drainage</div>
                    <span className="text-slate-400 text-[11px]">Evacuates standing water in torrential downpours.</span>
                  </div>
                  {sust.subAirDrainage ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <button
                      onClick={() => investInSustainability('drainage')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0"
                    >
                      Install (£1.9M)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Eco Sustainability & Utility Savings */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white">Net-Zero Eco Infrastructure</h4>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Weekly Savings: £{sust.weeklyUtilityCostReduction.toLocaleString()}/wk
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                  <div>
                    <div className="font-bold text-white">Roof Solar Array Microgrid (Tier {sust.solarArrayLevel}/3)</div>
                    <span className="text-slate-400 text-[11px]">Generates clean stadium power and offsets monthly utility tariffs.</span>
                  </div>
                  {sust.solarArrayLevel >= 3 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <button
                      onClick={() => investInSustainability('solarArray')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0"
                    >
                      Upgrade (£7.5M)
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                  <div>
                    <div className="font-bold text-white">Rainwater Harvesting System</div>
                    <span className="text-slate-400 text-[11px]">Recycles roof runoff for pitch irrigation and concourses.</span>
                  </div>
                  {sust.rainwaterHarvesting ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <button
                      onClick={() => investInSustainability('rainwater')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0"
                    >
                      Install (£1.8M)
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                  <div>
                    <div className="font-bold text-white">Zero-Waste Reusable Cup & Compost System</div>
                    <span className="text-slate-400 text-[11px]">Eliminates single-use stadium plastics and cuts waste disposal tariffs.</span>
                  </div>
                  {sust.zeroWasteProgram ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <button
                      onClick={() => investInSustainability('zeroWaste')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0"
                    >
                      Install (£950k)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Commercial Ground Assets */}
      {activeTab === 'amenities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white pb-3 border-b border-slate-800">Matchday Commercial Concourse</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                <div>
                  <div className="font-bold text-white">Club Superstore & Merchandising (Tier {amenities.megaStoreLevel}/4)</div>
                  <span className="text-slate-400 text-[11px]">Generates replica kit sales and matchday retail spending.</span>
                </div>
                {amenities.megaStoreLevel >= 4 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <button
                    onClick={() => investInAmenity('megaStoreLevel')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0"
                  >
                    Upgrade (£4.0M)
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                <div>
                  <div className="font-bold text-white">Fan Zone & Artisan Craft Brewery Terrace</div>
                  <span className="text-slate-400 text-[11px]">Boosts pre-match supporter dwell time and concession margins (+£4/head).</span>
                </div>
                {amenities.craftBreweryFanZone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <button
                    onClick={() => investInAmenity('craftBreweryFanZone')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0"
                  >
                    Build (£2.8M)
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white pb-3 border-b border-slate-800">Non-Matchday Commercial Yields</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                <div>
                  <div className="font-bold text-white">Club Heritage Museum & Stadium Tour Complex</div>
                  <span className="text-slate-400 text-[11px]">Draws 120,000+ tourists annually during non-matchday weeks.</span>
                </div>
                {amenities.museumAndTourCenter ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <button
                    onClick={() => investInAmenity('museumAndTourCenter')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0"
                  >
                    Build (£3.5M)
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
                <div>
                  <div className="font-bold text-white">Executive Conference & Events Hub</div>
                  <span className="text-slate-400 text-[11px]">Hosts corporate symposiums and trade exhibitions on weekdays.</span>
                </div>
                {amenities.corporateConferenceCenter ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <button
                    onClick={() => investInAmenity('corporateConferenceCenter')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0"
                  >
                    Build (£5.2M)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Ticket & Pricing Strategy */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ticketing Policy & Price Elasticity</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set ticket pricing across tiers. Excessive prices depress local fan attendance and trust; low prices reduce gate receipts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">General Admission Match Ticket</span>
                  <span className="font-mono text-emerald-400 font-bold">£{ticketGenInput} / match</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="95"
                  step="1"
                  value={ticketGenInput}
                  onChange={e => setTicketGenInput(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-500">Benchmark: £45 - £55 across top flight</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Adult Season Ticket</span>
                  <span className="font-mono text-emerald-400 font-bold">£{ticketSeasonInput} / season</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1600"
                  step="20"
                  value={ticketSeasonInput}
                  onChange={e => setTicketSeasonInput(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-500">Currently allocated: {stadium.seasonTicketHolders.toLocaleString()} holders</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">VIP Executive Skybox Hospitality</span>
                  <span className="font-mono text-emerald-400 font-bold">£{ticketVipInput} / match</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="600"
                  step="10"
                  value={ticketVipInput}
                  onChange={e => setTicketVipInput(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-500">High margin corporate clientele</span>
              </div>
            </div>

            <button
              onClick={handleSaveTickets}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
            >
              Update Ticketing Policy
            </button>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Attendance & Yield Simulation</h4>
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Average Capacity Utilization:</span>
                <span className="font-mono text-white font-bold">
                  {Math.round((stadium.averageAttendance / stadium.totalCapacity) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average Matchday Gate Receipts:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  £{(club.finances.weeklyMatchdayIncomeAvg / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Supporters Trust Sentiment:</span>
                <span className={ticketGenInput > 65 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {ticketGenInput > 65 ? 'Friction (High pricing complaints)' : 'Supportive & Loyal'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Youth Intake Reveal Modal */}
      {intakeProdigies && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Annual Youth Intake</span>
                <h3 className="text-base font-bold text-white mt-0.5">Scouted Academy Graduates</h3>
              </div>
              <button
                onClick={() => setIntakeProdigies(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              The Academy Director presents the most promising prospects from this year’s youth intake trial matches.
            </p>

            <div className="space-y-2.5">
              {intakeProdigies.map(kid => (
                <div key={kid.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{kid.name}</span>
                      <span className="text-emerald-400 text-[11px]">({kid.position}, {kid.age}yo)</span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      OVR: <span className="font-mono text-white font-bold">{kid.overall}</span> · Potential:{' '}
                      <span className="font-mono text-emerald-400 font-bold">{kid.potential}</span> · Wage: £{(kid.wage / 1000).toFixed(1)}k/wk
                    </div>
                  </div>

                  <button
                    onClick={() => handlePromoteKid(kid)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Sign Professional Contract
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
