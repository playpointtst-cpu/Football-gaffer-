import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { calculateFinancialForecast } from '../../services/simulationEngine';
import { DebtInstrument } from '../../types/game';
import { 
  PoundSterling, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Landmark, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  Calculator,
  RefreshCw,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';

export const FinancialLedgerView: React.FC = () => {
  const { 
    state, 
    updateBudgetAllocation, 
    issueDebt, 
    payoffDebt, 
    refinanceDebt 
  } = useGame();

  const club = state.selectedClub;
  const finances = club.finances;
  const budget = finances.budgetAllocation;

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'income' | 'expenses' | 'forecasting' | 'budgeting' | 'debt'>('overview');
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);

  // Modal states for Debt
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [newDebtType, setNewDebtType] = useState<DebtInstrument['type']>('Stadium Infrastructure Bond');
  const [newDebtAmount, setNewDebtAmount] = useState(15000000);
  const [newDebtTerm, setNewDebtTerm] = useState(260); // 5 years

  // Budget slider state
  const [transferCapInput, setTransferCapInput] = useState(budget.transferBudgetCap);
  const [wageCapInput, setWageCapInput] = useState(budget.weeklyWageCapPerPlayer);
  const [reserveInput, setReserveInput] = useState(budget.infrastructureReserve);
  const [targetRatioInput, setTargetRatioInput] = useState(budget.targetWageToTurnoverRatio);

  // Calculate real-time financial forecast
  const forecast = calculateFinancialForecast(club, state.currentWeek, state.leagueTable);
  const currentScenario = forecast.scenarios[selectedScenarioIndex] || forecast.scenarios[0];

  const handleSaveBudget = () => {
    updateBudgetAllocation({
      transferBudgetCap: transferCapInput,
      weeklyWageCapPerPlayer: wageCapInput,
      infrastructureReserve: reserveInput,
      targetWageToTurnoverRatio: targetRatioInput,
    });
  };

  const handleIssueDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rates: Record<DebtInstrument['type'], number> = {
      'Green Eco-Bond': 3.4,
      'Stadium Infrastructure Bond': 4.6,
      'Commercial Term Loan': 6.2,
      'Revolving Credit Facility': 7.5,
    };
    const rate = rates[newDebtType] || 5.0;
    issueDebt(`Consortium ${newDebtType}`, newDebtType, newDebtAmount, newDebtTerm, rate);
    setShowIssueModal(false);
  };

  // Weekly operational calculations
  const weeklyWages = finances.weeklyWageBill;
  const weeklyStaff = finances.weeklyStaffBill;
  const weeklyGround = finances.weeklyMaintenanceCost;
  const weeklyDebt = (finances.bankLoans || []).reduce((sum, l) => sum + l.weeklyRepayment, 0);
  const weeklyExpenses = weeklyWages + weeklyStaff + weeklyGround + weeklyDebt;
  const weeklyIncome = finances.weeklyCommercialIncome + (finances.weeklyMatchdayIncomeAvg * (state.currentWeek % 2 === 0 ? 1 : 0));
  const weeklyNet = weeklyIncome - weeklyExpenses;

  // FFP Health
  const ffpLimit = 105000000;
  const ffpLoss = finances.threeYearRollingLoss;
  const ffpPercentage = Math.min(100, Math.max(0, (ffpLoss / ffpLimit) * 100));

  return (
    <div className="space-y-6">
      {/* Financial Health Header Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Bank Cash Reserves</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            £{(finances.bankBalance / 1000000).toFixed(2)}M
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <span>Buffer: £{(budget.emergencyBuffer / 1000000).toFixed(1)}M</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Available</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Wage-to-Turnover Ratio</span>
          <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
            forecast.wageToTurnoverRatio <= 65 ? 'text-emerald-400' : forecast.wageToTurnoverRatio <= 70 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {forecast.wageToTurnoverRatio}%
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <span>Target: {budget.targetWageToTurnoverRatio}%</span>
            <span aria-hidden="true">·</span>
            <span>UEFA Limit: 70%</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">PSR / FFP 3-Yr Rolling Loss</span>
          <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
            ffpLoss <= 60000000 ? 'text-emerald-400' : ffpLoss <= 90000000 ? 'text-amber-400' : 'text-red-400'
          }`}>
            £{(ffpLoss / 1000000).toFixed(1)}M
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <span>Limit: £105.0M</span>
            <span aria-hidden="true">·</span>
            <span className={ffpPercentage > 85 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {ffpPercentage.toFixed(0)}% Utilized
            </span>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Total Debt Liabilities</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            £{(forecast.totalDebtOutstanding / 1000000).toFixed(1)}M
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <span>Service: £{(weeklyDebt / 1000).toFixed(0)}k/wk</span>
            <span aria-hidden="true">·</span>
            <span>{(finances.bankLoans || []).length} Facilities</span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Ledger & Cashflow
        </button>
        <button
          onClick={() => setActiveSubTab('income')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'income' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Revenue Breakdown
        </button>
        <button
          onClick={() => setActiveSubTab('expenses')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'expenses' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Operating Expenses
        </button>
        <button
          onClick={() => setActiveSubTab('forecasting')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'forecasting' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Forecasting & FFP
        </button>
        <button
          onClick={() => setActiveSubTab('budgeting')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'budgeting' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Budgeting & Wage Caps
        </button>
        <button
          onClick={() => setActiveSubTab('debt')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'debt' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Debt & Refinancing
        </button>
      </div>

      {/* SUB-TAB 1: Overview & Transaction Ledger */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly P&L Cashflow Model</h3>
                <span className="text-xs text-slate-400">Week {state.currentWeek} Snapshot</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg">
                  <span className="text-xs text-slate-400 font-medium">Recurring Weekly Inflows</span>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                    +£{Math.round(weeklyIncome).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Commercial Partnerships:</span>
                      <span className="font-mono text-slate-300">£{Math.round(finances.weeklyCommercialIncome).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected Matchday Avg:</span>
                      <span className="font-mono text-slate-300">£{Math.round(finances.weeklyMatchdayIncomeAvg).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg">
                  <span className="text-xs text-slate-400 font-medium">Recurring Weekly Outflows</span>
                  <div className="text-xl font-bold font-mono tabular-nums text-red-400 mt-1">
                    -£{Math.round(weeklyExpenses).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Player Squad Wages:</span>
                      <span className="font-mono text-slate-300">£{Math.round(weeklyWages).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Staff, Ground & Debt:</span>
                      <span className="font-mono text-slate-300">£{Math.round(weeklyStaff + weeklyGround + weeklyDebt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Net Weekly Operating Cashflow</span>
                  <div className={`text-lg font-bold font-mono tabular-nums ${weeklyNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {weeklyNet >= 0 ? '+' : ''}£{Math.round(weeklyNet).toLocaleString()} / week
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>Transfer Budget: <span className="font-mono text-white font-medium">£{(finances.transferBudget / 1000000).toFixed(1)}M</span></div>
                  <div>Wage Margin: <span className="font-mono text-emerald-400 font-medium">+£{(finances.remainingWageBudget / 1000).toFixed(0)}k/wk</span></div>
                </div>
              </div>
            </div>

            {/* Real Transaction Journal */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Official Transaction Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-medium">
                    <tr>
                      <th className="pb-2.5">Gameweek</th>
                      <th className="pb-2.5">Category</th>
                      <th className="pb-2.5">Ledger Description</th>
                      <th className="pb-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {finances.recentTransactions.slice(0, 10).map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-900/40">
                        <td className="py-2.5 font-mono text-slate-400">Wk {tx.week}</td>
                        <td className="py-2.5 font-medium text-slate-300">{tx.category}</td>
                        <td className="py-2.5 text-slate-300 truncate max-w-[280px]">{tx.description}</td>
                        <td className={`py-2.5 text-right font-mono font-medium tabular-nums ${
                          tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {tx.type === 'INCOME' ? '+' : '-'}£{tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Capital Allocation summary */}
          <div className="space-y-4">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Capital Reserves Breakdown</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Transfer Budget Allocation</span>
                    <span className="font-mono text-white font-medium">£{(finances.transferBudget / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (finances.transferBudget / finances.bankBalance) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Infrastructure Capital Reserve</span>
                    <span className="font-mono text-white font-medium">£{(budget.infrastructureReserve / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-sky-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (budget.infrastructureReserve / finances.bankBalance) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Untouchable Operating Buffer</span>
                    <span className="font-mono text-white font-medium">£{(budget.emergencyBuffer / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (budget.emergencyBuffer / finances.bankBalance) * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveSubTab('budgeting')}
                className="w-full mt-4 py-2 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-center"
              >
                Configure Budget Allocations
              </button>
            </div>

            {/* FFP Alert Banner */}
            <div className={`p-4 rounded-xl border ${
              ffpLoss <= 70000000 
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' 
                : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
            }`}>
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold">FFP / PSR Compliance Status: Nominal</div>
                  <p className="text-slate-400">
                    The club’s 3-year rolling adjusted loss sits safely below the Premier League £105M sanction threshold. Maintain current wage discipline to avoid point penalties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Granular Revenue Breakdown */}
      {activeSubTab === 'income' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matchday */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h4 className="text-sm font-bold text-white">Matchday Yields</h4>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  £{(Object.values(finances.incomeBreakdown?.matchday || {}).reduce((a, b) => a + b, 0) / 1000000).toFixed(1)}M / yr
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">General Gate Admission:</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.matchday?.generalAdmission || 19800000) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Season Tickets (Amortized):</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.matchday?.seasonTicketsAmortized || 37240000) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Corporate VIP Hospitality:</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.matchday?.vipHospitality || 16320000) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Concourse Catering & Fan Zone:</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.matchday?.cateringAndFanZone || 11400000) / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </div>

            {/* Commercial & Retail */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h4 className="text-sm font-bold text-white">Commercial & Retail</h4>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  £{(Object.values(finances.incomeBreakdown?.commercial || {}).reduce((a, b) => a + b, 0) / 1000000).toFixed(1)}M / yr
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Front-of-Shirt & Naming Rights:</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.commercial?.sponsorships || 68000000) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kit Manufacturer Royalties:</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.commercial?.kitManufacturerRoyalties || 12500000) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Megastore Replica Shirt Sales:</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.commercial?.megastoreRetail || 18400000) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stadium Tours & Non-Match Events:</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.commercial?.stadiumToursAndEvents || 4200000) / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </div>

            {/* Broadcasting & Prize Distribution */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h4 className="text-sm font-bold text-white">Broadcasting & Rights</h4>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  £{(Object.values(finances.incomeBreakdown?.broadcasting || {}).reduce((a, b) => a + b, 0) / 1000000).toFixed(1)}M / yr
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Domestic Equal Share:</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.broadcasting?.domesticEqualShare || 31200000) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">International Rights Pool:</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.broadcasting?.internationalPool || 48000000) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Facility Fees (Live TV Matches):</span>
                  <span className="font-mono text-slate-200 font-medium">
                    £{((finances.incomeBreakdown?.broadcasting?.facilityTelevisedBonus || 14500000) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Merit Award (Position Bonus):</span>
                  <span className="font-mono text-emerald-400 font-medium">
                    £{((finances.incomeBreakdown?.broadcasting?.meritFinishingProjected || 34100000) / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Operating Expenses */}
      {activeSubTab === 'expenses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white mb-3">Player & Staff Payroll</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">First-Team Base Salaries:</span>
                <span className="font-mono text-red-400 font-medium">£{(weeklyWages * 52 / 1000000).toFixed(2)}M / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Executive & Coaching Staff:</span>
                <span className="font-mono text-red-400 font-medium">£{(weeklyStaff * 52 / 1000000).toFixed(2)}M / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Appearance & Clean-Sheet Bonuses:</span>
                <span className="font-mono text-red-400 font-medium">£8.50M / yr</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white mb-3">Stadium & Ground Operations</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Ground Maintenance & Pitch Heating:</span>
                <span className="font-mono text-red-400 font-medium">£5.72M / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Utility & Energy Consumption:</span>
                <span className="font-mono text-red-400 font-medium">£3.20M / yr</span>
              </div>
              <div className="flex justify-between p-2 bg-emerald-950/20 border border-emerald-800/40 rounded">
                <span className="text-emerald-300">Green Solar & Eco Utility Offsets:</span>
                <span className="font-mono text-emerald-400 font-bold">-£0.65M / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Academy Operational Overhead:</span>
                <span className="font-mono text-red-400 font-medium">£4.80M / yr</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white mb-3">Debt Servicing & Financing</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Annual Loan Interest Paid:</span>
                <span className="font-mono text-red-400 font-medium">
                  £{(weeklyDebt * 52 * 0.3 / 1000000).toFixed(2)}M / yr
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Principal Bond Amortization:</span>
                <span className="font-mono text-slate-300 font-medium">
                  £{(weeklyDebt * 52 * 0.7 / 1000000).toFixed(2)}M / yr
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold">
                <span className="text-slate-300">Total Annual Debt Service:</span>
                <span className="font-mono text-red-400">£{(weeklyDebt * 52 / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Financial Forecasting & FFP */}
      {activeSubTab === 'forecasting' && (
        <div className="space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">End-of-Season Financial Forecasting Engine</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate end-of-season financial outcomes based on league performance and merit payout tiers.
                </p>
              </div>

              {/* Scenario Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                {forecast.scenarios.map((sc, idx) => (
                  <button
                    key={sc.scenarioName}
                    onClick={() => setSelectedScenarioIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      selectedScenarioIndex === idx ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sc.scenarioName}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Scenario Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl mb-6">
              <div>
                <span className="text-xs text-slate-400 font-medium">Projected Finish Position</span>
                <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                  {currentScenario.projectedFinishPosition === 1 ? '1st' : `${currentScenario.projectedFinishPosition}th`}
                </div>
                <span className="text-xs text-slate-500">Merit Pool: £{(currentScenario.projectedBroadcastMerit / 1000000).toFixed(1)}M</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Projected Total Turnover</span>
                <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                  £{(currentScenario.projectedTotalTurnover / 1000000).toFixed(1)}M
                </div>
                <span className="text-xs text-slate-500">Total annual revenue</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Projected Net Profit / (Loss)</span>
                <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
                  currentScenario.projectedNetProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {currentScenario.projectedNetProfitLoss >= 0 ? '+' : ''}£{(currentScenario.projectedNetProfitLoss / 1000000).toFixed(1)}M
                </div>
                <span className="text-xs text-slate-500">After all operating costs</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Projected Closing Cash Balance</span>
                <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                  £{(currentScenario.projectedClosingBankBalance / 1000000).toFixed(1)}M
                </div>
                <span className="text-xs text-slate-500">At Gameweek 38</span>
              </div>
            </div>

            {/* FFP / PSR Stress Test Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">3-Year Rolling FFP / PSR Regulatory Matrix</span>
                <span className="text-xs text-slate-400 font-mono">Allowable 3-Year Loss Ceiling: £105.0M</span>
              </div>
              <div className="p-4 bg-slate-950/40">
                <div className="space-y-3">
                  {forecast.scenarios.map(sc => (
                    <div key={sc.scenarioName} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg gap-2">
                      <div className="flex items-center gap-3">
                        {sc.ffpCompliant ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-white">{sc.scenarioName}</div>
                          <div className="text-[11px] text-slate-400">
                            Finish: {sc.projectedFinishPosition}th · Turnover: £{(sc.projectedTotalTurnover / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-xs">
                        <div className="text-right">
                          <span className="text-slate-400 block text-[11px]">3-Year Rolling Loss</span>
                          <span className={`font-mono font-bold ${sc.projectedThreeYearRollingLoss <= 105000000 ? 'text-slate-200' : 'text-red-400'}`}>
                            £{(sc.projectedThreeYearRollingLoss / 1000000).toFixed(1)}M
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-slate-400 block text-[11px]">Regulatory Status</span>
                          <span className={`font-medium ${sc.ffpCompliant ? 'text-emerald-400' : 'text-red-400 font-bold'}`}>
                            {sc.ffpCompliant ? 'Compliant' : 'Sanction Risk'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Budgeting & Wage Caps */}
      {activeSubTab === 'budgeting' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Executive Budget Allocation</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Allocate cash reserves across squad acquisitions, capital projects, and emergency liquidity.
              </p>
            </div>

            {/* Transfer Budget Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Transfer Market Budget Cap</span>
                <span className="font-mono text-emerald-400 font-bold">£{(transferCapInput / 1000000).toFixed(1)}M</span>
              </div>
              <input
                type="range"
                min="5000000"
                max={Math.max(20000000, finances.bankBalance)}
                step="1000000"
                value={transferCapInput}
                onChange={e => setTransferCapInput(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">Funds available to the Sporting Director for player signings</span>
            </div>

            {/* Individual Player Wage Cap */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Individual Player Wage Ceiling</span>
                <span className="font-mono text-emerald-400 font-bold">£{(wageCapInput / 1000).toFixed(0)}k / week</span>
              </div>
              <input
                type="range"
                min="30000"
                max="250000"
                step="5000"
                value={wageCapInput}
                onChange={e => setWageCapInput(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">Prevents dressing room wage inflation and contract rebellions</span>
            </div>

            {/* Infrastructure Reserve */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Infrastructure & Ground Reserve</span>
                <span className="font-mono text-sky-400 font-bold">£{(reserveInput / 1000000).toFixed(1)}M</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(10000000, finances.bankBalance * 0.6)}
                step="500000"
                value={reserveInput}
                onChange={e => setReserveInput(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">Ring-fenced capital for stadium expansion and eco-sustainability</span>
            </div>

            {/* Target Wage-to-Turnover Ratio */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Target Wage-to-Turnover Ratio</span>
                <span className="font-mono text-amber-400 font-bold">{targetRatioInput}%</span>
              </div>
              <input
                type="range"
                min="45"
                max="75"
                step="1"
                value={targetRatioInput}
                onChange={e => setTargetRatioInput(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">Board guideline (UEFA recommended upper ceiling is 70%)</span>
            </div>

            <button
              onClick={handleSaveBudget}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
            >
              Enforce Budget Parameters
            </button>
          </div>

          {/* Current Squad Wage Distribution */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">First-Team Wage Distribution</h3>
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2">
              {club.players
                .slice()
                .sort((a, b) => b.wage - a.wage)
                .map(player => (
                  <div key={player.id} className="flex items-center justify-between p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{player.name}</span>
                        <span className="text-slate-500 text-[11px]">({player.position}, {player.age}yo)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        OVR: <span className="font-mono text-white font-semibold">{player.overall}</span> · Contract: {player.contractYears} yrs left
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-mono font-bold tabular-nums ${player.wage > wageCapInput ? 'text-red-400' : 'text-slate-200'}`}>
                        £{(player.wage / 1000).toFixed(0)}k / wk
                      </div>
                      {player.wage > wageCapInput && (
                        <span className="text-[10px] text-red-400 font-semibold block">Exceeds Cap</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: Debt Management & Refinancing */}
      {activeSubTab === 'debt' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Club Debt & Credit Facilities</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage long-term stadium bonds, commercial credit lines, and refinancing opportunities.
              </p>
            </div>

            <button
              onClick={() => setShowIssueModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Issue New Debt Facility</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(finances.bankLoans || []).length === 0 ? (
              <div className="col-span-2 p-8 bg-[#111827] border border-slate-800 rounded-xl text-center">
                <Landmark className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                <h4 className="text-sm font-bold text-white">Debt-Free Balance Sheet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  The club currently has no outstanding bank loans or stadium bonds. You can issue a facility if capital is required for major stadium expansion.
                </p>
              </div>
            ) : (
              finances.bankLoans.map(loan => {
                const earlyCost = Math.round(loan.remainingPrincipal * (1 + (loan.earlyPayoffPenalty || 0) / 100));
                const canPayoff = finances.bankBalance >= earlyCost;

                return (
                  <div key={loan.id} className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">{loan.type}</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{loan.name}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                        {loan.interestRate}% APR
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Remaining Principal</span>
                        <span className="font-mono font-bold text-white text-base">
                          £{(loan.remainingPrincipal / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Weekly Debt Service</span>
                        <span className="font-mono font-bold text-red-400 text-base">
                          £{(loan.weeklyRepayment / 1000).toFixed(0)}k / wk
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Remaining Term</span>
                        <span className="font-mono text-slate-300">
                          {loan.weeksRemaining} weeks ({Math.round(loan.weeksRemaining / 52)} yrs)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Early Settlement Cost</span>
                        <span className="font-mono text-slate-300">
                          £{(earlyCost / 1000000).toFixed(2)}M
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => payoffDebt(loan.id)}
                        disabled={!canPayoff}
                        className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-red-800/80 hover:bg-red-700 disabled:opacity-40 rounded-lg transition-colors text-center"
                      >
                        {canPayoff ? 'Pay Off Early' : 'Insufficient Reserves'}
                      </button>

                      {loan.interestRate > 4.5 && (
                        <button
                          onClick={() => refinanceDebt(loan.id, 4.2)}
                          disabled={finances.bankBalance < 250000}
                          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors text-center"
                        >
                          Refinance to 4.2% (£250k fee)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Issue Debt Facility Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Issue Club Debt Facility</h3>
            <p className="text-xs text-slate-400">
              Select credit facility terms to inject liquidity for stadium expansion or operational buffers.
            </p>

            <form onSubmit={handleIssueDebtSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Facility Instrument</label>
                <select
                  value={newDebtType}
                  onChange={e => setNewDebtType(e.target.value as DebtInstrument['type'])}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Green Eco-Bond">Green Eco-Bond (3.4% APR · ESG Certified)</option>
                  <option value="Stadium Infrastructure Bond">Stadium Infrastructure Bond (4.6% APR · Long-term)</option>
                  <option value="Commercial Term Loan">Commercial Term Loan (6.2% APR · Standard)</option>
                  <option value="Revolving Credit Facility">Revolving Credit Facility (7.5% APR · Short-term)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Facility Amount (£)</label>
                <input
                  type="number"
                  step="1000000"
                  min="5000000"
                  max="50000000"
                  value={newDebtAmount}
                  onChange={e => setNewDebtAmount(Number(e.target.value))}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Repayment Term</label>
                <select
                  value={newDebtTerm}
                  onChange={e => setNewDebtTerm(Number(e.target.value))}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value={104}>2 Years (104 weeks)</option>
                  <option value={260}>5 Years (260 weeks)</option>
                  <option value={520}>10 Years (520 weeks)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  Issue Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
