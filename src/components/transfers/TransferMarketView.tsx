import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Position } from '../../types/game';
import { 
  Users, 
  Search, 
  DollarSign, 
  ArrowRightLeft, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Award,
  ChevronRight,
  Filter,
  Eye,
  Sliders,
  Sparkles,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

export const TransferMarketView: React.FC = () => {
  const { state, scoutedPlayers, buyPlayer, sellPlayer, scoutTargetPlayer, reallocateBudget } = useGame();
  const club = state.selectedClub;
  const transferBudget = club.finances.transferBudget;
  const availableWageHeadroom = club.finances.remainingWageBudget;

  const [activeTab, setActiveTab] = useState<'BUY' | 'SELL' | 'BUDGET_ALLOCATION'>('BUY');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'LISTED' | 'WONDERKID' | 'EXPIRING'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Scouting Modal State
  const [inspectedPlayer, setInspectedPlayer] = useState<Player | null>(null);

  // Negotiation Modal State
  const [targetToNegotiate, setTargetToNegotiate] = useState<Player | null>(null);
  const [negotiationStep, setNegotiationStep] = useState<'CLUB_OFFER' | 'AGENT_CONTRACT'>('CLUB_OFFER');
  
  // Step 1: Club Offer Inputs
  const [bidFee, setBidFee] = useState<number>(0);
  const [addOnsFee, setAddOnsFee] = useState<number>(0);
  const [sellOnPercentage, setSellOnPercentage] = useState<number>(10);
  const [clubResponseStatus, setClubResponseStatus] = useState<'IDLE' | 'ACCEPTED' | 'COUNTER' | 'REJECTED'>('IDLE');
  const [counterFee, setCounterFee] = useState<number>(0);

  // Step 2: Player & Agent Contract Inputs
  const [offeredWage, setOfferedWage] = useState<number>(0);
  const [contractYears, setContractYears] = useState<number>(3);
  const [signingBonus, setSigningBonus] = useState<number>(0);
  const [squadRole, setSquadRole] = useState<'Key Player' | 'First Team Regular' | 'Squad Rotation' | 'Future Prospect'>('First Team Regular');
  const [agentFeedback, setAgentFeedback] = useState<string | null>(null);

  // Budget Reallocation State
  const [reallocSliderValue, setReallocSliderValue] = useState<number>(0); // in millions £
  const [notice, setNotice] = useState<{ message: string; isError?: boolean } | null>(null);

  const positions = ['ALL', 'GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'AM', 'RW', 'LW', 'ST'];

  // Squad depth by position analysis
  const squadDepth = useMemo(() => {
    const depthMap: Record<Position, { count: number; avgOvr: number }> = {
      GK: { count: 0, avgOvr: 0 },
      CB: { count: 0, avgOvr: 0 },
      LB: { count: 0, avgOvr: 0 },
      RB: { count: 0, avgOvr: 0 },
      DM: { count: 0, avgOvr: 0 },
      CM: { count: 0, avgOvr: 0 },
      AM: { count: 0, avgOvr: 0 },
      LW: { count: 0, avgOvr: 0 },
      RW: { count: 0, avgOvr: 0 },
      ST: { count: 0, avgOvr: 0 },
    };

    club.players.forEach(p => {
      if (depthMap[p.position]) {
        depthMap[p.position].count += 1;
        depthMap[p.position].avgOvr += p.overall;
      }
    });

    Object.keys(depthMap).forEach(key => {
      const pos = key as Position;
      if (depthMap[pos].count > 0) {
        depthMap[pos].avgOvr = Math.round(depthMap[pos].avgOvr / depthMap[pos].count);
      }
    });

    return depthMap;
  }, [club.players]);

  // Filter available targets
  const filteredScouted = useMemo(() => {
    return scoutedPlayers.filter(p => {
      if (selectedPosition !== 'ALL' && p.position !== selectedPosition) return false;
      if (selectedFilter === 'LISTED' && !p.isTransferListed) return false;
      if (selectedFilter === 'WONDERKID' && !(p.age <= 21 && p.potential >= 88)) return false;
      if (selectedFilter === 'EXPIRING' && p.contractYears > 1) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.nationality.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [scoutedPlayers, selectedPosition, selectedFilter, searchQuery]);

  const filteredSquad = useMemo(() => {
    return club.players.filter(p => {
      if (selectedPosition !== 'ALL' && p.position !== selectedPosition) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.nationality.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [club.players, selectedPosition, searchQuery]);

  // Handlers
  const handleScoutPlayer = (playerId: string) => {
    const success = scoutTargetPlayer(playerId);
    if (success) {
      setNotice({ message: 'Chief Scout report commissioned (£25,000)! Player profile fully audited.', isError: false });
      const updated = scoutedPlayers.find(p => p.id === playerId);
      if (updated) {
        setInspectedPlayer({ ...updated, scoutingStatus: 'fully_scouted' });
      }
    } else {
      setNotice({ message: 'Insufficient bank cash reserves to dispatch scout.', isError: true });
    }
    setTimeout(() => setNotice(null), 3500);
  };

  const handleStartNegotiations = (player: Player) => {
    setTargetToNegotiate(player);
    setNegotiationStep('CLUB_OFFER');
    setBidFee(player.isTransferListed ? Math.round(player.marketValue * 0.9) : player.marketValue);
    setAddOnsFee(0);
    setSellOnPercentage(10);
    setClubResponseStatus('IDLE');
    setCounterFee(0);

    setOfferedWage(Math.round(player.wage * 1.15));
    setContractYears(3);
    setSigningBonus(Math.round(player.marketValue * 0.05));
    setSquadRole(player.overall >= 82 ? 'Key Player' : 'First Team Regular');
    setAgentFeedback(null);
  };

  const handleTriggerReleaseClause = () => {
    if (!targetToNegotiate?.releaseClause) return;
    setBidFee(targetToNegotiate.releaseClause);
    setClubResponseStatus('ACCEPTED');
    setNegotiationStep('AGENT_CONTRACT');
    setAgentFeedback(`Selling club confirmed release clause activated. Enter direct contract negotiations with ${targetToNegotiate.name}'s representative.`);
  };

  const handleSubmitClubOffer = () => {
    if (!targetToNegotiate) return;

    if (bidFee > transferBudget) {
      setNotice({ message: 'Offer exceeds current available transfer budget. Reallocate funds first.', isError: true });
      setTimeout(() => setNotice(null), 3000);
      return;
    }

    const askingPrice = targetToNegotiate.isTransferListed 
      ? targetToNegotiate.marketValue * 0.88 
      : targetToNegotiate.marketValue * 1.05;

    const totalPackage = bidFee + addOnsFee * 0.5;

    if (totalPackage >= askingPrice) {
      setClubResponseStatus('ACCEPTED');
      setNegotiationStep('AGENT_CONTRACT');
      setAgentFeedback(`Bid of £${(bidFee / 1000000).toFixed(1)}M accepted by club boardroom. Now discussing personal contract terms.`);
    } else if (totalPackage >= askingPrice * 0.8) {
      const counter = Math.round(askingPrice * 0.96);
      setClubResponseStatus('COUNTER');
      setCounterFee(counter);
    } else {
      setClubResponseStatus('REJECTED');
    }
  };

  const handleFinalizeSigning = () => {
    if (!targetToNegotiate) return;

    // Check wage headroom
    if (offeredWage > availableWageHeadroom + targetToNegotiate.wage) {
      setNotice({ message: 'Wage offer exceeds payroll headroom. Reallocate transfer budget to wage margin.', isError: true });
      setTimeout(() => setNotice(null), 3500);
      return;
    }

    // Agent decision logic
    const expectedWage = targetToNegotiate.wage * 1.1;
    if (offeredWage < expectedWage * 0.9) {
      setAgentFeedback(`Agent: "My client finds £${(offeredWage / 1000).toFixed(0)}k/wk insulting for a ${squadRole}. We require at least £${(expectedWage / 1000).toFixed(0)}k/wk."`);
      return;
    }

    const result = buyPlayer(targetToNegotiate, bidFee, offeredWage, contractYears);
    if (result.success) {
      setNotice({ message: result.message, isError: false });
      setTargetToNegotiate(null);
    } else {
      setNotice({ message: result.message, isError: true });
    }
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSellConfirm = (player: Player) => {
    const offerFee = Math.round(player.marketValue * (0.92 + Math.random() * 0.22));
    if (window.confirm(`Accept incoming transfer bid of £${(offerFee / 1000000).toFixed(1)}M for ${player.name}? This sum will be credited directly to your transfer reserves.`)) {
      sellPlayer(player.id, offerFee);
      setNotice({ message: `Sold ${player.name} for £${(offerFee / 1000000).toFixed(1)}M. Payroll relieved by £${(player.wage / 1000).toFixed(0)}k/wk.`, isError: false });
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleApplyReallocation = (transferDeltaM: number) => {
    const delta = transferDeltaM * 1000000;
    reallocateBudget(delta);
    setNotice({
      message: delta > 0 
        ? `Transferred £${transferDeltaM}M from wage margin to Transfer Budget.` 
        : `Transferred £${Math.abs(transferDeltaM)}M to weekly Wage Margin (+£${Math.round(Math.abs(delta) / 52 / 1000)}k/wk).`,
      isError: false,
    });
    setReallocSliderValue(0);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className={`p-3 rounded-lg text-xs flex items-center justify-between border ${
          notice.isError 
            ? 'bg-rose-950/80 border-rose-500/40 text-rose-300' 
            : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2">
            {notice.isError ? <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Overview & Budget Control Strip */}
      <div className="border border-slate-800 bg-[#111827] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Player Transfer Market & Recruitment Hub
                </h1>
                <p className="text-xs text-slate-400">
                  Global Scouting Intelligence • Club-to-Club Bids • Personal Contract Negotiations
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              As Sporting Director and CEO, recruit elite talent, commission Chief Scout dossiers, negotiate multi-structured transfer packages, and balance wage caps to maintain sustainable financial stability.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Transfer Budget</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                £{(transferBudget / 1000000).toFixed(1)}M
              </div>
              <div className="text-[10px] text-slate-500">Available cash</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Wage Headroom</div>
              <div className={`text-lg font-bold font-mono mt-0.5 tabular-nums ${
                availableWageHeadroom >= 0 ? 'text-white' : 'text-rose-400'
              }`}>
                £{(availableWageHeadroom / 1000).toFixed(0)}k <span className="text-xs text-slate-500 font-normal">/wk</span>
              </div>
              <div className="text-[10px] text-slate-500">Margin vs Wage Cap</div>
            </div>
          </div>
        </div>

        {/* Squad Depth Matrix Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            First-Team Positional Depth & Recruitment Priorities
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {(Object.keys(squadDepth) as Position[]).map(pos => {
              const depth = squadDepth[pos];
              const isLow = depth.count <= 1;
              return (
                <div 
                  key={pos}
                  onClick={() => setSelectedPosition(pos === selectedPosition ? 'ALL' : pos)}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                    selectedPosition === pos 
                      ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300' 
                      : isLow
                      ? 'bg-amber-950/30 border-amber-800/50 hover:bg-slate-800'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">{pos}</div>
                  <div className="text-xs font-mono text-white mt-0.5 tabular-nums">{depth.count} players</div>
                  <div className={`text-[10px] font-mono mt-0.5 ${isLow ? 'text-amber-400' : 'text-slate-400'}`}>
                    Avg {depth.avgOvr || '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Toggle Strip & Position Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('BUY')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'BUY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>Market Targets ({scoutedPlayers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('SELL')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'SELL'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>First Team Outgoings ({club.players.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('BUDGET_ALLOCATION')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'BUDGET_ALLOCATION'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Budget Leverage Slider</span>
            </button>
          </div>

          {/* Quick Filter Categories */}
          {activeTab === 'BUY' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('LISTED')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedFilter === 'LISTED' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Transfer Listed
              </button>
              <button
                onClick={() => setSelectedFilter('WONDERKID')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedFilter === 'WONDERKID' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Wonderkids (U21)
              </button>
              <button
                onClick={() => setSelectedFilter('EXPIRING')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedFilter === 'EXPIRING' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Expiring Deals
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Budget Allocation Panel */}
      {activeTab === 'BUDGET_ALLOCATION' && (
        <div className="border border-slate-800 bg-[#111827] rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Executive Budget Reallocation Slider</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Shift capital between your upfront Transfer Budget and weekly Player Wage ceiling to facilitate marquee acquisitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs">
            <div className="p-3 bg-slate-950 rounded-lg space-y-2">
              <span className="text-slate-400 block text-[11px]">Current Transfer Budget</span>
              <span className="text-2xl font-bold text-emerald-400 block tabular-nums">
                £{(transferBudget / 1000000).toFixed(1)}M
              </span>
              <span className="text-slate-500 text-[10px]">Earmarked for upfront transfer fees</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg space-y-2">
              <span className="text-slate-400 block text-[11px]">Current Weekly Wage Margin</span>
              <span className="text-2xl font-bold text-white block tabular-nums">
                £{(availableWageHeadroom / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-normal">/wk</span>
              </span>
              <span className="text-slate-500 text-[10px]">Headroom under Board PSR cap</span>
            </div>
          </div>

          {/* Preset conversion buttons */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">Instant Conversion Shortcuts:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleApplyReallocation(-5)}
                disabled={transferBudget < 5000000}
                className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-left transition-colors"
              >
                <div className="text-xs font-bold text-emerald-400">+£96k/wk Wages</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">-£5M Transfer Cash</div>
              </button>
              <button
                onClick={() => handleApplyReallocation(-10)}
                disabled={transferBudget < 10000000}
                className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-left transition-colors"
              >
                <div className="text-xs font-bold text-emerald-400">+£192k/wk Wages</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">-£10M Transfer Cash</div>
              </button>
              <button
                onClick={() => handleApplyReallocation(5)}
                disabled={availableWageHeadroom < 100000}
                className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-left transition-colors"
              >
                <div className="text-xs font-bold text-sky-400">+£5M Transfer Cash</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">-£96k/wk Wage Headroom</div>
              </button>
              <button
                onClick={() => handleApplyReallocation(10)}
                disabled={availableWageHeadroom < 200000}
                className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-left transition-colors"
              >
                <div className="text-xs font-bold text-sky-400">+£10M Transfer Cash</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">-£192k/wk Wage Headroom</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Players Table View */}
      {activeTab !== 'BUDGET_ALLOCATION' && (
        <div className="border border-slate-800 bg-[#111827] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {activeTab === 'BUY' ? 'Scouted Transfer Database' : 'First-Team Squad (Transfer Listings)'}
              </h2>
              <p className="text-xs text-slate-400">
                {activeTab === 'BUY'
                  ? 'Audit detailed scouting files, trigger release clauses, and initiate contract negotiations.'
                  : 'Current squad valuation, wages, and market bid management.'}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, nation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold pb-2">
                  <th className="py-2.5 px-3">Player</th>
                  <th className="py-2.5 px-2">Age</th>
                  <th className="py-2.5 px-2">Pos</th>
                  <th className="py-2.5 px-2 text-center">OVR</th>
                  <th className="py-2.5 px-2 text-center">Scouted Potential</th>
                  <th className="py-2.5 px-3 text-right">Valuation</th>
                  <th className="py-2.5 px-3 text-right">Wage</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {(activeTab === 'BUY' ? filteredScouted : filteredSquad).map(player => {
                  const isScouted = player.scoutingStatus === 'fully_scouted';

                  return (
                    <tr key={player.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-sans">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{player.name}</span>
                          {player.isTransferListed && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-600/40 text-amber-300 font-mono">
                              Listed
                            </span>
                          )}
                          {player.releaseClause && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-600/40 text-purple-300 font-mono">
                              Release Clause
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>{player.nationality}</span>
                          <span>•</span>
                          <span>{player.contractYears}y deal</span>
                          {player.personalityTrait && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400">{player.personalityTrait}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-2 font-mono text-slate-300 tabular-nums">
                        {player.age}
                      </td>

                      <td className="py-3 px-2 font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-slate-200">
                          {player.position}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-center font-mono font-bold text-emerald-400 tabular-nums">
                        {player.overall}
                      </td>

                      <td className="py-3 px-2 text-center font-mono font-bold tabular-nums">
                        {activeTab === 'SELL' || isScouted ? (
                          <span className="text-amber-400">{player.potential} POT</span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">
                            {player.potential - 4}-{player.potential + 3} (?)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-emerald-400 font-semibold tabular-nums">
                        £{(player.marketValue / 1000000).toFixed(1)}M
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">
                        £{(player.wage / 1000).toFixed(0)}k/wk
                      </td>

                      <td className="py-3 px-3 text-right font-sans">
                        {activeTab === 'BUY' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {!isScouted && (
                              <button
                                onClick={() => handleScoutPlayer(player.id)}
                                className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
                                title="Commission Chief Scout dossier (£25k)"
                              >
                                <Eye className="w-3.5 h-3.5 text-sky-400" />
                                <span className="hidden sm:inline">Scout</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleStartNegotiations(player)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors shadow-sm flex items-center gap-1"
                            >
                              <span>Negotiate</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSellConfirm(player)}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-600 border border-rose-800/50 rounded transition-colors"
                          >
                            Accept Bid
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Negotiation Modal: 2-Stage Protocol (Club Offer -> Agent Contract) */}
      {targetToNegotiate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                  Stage {negotiationStep === 'CLUB_OFFER' ? '1: Club Transfer Fee Agreement' : '2: Player Contract Terms'}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Negotiating: {targetToNegotiate.name}
                </h3>
              </div>
              <button 
                onClick={() => setTargetToNegotiate(null)} 
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Target Summary Snapshot */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl text-center font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Position / Age</span>
                <span className="text-white font-bold">{targetToNegotiate.position} • {targetToNegotiate.age}yo</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Current Rating</span>
                <span className="text-emerald-400 font-bold">{targetToNegotiate.overall} OVR</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Market Valuation</span>
                <span className="text-emerald-400 font-bold">£{(targetToNegotiate.marketValue / 1000000).toFixed(1)}M</span>
              </div>
            </div>

            {/* Stage 1: Club-to-Club Offer */}
            {negotiationStep === 'CLUB_OFFER' && (
              <div className="space-y-4">
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-sans font-medium">Guaranteed Upfront Transfer Fee (£):</span>
                      <span className="font-bold text-emerald-400 tabular-nums">£{(bidFee / 1000000).toFixed(1)}M</span>
                    </div>
                    <input
                      type="number"
                      step="500000"
                      min="0"
                      value={bidFee}
                      onChange={(e) => setBidFee(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Max transfer budget available: £{(transferBudget / 1000000).toFixed(1)}M
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-sans font-medium">Appearance & Milestone Add-Ons (£):</span>
                      <span className="font-bold text-slate-300 tabular-nums">£{(addOnsFee / 1000000).toFixed(1)}M</span>
                    </div>
                    <input
                      type="number"
                      step="500000"
                      min="0"
                      value={addOnsFee}
                      onChange={(e) => setAddOnsFee(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-sans font-medium">Future Sell-On Percentage (%):</label>
                    <select
                      value={sellOnPercentage}
                      onChange={(e) => setSellOnPercentage(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    >
                      <option value={0}>0% No Sell-On</option>
                      <option value={10}>10% Profit on Next Sale</option>
                      <option value={15}>15% Profit on Next Sale</option>
                      <option value={20}>20% Profit on Next Sale</option>
                    </select>
                  </div>
                </div>

                {/* Release clause trigger shortcut if available */}
                {targetToNegotiate.releaseClause && (
                  <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-purple-300 font-bold block">Buyout Release Clause Active</span>
                      <span className="text-[11px] text-slate-400 font-mono">Guaranteed fee: £{(targetToNegotiate.releaseClause / 1000000).toFixed(1)}M</span>
                    </div>
                    <button
                      onClick={handleTriggerReleaseClause}
                      disabled={transferBudget < targetToNegotiate.releaseClause}
                      className="px-3 py-1.5 text-xs font-semibold text-purple-200 bg-purple-900/60 hover:bg-purple-800 border border-purple-600 rounded-lg transition-colors"
                    >
                      Trigger Clause
                    </button>
                  </div>
                )}

                {/* Selling Club AI Feedback / Counter */}
                {clubResponseStatus === 'COUNTER' && (
                  <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl text-xs space-y-2">
                    <span className="text-amber-300 font-bold block">Selling Club Counter-Offer</span>
                    <p className="text-slate-300 text-[11px]">
                      The club board refuses your initial proposal, but indicates they will sanction the sale for a revised fee of <strong className="text-white">£{(counterFee / 1000000).toFixed(1)}M</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setBidFee(counterFee);
                        setClubResponseStatus('ACCEPTED');
                        setNegotiationStep('AGENT_CONTRACT');
                      }}
                      className="px-3 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded"
                    >
                      Accept Counter-Offer (£{(counterFee / 1000000).toFixed(1)}M)
                    </button>
                  </div>
                )}

                {clubResponseStatus === 'REJECTED' && (
                  <div className="p-3 bg-rose-950/40 border border-rose-600/40 rounded-xl text-xs text-rose-300">
                    The selling club has rejected this proposal as derisory. You must increase your guaranteed fee.
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setTargetToNegotiate(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Withdraw
                  </button>
                  <button
                    onClick={handleSubmitClubOffer}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm"
                  >
                    Submit Formal Bid to Club
                  </button>
                </div>
              </div>
            )}

            {/* Stage 2: Player & Agent Contract Terms */}
            {negotiationStep === 'AGENT_CONTRACT' && (
              <div className="space-y-4">
                {agentFeedback && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                    {agentFeedback}
                  </div>
                )}

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-sans font-medium">Offered Weekly Wage (£/wk):</span>
                      <span className="font-bold text-emerald-400 tabular-nums">£{(offeredWage / 1000).toFixed(0)}k/wk</span>
                    </div>
                    <input
                      type="number"
                      step="2500"
                      min="1000"
                      value={offeredWage}
                      onChange={(e) => setOfferedWage(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Available wage margin: £{(availableWageHeadroom / 1000).toFixed(0)}k/wk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1 font-sans font-medium">Contract Duration:</label>
                      <select
                        value={contractYears}
                        onChange={(e) => setContractYears(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      >
                        <option value={1}>1 Season</option>
                        <option value={2}>2 Seasons</option>
                        <option value={3}>3 Seasons</option>
                        <option value={4}>4 Seasons</option>
                        <option value={5}>5 Seasons</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1 font-sans font-medium">Squad Role Promised:</label>
                      <select
                        value={squadRole}
                        onChange={(e) => setSquadRole(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-sans text-xs"
                      >
                        <option value="Key Player">Key Player</option>
                        <option value="First Team Regular">First Team Regular</option>
                        <option value="Squad Rotation">Squad Rotation</option>
                        <option value="Future Prospect">Future Prospect</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-sans font-medium">Signing-On / Agent Fee (£):</label>
                    <input
                      type="number"
                      step="250000"
                      min="0"
                      value={signingBonus}
                      onChange={(e) => setSigningBonus(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setNegotiationStep('CLUB_OFFER')}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Back to Fee
                  </button>
                  <button
                    onClick={handleFinalizeSigning}
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm"
                  >
                    Finalize & Sign Player
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
