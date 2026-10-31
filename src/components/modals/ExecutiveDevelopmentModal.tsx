import React, { useState } from 'react';
import { 
  Award, 
  Shield, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  RefreshCw, 
  X, 
  Sparkles, 
  Building2, 
  Wallet, 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  ChevronRight,
  AlertCircle,
  FileCheck,
  Check
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { 
  EXECUTIVE_QUALIFICATIONS, 
  getExecutiveQualificationById, 
  calculateExecutiveReputation 
} from '../../data/executiveQualifications';
import { 
  ExecutiveQualificationId, 
  ExecutiveQualificationDefinition, 
  ExecutiveAssessmentQuestion 
} from '../../types/game';

interface ExecutiveDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQualificationId?: ExecutiveQualificationId;
}

export const ExecutiveDevelopmentModal: React.FC<ExecutiveDevelopmentModalProps> = ({
  isOpen,
  onClose,
  defaultQualificationId,
}) => {
  const { state, earnExecutiveQualification } = useGame();
  const manager = state.managerProfile;
  const club = state.selectedClub;

  // Active view: 'overview' (qualifications catalog) | 'exam' (active assessment) | 'certificate' (awarded credentials view)
  const [activeView, setActiveView] = useState<'overview' | 'exam' | 'certificate'>('overview');
  const [selectedQualId, setSelectedQualId] = useState<ExecutiveQualificationId>(
    defaultQualificationId || 'admin_certificate'
  );

  // Exam state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [showFeedbackForCurrent, setShowFeedbackForCurrent] = useState<boolean>(false);
  const [examCompleted, setExamCompleted] = useState<boolean>(false);
  const [awardedCertInfo, setAwardedCertInfo] = useState<{
    title: string;
    score: number;
    certId: string;
    date: string;
  } | null>(null);

  if (!isOpen) return null;

  const experiencePoints = manager?.executiveExperience || 0;
  const completedList = manager?.completedExecutiveQualifications || [];
  
  const currentQualDef = getExecutiveQualificationById(selectedQualId) || EXECUTIVE_QUALIFICATIONS[0];

  // Check if player has earned qualification
  const hasEarnedQual = (id: ExecutiveQualificationId) => {
    return completedList.some(q => q.id === id);
  };

  // Check if qualification is eligible to sit
  const isQualEligible = (def: ExecutiveQualificationDefinition) => {
    const meetsXp = experiencePoints >= def.requiredXp;
    const meetsPrereq = !def.prerequisiteId || hasEarnedQual(def.prerequisiteId);
    return meetsXp && meetsPrereq;
  };

  const handleStartExam = (qualId: ExecutiveQualificationId) => {
    setSelectedQualId(qualId);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowFeedbackForCurrent(false);
    setExamCompleted(false);
    setActiveView('exam');
  };

  const handleSelectOption = (questionId: string, optionLetter: 'A' | 'B' | 'C' | 'D') => {
    if (showFeedbackForCurrent) return; // Locked until next question
    setUserAnswers(prev => ({ ...prev, [questionId]: optionLetter }));
    setShowFeedbackForCurrent(true);
  };

  const handleNextQuestion = () => {
    setShowFeedbackForCurrent(false);
    if (currentQuestionIndex + 1 < currentQualDef.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      currentQualDef.questions.forEach(q => {
        const chosen = userAnswers[q.id];
        const opt = q.options.find(o => o.letter === chosen);
        if (opt && opt.isCorrect) {
          correctCount++;
        }
      });
      const scorePct = Math.round((correctCount / currentQualDef.questions.length) * 100);
      const passed = scorePct >= currentQualDef.passingScorePercent;

      if (passed) {
        const certId = `IPFE-${currentQualDef.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        earnExecutiveQualification(currentQualDef.id, scorePct);
        setAwardedCertInfo({
          title: currentQualDef.title,
          score: scorePct,
          certId,
          date: dateStr,
        });
        setActiveView('certificate');
      }
      setExamCompleted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border border-slate-800 rounded-3xl max-w-4xl w-full text-slate-100 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden relative">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-wide">
                  Executive Development & Accreditation
                </h2>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  Professional Directorate
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Formal education, executive experience, and professional standing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeView !== 'overview' && (
              <button
                onClick={() => setActiveView('overview')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
              >
                ← Qualifications Index
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Executive Stats & Standing Header */}
        <div className="px-6 py-3.5 bg-slate-900/60 border-b border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Executive</div>
            <div className="font-bold text-white truncate flex items-center gap-1.5 mt-0.5">
              <span>{manager?.nationalityFlag || '👔'}</span>
              <span>{manager?.fullName || 'Chief Executive'}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Experience (XP)</div>
            <div className="font-bold font-mono text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{experiencePoints} XP</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Reputation Standing</div>
            <div className="font-bold font-mono text-amber-400 mt-0.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{manager?.reputationScore || 50}/100</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Credentials Earned</div>
            <div className="font-bold font-mono text-white mt-0.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>{completedList.length} of 4 Completed</span>
            </div>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* VIEW 1: Overview of Qualifications */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              {/* Concept Separation Notice */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white">Three Distinct Pillars of Executive Career Growth:</div>
                  <div className="text-slate-300 leading-relaxed grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="font-bold text-emerald-400">1. Experience (XP):</span> Earned exclusively through practical club management (advancing match weeks, completing infrastructure, signing sponsors, youth promotions).
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="font-bold text-amber-400">2. Reputation:</span> Reflects your professional standing and peer esteem, driven dynamically by board confidence, fan trust, win rate, and FFP compliance.
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="font-bold text-blue-400">3. Qualifications:</span> Formal education unlocking advanced management options, strategic instruments, and elite scouting clearance.
                    </div>
                  </div>
                </div>
              </div>

              {/* The 4 Qualifications Pathways */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Executive Qualifications Curriculum</span>
                  <span className="text-[11px] font-mono text-slate-500">Passing Threshold: 75%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EXECUTIVE_QUALIFICATIONS.map(qual => {
                    const earned = hasEarnedQual(qual.id);
                    const eligible = isQualEligible(qual);
                    const completedData = completedList.find(c => c.id === qual.id);

                    return (
                      <div
                        key={qual.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          earned
                            ? 'bg-gradient-to-br from-emerald-950/30 to-slate-900 border-emerald-500/40 shadow-sm'
                            : eligible
                            ? 'bg-slate-900/90 border-slate-700 hover:border-emerald-500/50'
                            : 'bg-slate-900/40 border-slate-800/80 opacity-75'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              Level {qual.level}
                            </span>
                            {earned ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3 h-3" />
                                Accredited
                              </span>
                            ) : eligible ? (
                              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                Ready to Sit Exam
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                                <Lock className="w-3 h-3" />
                                {qual.requiredXp} XP Required
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-white">{qual.title}</h3>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {qual.description}
                            </p>
                          </div>

                          {/* Unlocked Management Privileges */}
                          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                              Unlocked Management Opportunities:
                            </span>
                            <ul className="space-y-1">
                              {qual.unlockedCapabilities.map((cap, i) => (
                                <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                                  <span>{cap}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                          <div className="text-[10px] text-slate-500 font-mono">
                            {earned && completedData
                              ? `Graduated Wk ${completedData.completedWeek} (${completedData.score}%)`
                              : `Governed by ${qual.governingBody}`}
                          </div>

                          {earned ? (
                            <button
                              onClick={() => {
                                setSelectedQualId(qual.id);
                                setAwardedCertInfo({
                                  title: qual.title,
                                  score: completedData?.score || 100,
                                  certId: completedData?.certificateId || 'IPFE-CERT-OFFICIAL',
                                  date: completedData?.awardedDate || 'Season 2026',
                                });
                                setActiveView('certificate');
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>View Diploma</span>
                            </button>
                          ) : eligible ? (
                            <button
                              onClick={() => handleStartExam(qual.id)}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              <span>Sit Examination</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                              <span>Needs {qual.requiredXp - experiencePoints} more XP</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Examination Room */}
          {activeView === 'exam' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Exam Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    Official Assessment • {currentQualDef.title}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Scenario Question {currentQuestionIndex + 1} of {currentQualDef.questions.length}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400">
                    Category: <strong className="text-slate-200">{currentQualDef.questions[currentQuestionIndex].category}</strong>
                  </span>
                </div>
              </div>

              {/* Question Card */}
              {(() => {
                const q = currentQualDef.questions[currentQuestionIndex];
                const selectedOptionLetter = userAnswers[q.id];

                return (
                  <div className="space-y-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
                    {/* Scenario Box */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block mb-1">
                        Executive Situation Briefing:
                      </span>
                      {q.scenario}
                    </div>

                    <h4 className="text-sm font-bold text-white pt-1">
                      {q.question}
                    </h4>

                    {/* Options */}
                    <div className="space-y-2.5 pt-2">
                      {q.options.map(opt => {
                        const isChosen = selectedOptionLetter === opt.letter;
                        let optionStyle = 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800 cursor-pointer';

                        if (showFeedbackForCurrent) {
                          if (opt.isCorrect) {
                            optionStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 font-semibold';
                          } else if (isChosen && !opt.isCorrect) {
                            optionStyle = 'bg-rose-950/60 border-rose-500/80 text-rose-200';
                          } else {
                            optionStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                          }
                        }

                        return (
                          <div
                            key={opt.letter}
                            onClick={() => !showFeedbackForCurrent && handleSelectOption(q.id, opt.letter)}
                            className={`p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 ${optionStyle}`}
                          >
                            <span className="w-5 h-5 rounded-md bg-slate-700/60 flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                              {opt.letter}
                            </span>
                            <div className="flex-1 leading-relaxed">
                              {opt.text}
                            </div>
                            {showFeedbackForCurrent && opt.isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
                    {showFeedbackForCurrent && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mt-4 animate-in fade-in space-y-3">
                        <div className="text-xs leading-relaxed">
                          <span className="font-bold text-slate-300 block mb-1">
                            Executive Board Review Rationale:
                          </span>
                          <span className="text-slate-400">
                            {q.options.find(o => o.letter === selectedOptionLetter)?.feedback}
                          </span>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={handleNextQuestion}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            <span>{currentQuestionIndex + 1 < currentQualDef.questions.length ? 'Next Scenario' : 'Conclude Assessment'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* VIEW 3: Awarded Diploma Certificate */}
          {activeView === 'certificate' && awardedCertInfo && (
            <div className="max-w-xl mx-auto space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0d1424] to-[#0d1424] border-2 border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center font-extrabold text-2xl shadow-inner">
                  <Award className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    Official Executive Diploma
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    {awardedCertInfo.title}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Accredited by the {currentQualDef.governingBody}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                  <div className="text-slate-300">
                    This certifies that <strong className="text-white">{manager?.fullName || 'Chief Executive'}</strong> has successfully passed the formal executive assessment with distinction:
                  </div>
                  <div className="text-emerald-400 font-bold font-mono text-sm">
                    Assessment Score: {awardedCertInfo.score}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Certificate Ref:</span>
                    <span className="text-slate-300 font-bold">{awardedCertInfo.certId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Accreditation Date:</span>
                    <span className="text-slate-300">{awardedCertInfo.date}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveView('overview')}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg cursor-pointer"
                  >
                    Return to Executive Suite
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Status Bar */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{club.name} • Professional Executive Development Portal</span>
          <span className="font-mono text-[11px] text-slate-500">IPFE Certified Framework</span>
        </div>
      </div>
    </div>
  );
};
