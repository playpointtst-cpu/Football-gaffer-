import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import {
  WORLD_NATIONS,
  CONFEDERATION_METADATA,
  COACHING_LICENSE_EXAM_QUESTIONS,
  NationInfo,
} from '../../data/nationsCatalog';
import { Continent, Confederation, TacticalStyle, ManagerProfile } from '../../types/game';
import {
  Award,
  CheckCircle2,
  ChevronDown,
  Globe,
  Search,
  Shield,
  Sparkles,
  User,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Check,
  AlertCircle,
  FileCheck,
  Building,
} from 'lucide-react';
import { TOP_10_WORLD_LEAGUES } from '../../data/worldLeagues';

interface PreGameSetupModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canDismiss?: boolean;
}

const TACTICAL_STYLES: TacticalStyle[] = [
  'High-Intensity Press',
  'Positional Tiki-Taka',
  'Direct Counter-Attack',
  'Pragmatic Low Block',
  'Fluid Wing Play',
];

const SUGGESTED_NAMES = [
  { first: 'Alexander', last: 'Vance' },
  { first: 'Marcus', last: 'Sterling' },
  { first: 'Julian', last: 'Navarro' },
  { first: 'Hansi', last: 'Fischer' },
  { first: 'Roberto', last: 'De Silva' },
  { first: 'Mateo', last: 'Kovacic' },
  { first: 'Kenji', last: 'Takahashi' },
  { first: 'Tariq', last: 'Al-Mansoor' },
  { first: 'Kofi', last: 'Mensah' },
  { first: 'Gabriel', last: 'Fontaine' },
];

export const PreGameSetupModal: React.FC<PreGameSetupModalProps> = ({
  isOpen,
  onClose,
  canDismiss = false,
}) => {
  const { state, setManagerProfile, selectClub, setTacticalDirective } = useGame();

  // Wizard steps: 'profile' -> 'exam' -> 'certificate'
  const [currentStep, setCurrentStep] = useState<'profile' | 'exam' | 'certificate'>(() => {
    return state.managerProfile ? 'certificate' : 'profile';
  });

  // Inputs
  const [firstName, setFirstName] = useState(state.managerProfile?.firstName || 'Marcus');
  const [lastName, setLastName] = useState(state.managerProfile?.lastName || 'Vance');
  
  // Selected Nation (Default to England or existing)
  const defaultNation = useMemo(() => {
    if (state.managerProfile) {
      const found = WORLD_NATIONS.find(n => n.name === state.managerProfile?.nationality);
      if (found) return found;
    }
    return WORLD_NATIONS[0]; // England
  }, [state.managerProfile]);

  const [selectedNation, setSelectedNation] = useState<NationInfo>(defaultNation);
  const [nationSearch, setNationSearch] = useState('');
  const [selectedContinentFilter, setSelectedContinentFilter] = useState<string>('All');
  const [isNationDropdownOpen, setIsNationDropdownOpen] = useState(false);

  // Selected Country & Club to manage
  const [selectedLeagueCountry, setSelectedLeagueCountry] = useState<string>(
    state.managerProfile?.selectedCountry || 'England'
  );
  const [selectedClubId, setSelectedClubId] = useState<string>(
    state.selectedClub.id || 'metro'
  );

  // Tactical style
  const [tacticalStyle, setTacticalStyle] = useState<TacticalStyle>(
    state.selectedClub.tacticalDirective || 'High-Intensity Press'
  );

  // Exam answers: questionId -> selected option letter
  const [examAnswers, setExamAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({
    1: 'B',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'A',
  });
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number>(100);

  // Computed Confederation & Metadata based on selected nationality
  const confedMeta = useMemo(() => {
    return CONFEDERATION_METADATA[selectedNation.confederation];
  }, [selectedNation.confederation]);

  // Filtered Nations List
  const filteredNations = useMemo(() => {
    return WORLD_NATIONS.filter(n => {
      const matchesSearch =
        n.name.toLowerCase().includes(nationSearch.toLowerCase()) ||
        n.code.toLowerCase().includes(nationSearch.toLowerCase());
      const matchesContinent =
        selectedContinentFilter === 'All' || n.continent === selectedContinentFilter;
      return matchesSearch && matchesContinent;
    });
  }, [nationSearch, selectedContinentFilter]);

  // Available clubs in selected country
  const availableClubsForCountry = useMemo(() => {
    const country = TOP_10_WORLD_LEAGUES.find(c => c.name.toLowerCase() === selectedLeagueCountry.toLowerCase());
    if (!country) return [];
    // Flatten tier 1 clubs
    return country.divisions[0]?.clubs || [];
  }, [selectedLeagueCountry]);

  const handleRandomizeName = () => {
    const randomPick = SUGGESTED_NAMES[Math.floor(Math.random() * SUGGESTED_NAMES.length)];
    setFirstName(randomPick.first);
    setLastName(randomPick.last);
  };

  const handleSelectNation = (nation: NationInfo) => {
    setSelectedNation(nation);
    setIsNationDropdownOpen(false);
    setNationSearch('');
  };

  const handleStartExam = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    setCurrentStep('exam');
  };

  const handleAnswerSelect = (questionId: number, letter: 'A' | 'B' | 'C' | 'D') => {
    setExamAnswers(prev => ({
      ...prev,
      [questionId]: letter,
    }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    COACHING_LICENSE_EXAM_QUESTIONS.forEach(q => {
      const chosen = examAnswers[q.id];
      const correctOption = q.options.find(o => o.isCorrect);
      if (chosen && correctOption && chosen === correctOption.letter) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / COACHING_LICENSE_EXAM_QUESTIONS.length) * 100);
    setCalculatedScore(scorePct);
    setExamSubmitted(true);

    // Build the official profile
    const certificateNumber = `${selectedNation.confederation}-${new Date().getFullYear()}-C-${Math.floor(10000 + Math.random() * 90000)}`;
    const newProfile: ManagerProfile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      nationality: selectedNation.name,
      nationalityCode: selectedNation.code,
      nationalityFlag: selectedNation.flag,
      continent: selectedNation.continent,
      confederation: selectedNation.confederation,
      selectedCountry: selectedLeagueCountry,
      selectedClubId: selectedClubId,
      selectedClubName: state.selectedClub.name,
      licenseName: confedMeta.lowestLicenseName,
      licenseLevel: 'Tier 1 - Foundation / Lowest',
      licenseDescription: confedMeta.lowestLicenseDesc,
      examScore: scorePct,
      examPassed: scorePct >= 60,
      examDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      certificateNumber,
      tacticalPhilosophy: tacticalStyle,
      reputationScore: scorePct === 100 ? 55 : 45,
    };

    setManagerProfile(newProfile);
    setTacticalDirective(tacticalStyle);

    setCurrentStep('certificate');
  };

  const handleCompleteAndEnter = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0d1424] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Top Header Banner with Dynamic Confederation Theming */}
        <div className={`p-6 bg-gradient-to-r ${confedMeta.bannerGradient} border-b border-slate-700/60 relative`}>
          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-black/30 text-xs font-semibold hover:bg-black/50 transition-colors"
            >
              ✕ Close
            </button>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner">
                {selectedNation.flag}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Official Executive Accreditation
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    {confedMeta.code} Convention
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                  Apex Football Executive • Career Onboarding
                </h1>
                <p className="text-xs text-slate-300">
                  Accredited by {confedMeta.fullName} ({confedMeta.regionName})
                </p>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/50">
              <button
                onClick={() => setCurrentStep('profile')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentStep === 'profile'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Manager Identity
              </button>
              <span className="text-slate-600 text-xs">→</span>
              <button
                onClick={() => currentStep !== 'profile' && setCurrentStep('exam')}
                disabled={currentStep === 'profile' && (!firstName || !lastName)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentStep === 'exam'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : currentStep === 'certificate'
                    ? 'text-emerald-400'
                    : 'text-slate-500 cursor-not-allowed'
                }`}
              >
                2. Coaching Exam
              </button>
              <span className="text-slate-600 text-xs">→</span>
              <button
                onClick={() => state.managerProfile && setCurrentStep('certificate')}
                disabled={!state.managerProfile}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentStep === 'certificate'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 cursor-not-allowed'
                }`}
              >
                3. Accredited License
              </button>
            </div>
          </div>
        </div>

        {/* STEP 1: MANAGER IDENTITY & NATION SELECTION */}
        {currentStep === 'profile' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">Confederation Regulations:</span> Every candidate enters with the{' '}
                <strong className="text-emerald-400">1st & lowest coaching tier</strong> authorized by their home continent’s confederation. 
                Your license title dynamically aligns with your nationality ({selectedNation.continent} → <span className="font-bold text-amber-400">{confedMeta.lowestLicenseName}</span>).
              </div>
            </div>

            {/* Manager Name Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Manager Legal Name & Credentials
                </label>
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Randomize Name
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="e.g. Marcus"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="e.g. Vance"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Global Nationality Selector (Dropdown with search & continent filters) */}
            <div className="space-y-2 relative">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Nationality (All Worldwide Nations Included)
              </label>

              {/* Selected Nation Display Trigger */}
              <button
                type="button"
                onClick={() => setIsNationDropdownOpen(!isNationDropdownOpen)}
                className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-3 text-left flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedNation.flag}</span>
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      {selectedNation.name}
                      <span className="text-xs text-slate-400 font-mono">({selectedNation.code})</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Continent: <span className="text-slate-300 font-medium">{selectedNation.continent}</span> • 
                      Confederation: <span className="text-amber-400 font-semibold">{selectedNation.confederation}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-lg font-mono border border-slate-700">
                    {confedMeta.lowestLicenseBadge}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isNationDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isNationDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl p-3 space-y-3 max-h-96 flex flex-col">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={nationSearch}
                      onChange={e => setNationSearch(e.target.value)}
                      placeholder="Search any nation or country code..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Continent Filter Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                    {['All', 'Europe', 'Asia', 'South America', 'North America', 'Africa', 'Oceania'].map(cont => (
                      <button
                        key={cont}
                        type="button"
                        onClick={() => setSelectedContinentFilter(cont)}
                        className={`px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                          selectedContinentFilter === cont
                            ? 'bg-emerald-600 text-white font-semibold'
                            : 'bg-slate-800/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cont}
                      </button>
                    ))}
                  </div>

                  {/* Nations List */}
                  <div className="overflow-y-auto flex-1 space-y-1 divide-y divide-slate-800/60 max-h-56 pr-1">
                    {filteredNations.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No nation found matching "{nationSearch}".
                      </div>
                    ) : (
                      filteredNations.map(nation => (
                        <button
                          key={nation.name}
                          type="button"
                          onClick={() => handleSelectNation(nation)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                            selectedNation.name === nation.name
                              ? 'bg-emerald-950/60 border border-emerald-500/30 text-white'
                              : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{nation.flag}</span>
                            <span className="font-medium text-white">{nation.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({nation.code})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">{nation.continent}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                              {nation.confederation}
                            </span>
                            {selectedNation.name === nation.name && (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic License Card preview */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Mandatory Foundational Entry Tier (Lowest Available)
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {confedMeta.lowestLicenseName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {confedMeta.lowestLicenseDesc}
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                <div className="text-[10px] text-slate-400 font-mono">Governing Confederation</div>
                <div className="text-xs font-bold text-white">{confedMeta.code}</div>
                <div className="text-[10px] text-slate-500 mt-1">Tier 1 of {confedMeta.licenseTiers.length}</div>
              </div>
            </div>

            {/* Country & Starting Club Setup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  Management League / Host Country
                </label>
                <select
                  value={selectedLeagueCountry}
                  onChange={e => {
                    setSelectedLeagueCountry(e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {TOP_10_WORLD_LEAGUES.map(league => (
                    <option key={league.id} value={league.name}>
                      {league.flag} {league.name} ({league.divisions[0]?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Tactical Philosophy Directive
                </label>
                <select
                  value={tacticalStyle}
                  onChange={e => setTacticalStyle(e.target.value as TacticalStyle)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {TACTICAL_STYLES.map(style => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleStartExam}
                disabled={!firstName.trim() || !lastName.trim()}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <span>Proceed to {confedMeta.code} Coaching Exam</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COACHING LICENSE EXAMINATION (LOWEST TIER) */}
        {currentStep === 'exam' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <FileCheck className="w-4 h-4" />
                  Official Examination: {confedMeta.lowestLicenseName}
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  Candidate: {firstName} {lastName} ({selectedNation.flag} {selectedNation.name})
                </h2>
                <p className="text-xs text-slate-400">
                  Passing requirement: 60% (3 of 5 questions correct). Answer all tactical questions to secure your badge.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-mono font-semibold">
                  {confedMeta.code} Level 1
                </span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {COACHING_LICENSE_EXAM_QUESTIONS.map((q, idx) => {
                const currentAnswer = examAnswers[q.id];

                return (
                  <div
                    key={q.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                        Question {idx + 1} • {q.category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">1 Mark</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white leading-relaxed">
                      {q.question}
                    </h4>
                    <p className="text-xs text-slate-400 italic">
                      Context: {q.scenario}
                    </p>

                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {q.options.map(opt => {
                        const isSelected = currentAnswer === opt.letter;

                        return (
                          <button
                            key={opt.letter}
                            type="button"
                            onClick={() => handleAnswerSelect(q.id, opt.letter)}
                            className={`p-3 rounded-lg text-left text-xs transition-all flex items-start gap-3 border ${
                              isSelected
                                ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-sm'
                                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {opt.letter}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Exam Navigation / Submission */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep('profile')}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Profile
              </button>

              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <span>Submit Exam & Receive Official Accreditation</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ACCREDITED LICENSE CERTIFICATE & EMBOSSED CREDENTIAL */}
        {currentStep === 'certificate' && state.managerProfile && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Congratulatory Banner */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Examination Result: {state.managerProfile.examScore}% • Accredited with Distinction
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Official {state.managerProfile.confederation} Coaching License Conferred
              </h2>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">
                The {confedMeta.fullName} has formally verified and issued your foundational executive coaching badge. 
                You are registered as Chief Executive & Sporting Director.
              </p>
            </div>

            {/* Official Diploma / Certificate Card */}
            <div className="relative bg-gradient-to-b from-[#131d36] to-[#0a1020] border-2 border-amber-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
              {/* Guilloche / Watermark Pattern */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-8 border-amber-500/10 pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full border-8 border-amber-500/10 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                
                {/* Certificate Header */}
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif text-2xl font-black">
                      {state.managerProfile.confederation.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-[10px] tracking-widest uppercase font-bold text-amber-400">
                        {state.managerProfile.confederation} COACHING DIPLOMA
                      </div>
                      <div className="text-xs text-slate-300 font-serif">
                        {confedMeta.fullName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Certificate ID</div>
                    <div className="text-xs font-mono font-bold text-amber-400">{state.managerProfile.certificateNumber}</div>
                    <div className="text-[10px] text-slate-500">{state.managerProfile.examDate}</div>
                  </div>
                </div>

                {/* Candidate Name & Title */}
                <div className="text-center py-2 space-y-1">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                    This certifies that
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-serif flex items-center justify-center gap-3">
                    <span>{state.managerProfile.fullName}</span>
                    <span className="text-2xl">{state.managerProfile.nationalityFlag}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Nationality: <strong className="text-white">{state.managerProfile.nationality}</strong> ({state.managerProfile.continent})
                  </div>
                </div>

                {/* License Conferred Badge Box */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                    Level 1 Entry Qualification Awarded
                  </div>
                  <div className="text-xl font-black text-amber-300 tracking-tight font-serif">
                    {state.managerProfile.licenseName}
                  </div>
                  <div className="text-xs text-slate-300">
                    {state.managerProfile.licenseDescription}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Tactical Style</span>
                    <span className="font-semibold text-emerald-400">{state.managerProfile.tacticalPhilosophy}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Exam Grade</span>
                    <span className="font-semibold text-white">{state.managerProfile.examScore}% (1st Attempt)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Club</span>
                    <span className="font-semibold text-white">{state.selectedClub.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Host League</span>
                    <span className="font-semibold text-amber-400">{state.managerProfile.selectedCountry}</span>
                  </div>
                </div>

                {/* Progression Roadmap */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                    <span>{state.managerProfile.confederation} Coaching License Ladder</span>
                    <span className="text-emerald-400 text-[10px]">Active Credential: {confedMeta.lowestLicenseBadge}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {confedMeta.licenseTiers.map((tier, idx) => {
                      const isCurrent = idx === 0;
                      return (
                        <div
                          key={tier}
                          className={`p-2 rounded-lg text-center text-xs border ${
                            isCurrent
                              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-bold'
                              : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                          }`}
                        >
                          <div className="text-[10px] font-mono">
                            {isCurrent ? '★ Current' : `Tier ${idx + 1}`}
                          </div>
                          <div className="truncate">{tier}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Official Signatures Stamp */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Accredited Sporting Director & Executive Badge</span>
                  </div>
                  <div className="font-serif italic text-amber-300/80">
                    {confedMeta.governingBodyMotto}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep('profile')}
                className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Edit Profile or Retake Exam
              </button>

              <button
                type="button"
                onClick={handleCompleteAndEnter}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition-all cursor-pointer"
              >
                <span>Enter Boardroom Suite & Begin Career</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
