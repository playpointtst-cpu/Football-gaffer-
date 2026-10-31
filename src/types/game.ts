export type Position = 'GK' | 'CB' | 'LB' | 'RB' | 'DM' | 'CM' | 'AM' | 'LW' | 'RW' | 'ST';

export interface Player {
  id: string;
  name: string;
  nationality: string;
  age: number;
  position: Position;
  overall: number; // 40 - 99
  potential: number; // 40 - 99
  wage: number; // weekly wage in £
  marketValue: number; // in £
  contractYears: number; // remaining years
  fitness: number; // 0 - 100
  morale: number; // 0 - 100
  form: number; // 1 - 10
  goals: number;
  assists: number;
  appearances: number;
  isInjured: boolean;
  injuryWeeks?: number;
  injuryType?: string;
  isTransferListed: boolean;
  releaseClause?: number;
  academyGraduate?: boolean;
  scoutingStatus?: 'unscouted' | 'in_progress' | 'fully_scouted';
  currentClubName?: string;
  personalityTrait?: string;
  tacticalFitScore?: number;
}

export type TacticalStyle = 
  | 'High-Intensity Press' 
  | 'Positional Tiki-Taka' 
  | 'Direct Counter-Attack' 
  | 'Pragmatic Low Block'
  | 'Fluid Wing Play';

export interface HeadCoach {
  id: string;
  name: string;
  nationality: string;
  age: number;
  preferredFormation: string;
  tacticalStyle: TacticalStyle;
  tacticalAcumen: number; // 1 - 20
  youthDevelopment: number; // 1 - 20
  manManagement: number; // 1 - 20
  reputation: number; // 1 - 20
  salary: number; // weekly in £
  contractYears: number;
  jobSecurity: number; // 0 - 100
}

export interface KeyStaff {
  chiefScout: {
    name: string;
    level: number; // 1 - 5
    salary: number;
    scoutingAccuracy: number; // percentage
  };
  headPhysio: {
    name: string;
    level: number; // 1 - 5
    salary: number;
    recoverySpeedBonus: number; // percentage
  };
  academyDirector: {
    name: string;
    level: number; // 1 - 5
    salary: number;
    talentIntakeQuality: number; // percentage
  };
}

export interface StadiumStand {
  id: string;
  name: string;
  capacity: number;
  maxCapacity: number;
  safeStandingEnabled: boolean;
  vipBoxes: number;
  condition: number; // 0 - 100
  upgradeCost: number;
  isUpgrading?: boolean;
  upgradeWeeksRemaining?: number;
}

export interface GroundSustainability {
  solarArrayLevel: number; // 0 - 3 (0: none, 1: partial, 2: full roof, 3: solar export microgrid)
  rainwaterHarvesting: boolean;
  ledFloodlights: boolean;
  zeroWasteProgram: boolean;
  evChargingPiazza: boolean;
  hybridTurfSystem: boolean; // Desso GrassMaster
  undersoilHeating: boolean;
  subAirDrainage: boolean;
  greenRatingScore: number; // 0 - 100
  weeklyUtilityCostReduction: number; // £/wk saved
}

export interface CommercialAmenities {
  megaStoreLevel: number; // 1 - 4
  museumAndTourCenter: boolean;
  craftBreweryFanZone: boolean;
  corporateConferenceCenter: boolean;
  hotelAndWellnessSuites: boolean;
}

export interface TrainingGroundFacility {
  name: string;
  level: number; // 1 to 5
  sportsScienceLevel: number; // 1 to 5 (accelerates recovery, lowers fatigue)
  tacticalAnalysisSuite: boolean; // boosts team chemistry and tactical execution
  condition: number; // 0 - 100
  upgradeCost: number;
  upgradeWeeks: number;
  isUpgrading?: boolean;
  upgradeWeeksRemaining?: number;
  weeklyOperatingCost: number;
}

export interface YouthAcademyFacility {
  name: string;
  categoryGrade: number; // Category 1 to 4 (Cat 1 is elite Premier League grade)
  academyLevel: number; // 1 to 5
  scoutingNetworkReach: 'Local Grassroots' | 'National Regional' | 'Continental Europe' | 'Global Elite Wonderkids';
  educationCampus: boolean; // boosts young player morale, loyalty, and prevents early contract unrest
  condition: number; // 0 - 100
  upgradeCost: number;
  upgradeWeeks: number;
  isUpgrading?: boolean;
  upgradeWeeksRemaining?: number;
  weeklyOperatingCost: number;
  recentGraduatesCount: number;
}

export interface AcademyProspect {
  id: string;
  name: string;
  nationality: string;
  age: number; // 15 to 20
  ageGroup: 'U16' | 'U18' | 'U21';
  position: Position;
  archetype: string;
  currentAbility: number; // 50 to 76
  potentialMin: number; // e.g. 82
  potentialMax: number; // e.g. 94
  scoutingCertainty: number; // percentage based on Chief Scout level
  personality: 'Driven & Determined' | 'Model Professional' | 'Raw Ambition' | 'Resilient & Tenacious';
  trainingFocus: 'Technical Mastery' | 'Physical Conditioning' | 'Tactical Discipline' | 'Balanced';
  growthProgress: number; // 0 to 100 towards next point
  joinedSeason: number;
  developmentWeeksInAcademy: number;
  isReadyForSenior: boolean;
  isOnLoan?: boolean;
  loanClub?: string;
}

export interface YouthScoutingMission {
  id: string;
  region: 'Local Grassroots' | 'National Academy Network' | 'Continental Europe' | 'Global Wonderkid Expedition';
  cost: number;
  weeksRemaining: number;
  totalWeeks: number;
  expectedYield: number;
}

export interface Stadium {
  name: string;
  stands: StadiumStand[];
  totalCapacity: number;
  pitchCondition: number; // 0 - 100
  sustainability: GroundSustainability;
  amenities: CommercialAmenities;
  ticketPrices: {
    generalAdmission: number; // £
    seasonTicket: number; // £
    vipHospitality: number; // £
  };
  seasonTicketHolders: number;
  maxSeasonTicketAllocation: number;
  averageAttendance: number;
}

export type SponsorCategory = 
  | 'Front-of-Shirt' 
  | 'Kit Manufacturer' 
  | 'Stadium Naming Rights' 
  | 'Sleeve Sponsor' 
  | 'Training Ground'
  | 'Concourse Partner';

export interface SponsorContract {
  id: string;
  brandName: string;
  category: SponsorCategory;
  annualValue: number; // £/year
  weeklyValue: number; // £/week
  yearsRemaining: number;
  bonusClause?: string;
  bonusAmount?: number;
  signingBonus?: number;
  fanSentimentImpact: number; // -10 to +10 (e.g. betting/crypto = -5, local clean energy = +8)
  ethicalTier: 'Green / Tech' | 'Established Corporate' | 'Gambling / Crypto';
}

export interface DebtInstrument {
  id: string;
  name: string;
  type: 'Commercial Term Loan' | 'Stadium Infrastructure Bond' | 'Revolving Credit Facility' | 'Green Eco-Bond';
  principal: number;
  remainingPrincipal: number;
  interestRate: number; // annual percentage e.g. 4.5%
  weeklyRepayment: number;
  totalWeeks: number;
  weeksRemaining: number;
  earlyPayoffPenalty: number; // percentage e.g. 1.5%
}

export interface BudgetAllocation {
  transferBudgetCap: number; // £ earmarked
  weeklyWageCapPerPlayer: number; // £/wk ceiling
  infrastructureReserve: number; // £ locked for ground upgrades
  emergencyBuffer: number; // £ untouchable cash buffer
  targetWageToTurnoverRatio: number; // percentage e.g. 62%
}

export interface IncomeBreakdown {
  matchday: {
    generalAdmission: number;
    seasonTicketsAmortized: number;
    vipHospitality: number;
    cateringAndFanZone: number;
  };
  commercial: {
    sponsorships: number;
    kitManufacturerRoyalties: number;
    megastoreRetail: number;
    stadiumToursAndEvents: number;
  };
  broadcasting: {
    domesticEqualShare: number;
    internationalPool: number;
    facilityTelevisedBonus: number;
    meritFinishingProjected: number;
  };
}

export interface ExpenseBreakdown {
  payroll: {
    playerBaseWages: number;
    matchdayBonuses: number;
    executiveAndStaffWages: number;
  };
  operations: {
    stadiumMaintenance: number;
    utilityAndEnergyGross: number;
    greenEnergyOffsetSavings: number; // negative expense
    academyOperationalCost: number;
    scoutingNetworkCost: number;
  };
  debtService: {
    loanInterestPaid: number;
    principalAmortization: number;
  };
}

export interface FinancialForecastScenario {
  scenarioName: string;
  projectedFinishPosition: number;
  projectedBroadcastMerit: number;
  projectedMatchdayRevenue: number;
  projectedCommercialRevenue: number;
  projectedTotalTurnover: number;
  projectedTotalExpenses: number;
  projectedNetProfitLoss: number;
  projectedClosingBankBalance: number;
  projectedThreeYearRollingLoss: number;
  ffpCompliant: boolean;
}

export interface FinancialLedger {
  bankBalance: number; // total cash reserves in £
  weeklyWageBill: number; // player wages
  weeklyStaffBill: number; // non-playing staff wages
  weeklyMaintenanceCost: number; // stadium & ground
  weeklyCommercialIncome: number; // sponsors
  weeklyMatchdayIncomeAvg: number; // ticket + concessions
  transferBudget: number; // cash earmarked for transfers
  remainingWageBudget: number; // weekly wage margin
  annualTurnover: number;
  threeYearRollingLoss: number; // For FFP / PSR check (limit £105M in Premier League)
  ffpWarningActive: boolean;
  budgetAllocation: BudgetAllocation;
  bankLoans: DebtInstrument[];
  incomeBreakdown: IncomeBreakdown;
  expenseBreakdown: ExpenseBreakdown;
  recentTransactions: Transaction[];
}

export interface Transaction {
  id: string;
  week: number;
  season: number;
  type: 'INCOME' | 'EXPENSE';
  category: 'Matchday' | 'Sponsorship' | 'Transfers' | 'Wages' | 'Infrastructure' | 'Prize/Broadcast' | 'Loan';
  description: string;
  amount: number;
}

export interface MatchFixture {
  id: string;
  gameweek: number;
  homeTeam: string;
  awayTeam: string;
  isPlayed: boolean;
  homeScore?: number;
  awayScore?: number;
  attendance?: number;
  gateReceipts?: number;
  events?: string[];
  homeScorers?: string[];
  awayScorers?: string[];
}

export interface LeagueClub {
  id: string;
  name: string;
  shortName: string;
  reputation: number; // 1 - 100
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface WorldClubInfo {
  id: string;
  name: string;
  shortName: string;
  city: string;
  stadiumName: string;
  stadiumCapacity: number;
  reputation: number; // 40 - 95
  transferBudgetEstimate: number;
  wageBillWeeklyEstimate: number;
  primaryColor: string;
}

export interface DivisionData {
  tier: 1 | 2 | 3 | 4;
  name: string;
  shortName: string;
  promotionSpots: number;
  relegationSpots: number;
  teamsCount: number;
  clubs: WorldClubInfo[];
}

export interface CountryData {
  id: string;
  name: string;
  code: string;
  flag: string;
  confederation: 'UEFA' | 'CONMEBOL';
  divisions: DivisionData[];
}

export interface BoardMandate {
  sportingTarget: string; // e.g. "Secure European Qualification (Top 6)"
  financialTarget: string; // e.g. "Maintain positive net transfer balance and wage-to-turnover under 65%"
  sustainabilityTarget: string; // e.g. "Achieve 80+ Stadium Green Infrastructure score"
  boardConfidence: number; // 0 - 100
  fanTrustRating: number; // 0 - 100
}

export interface ExecutiveMessage {
  id: string;
  week: number;
  season: number;
  sender: string;
  senderRole: 'Head Coach' | 'Board of Directors' | 'Chief Financial Officer' | 'Head of Commercial' | 'Head Groundsman' | 'Chief Scout' | 'Fan Supporters Trust';
  subject: string;
  preview: string;
  body: string;
  isRead: boolean;
  urgent?: boolean;
  decision?: {
    choiceA: {
      label: string;
      description: string;
      consequenceKey: string;
    };
    choiceB: {
      label: string;
      description: string;
      consequenceKey: string;
    };
    resolved?: boolean;
    chosenChoice?: 'A' | 'B';
  };
}

export interface ClubProfile {
  id: string;
  name: string;
  nickname: string;
  founded: number;
  city: string;
  leagueName: string;
  reputation: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headCoach: HeadCoach;
  staff: KeyStaff;
  stadium: Stadium;
  trainingGround: TrainingGroundFacility;
  youthAcademy: YouthAcademyFacility;
  sponsors: SponsorContract[];
  players: Player[];
  academyProspects: AcademyProspect[];
  youthScoutingMissions: YouthScoutingMission[];
  finances: FinancialLedger;
  boardMandate: BoardMandate;
  tacticalDirective: TacticalStyle; // Sporting Director dictates to Head Coach
}

export interface GameState {
  currentWeek: number; // 1 to 38
  currentSeason: number; // e.g. 2026/27
  isTransferWindowOpen: boolean;
  selectedClub: ClubProfile;
  leagueTable: LeagueClub[];
  fixtures: MatchFixture[];
  inbox: ExecutiveMessage[];
  lastMatchReport?: {
    fixture: MatchFixture;
    coachQuote: string;
    injuryUpdates: string[];
    boardReaction: string;
  };
  managerProfile?: ManagerProfile;
  activePressConference?: PressConference | null;
  socialFeed: SocialPost[];
  pressHistory: CompletedPressSession[];
}

export interface PressResponseOption {
  id: string;
  tone: 'diplomatic' | 'passionate' | 'defensive' | 'candid';
  label: string;
  quote: string;
  effects: {
    squadMoraleDelta: number; // e.g. +5 or -4
    fanTrustDelta: number; // e.g. +4 or -3
    boardConfidenceDelta: number; // e.g. +3 or -2
    reputationDelta?: number;
    coachJobSecurityDelta?: number;
    headlineOutcome: string;
  };
}

export interface PressQuestion {
  id: string;
  journalistName: string;
  journalistAvatar?: string;
  outlet: string;
  outletType: 'Broadcaster' | 'National Newspaper' | 'Tactical Journal' | 'Fan Media' | 'Tabloid';
  question: string;
  topic: 'Match Result' | 'Tactics' | 'Player Form' | 'Injuries' | 'Transfer Market' | 'Youth Integration' | 'Board Expectations';
  options: PressResponseOption[];
  answeredOptionId?: string;
}

export interface PressConference {
  id: string;
  week: number;
  season: number;
  headline: string;
  triggerEvent: 'Post-Match' | 'Big Win' | 'Derby Victory' | 'Shock Defeat' | 'Crisis Meeting' | 'Record Signing' | 'Injury Crisis';
  matchContext?: {
    opponent: string;
    score: string;
    result: 'WIN' | 'DRAW' | 'LOSS';
    venue: 'Home' | 'Away';
  };
  questions: PressQuestion[];
  isCompleted: boolean;
  completedAt?: string;
  summaryOutcome?: string;
}

export interface SocialPost {
  id: string;
  week: number;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorRole: 'Player' | 'Fan' | 'Journalist' | 'Pundit' | 'Club Official';
  verified: boolean;
  timeAgo: string;
  content: string;
  sentiment: 'ecstatic' | 'positive' | 'neutral' | 'critical' | 'furious';
  likes: number;
  reposts: number;
  commentsCount: number;
  likedByManager?: boolean;
  managerReply?: string;
  tags: string[];
  matchContext?: {
    opponent: string;
    score: string;
    result: 'WIN' | 'DRAW' | 'LOSS';
  };
  mediaUrl?: string;
}

export interface CompletedPressSession {
  conferenceId: string;
  week: number;
  headline: string;
  triggerEvent: string;
  date: string;
  totalMoraleDelta: number;
  totalFanTrustDelta: number;
  totalBoardConfidenceDelta: number;
  keyQuote: string;
  outletHeadlines: string[];
}

export type Continent = 'Europe' | 'Asia' | 'South America' | 'North America' | 'Africa' | 'Oceania';
export type Confederation = 'UEFA' | 'AFC' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'OFC';

export interface ManagerProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  nationality: string;
  nationalityCode: string;
  nationalityFlag: string;
  continent: Continent;
  confederation: Confederation;
  selectedCountry: string;
  selectedClubId: string;
  selectedClubName: string;
  licenseName: string; // e.g. "UEFA C License" or "AFC C License"
  licenseLevel: string; // "Tier 1 - Foundation / Lowest"
  licenseDescription: string;
  examScore: number; // percentage, e.g. 100
  examPassed: boolean;
  examDate: string;
  certificateNumber: string;
  tacticalPhilosophy: TacticalStyle;
  reputationScore: number;
}
