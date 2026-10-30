import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { AVAILABLE_SPONSOR_OFFERS } from '../../data/sponsorCatalog';
import { SponsorContract, SponsorCategory } from '../../types/game';
import { 
  Briefcase, 
  DollarSign, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Sliders,
  Scale,
  Handshake,
  HeartHandshake
} from 'lucide-react';

export const SponsorshipView: React.FC = () => {
  const { state, signSponsorship, terminateSponsorship } = useGame();
  const club = state.selectedClub;
  const activeSponsors = club.sponsors;

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [proposalToNegotiate, setProposalToNegotiate] = useState<Omit<SponsorContract, 'yearsRemaining'> | null>(null);

  // Negotiation sliders
  const [markupPercent, setMarkupPercent] = useState<number>(0); // 0, 5, 10, 15, 20
  const [requestedDuration, setRequestedDuration] = useState<number>(3);
  const [requestedSigningBonus, setRequestedSigningBonus] = useState<number>(1000000);
  const [negotiationNotice, setNegotiationNotice] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const categories = [
    'ALL', 
    'Front-of-Shirt', 
    'Kit Manufacturer', 
    'Stadium Naming Rights', 
    'Sleeve Sponsor', 
    'Training Ground',
    'Concourse Partner'
  ];

  const filteredOffers = useMemo(() => {
    return AVAILABLE_SPONSOR_OFFERS.filter(offer => {
      if (selectedCategory !== 'ALL' && offer.category !== selectedCategory) return false;
      return !activeSponsors.some(s => s.brandName === offer.brandName);
    });
  }, [selectedCategory, activeSponsors]);

  const totalWeeklyRevenue = activeSponsors.reduce((sum, s) => sum + s.weeklyValue, 0);
  const totalAnnualRevenue = activeSponsors.reduce((sum, s) => sum + s.annualValue, 0);

  // Calculate negotiated values
  const negotiatedAnnual = useMemo(() => {
    if (!proposalToNegotiate) return 0;
    return Math.round(proposalToNegotiate.annualValue * (1 + markupPercent / 100));
  }, [proposalToNegotiate, markupPercent]);

  // Acceptance probability based on markup and club reputation
  const acceptanceProbability = useMemo(() => {
    if (!proposalToNegotiate) return 100;
    const base = 85 + (club.reputation - 75) * 1.2;
    const penalty = markupPercent * 2.5 + (requestedSigningBonus / 1000000) * 3;
    return Math.min(98, Math.max(25, Math.round(base - penalty)));
  }, [proposalToNegotiate, markupPercent, requestedSigningBonus, club.reputation]);

  const handleOpenNegotiation = (offer: Omit<SponsorContract, 'yearsRemaining'>) => {
    setProposalToNegotiate(offer);
    setMarkupPercent(0);
    setRequestedDuration(3);
    setRequestedSigningBonus(offer.signingBonus || 1000000);
    setNegotiationNotice(null);
  };

  const handleExecuteAgreement = () => {
    if (!proposalToNegotiate) return;

    // Check if sponsor walked away
    const roll = Math.random() * 100;
    if (roll > acceptanceProbability) {
      setNegotiationNotice(`The corporate board of ${proposalToNegotiate.brandName} rejected your aggressive terms and walked away from the negotiation table.`);
      return;
    }

    // Check if category slot is already occupied
    const existing = activeSponsors.find(s => s.category === proposalToNegotiate.category);
    if (existing) {
      if (!window.confirm(`Your club already has an active ${proposalToNegotiate.category} deal (${existing.brandName}). Signing this will terminate the current agreement. Proceed?`)) {
        return;
      }
      terminateSponsorship(existing.id);
    }

    const newContract: SponsorContract = {
      ...proposalToNegotiate,
      annualValue: negotiatedAnnual,
      weeklyValue: Math.round(negotiatedAnnual / 52),
      yearsRemaining: requestedDuration,
      signingBonus: requestedSigningBonus,
    };

    signSponsorship(newContract);
    setProposalToNegotiate(null);
    setNotice(`Commercial agreement ratified with ${newContract.brandName}! Annual revenue: £${(newContract.annualValue / 1000000).toFixed(1)}M (${newContract.yearsRemaining} seasons).`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleTerminate = (sponsorId: string, brandName: string) => {
    if (window.confirm(`Terminate commercial contract with ${brandName}? This will cancel incoming weekly sponsor disbursements.`)) {
      terminateSponsorship(sponsorId);
      setNotice(`Contract with ${brandName} terminated.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Overview Card */}
      <div className="border border-slate-800 bg-[#111827] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Commercial Partnerships & Brand Sponsorships
                </h1>
                <p className="text-xs text-slate-400">
                  Global Sponsorship Portfolio • Kit Supplier • Front-of-Shirt • Stadium Naming Rights • Concourse
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Negotiate multi-million pound corporate sponsorships to subsidize player wage growth and stadium infrastructure bonds. Weigh lucrative gambling/crypto partners against fan goodwill and long-term club integrity.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Weekly Inflow</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                £{(totalWeeklyRevenue / 1000).toFixed(0)}k <span className="text-xs text-slate-500 font-normal">/wk</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Annualized Run-Rate</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5 tabular-nums">
                £{(totalAnnualRevenue / 1000000).toFixed(1)}M <span className="text-xs text-slate-500 font-normal">/yr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Contracts Grid */}
      <div className="border border-slate-800 bg-[#111827] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Active Sponsorship Agreements ({activeSponsors.length} Slots Occupied)
            </h2>
            <p className="text-xs text-slate-400">
              Guaranteed commercial revenues credited every gameweek accounting cycle.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSponsors.map(sponsor => (
            <div key={sponsor.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono font-medium">
                    {sponsor.category}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    sponsor.ethicalTier === 'Green / Tech' ? 'bg-emerald-950/60 text-emerald-300' :
                    sponsor.ethicalTier === 'Gambling / Crypto' ? 'bg-amber-950/60 text-amber-300' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {sponsor.ethicalTier}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">
                  {sponsor.brandName}
                </h3>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">Weekly</span>
                    <span className="text-emerald-400 font-bold block mt-0.5 tabular-nums">
                      £{(sponsor.weeklyValue / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">Annual</span>
                    <span className="text-white font-bold block mt-0.5 tabular-nums">
                      £{(sponsor.annualValue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>

                {sponsor.bonusClause && (
                  <div className="mt-2.5 p-2 rounded bg-slate-950/60 border border-slate-800/50 text-[11px] text-slate-300 flex items-center justify-between">
                    <span className="text-slate-400 truncate mr-2">Bonus: {sponsor.bonusClause}</span>
                    <span className="font-mono text-amber-400 font-semibold shrink-0 tabular-nums">
                      +£{((sponsor.bonusAmount || 0) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-mono">{sponsor.yearsRemaining} years remaining</span>
                <button
                  onClick={() => handleTerminate(sponsor.id, sponsor.brandName)}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Terminate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Proposals Catalog */}
      <div className="border border-slate-800 bg-[#111827] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Tender Market: Corporate Sponsorship Opportunities
            </h2>
            <p className="text-xs text-slate-400">
              Corporate bids submitted to the commercial board for executive negotiation and ratification.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs bg-slate-900 p-1 rounded-lg border border-slate-800">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded whitespace-nowrap transition-colors ${
                  selectedCategory === cat ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOffers.map(offer => (
            <div key={offer.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {offer.category}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    offer.ethicalTier === 'Green / Tech' ? 'bg-emerald-950/60 text-emerald-300' :
                    offer.ethicalTier === 'Gambling / Crypto' ? 'bg-amber-950/60 text-amber-300' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {offer.ethicalTier}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">
                  {offer.brandName}
                </h3>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">Annual Payout</span>
                    <span className="text-emerald-400 font-bold block mt-0.5 tabular-nums">
                      £{(offer.annualValue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">Fan Sentiment</span>
                    <span className={`font-bold block mt-0.5 ${
                      offer.fanSentimentImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {offer.fanSentimentImpact >= 0 ? `+${offer.fanSentimentImpact}%` : `${offer.fanSentimentImpact}%`}
                    </span>
                  </div>
                </div>

                {offer.bonusClause && (
                  <div className="mt-2.5 p-2 rounded bg-slate-950/60 border border-slate-800/50 text-[11px] text-slate-300">
                    <div className="text-slate-400 text-[10px]">Performance Clause</div>
                    <div className="text-slate-200 mt-0.5">{offer.bonusClause} (+£{((offer.bonusAmount || 0) / 1000000).toFixed(1)}M)</div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenNegotiation(offer)}
                className="w-full py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Negotiate & Ratify</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Negotiation Room Modal */}
      {proposalToNegotiate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                  Executive Commercial Negotiation Room
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {proposalToNegotiate.brandName}
                </h3>
              </div>
              <button onClick={() => setProposalToNegotiate(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {negotiationNotice && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs rounded-lg">
                {negotiationNotice}
              </div>
            )}

            {/* Package Summary */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Sponsorship Package:</span>
                <span className="text-emerald-400 font-bold">{proposalToNegotiate.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Baseline Annual Payout:</span>
                <span className="text-white font-bold tabular-nums">£{(proposalToNegotiate.annualValue / 1000000).toFixed(1)}M / season</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ethical Classification:</span>
                <span className={`font-bold ${
                  proposalToNegotiate.ethicalTier === 'Green / Tech' ? 'text-emerald-400' :
                  proposalToNegotiate.ethicalTier === 'Gambling / Crypto' ? 'text-amber-400' :
                  'text-slate-300'
                }`}>
                  {proposalToNegotiate.ethicalTier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Supporter Sentiment Impact:</span>
                <span className={proposalToNegotiate.fanSentimentImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {proposalToNegotiate.fanSentimentImpact >= 0 ? `+${proposalToNegotiate.fanSentimentImpact}% Trust` : `${proposalToNegotiate.fanSentimentImpact}% Trust`}
                </span>
              </div>
            </div>

            {/* Negotiation Sliders */}
            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-300 font-sans font-medium">
                  <span>Counter-Offer Annual Fee Markup:</span>
                  <span className="font-bold text-emerald-400 tabular-nums">+{markupPercent}% (£{(negotiatedAnnual / 1000000).toFixed(1)}M/yr)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="5"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-300 font-sans font-medium">
                  <span>Upfront Signing Incentive Bonus Demand:</span>
                  <span className="font-bold text-white tabular-nums">£{(requestedSigningBonus / 1000000).toFixed(1)}M cash</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="4000000"
                  step="500000"
                  value={requestedSigningBonus}
                  onChange={(e) => setRequestedSigningBonus(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-sans font-medium">Contract Duration:</label>
                <select
                  value={requestedDuration}
                  onChange={(e) => setRequestedDuration(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 font-mono"
                >
                  <option value={1}>1 Season Fixed</option>
                  <option value={2}>2 Seasons Fixed</option>
                  <option value={3}>3 Seasons Fixed</option>
                  <option value={4}>4 Seasons Fixed</option>
                  <option value={5}>5 Seasons Fixed (Long-Term Stability)</option>
                </select>
              </div>

              {/* Acceptance Probability Meter */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-slate-400 font-medium">Corporate Acceptance Likelihood:</span>
                  <span className={`font-mono font-bold ${
                    acceptanceProbability >= 70 ? 'text-emerald-400' :
                    acceptanceProbability >= 45 ? 'text-amber-400' :
                    'text-rose-400'
                  }`}>
                    {acceptanceProbability}% Probability
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      acceptanceProbability >= 70 ? 'bg-emerald-500' :
                      acceptanceProbability >= 45 ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`}
                    style={{ width: `${acceptanceProbability}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-sans block">
                  Based on club reputation ({club.reputation}/100) and aggressive fee counter-proposals.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setProposalToNegotiate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAgreement}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Handshake className="w-4 h-4" />
                <span>Submit & Ratify Contract</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
