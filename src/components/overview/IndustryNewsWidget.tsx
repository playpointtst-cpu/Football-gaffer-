import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Newspaper, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Building2, 
  Briefcase, 
  Users, 
  ArrowRight, 
  Flame, 
  RefreshCw,
  Compass,
  DollarSign
} from 'lucide-react';

export type NewsCategory = 'ALL' | 'TRANSFERS' | 'STADIUM' | 'YOUTH' | 'SPONSORS' | 'MEDICAL';

export interface NewsItem {
  id: string;
  category: NewsCategory;
  badge: 'BREAKING' | 'RUMOR' | 'OFFICIAL' | 'SCOOP' | 'MEDICAL';
  badgeColor: string;
  headline: string;
  summary: string;
  timeAgo: string;
  source: string;
  targetTab?: string;
  impactLabel?: string;
}

interface IndustryNewsWidgetProps {
  onNavigate: (tab: string) => void;
}

export const IndustryNewsWidget: React.FC<IndustryNewsWidgetProps> = ({ onNavigate }) => {
  const { state, scoutedPlayers } = useGame();
  const club = state.selectedClub;
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('ALL');
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  // Generate dynamic industry news tailored to game state + world events
  const newsItems = useMemo(() => {
    const items: NewsItem[] = [];

    // 1. Live Medical / Player Injuries from Club Squad
    const injuredPlayers = club.players.filter(p => p.isInjured || (p.injuryWeeks && p.injuryWeeks > 0));
    if (injuredPlayers.length > 0) {
      const p = injuredPlayers[0];
      items.push({
        id: `med_${p.id}_${state.currentWeek}`,
        category: 'MEDICAL',
        badge: 'MEDICAL',
        badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
        headline: `Medical Alert: ${p.name} Sidelined with ${p.injuryType || 'Soft Tissue Strain'}`,
        summary: `Club medical staff confirm ${p.name} is scheduled for an intensive rehabilitation cycle. Expected recovery window is ${p.injuryWeeks || 1} weeks.`,
        timeAgo: '1h ago',
        source: 'Head Physio Bulletin',
        targetTab: 'sporting',
        impactLabel: 'Squad Availability',
      });
    } else {
      // General squad fitness update
      items.push({
        id: `med_clear_${state.currentWeek}`,
        category: 'MEDICAL',
        badge: 'OFFICIAL',
        badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
        headline: 'Clean Bill of Health: First-Team Medical Department Reports Zero Critical Injuries',
        summary: `Physiotherapy staff credit upgraded hydrotherapy facilities and sports science protocols for zero soft-tissue dropouts this gameweek.`,
        timeAgo: '3h ago',
        source: 'Club Medical Centre',
        targetTab: 'sporting',
        impactLabel: 'Full Squad Fit',
      });
    }

    // 2. Stadium & Infrastructure News
    const upgradingStand = club.stadium.stands.find(s => s.isUpgrading);
    if (upgradingStand) {
      items.push({
        id: `stad_upg_${upgradingStand.id}_${state.currentWeek}`,
        category: 'STADIUM',
        badge: 'OFFICIAL',
        badgeColor: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
        headline: `Stadium Expansion: ${upgradingStand.name} Construction Underway`,
        summary: `Heavy civil contractors report structural steel installation progressing on schedule. Completion estimated within ${upgradingStand.upgradeWeeksRemaining || 1} gameweeks.`,
        timeAgo: '4h ago',
        source: 'Stadium Operations Gazette',
        targetTab: 'stadium',
        impactLabel: `+${Math.round(upgradingStand.maxCapacity - upgradingStand.capacity)} Capacity Soon`,
      });
    } else {
      items.push({
        id: `stad_plan_${state.currentWeek}`,
        category: 'STADIUM',
        badge: 'RUMOR',
        badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
        headline: `${club.stadium.name} Expansion Study Commissioned for Safe Standing`,
        summary: `Architectural consultants present feasibility report to convert lower terrace tiers into modern rail seating to boost matchday atmospheric density.`,
        timeAgo: '6h ago',
        source: 'Municipal Stadium Journal',
        targetTab: 'stadium',
        impactLabel: 'Ground Innovation',
      });
    }

    // 3. Youth Scout Recommendations
    const topProspect = club.academyProspects.slice().sort((a, b) => b.potentialMax - a.potentialMax)[0];
    if (topProspect) {
      items.push({
        id: `scout_prospect_${topProspect.id}_${state.currentWeek}`,
        category: 'YOUTH',
        badge: 'SCOOP',
        badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
        headline: `Youth Scout Recommendation: ${topProspect.name} (${topProspect.age}yo, ${topProspect.position})`,
        summary: `Academy Director highlights ${topProspect.name}'s rapid progress in ${topProspect.trainingFocus} training. Scouted ceiling evaluated at an elite ${topProspect.potentialMin}-${topProspect.potentialMax} PA.`,
        timeAgo: '2h ago',
        source: 'Youth Academy Dispatch',
        targetTab: 'academy',
        impactLabel: `Ceiling: ${topProspect.potentialMax} PA`,
      });
    }

    // 4. Big Transfer News & Rumors
    const topScouted = scoutedPlayers[refreshSeed % scoutedPlayers.length] || scoutedPlayers[0];
    if (topScouted) {
      items.push({
        id: `transfer_big_${topScouted.id}_${state.currentWeek}_${refreshSeed}`,
        category: 'TRANSFERS',
        badge: 'BREAKING',
        badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
        headline: `Big Transfer News: European Giants Circling ${topScouted.name} (£${(topScouted.marketValue / 1000000).toFixed(1)}M Valued)`,
        summary: `Scouts from continental Champions League contenders have submitted formal monitoring dossiers for ${topScouted.name} (${topScouted.position}, OVR ${topScouted.overall}).`,
        timeAgo: '12m ago',
        source: 'The Daily Football Wire',
        targetTab: 'transfers',
        impactLabel: 'Transfer Hotlist',
      });
    }

    // Transfer Rumor 2
    items.push({
      id: `rumor_bidding_war_${state.currentWeek}_${refreshSeed}`,
      category: 'TRANSFERS',
      badge: 'RUMOR',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      headline: `Transfer Rumor: £75M Striker Bidding War Brewing Across Tier 1 European Clubs`,
      summary: `Premier League and Serie A sporting directors are preparing coordinated deadline offers as top-flight agents land in London for high-stakes executive negotiations.`,
      timeAgo: '35m ago',
      source: 'Global Mercato Insider',
      targetTab: 'transfers',
      impactLabel: 'Market Heat',
    });

    // 5. Commercial & Sponsorship Deals
    const primeSponsor = club.sponsors[0];
    if (primeSponsor) {
      items.push({
        id: `sponsor_deal_${primeSponsor.id}_${state.currentWeek}`,
        category: 'SPONSORS',
        badge: 'OFFICIAL',
        badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
        headline: `Commercial Milestone: ${primeSponsor.brandName} Partnership Generating £${(primeSponsor.annualValue / 1000000).toFixed(1)}M Annually`,
        summary: `Commercial director confirms all quarterly contractual metrics have been satisfied, providing continuous liquidity to player payroll and youth scouting operations.`,
        timeAgo: '5h ago',
        source: 'Football Business Chronicle',
        targetTab: 'sponsors',
        impactLabel: `£${(primeSponsor.weeklyValue / 1000).toFixed(0)}k/wk Inflow`,
      });
    } else {
      items.push({
        id: `sponsor_tender_${state.currentWeek}`,
        category: 'SPONSORS',
        badge: 'RUMOR',
        badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
        headline: `Sponsorship Tender: Multi-National Brands Competing for Primary Front-of-Shirt Rights`,
        summary: `Corporate tenders arriving at boardroom headquarters with proposals ranging up to £28.5M/yr across technology and clean energy sectors.`,
        timeAgo: '1d ago',
        source: 'Sponsorship Market Report',
        targetTab: 'sponsors',
        impactLabel: 'Commercial Opportunity',
      });
    }

    // 6. Youth Scouting Expedition Dispatch
    const activeMission = club.youthScoutingMissions[0];
    if (activeMission) {
      items.push({
        id: `mission_wire_${activeMission.id}_${state.currentWeek}`,
        category: 'YOUTH',
        badge: 'SCOOP',
        badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
        headline: `Scouting Expedition Report: Intel Gathered in ${activeMission.region}`,
        summary: `Senior international talent spotters identify 3 high-ceiling wonderkids with exceptional technical baseline ratings. Final reports due in ${activeMission.weeksRemaining} weeks.`,
        timeAgo: '7h ago',
        source: 'Chief Scout Telegram',
        targetTab: 'academy',
        impactLabel: `${activeMission.weeksRemaining}w Remaining`,
      });
    }

    // Filter by active category tab
    if (activeCategory === 'ALL') return items;
    return items.filter(item => item.category === activeCategory);
  }, [club, scoutedPlayers, state.currentWeek, refreshSeed, activeCategory]);

  return (
    <div className="border border-slate-800 bg-[#111827] rounded-xl p-5 space-y-4">
      {/* Header with Title and Refresh Wire CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Global Football Industry News & Live Wire
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live intelligence feed • Transfer scoops, stadium infrastructure, youth wonderkids, and corporate deals
            </p>
          </div>
        </div>

        <button
          onClick={() => setRefreshSeed(prev => prev + 1)}
          className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto font-mono text-[11px]"
          title="Refresh latest rumors wire"
        >
          <RefreshCw className="w-3 h-3 text-emerald-400" />
          <span>Fetch Wire Update</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs bg-slate-900/90 p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            activeCategory === 'ALL' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Wire ({newsItems.length})
        </button>
        <button
          onClick={() => setActiveCategory('TRANSFERS')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            activeCategory === 'TRANSFERS' ? 'bg-slate-800 text-rose-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Transfers & Rumors
        </button>
        <button
          onClick={() => setActiveCategory('STADIUM')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            activeCategory === 'STADIUM' ? 'bg-slate-800 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Stadium & Ground
        </button>
        <button
          onClick={() => setActiveCategory('YOUTH')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            activeCategory === 'YOUTH' ? 'bg-slate-800 text-purple-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Youth & Academy
        </button>
        <button
          onClick={() => setActiveCategory('SPONSORS')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            activeCategory === 'SPONSORS' ? 'bg-slate-800 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sponsorships
        </button>
        <button
          onClick={() => setActiveCategory('MEDICAL')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            activeCategory === 'MEDICAL' ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Medical Bulletin
        </button>
      </div>

      {/* News Feed Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {newsItems.map(item => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded font-bold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-slate-500">{item.source}</span>
                </div>
                <span className="text-slate-500">{item.timeAgo}</span>
              </div>

              <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                {item.headline}
              </h4>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                {item.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
              {item.impactLabel ? (
                <span className="font-mono text-emerald-400/90 text-[10px] font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                  {item.impactLabel}
                </span>
              ) : <div />}

              {item.targetTab && (
                <button
                  onClick={() => onNavigate(item.targetTab!)}
                  className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold text-[11px] group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Investigate</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
