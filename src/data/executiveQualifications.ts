import { ExecutiveQualificationDefinition } from '../types/game';

export const EXECUTIVE_QUALIFICATIONS: ExecutiveQualificationDefinition[] = [
  // 1. Football Administration Certificate
  {
    id: 'admin_certificate',
    title: 'Football Administration Certificate',
    level: 1,
    subtitle: 'Foundation Executive Credential in Club Governance & Operational Compliance',
    description: 'Foundational executive qualification establishing rigorous mastery over club statutory governance, player registration compliance, operating wage ratios, matchday safety protocols, and boardroom accounting standards.',
    requiredXp: 0,
    governingBody: 'Institute of Professional Football Executives (IPFE)',
    unlockedCapabilities: [
      'Standard Financial Ledger Reallocation (flexibility between transfer & wage envelopes)',
      'Domestic Scouting Clearance (detailed tactical & character profiling)',
      'Short-term Operating Credit Lines & revolving debt facilities',
      'Boardroom Strategic Briefings & KPI visibility'
    ],
    passingScorePercent: 75,
    questions: [
      {
        id: 'admin_q1',
        category: 'Financial Planning & Wage Management',
        scenario: 'Your mid-season payroll audit reveals the club’s wage-to-turnover ratio has climbed to 76%, putting you dangerously close to league financial sustainability thresholds.',
        question: 'As Chief Executive, what is your primary strategic intervention to stabilize club finances without inducing dressing room revolt?',
        options: [
          {
            letter: 'A',
            text: 'Conduct a squad wage audit to freeze non-essential squad renewals, offload high-earning fringe players during the window, and restructure incoming contracts with performance incentives.',
            isCorrect: true,
            feedback: 'Exemplary executive governance. Trimming unproductive fringe wages while linking new commitments to sporting performance restores financial equilibrium without degrading starting quality.'
          },
          {
            letter: 'B',
            text: 'Default on matchday vendor payments and take emergency payday loans at 30% APR.',
            isCorrect: false,
            feedback: 'Disastrous. Compound interest on predatory debt drives clubs into administration and risks immediate points deductions.'
          },
          {
            letter: 'C',
            text: 'Unilaterally cut all active player wages by 50% without consulting the players’ union.',
            isCorrect: false,
            feedback: 'Breaches statutory employment law. Players would walk on free transfers and file breach-of-contract lawsuits.'
          },
          {
            letter: 'D',
            text: 'Ignore the ratio until the league issues an official sanction.',
            isCorrect: false,
            feedback: 'Passive negligence leads directly to transfer embargos and board dismissal.'
          }
        ]
      },
      {
        id: 'admin_q2',
        category: 'Club Governance & Regulations',
        scenario: 'On deadline day, your recruitment team finalizes an international signing, but discovering a missing work permit visa clearance endorsement 20 minutes before window closure.',
        question: 'What is the correct administrative course of action?',
        options: [
          {
            letter: 'A',
            text: 'Submit the standard provisional deal sheet to register the player, but hold back matchday squad deployment until full governing body work endorsement is verified.',
            isCorrect: true,
            feedback: 'Correct! Timely filing of the deal sheet secures the transfer rights while strict adherence to non-selection prevents playing an ineligible player.'
          },
          {
            letter: 'B',
            text: 'Forge the missing immigration stamps to ensure the player starts on Saturday.',
            isCorrect: false,
            feedback: 'Criminal misconduct resulting in lifelong bans from football management and criminal prosecution.'
          },
          {
            letter: 'C',
            text: 'Field the player anyway under a fake domestic pseudonym.',
            isCorrect: false,
            feedback: 'Immediate match forfeiture, hefty regulatory fines, and reputational disgrace.'
          },
          {
            letter: 'D',
            text: 'Tear up the transfer documents and fire the club secretary immediately.',
            isCorrect: false,
            feedback: 'Destroys club relations with the selling club and exposes the club to financial liability.'
          }
        ]
      },
      {
        id: 'admin_q3',
        category: 'Matchday Operations & Crisis Management',
        scenario: 'Three hours before a 35,000-seat sellout league derby, severe localized freezing causes burst water mains in the main stand concourse and creates localized external ice hazards.',
        question: 'How should the executive leadership team manage this operational safety crisis?',
        options: [
          {
            letter: 'A',
            text: 'Convene the Emergency Stadium Safety Committee with local police and fire services, assess safe concourse redirection, and communicate clear arrival instructions to supporters.',
            isCorrect: true,
            feedback: 'Correct! Executive protocol prioritizes public safety, statutory compliance with the Safety Advisory Group (SAG), and transparent crowd communication.'
          },
          {
            letter: 'B',
            text: 'Lock all turnstiles and refuse to answer the phone to emergency services.',
            isCorrect: false,
            feedback: 'Dangerous crowd containment breach risking crush injuries and loss of safety certificate.'
          },
          {
            letter: 'C',
            text: 'Ignore the standing water and open turnstiles without any gritting or steward rerouting.',
            isCorrect: false,
            feedback: 'Violates statutory safety at sports grounds duties, exposing directors to personal liability.'
          },
          {
            letter: 'D',
            text: 'Cancel the fixture instantly without consulting match officials or local transport authorities.',
            isCorrect: false,
            feedback: 'Premature unilateral abandonment incurs league compensation fines when manageable solutions existed.'
          }
        ]
      },
      {
        id: 'admin_q4',
        category: 'Boardroom Governance & Long-Term Strategy',
        scenario: 'The club chairman wants to liquidate the club’s training ground land for quick short-term property revenue to sign an aging celebrity striker.',
        question: 'How does a qualified football administrator advise the board?',
        options: [
          {
            letter: 'A',
            text: 'Present a 5-year financial impact dossier demonstrating how preserving academy infrastructure yields higher capital return and long-term asset value than a short-term marquee signing.',
            isCorrect: true,
            feedback: 'Correct! Strong executives protect core infrastructure assets with empirical financial and sporting data to steer the board toward sustainable value creation.'
          },
          {
            letter: 'B',
            text: 'Sign off on the sale immediately to secure a popular headline for the local paper.',
            isCorrect: false,
            feedback: 'Deprives the club of its training ground, permanently crippling player conditioning and youth pathways.'
          },
          {
            letter: 'C',
            text: 'Leak private board minutes to the tabloid press to publicly humiliate the chairman.',
            isCorrect: false,
            feedback: 'Breaches fiduciary duty and guarantees immediate termination for gross misconduct.'
          },
          {
            letter: 'D',
            text: 'Resign on the spot and leave the club with zero executive leadership.',
            isCorrect: false,
            feedback: 'Abdicates managerial responsibility without defending the club’s long-term interests.'
          }
        ]
      }
    ]
  },

  // 2. Sporting Management Diploma
  {
    id: 'sporting_diploma',
    title: 'Sporting Management Diploma',
    level: 2,
    subtitle: 'Professional Sporting Directorate, Squad Architecture & Recruitment Strategy',
    description: 'Advanced credential focusing on multi-window squad construction, performance-incentivized contract negotiations, data-informed recruitment pipelines, and youth transition frameworks.',
    requiredXp: 150,
    prerequisiteId: 'admin_certificate',
    governingBody: 'European Association of Sporting Directors (EASD)',
    unlockedCapabilities: [
      'Incentive-Laden Contract Structuring (appearance clauses, goal bonuses, buyback provisions)',
      'Continental & Regional Scouting Clearance (South America & European pipeline access)',
      'Youth Academy Loan Placement & Senior Mentorship frameworks',
      'Squad Amortization & Age-Profile Depreciation Auditing'
    ],
    passingScorePercent: 75,
    questions: [
      {
        id: 'sporting_q1',
        category: 'Transfer Strategy & Recruitment',
        scenario: 'Your star 26-year-old winger enters the final 12 months of his contract, demanding £150,000/week (twice your club wage ceiling). An overseas club offers £38,000,000 in cash today.',
        question: 'What is the optimal Sporting Director strategy to protect the club’s sporting and financial health?',
        options: [
          {
            letter: 'A',
            text: 'Accept the £38M valuation, reinvest 40% into an identified high-potential 21-year-old replacement on sustainable wages, and allocate remainder to the infrastructure reserve.',
            isCorrect: true,
            feedback: 'Masterclass in squad asset cycling. Monetizing expiring contracts prevents catastrophic free agency loss while rejuvenating squad age profile.'
          },
          {
            letter: 'B',
            text: 'Cave in and pay £150,000/week, triggering contract renegotiation demands from all other 24 squad members.',
            isCorrect: false,
            feedback: 'Shatters squad wage parity and triggers irreversible payroll inflation across the dressing room.'
          },
          {
            letter: 'C',
            text: 'Refuse all offers, let the player run down his contract, and lose him for £0 next summer.',
            isCorrect: false,
            feedback: 'Asset mismanagement resulting in tens of millions of lost value and zero reinvestment funds.'
          },
          {
            letter: 'D',
            text: 'Banish the player to train alone in a public park to show dominance.',
            isCorrect: false,
            feedback: 'Invites constructive dismissal claims, degrades player market value, and alienates agent networks.'
          }
        ]
      },
      {
        id: 'sporting_q2',
        category: 'Contract Negotiations',
        scenario: 'A promising 20-year-old midfielder’s representative insists on an unrestricted £15M release clause, which you believe is below his future ceiling.',
        question: 'How do you negotiate this clause to safeguard club value while sealing the player’s commitment?',
        options: [
          {
            letter: 'A',
            text: 'Negotiate a escalating release clause that triggers only for Champions League clubs at £40M, while offering performance escalators for international caps and team trophies.',
            isCorrect: true,
            feedback: 'Superb negotiation. Tailoring release clauses with performance-contingent thresholds and higher triggers aligns player ambition with club equity protection.'
          },
          {
            letter: 'B',
            text: 'Accept the £15M release clause without any counter-proposal.',
            isCorrect: false,
            feedback: 'Exposes the club to predatory bids well below true fair market value.'
          },
          {
            letter: 'C',
            text: 'Refuse to include any bonuses and tell the agent that players are lucky to play for this club.',
            isCorrect: false,
            feedback: 'Collapses the negotiation and pushes the young talent toward league rivals.'
          },
          {
            letter: 'D',
            text: 'Offer the agent an illegal undisclosed brown envelope cash payment under the table.',
            isCorrect: false,
            feedback: 'Breaches FIFA agent regulations, triggering disciplinary proceedings and transfer bans.'
          }
        ]
      },
      {
        id: 'sporting_q3',
        category: 'Youth Academy Development',
        scenario: 'Your Category 1 Academy produces an exceptional 17-year-old attacking midfielder who has outgrown the U21 league but cannot yet break into the senior starting XI.',
        question: 'What developmental pathway maximizes this asset’s valuation and match readiness?',
        options: [
          {
            letter: 'A',
            text: 'Arrange a strategic season-long loan to a high-tempo Championship club with a contractual minimum 60% match-start guarantee and January recall clause.',
            isCorrect: true,
            feedback: 'Correct! Structured loans with verified playing-time guarantees bridge the academy-to-senior gulf without stalling psychological and physical growth.'
          },
          {
            letter: 'B',
            text: 'Keep him on the senior bench for 38 matches without playing a single minute.',
            isCorrect: false,
            feedback: 'Stifles crucial developmental game-time during peak cognitive learning years.'
          },
          {
            letter: 'C',
            text: 'Release him on a free transfer to clear academy locker space.',
            isCorrect: false,
            feedback: 'Destroys academy ROI by discarding an elite prospective first-team asset for nothing.'
          },
          {
            letter: 'D',
            text: 'Send him to a recreational Sunday league with no professional coaching staff.',
            isCorrect: false,
            feedback: 'Substandard facilities and coaching ruin player development and physical conditioning.'
          }
        ]
      },
      {
        id: 'sporting_q4',
        category: 'Boardroom & Coach Alignment',
        scenario: 'Your newly appointed Head Coach is benching the club’s record £25M signing because the player doesn’t fit his direct long-ball tactical style.',
        question: 'How does the Sporting Director resolve this tactical and financial friction?',
        options: [
          {
            letter: 'A',
            text: 'Hold an executive alignment review with the coach and performance analysts to establish tactical role adjustments that leverage the player’s strengths within the club’s sporting blueprint.',
            isCorrect: true,
            feedback: 'Spot on. Sporting Directors act as custodians of club assets, collaborating with technical staff to integrate major investments constructively.'
          },
          {
            letter: 'B',
            text: 'Sack the head coach at halftime during his second match.',
            isCorrect: false,
            feedback: 'Extremely costly severance payouts and creates chaos in squad tactical preparation.'
          },
          {
            letter: 'C',
            text: 'Burst into the dressing room and physically select the match lineup yourself.',
            isCorrect: false,
            feedback: 'Violates role boundaries, completely undermines the head coach’s dressing room authority.'
          },
          {
            letter: 'D',
            text: 'Sell the player to rivals for £1M just to end the disagreement.',
            isCorrect: false,
            feedback: 'Massive capital write-down destroying balance sheet assets and board confidence.'
          }
        ]
      }
    ]
  },

  // 3. Football Business Management
  {
    id: 'football_business',
    title: 'Football Business Management',
    level: 3,
    subtitle: 'Commercial Monetization, Stadium Infrastructure Financing & PSR Strategy',
    description: 'Rigorous corporate executive qualification mastering stadium naming rights valuation, ESG green infrastructure debt structuring, Profitability and Sustainability Rules (PSR) compliance, and global commercial partnerships.',
    requiredXp: 400,
    prerequisiteId: 'sporting_diploma',
    governingBody: 'Global Football Business Council (GFBC)',
    unlockedCapabilities: [
      'Tier-1 Global Corporate & Stadium Naming Rights Partnerships',
      'Green Infrastructure Bond Debt Issuance (subsidized long-term rates)',
      'Concourse Commercial Ecosystem Amenities (Megastore expansion, FanZone brewery, VIP suites)',
      'Comprehensive 3-Year Rolling PSR / FFP Compliance Risk Mitigation'
    ],
    passingScorePercent: 75,
    questions: [
      {
        id: 'business_q1',
        category: 'Sponsorship & Commercial Partnerships',
        scenario: 'Your front-of-shirt sponsorship contract is expiring. An offshore gambling platform offers £12M/year, while an innovative clean-energy technology company offers £8M/year with extensive community academy funding.',
        question: 'How do you evaluate and structure this commercial choice for long-term club health?',
        options: [
          {
            letter: 'A',
            text: 'Choose the clean energy partner, monetizing secondary sleeve and training ground rights to close the £4M delta, while safeguarding family brand equity and regulatory stability.',
            isCorrect: true,
            feedback: 'Superior executive strategy. Anticipating regulatory gambling sponsorship bans while protecting brand prestige and commercial longevity.'
          },
          {
            letter: 'B',
            text: 'Sign with the gambling company, ignore upcoming government advertising bans, and alienate youth supporters.',
            isCorrect: false,
            feedback: 'High regulatory exposure. Imminent legal bans leave clubs scrambling for replacements under distressed terms.'
          },
          {
            letter: 'C',
            text: 'Refuse all sponsors and leave the shirt blank with zero commercial revenue.',
            isCorrect: false,
            feedback: 'Deprives the club of millions in vital cash flow required to meet PSR limits.'
          },
          {
            letter: 'D',
            text: 'Sign with both sponsors simultaneously and put two conflicting logos on top of each other.',
            isCorrect: false,
            feedback: 'Breaches exclusive sponsorship contracts and invites massive commercial breach-of-contract penalties.'
          }
        ]
      },
      {
        id: 'business_q2',
        category: 'Infrastructure Investment',
        scenario: 'A proposed £15M stadium solar roof array and hybrid turf system will reduce weekly ground utility overhead by £18,000/week and eliminate soft-tissue pitch injury delays.',
        question: 'What is the most fiscally prudent financial structure for this capital project?',
        options: [
          {
            letter: 'A',
            text: 'Issue a long-term low-interest Green Eco-Bond exempt from PSR calculations, amortized over 15 years using the guaranteed utility cost savings to service debt.',
            isCorrect: true,
            feedback: 'Correct! Capital expenditures (CapEx) in stadium sustainability and green infrastructure are typically deductible from PSR losses and pay for themselves in operating reductions.'
          },
          {
            letter: 'B',
            text: 'Deplete 100% of the player transfer budget and leave zero funds to pay squad wages in December.',
            isCorrect: false,
            feedback: 'Creates immediate cash insolvency and severe payroll defaults.'
          },
          {
            letter: 'C',
            text: 'Finance the project via high-interest short-term credit cards at 24% annual interest.',
            isCorrect: false,
            feedback: 'Destroys operating cash flow with ruinous debt servicing costs.'
          },
          {
            letter: 'D',
            text: 'Build the solar panels out of cardboard to save money.',
            isCorrect: false,
            feedback: 'Ludicrous safety hazard violating building codes and stadium safety licences.'
          }
        ]
      },
      {
        id: 'business_q3',
        category: 'Club Governance & Regulations',
        scenario: 'Your three-year rolling financial loss is projected at £98M (dangerously close to the £105M PSR limit). The board wants to sign a £30M striker in January.',
        question: 'How do you intervene as Chief Executive?',
        options: [
          {
            letter: 'A',
            text: 'Veto the cash purchase, demonstrate to the board how player amortization impacts this cycle, and propose an initial loan-with-option structure while crystallizing pure profit on academy graduate sales.',
            isCorrect: true,
            feedback: 'Essential financial acumen. Accounting amortization and pure-profit homegrown sales are the dual levers protecting clubs from multi-point deductions.'
          },
          {
            letter: 'B',
            text: 'Falsify accounting invoices by recording player transfer fees as stationery supplies.',
            isCorrect: false,
            feedback: 'Fraudulent accounting resulting in police investigations, club relegation, and director disqualification.'
          },
          {
            letter: 'C',
            text: 'Sign the player regardless and blame the league when a 10-point deduction is handed down.',
            isCorrect: false,
            feedback: 'Gross executive negligence leading to relegation and multi-million pound broadcast loss.'
          },
          {
            letter: 'D',
            text: 'Double all ticket prices mid-season to extract the difference from season ticket holders.',
            isCorrect: false,
            feedback: 'Triggers mass fan boycotts, empty stadiums, and catastrophic sponsor dissatisfaction.'
          }
        ]
      },
      {
        id: 'business_q4',
        category: 'Crisis Management',
        scenario: 'A major broadcast rights partner enters sudden receivership, causing an expected 25% drop in televised distributions across the division.',
        question: 'What is your executive action plan for maintaining operational liquidity?',
        options: [
          {
            letter: 'A',
            text: 'Immediately enact contingency budget controls: freeze non-critical CapEx, activate revolving credit facility buffers, and accelerate retail merchandising and VIP hospitality sales.',
            isCorrect: true,
            feedback: 'Top-tier crisis management. Swift diversification of self-generated revenues and cash preservation prevents insolvency during macroeconomic industry shocks.'
          },
          {
            letter: 'B',
            text: 'Sell the entire starting eleven in 48 hours for pennies on the pound.',
            isCorrect: false,
            feedback: 'Guarantees on-pitch collapse, catastrophic relegation, and destroyed club reputation.'
          },
          {
            letter: 'C',
            text: 'Pretend the news isn’t real and continue spending beyond existing credit lines.',
            isCorrect: false,
            feedback: 'Trading while insolvent triggers immediate court-ordered administration.'
          },
          {
            letter: 'D',
            text: 'Shut down the youth academy permanently to save on meal vouchers.',
            isCorrect: false,
            feedback: 'Permanently erodes the club’s future talent pipeline and community standing.'
          }
        ]
      }
    ]
  },

  // 4. Advanced Club Executive Programme
  {
    id: 'advanced_executive',
    title: 'Advanced Club Executive Programme',
    level: 4,
    subtitle: 'Apex Master Executive Leadership, Boardroom Diplomacy & Global Sporting Strategy',
    description: 'The pinnacle executive programme for modern football club Chief Executives and Global Sporting Directors. Covers boardroom governance conflicts, multi-club strategic networks, international commercial expansion, crisis diplomacy, and long-term multi-decade club sustainability.',
    requiredXp: 800,
    prerequisiteId: 'football_business',
    governingBody: 'World Football Executive Summit (WFES)',
    unlockedCapabilities: [
      'Global Elite Wonderkid Scouting Clearance (Exclusive South American & Worldwide missions)',
      'Executive Boardroom Strategic Veto on Destructive Mandates',
      'Sovereign / Blue-Chip Global Commercial Syndicates with Signing Bonuses',
      'Strategic Multi-Club Loan Network Alliances and Fast-Track International Visas'
    ],
    passingScorePercent: 75,
    questions: [
      {
        id: 'advanced_q1',
        category: 'Boardroom Disagreements',
        scenario: 'A split ownership board is paralyzed: 50% of directors demand a high-risk leveraged buy-out to pursue immediate Champions League qualification, while 50% demand austerity.',
        question: 'How does an Advanced Club Executive resolve this boardroom deadlock to preserve the institution?',
        options: [
          {
            letter: 'A',
            text: 'Propose a balanced "Self-Funding Growth Blueprint": index sporting bonuses to revenue growth, structure debt only against revenue-generating stadium assets, and tie transfer budgets to net trading surplus.',
            isCorrect: true,
            feedback: 'Statesmanship at its finest. Bridging divided ownership factions through objective, KPI-indexed growth frameworks unites the board behind sustainable ambition.'
          },
          {
            letter: 'B',
            text: 'Take a side publicly in the press and accuse half the board of incompetence.',
            isCorrect: false,
            feedback: 'Destroys boardroom confidentiality, polarizes the club, and renders executive leadership untenable.'
          },
          {
            letter: 'C',
            text: 'Flip a coin in the boardroom to decide the club’s 5-year financial strategy.',
            isCorrect: false,
            feedback: 'Dereliction of fiduciary duty and professional standards.'
          },
          {
            letter: 'D',
            text: 'Secretly siphon funds into an offshore holding company.',
            isCorrect: false,
            feedback: 'Criminal fraud resulting in prison sentences and club disqualification.'
          }
        ]
      },
      {
        id: 'advanced_q2',
        category: 'Crisis Management',
        scenario: '48 hours before an international cup final, an explosive media investigation alleges financial irregularities involving a former director from five years ago.',
        question: 'What is the executive crisis communication strategy?',
        options: [
          {
            letter: 'A',
            text: 'Issue an immediate transparent holding statement confirming full cooperation with independent auditors, isolate the sporting squad from media distractions, and brief team captains privately.',
            isCorrect: true,
            feedback: 'Masterful crisis containment. Decisive separation of historical administrative audits from matchday sporting preparation shields players and protects corporate reputation.'
          },
          {
            letter: 'B',
            text: 'Attack all journalists on personal social media accounts with hostile remarks.',
            isCorrect: false,
            feedback: 'Pours gasoline on a media firestorm and turns neutral observers against the club.'
          },
          {
            letter: 'C',
            text: 'Cancel the cup final and refuse to take the field.',
            isCorrect: false,
            feedback: 'Massive contractual breaches, forfeiture of trophies, and multi-million pound broadcast damages.'
          },
          {
            letter: 'D',
            text: 'Force the head coach to answer forensic corporate legal questions in his pre-match press conference.',
            isCorrect: false,
            feedback: 'Unfairly burdens the technical coach with legal matters outside his remit and distracts tactical focus.'
          }
        ]
      },
      {
        id: 'advanced_q3',
        category: 'Long-Term Club Strategy',
        scenario: 'Your club has achieved domestic stability. The board asks you to blueprint the transition from a mid-table domestic side into a perennial self-sustaining European powerhouse over a 7-year horizon.',
        question: 'Which strategic pillars form the foundation of this master plan?',
        options: [
          {
            letter: 'A',
            text: 'Invest in Category 1 youth recruitment, install data-driven analytics recruitment models, expand commercial non-matchday stadium yields, and maintain strict wage-to-revenue ceilings under 65%.',
            isCorrect: true,
            feedback: 'The gold standard of football executive architecture. Sustainable European powerhouses are built on talent generation, data-driven recruitment, and robust non-football commercial engines.'
          },
          {
            letter: 'B',
            text: 'Sign 35-year-old former superstars on massive 5-year contracts while starving the academy.',
            isCorrect: false,
            feedback: 'Recipe for catastrophic wage stagnation, plummeting squad asset values, and financial ruin.'
          },
          {
            letter: 'C',
            text: 'Rely solely on luck and pray the referee makes favorable decisions in every match.',
            isCorrect: false,
            feedback: 'Hope is not a management strategy.'
          },
          {
            letter: 'D',
            text: 'Demolish the stadium and play exclusively in public parks to eliminate operating costs.',
            isCorrect: false,
            feedback: 'Incompatible with professional football standards and league membership regulations.'
          }
        ]
      },
      {
        id: 'advanced_q4',
        category: 'Transfer Strategy & Recruitment',
        scenario: 'A European multi-club consortium offers a strategic alliance where your club serves as their primary development hub for premier South American prospects.',
        question: 'How do you structure this partnership to protect your club’s autonomy and sporting identity?',
        options: [
          {
            letter: 'A',
            text: 'Ensure complete autonomy over technical selection, negotiate guaranteed loan compensation and secondary sell-on percentages, and maintain strict priority for your own academy graduates.',
            isCorrect: true,
            feedback: 'Exemplary diplomacy. Leveraging multi-club talent access while protecting local sporting identity, financial upside, and academy pathways.'
          },
          {
            letter: 'B',
            text: 'Surrender all sporting control and let the foreign group select your matchday squads via email.',
            isCorrect: false,
            feedback: 'Subordinates the club into a powerless feeder franchise, destroying supporter trust and historical culture.'
          },
          {
            letter: 'C',
            text: 'Refuse all international partnerships and only sign players born within a 2-mile radius of the stadium.',
            isCorrect: false,
            feedback: 'Unrealistic competitive isolationism in an increasingly globalized sport.'
          },
          {
            letter: 'D',
            text: 'Agree to the deal verbally and then refuse to play any of their players upon arrival.',
            isCorrect: false,
            feedback: 'Destroys contractual integrity and permanently blacklists the club from elite recruitment networks.'
          }
        ]
      }
    ]
  }
];

export function getExecutiveQualificationById(id: string): ExecutiveQualificationDefinition | undefined {
  return EXECUTIVE_QUALIFICATIONS.find(q => q.id === id);
}

export function calculateExecutiveReputation(
  boardConfidence: number,
  fanTrust: number,
  leagueWinRate: number,
  ffpCompliant: boolean,
  completedQualsCount: number
): number {
  // Balanced formula separating reputation from qualifications
  // Qualifications add a modest +3 boost per credential, while board/fan trust and performance dominate (0-100)
  const baseRep = (boardConfidence * 0.4) + (fanTrust * 0.3) + (leagueWinRate * 0.2) + (ffpCompliant ? 10 : 0);
  const qualBonus = completedQualsCount * 3;
  return Math.min(100, Math.max(20, Math.round(baseRep + qualBonus)));
}
