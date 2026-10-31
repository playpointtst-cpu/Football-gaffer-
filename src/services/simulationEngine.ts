import { ClubProfile, GameState, LeagueClub, MatchFixture, Player, ExecutiveMessage } from '../types/game';
import { generatePostMatchPressConference, generateWeeklySocialFeed } from './pressAndSocialEngine';

// Helper to generate full season schedule (38 gameweeks for 20 teams)
export function generateSeasonFixtures(leagueClubs: LeagueClub[]): MatchFixture[] {
  const fixtures: MatchFixture[] = [];
  const teams = leagueClubs.map(c => c.name);
  const n = teams.length;
  let fixtureId = 1;

  // Round robin 19 rounds home, 19 rounds reverse
  const rounds = (n - 1) * 2;
  const matchesPerRound = n / 2;

  // Standard Berger round-robin algorithm
  const teamIndices: number[] = Array.from({ length: n }, (_, i) => i);

  for (let r = 0; r < n - 1; r++) {
    for (let m = 0; m < matchesPerRound; m++) {
      const homeIdx = teamIndices[m];
      const awayIdx = teamIndices[n - 1 - m];
      
      const homeTeam = r % 2 === 0 ? teams[homeIdx] : teams[awayIdx];
      const awayTeam = r % 2 === 0 ? teams[awayIdx] : teams[homeIdx];

      fixtures.push({
        id: `fx_${fixtureId++}`,
        gameweek: r + 1,
        homeTeam,
        awayTeam,
        isPlayed: false,
      });
    }

    // Rotate indices keeping first fixed
    const last = teamIndices.pop()!;
    teamIndices.splice(1, 0, last);
  }

  // Second half of season (reverse fixtures)
  const firstHalfCount = fixtures.length;
  for (let i = 0; i < firstHalfCount; i++) {
    const orig = fixtures[i];
    fixtures.push({
      id: `fx_${fixtureId++}`,
      gameweek: orig.gameweek + 19,
      homeTeam: orig.awayTeam,
      awayTeam: orig.homeTeam,
      isPlayed: false,
    });
  }

  return fixtures;
}

// Calculate team rating from players
export function getSquadStrength(players: Player[]): number {
  const activePlayers = players.filter(p => !p.isInjured);
  if (activePlayers.length < 11) return 65;
  const sorted = [...activePlayers].sort((a, b) => b.overall - a.overall);
  const top11 = sorted.slice(0, 11);
  const avg = top11.reduce((sum, p) => sum + p.overall, 0) / 11;
  return Math.round(avg);
}

// Simulate a single match
export function simulateMatch(
  fixture: MatchFixture,
  playerClub: ClubProfile,
  leagueClubs: LeagueClub[]
): {
  fixture: MatchFixture;
  playerUpdates?: {
    scorers: string[];
    injuries: { player: Player; weeks: number; type: string }[];
    gateReceipts: number;
    attendance: number;
    coachQuote: string;
    boardReaction: string;
  };
} {
  const isPlayerHome = fixture.homeTeam === playerClub.name;
  const isPlayerAway = fixture.awayTeam === playerClub.name;
  const isPlayerInvolved = isPlayerHome || isPlayerAway;

  let homeStrength = 75;
  let awayStrength = 75;

  if (isPlayerHome) {
    homeStrength = getSquadStrength(playerClub.players) + (playerClub.headCoach.tacticalAcumen / 4);
    // Opponent
    const opp = leagueClubs.find(c => c.name === fixture.awayTeam);
    awayStrength = opp ? opp.reputation : 78;
  } else if (isPlayerAway) {
    const opp = leagueClubs.find(c => c.name === fixture.homeTeam);
    homeStrength = opp ? opp.reputation : 78;
    awayStrength = getSquadStrength(playerClub.players) + (playerClub.headCoach.tacticalAcumen / 4);
  } else {
    const hClub = leagueClubs.find(c => c.name === fixture.homeTeam);
    const aClub = leagueClubs.find(c => c.name === fixture.awayTeam);
    homeStrength = hClub ? hClub.reputation : 75;
    awayStrength = aClub ? aClub.reputation : 75;
  }

  // Home advantage factor (+3 rating points)
  homeStrength += 3;

  // Strength difference
  const diff = homeStrength - awayStrength;
  const homeLambda = Math.max(0.3, Math.min(4.5, 1.4 + diff * 0.08));
  const awayLambda = Math.max(0.2, Math.min(4.0, 1.1 - diff * 0.08));

  // Poisson-like distribution
  const homeScore = randomPoisson(homeLambda);
  const awayScore = randomPoisson(awayLambda);

  const updatedFixture: MatchFixture = {
    ...fixture,
    isPlayed: true,
    homeScore,
    awayScore,
    homeScorers: [],
    awayScorers: [],
  };

  if (!isPlayerInvolved) {
    return { fixture: updatedFixture };
  }

  // Detailed simulation for player's match
  const playerWon = (isPlayerHome && homeScore > awayScore) || (isPlayerAway && awayScore > homeScore);
  const playerDrew = homeScore === awayScore;
  const playerGoals = isPlayerHome ? homeScore : awayScore;

  // Assign goals to available players
  const availableAttackers = playerClub.players.filter(p => !p.isInjured && ['ST', 'LW', 'RW', 'AM', 'CM'].includes(p.position));
  const scorers: string[] = [];
  for (let g = 0; g < playerGoals; g++) {
    if (availableAttackers.length > 0) {
      const picked = availableAttackers[Math.floor(Math.random() * availableAttackers.length)];
      scorers.push(picked.name);
      picked.goals += 1;
    }
  }

  if (isPlayerHome) {
    updatedFixture.homeScorers = scorers;
  } else {
    updatedFixture.awayScorers = scorers;
  }

  // Attendance calculation if player is home
  let attendance = 0;
  let gateReceipts = 0;
  if (isPlayerHome) {
    const stadium = playerClub.stadium;
    const baseDemand = 0.88;
    // Price elasticity: standard price £45-50
    const priceRatio = stadium.ticketPrices.generalAdmission / 50;
    const priceFactor = Math.max(0.7, 1.1 - (priceRatio - 1) * 0.5);
    const winBonus = playerWon ? 0.04 : 0;
    const finalAttendanceRatio = Math.min(1.0, Math.max(0.65, baseDemand * priceFactor + winBonus));
    attendance = Math.round(stadium.totalCapacity * finalAttendanceRatio);

    const nonSeasonTickets = Math.max(0, attendance - stadium.seasonTicketHolders);
    const vipAttendance = Math.round(stadium.stands.reduce((sum, s) => sum + s.vipBoxes * 10, 0) * 0.9);
    
    const generalIncome = nonSeasonTickets * stadium.ticketPrices.generalAdmission;
    const vipIncome = vipAttendance * stadium.ticketPrices.vipHospitality;
    const concessionSpendPerHead = 8 + (stadium.amenities.craftBreweryFanZone ? 4 : 0) + (stadium.amenities.megaStoreLevel * 2);
    const concessionIncome = attendance * concessionSpendPerHead;

    gateReceipts = generalIncome + vipIncome + concessionIncome;
    updatedFixture.attendance = attendance;
    updatedFixture.gateReceipts = gateReceipts;
  }

  // Injury chance check
  const injuries: { player: Player; weeks: number; type: string }[] = [];
  const injuryTypes = [
    { type: 'Hamstring Tightness', weeks: 2 },
    { type: 'Ankle Ligament Sprain', weeks: 3 },
    { type: 'Groin Strain', weeks: 2 },
    { type: 'Metatarsal Impact', weeks: 5 },
    { type: 'Knock & Bruising', weeks: 1 },
  ];

  // Pitch hybrid tech reduces injury risk
  const pitchSafetyBonus = playerClub.stadium.sustainability.hybridTurfSystem ? 0.5 : 1.0;
  const physioSafetyBonus = 1 - (playerClub.staff.headPhysio.level * 0.06);
  const injuryProbability = 0.18 * pitchSafetyBonus * physioSafetyBonus;

  if (Math.random() < injuryProbability) {
    const uninjured = playerClub.players.filter(p => !p.isInjured);
    if (uninjured.length > 0) {
      const injuredPlayer = uninjured[Math.floor(Math.random() * uninjured.length)];
      const pickedInjury = injuryTypes[Math.floor(Math.random() * injuryTypes.length)];
      const recoveryWeeks = Math.max(1, Math.round(pickedInjury.weeks * (1 - playerClub.staff.headPhysio.recoverySpeedBonus / 100)));
      
      injuredPlayer.isInjured = true;
      injuredPlayer.injuryWeeks = recoveryWeeks;
      injuredPlayer.injuryType = pickedInjury.type;
      injuries.push({ player: injuredPlayer, weeks: recoveryWeeks, type: pickedInjury.type });
    }
  }

  // Coach quotes & Board reaction
  let coachQuote = '';
  let boardReaction = '';
  if (playerWon) {
    coachQuote = `"${playerClub.headCoach.name}: 'The squad executed our tactical directive flawlessly today. The intensity from the first minute won us the points.'"`;
    boardReaction = 'The Board is delighted with this victory and our competitive sporting trajectory.';
  } else if (playerDrew) {
    coachQuote = `"${playerClub.headCoach.name}: 'A hard-fought point. We controlled phases of the match, but we need more clinical precision in the final third.'"`;
    boardReaction = 'The Board notes a resilient display, keeping our campaign on steady ground.';
  } else {
    coachQuote = `"${playerClub.headCoach.name}: 'Deeply disappointing result. We allowed ourselves to be caught on transitions. We will review video footage on Monday morning.'"`;
    boardReaction = 'The Board expresses concern regarding dropped points and expects immediate response next week.';
  }

  return {
    fixture: updatedFixture,
    playerUpdates: {
      scorers,
      injuries,
      gateReceipts,
      attendance,
      coachQuote,
      boardReaction,
    },
  };
}

function randomPoisson(lambda: number): number {
  let l = Math.exp(-lambda);
  let k = 0;
  let p = 1.0;
  do {
    k++;
    p *= Math.random();
  } while (p > l && k < 10);
  return k - 1;
}

// Execute weekly progression
export function advanceGameWeek(state: GameState): GameState {
  const currentWeek = state.currentWeek;
  const club = { ...state.selectedClub };
  const fixtures = [...state.fixtures];
  const leagueTable = [...state.leagueTable];
  const inbox = [...state.inbox];

  // 1. Simulate matches for current gameweek
  const thisWeekFixtures = fixtures.filter(f => f.gameweek === currentWeek && !f.isPlayed);
  let lastMatchReport = state.lastMatchReport;
  let playerFixturePlayed: MatchFixture | undefined = undefined;

  for (const f of thisWeekFixtures) {
    const simResult = simulateMatch(f, club, leagueTable);
    const index = fixtures.findIndex(orig => orig.id === f.id);
    if (index !== -1) {
      fixtures[index] = simResult.fixture;
    }

    if (simResult.playerUpdates) {
      playerFixturePlayed = simResult.fixture;
      lastMatchReport = {
        fixture: simResult.fixture,
        coachQuote: simResult.playerUpdates.coachQuote,
        injuryUpdates: simResult.playerUpdates.injuries.map(i => `${i.player.name}: ${i.type} (${i.weeks}w)`),
        boardReaction: simResult.playerUpdates.boardReaction,
      };

      // If home game, add matchday revenue
      if (simResult.fixture.homeTeam === club.name && simResult.playerUpdates.gateReceipts > 0) {
        club.finances.bankBalance += simResult.playerUpdates.gateReceipts;
        club.finances.recentTransactions.unshift({
          id: `tx_match_${currentWeek}_${Date.now()}`,
          week: currentWeek,
          season: state.currentSeason,
          type: 'INCOME',
          category: 'Matchday',
          description: `Gate receipts & matchday concessions vs ${simResult.fixture.awayTeam}`,
          amount: simResult.playerUpdates.gateReceipts,
        });
      }
    }

    // Update league table for this fixture
    updateLeagueTableForMatch(leagueTable, simResult.fixture);
  }

  // Sort league table
  sortLeagueTable(leagueTable);

  // 2. Financial weekly accounting tick
  const weeklyWages = club.players.reduce((sum, p) => sum + p.wage, 0);
  const weeklyStaff = club.headCoach.salary + club.staff.chiefScout.salary + club.staff.headPhysio.salary + club.staff.academyDirector.salary;
  
  // Sustainability deduction on ground maintenance
  const baseGroundMaintenance = 90000;
  const utilityReduction = club.stadium.sustainability.weeklyUtilityCostReduction || 0;
  const netGroundMaintenance = Math.max(25000, baseGroundMaintenance - utilityReduction);

  // Commercial revenue (Sponsorship weekly breakdown)
  const weeklyCommercial = club.sponsors.reduce((sum, sp) => sum + sp.weeklyValue, 0);

  // Loan repayment
  let loanRepayment = 0;
  if (club.finances.bankLoans && club.finances.bankLoans.length > 0) {
    club.finances.bankLoans = club.finances.bankLoans.map(loan => {
      loanRepayment += loan.weeklyRepayment;
      const principalPortion = Math.round(loan.weeklyRepayment * (1 - (loan.interestRate / 100) / 52));
      return {
        ...loan,
        weeksRemaining: Math.max(0, loan.weeksRemaining - 1),
        remainingPrincipal: Math.max(0, loan.remainingPrincipal - principalPortion),
      };
    }).filter(loan => loan.weeksRemaining > 0 && loan.remainingPrincipal > 0);
  }

  // Operating costs for training ground and academy
  const trainingOps = club.trainingGround?.weeklyOperatingCost || 30000;
  const academyOps = club.youthAcademy?.weeklyOperatingCost || 35000;

  const netWeeklyCashflow = weeklyCommercial - (weeklyWages + weeklyStaff + netGroundMaintenance + trainingOps + academyOps + loanRepayment);
  club.finances.bankBalance += netWeeklyCashflow;
  club.finances.weeklyWageBill = weeklyWages;
  club.finances.weeklyStaffBill = weeklyStaff;
  club.finances.weeklyMaintenanceCost = netGroundMaintenance;
  club.finances.weeklyCommercialIncome = weeklyCommercial;

  // Log recurring ledger
  club.finances.recentTransactions.unshift({
    id: `tx_ops_${currentWeek}_${Date.now()}`,
    week: currentWeek,
    season: state.currentSeason,
    type: netWeeklyCashflow >= 0 ? 'INCOME' : 'EXPENSE',
    category: 'Wages',
    description: `Weekly club payroll, ground maintenance, training facilities & debt service (Net: ${netWeeklyCashflow >= 0 ? '+' : ''}£${Math.abs(Math.round(netWeeklyCashflow)).toLocaleString()})`,
    amount: Math.abs(Math.round(netWeeklyCashflow)),
  });

  // 3. Player injuries & training progression with Training Ground & Physio bonuses
  const sportsScienceBonus = (club.trainingGround?.sportsScienceLevel || 1) * 0.05;
  const academyQualityBonus = (club.youthAcademy?.academyLevel || 1) * 0.04;

  club.players = club.players.map(player => {
    let updated = { ...player };
    // Appearances update
    if (thisWeekFixtures.some(f => f.homeTeam === club.name || f.awayTeam === club.name)) {
      if (!updated.isInjured) {
        updated.appearances += 1;
      }
    }

    // Injury recovery accelerated by sports science
    if (updated.isInjured && updated.injuryWeeks !== undefined) {
      const remaining = updated.injuryWeeks - 1;
      if (remaining <= 0) {
        updated.isInjured = false;
        updated.injuryWeeks = 0;
        updated.injuryType = undefined;
        updated.fitness = 88;
        updated.morale = Math.min(100, updated.morale + 5);
      } else {
        updated.injuryWeeks = remaining;
      }
    } else {
      // Natural fitness recovery boosted by high-spec training ground
      updated.fitness = Math.min(100, updated.fitness + 3 + Math.round(sportsScienceBonus * 10));
    }

    // Youth potential growth accelerated by Youth Academy grade
    if (updated.age <= 21 && updated.overall < updated.potential && Math.random() < (0.12 + academyQualityBonus)) {
      updated.overall += 1;
      updated.morale = Math.min(100, updated.morale + 3);
    }

    return updated;
  });

  // 4. Stadium upgrade progress
  let standCompleted = false;
  club.stadium.stands = club.stadium.stands.map(stand => {
    if (stand.isUpgrading && stand.upgradeWeeksRemaining !== undefined) {
      const remaining = stand.upgradeWeeksRemaining - 1;
      if (remaining <= 0) {
        standCompleted = true;
        return {
          ...stand,
          capacity: Math.min(stand.maxCapacity, stand.capacity + 2500),
          condition: 98,
          isUpgrading: false,
          upgradeWeeksRemaining: 0,
        };
      }
      return {
        ...stand,
        upgradeWeeksRemaining: remaining,
      };
    }
    return stand;
  });

  // 4b. Training Ground upgrade progress
  if (club.trainingGround?.isUpgrading && club.trainingGround.upgradeWeeksRemaining !== undefined) {
    const rem = club.trainingGround.upgradeWeeksRemaining - 1;
    if (rem <= 0) {
      club.trainingGround.isUpgrading = false;
      club.trainingGround.upgradeWeeksRemaining = 0;
      club.trainingGround.level = Math.min(5, club.trainingGround.level + 1);
      club.trainingGround.sportsScienceLevel = Math.min(5, club.trainingGround.sportsScienceLevel + 1);
      club.trainingGround.condition = 99;
      // Tangible benefit: Boost squad morale
      club.players.forEach(p => { p.morale = Math.min(100, p.morale + 8); });
      inbox.unshift({
        id: `msg_tg_comp_${currentWeek}`,
        week: currentWeek,
        season: state.currentSeason,
        sender: 'Head of Sports Science & Performance',
        senderRole: 'Head Groundsman',
        subject: 'Training Complex Upgraded: Elite Performance Center Opened!',
        preview: 'New sports science recovery suites and biometric facilities are now fully operational.',
        body: `We are thrilled to announce that the expansion of our training ground facilities is complete. The first-team squad now enjoys world-class hydrotherapy chambers, recovery cryo-pods, and tactical video presentation auditoriums. Team morale has surged across the entire dressing room, and physical rehabilitation velocity is significantly enhanced.`,
        isRead: false,
        urgent: true,
      });
    } else {
      club.trainingGround.upgradeWeeksRemaining = rem;
    }
  }

  // 4c. Youth Academy upgrade progress
  if (club.youthAcademy?.isUpgrading && club.youthAcademy.upgradeWeeksRemaining !== undefined) {
    const rem = club.youthAcademy.upgradeWeeksRemaining - 1;
    if (rem <= 0) {
      club.youthAcademy.isUpgrading = false;
      club.youthAcademy.upgradeWeeksRemaining = 0;
      club.youthAcademy.academyLevel = Math.min(5, club.youthAcademy.academyLevel + 1);
      club.youthAcademy.condition = 98;
      club.youthAcademy.recentGraduatesCount += 2;
      club.boardMandate.fanTrustRating = Math.min(100, club.boardMandate.fanTrustRating + 6);
      inbox.unshift({
        id: `msg_ya_comp_${currentWeek}`,
        week: currentWeek,
        season: state.currentSeason,
        sender: 'Academy Director',
        senderRole: 'Board of Directors',
        subject: 'Youth Academy Expansion Complete: World-Class Talent Incubator!',
        preview: 'Our youth academy upgrades have earned top category accreditation.',
        body: `Our newly developed academy education center and indoor hybrid pitches have been awarded Category 1 Premier accreditation. Local supporters and the board are thrilled with your commitment to youth development. Wonderkid scouting intake yield will increase substantially.`,
        isRead: false,
        urgent: true,
      });
    } else {
      club.youthAcademy.upgradeWeeksRemaining = rem;
    }
  }

  // 4d. Youth Scouting Missions Progression & Discovery
  if (club.youthScoutingMissions && club.youthScoutingMissions.length > 0) {
    club.youthScoutingMissions = club.youthScoutingMissions.map(mission => {
      const rem = mission.weeksRemaining - 1;
      if (rem <= 0) {
        // Mission concluded: Discover newly scouted prospects
        const archetypes = [
          'Generational Number 10', 
          'Explosive Inverted Winger', 
          'Deep-Lying Tempo Controller', 
          'Ball-Playing Centre Back', 
          'Clinical Poacher', 
          'Commanding Sweeper Keeper'
        ];
        const personalities: import('../types/game').AcademyProspect['personality'][] = [
          'Model Professional', 
          'Driven & Determined', 
          'Raw Ambition', 
          'Resilient & Tenacious'
        ];
        const positions: import('../types/game').Position[] = ['GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST'];
        const names = ['Kai', 'Ruben', 'Sandro', 'Alfie', 'Maxence', 'Jonas', 'Kenzo', 'Santiago'];
        const surnames = ['Vance', 'Da Silva', 'Moretti', 'O’Shea', 'Bastos', 'Lindholm', 'Tanaka', 'Morales'];

        const newProspects: import('../types/game').AcademyProspect[] = [];
        for (let i = 0; i < mission.expectedYield; i++) {
          const fn = names[Math.floor(Math.random() * names.length)];
          const ln = surnames[Math.floor(Math.random() * surnames.length)];
          const pos = positions[Math.floor(Math.random() * positions.length)];
          const arch = archetypes[Math.floor(Math.random() * archetypes.length)];
          const pers = personalities[Math.floor(Math.random() * personalities.length)];
          
          const age = 15 + Math.floor(Math.random() * 3); // 15 to 17
          const ca = 58 + Math.floor(Math.random() * 10);
          const potMax = Math.min(95, ca + 18 + Math.floor(Math.random() * 10));
          const potMin = Math.max(ca + 5, potMax - 8);

          newProspects.push({
            id: `prospect_${Date.now()}_${i}`,
            name: `${fn} ${ln}`,
            nationality: mission.region === 'Continental Europe' ? 'France' : mission.region === 'Global Wonderkid Expedition' ? 'Brazil' : 'England',
            age,
            ageGroup: age <= 16 ? 'U16' : 'U18',
            position: pos,
            archetype: arch,
            currentAbility: ca,
            potentialMin: potMin,
            potentialMax: potMax,
            scoutingCertainty: Math.min(98, 75 + club.staff.chiefScout.level * 4),
            personality: pers,
            trainingFocus: 'Technical Mastery',
            growthProgress: 30,
            joinedSeason: state.currentSeason,
            developmentWeeksInAcademy: 0,
            isReadyForSenior: age >= 17,
          });
        }

        club.academyProspects = [...(club.academyProspects || []), ...newProspects];

        inbox.unshift({
          id: `msg_mission_${mission.id}_${currentWeek}`,
          week: currentWeek,
          season: state.currentSeason,
          sender: 'Chief Scout',
          senderRole: 'Chief Scout',
          subject: `Scouting Expedition Returned: ${mission.region}`,
          preview: `Scouts have returned with ${mission.expectedYield} elite academy candidates.`,
          body: `Our scouting team has concluded the talent identification mission in ${mission.region}. ${mission.expectedYield} prospects have passed trial matches and been enrolled into our academy age-group squads. Review their current ability attributes and configure their individual training regimes.`,
          isRead: false,
          urgent: true,
        });

        return null;
      }
      return { ...mission, weeksRemaining: rem };
    }).filter(Boolean) as import('../types/game').YouthScoutingMission[];
  }

  // 4e. Academy Prospects Weekly Training & Age Progression
  if (club.academyProspects && club.academyProspects.length > 0) {
    club.academyProspects = club.academyProspects.map(p => {
      let updated = { ...p };
      updated.developmentWeeksInAcademy += 1;

      // Base weekly growth points (influenced by academy level and loan status)
      const academyTierBonus = (club.youthAcademy?.academyLevel || 3) * 3;
      const loanBonus = updated.isOnLoan ? 15 : 0; // playing regular games accelerates CA
      const focusBonus = updated.trainingFocus === 'Balanced' ? 5 : 8;

      const progressGain = 8 + academyTierBonus + loanBonus + focusBonus;
      updated.growthProgress += progressGain;

      if (updated.growthProgress >= 100) {
        if (updated.currentAbility < updated.potentialMax) {
          updated.currentAbility += 1;
        }
        updated.growthProgress = updated.growthProgress - 100;
      }

      // Age category migration
      if (updated.age >= 17 && updated.ageGroup === 'U16') {
        updated.ageGroup = 'U18';
        updated.isReadyForSenior = true;
      } else if (updated.age >= 19 && updated.ageGroup === 'U18') {
        updated.ageGroup = 'U21';
        updated.isReadyForSenior = true;
      }

      return updated;
    });
  }

  if (standCompleted) {
    club.stadium.totalCapacity = club.stadium.stands.reduce((sum, s) => sum + s.capacity, 0);
    inbox.unshift({
      id: `msg_stadium_${currentWeek}`,
      week: currentWeek,
      season: state.currentSeason,
      sender: 'Ground Development Director',
      senderRole: 'Head Groundsman',
      subject: 'Construction Milestone: Stand Expansion Complete!',
      preview: 'The stadium capacity expansion has been fully signed off by local health & safety inspectors.',
      body: `We are pleased to report that the construction crew has completed the turnstile, seating, and hospitality works on schedule. Total ground capacity is now expanded to ${club.stadium.totalCapacity.toLocaleString()} seats. This will immediately augment matchday ticket yields.`,
      isRead: false,
      urgent: true,
    });
  }

  // 5. Board confidence update based on current league position
  const clubPos = leagueTable.findIndex(c => c.name === club.name) + 1;
  if (clubPos <= 4) {
    club.boardMandate.boardConfidence = Math.min(100, club.boardMandate.boardConfidence + 1);
  } else if (clubPos > 12) {
    club.boardMandate.boardConfidence = Math.max(30, club.boardMandate.boardConfidence - 1);
  }

  // 6. Occasional contextual executive dilemma in inbox
  maybeTriggerExecutiveDilemma(inbox, currentWeek, state.currentSeason, club, clubPos);

  const nextWeek = currentWeek + 1;
  const isTransferWindowOpen = nextWeek <= 6 || (nextWeek >= 20 && nextWeek <= 24);

  // 7. Contextual Post-Match Press Conference & Social Media Feed
  let activePressConference = state.activePressConference;
  let socialFeed = state.socialFeed || [];

  if (playerFixturePlayed) {
    activePressConference = generatePostMatchPressConference(playerFixturePlayed, club, currentWeek, state.currentSeason);
    const newPosts = generateWeeklySocialFeed(club, playerFixturePlayed, currentWeek);
    socialFeed = [...newPosts, ...socialFeed].slice(0, 50);
  }

  return {
    ...state,
    currentWeek: nextWeek > 38 ? 1 : nextWeek,
    currentSeason: nextWeek > 38 ? state.currentSeason + 1 : state.currentSeason,
    isTransferWindowOpen,
    selectedClub: club,
    leagueTable,
    fixtures,
    inbox,
    lastMatchReport,
    activePressConference,
    socialFeed,
    pressHistory: state.pressHistory || [],
  };
}

function updateLeagueTableForMatch(table: LeagueClub[], match: MatchFixture) {
  if (match.homeScore === undefined || match.awayScore === undefined) return;
  const home = table.find(c => c.name === match.homeTeam);
  const away = table.find(c => c.name === match.awayTeam);
  if (!home || !away) return;

  home.played += 1;
  away.played += 1;
  home.goalsFor += match.homeScore;
  home.goalsAgainst += match.awayScore;
  away.goalsFor += match.awayScore;
  away.goalsAgainst += match.homeScore;

  home.goalDifference = home.goalsFor - home.goalsAgainst;
  away.goalDifference = away.goalsFor - away.goalsAgainst;

  if (match.homeScore > match.awayScore) {
    home.won += 1;
    home.points += 3;
    away.lost += 1;
    home.form = (['W', ...home.form].slice(0, 5)) as ('W' | 'D' | 'L')[];
    away.form = (['L', ...away.form].slice(0, 5)) as ('W' | 'D' | 'L')[];
  } else if (match.homeScore < match.awayScore) {
    away.won += 1;
    away.points += 3;
    home.lost += 1;
    home.form = (['L', ...home.form].slice(0, 5)) as ('W' | 'D' | 'L')[];
    away.form = (['W', ...away.form].slice(0, 5)) as ('W' | 'D' | 'L')[];
  } else {
    home.drawn += 1;
    home.points += 1;
    away.drawn += 1;
    away.points += 1;
    home.form = (['D', ...home.form].slice(0, 5)) as ('W' | 'D' | 'L')[];
    away.form = (['D', ...away.form].slice(0, 5)) as ('W' | 'D' | 'L')[];
  }
}

function sortLeagueTable(table: LeagueClub[]) {
  table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

function maybeTriggerExecutiveDilemma(
  inbox: ExecutiveMessage[],
  week: number,
  season: number,
  club: ClubProfile,
  leaguePos: number
) {
  // Trigger on specific weeks or milestones
  if (week === 2) {
    inbox.unshift({
      id: `dilemma_w2_${Date.now()}`,
      week,
      season,
      sender: 'Chief Commercial Officer',
      senderRole: 'Head of Commercial',
      subject: 'Commercial Opportunity: Luxury Stadium Skybox Pre-Leasing',
      preview: 'A multinational private wealth consortium offers to lease 10 corporate skyboxes for 3 seasons upfront.',
      body: 'Our commercial team has received a lucrative proposal from an international corporate syndicate seeking multi-year exclusivity over our prime hospitality suites. Accepting will yield £6.5M immediate liquidity to bolster our transfer budget, but restricts general corporate VIP flexibility.',
      isRead: false,
      urgent: true,
      decision: {
        choiceA: {
          label: 'Accept £6.5M Upfront Cash',
          description: 'Bolster transfer reserves immediately. Commits 10 suites for 3 seasons.',
          consequenceKey: 'ACCEPT_SKYBOX_LEASE',
        },
        choiceB: {
          label: 'Decline for Matchday Flexibility',
          description: 'Retain open hospitality inventory to sell at peak match rates. Earns higher fan trust.',
          consequenceKey: 'DECLINE_SKYBOX_LEASE',
        },
      },
    });
  } else if (week === 5) {
    inbox.unshift({
      id: `dilemma_w5_${Date.now()}`,
      week,
      season,
      sender: club.headCoach.name,
      senderRole: 'Head Coach',
      subject: 'Sporting Assessment: Youth Talent Pathway Request',
      preview: 'The coaching staff recommends formalizing first-team bench slots for academy standouts.',
      body: `Sporting Director, I have been reviewing our U21 academy cohort with the Academy Director. There is genuine technical quality coming through. If you authorize a structured youth incentive clause (£200K investment in individual biometric data tracking), I will guarantee 500+ first-team minutes across the season for our homegrown prospects.`,
      isRead: false,
      urgent: false,
      decision: {
        choiceA: {
          label: 'Approve £200k Youth Pathway Investment',
          description: 'Accelerates player potential development and boosts Academy Director morale.',
          consequenceKey: 'APPROVE_YOUTH_PATHWAY',
        },
        choiceB: {
          label: 'Prioritize Senior Squad Fitness Only',
          description: 'Keep operational focus strictly on senior professionals.',
          consequenceKey: 'DECLINE_YOUTH_PATHWAY',
        },
      },
    });
  } else if (week === 9) {
    inbox.unshift({
      id: `dilemma_w9_${Date.now()}`,
      week,
      season,
      sender: 'Supporters Trust Chairman',
      senderRole: 'Fan Supporters Trust',
      subject: 'Supporters Charter: Ticket Price Cap for Away Fans & Young Supporters',
      preview: 'The official supporters union submits a petition to freeze £25 junior ticket tiers.',
      body: `As CEO, your stewardship of the club is watched closely by our local community. We urge the board to enact a freeze on U18 matchday tickets and expand our local schools allocation. This will reduce short-term matchday gate yields by ~£80,000 across the autumn fixtures, but significantly reinforces generational loyalty and fan trust.`,
      isRead: false,
      urgent: true,
      decision: {
        choiceA: {
          label: 'Enact Junior Ticket Freeze (-£80k, +8 Fan Trust)',
          description: 'Support local grassroots families and strengthen club community heritage.',
          consequenceKey: 'ACCEPT_FAN_FREEZE',
        },
        choiceB: {
          label: 'Maintain Standard Market Pricing',
          description: 'Maximize matchday commercial efficiency to maintain transfer payroll.',
          consequenceKey: 'REJECT_FAN_FREEZE',
        },
      },
    });
  }
}

// Calculate comprehensive financial forecasts across finish scenarios
export function calculateFinancialForecast(
  club: ClubProfile,
  currentWeek: number,
  leagueTable: LeagueClub[]
): {
  scenarios: import('../types/game').FinancialForecastScenario[];
  wageToTurnoverRatio: number;
  totalDebtOutstanding: number;
  projectedAnnualCashflow: number;
} {
  const currentPos = leagueTable.findIndex(c => c.name === club.name) + 1 || 8;
  const remainingWeeks = Math.max(0, 38 - currentWeek);
  const remainingHomeMatches = Math.max(1, Math.round(remainingWeeks / 2));
  
  const avgGate = club.finances.weeklyMatchdayIncomeAvg || 1500000;
  const weeklyWages = club.finances.weeklyWageBill;
  const weeklyStaff = club.finances.weeklyStaffBill;
  const weeklyMaint = club.finances.weeklyMaintenanceCost;
  const weeklyCommercial = club.finances.weeklyCommercialIncome;
  const weeklyDebtService = (club.finances.bankLoans || []).reduce((sum, l) => sum + l.weeklyRepayment, 0);

  const totalDebtOutstanding = (club.finances.bankLoans || []).reduce((sum, l) => sum + l.remainingPrincipal, 0);

  // Weekly net operational burn/surplus
  const weeklyOpsNet = weeklyCommercial - (weeklyWages + weeklyStaff + weeklyMaint + weeklyDebtService);
  const projectedRemainingOperatingNet = weeklyOpsNet * remainingWeeks;

  const scenariosConfig = [
    { name: 'Current Trajectory', pos: currentPos, gateMod: 1.0 },
    { name: 'European Top 4 Finish', pos: 3, gateMod: 1.15 },
    { name: 'Mid-Table Consolidation', pos: 10, gateMod: 0.95 },
    { name: 'Downside Stress Test', pos: 16, gateMod: 0.82 },
  ];

  const scenarios: import('../types/game').FinancialForecastScenario[] = scenariosConfig.map(sc => {
    // Merit payout: £3.1m per place from bottom
    const projectedBroadcastMerit = Math.round((21 - sc.pos) * 3100000);
    const domesticPool = 31200000;
    const internationalPool = club.reputation > 80 ? 48000000 : 36000000;
    const facilityFees = 12000000;
    const totalBroadcast = domesticPool + internationalPool + facilityFees + projectedBroadcastMerit;

    const projectedMatchdayRemaining = remainingHomeMatches * (avgGate * sc.gateMod);
    const projectedMatchdayTotal = (club.finances.incomeBreakdown?.matchday?.generalAdmission || 20000000) + projectedMatchdayRemaining;
    const projectedCommercialTotal = (club.finances.weeklyCommercialIncome * 52) + (sc.pos <= 4 ? 6000000 : 0);

    const projectedTotalTurnover = totalBroadcast + projectedMatchdayTotal + projectedCommercialTotal;

    const projectedTotalExpenses = ((weeklyWages + weeklyStaff + weeklyMaint + weeklyDebtService) * 52) + 12000000; // includes bonuses & amort
    const projectedNetProfitLoss = projectedTotalTurnover - projectedTotalExpenses;
    const projectedClosingBankBalance = club.finances.bankBalance + projectedRemainingOperatingNet + (remainingHomeMatches * avgGate * sc.gateMod) + (projectedBroadcastMerit * 0.4);
    
    // Rolling 3-year loss calculation
    const projectedThreeYearRollingLoss = Math.round(club.finances.threeYearRollingLoss - (projectedNetProfitLoss * 0.33));
    const ffpCompliant = projectedThreeYearRollingLoss <= 105000000;

    return {
      scenarioName: sc.name,
      projectedFinishPosition: sc.pos,
      projectedBroadcastMerit,
      projectedMatchdayRevenue: Math.round(projectedMatchdayTotal),
      projectedCommercialRevenue: Math.round(projectedCommercialTotal),
      projectedTotalTurnover: Math.round(projectedTotalTurnover),
      projectedTotalExpenses: Math.round(projectedTotalExpenses),
      projectedNetProfitLoss: Math.round(projectedNetProfitLoss),
      projectedClosingBankBalance: Math.round(projectedClosingBankBalance),
      projectedThreeYearRollingLoss,
      ffpCompliant,
    };
  });

  const estimatedAnnualTurnover = scenarios[0].projectedTotalTurnover || 120000000;
  const annualWageBill = weeklyWages * 52;
  const wageToTurnoverRatio = Math.round((annualWageBill / estimatedAnnualTurnover) * 100);

  return {
    scenarios,
    wageToTurnoverRatio,
    totalDebtOutstanding,
    projectedAnnualCashflow: scenarios[0].projectedNetProfitLoss,
  };
}

// Generate new intake of academy prodigies based on Academy Level
export function generateYouthIntakeBatch(academyGrade: number, academyLevel: number): Player[] {
  const firstNames = ['Leo', 'Jude', 'Callum', 'Archie', 'Finlay', 'Mateo', 'Luka', 'Noah', 'Darius', 'Ethan'];
  const lastNames = ['Sterling', 'O’Connor', 'Van Dijk', 'Alvarez', 'Moreau', 'Lindqvist', 'Nakamura', 'Adeyemi', 'Davies', 'Kovacic'];
  const positions: import('../types/game').Position[] = ['GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST'];

  const count = 3;
  const players: Player[] = [];

  for (let i = 0; i < count; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const pos = positions[Math.floor(Math.random() * positions.length)];
    
    // Quality scales with academy level (1-5) and grade
    const baseOvr = 64 + academyLevel * 2 + Math.floor(Math.random() * 4);
    const pot = Math.min(94, baseOvr + 12 + academyLevel * 2 + Math.floor(Math.random() * 6));
    const marketValue = Math.round((baseOvr * baseOvr * 2500) * (pot / 80));

    players.push({
      id: `academy_grad_${Date.now()}_${i}`,
      name: `${fn} ${ln}`,
      nationality: 'England',
      age: 17,
      position: pos,
      overall: baseOvr,
      potential: pot,
      wage: 6500,
      marketValue,
      contractYears: 3,
      fitness: 100,
      morale: 95,
      form: 7,
      goals: 0,
      assists: 0,
      appearances: 0,
      isInjured: false,
      isTransferListed: false,
      academyGraduate: true,
    });
  }

  return players;
}

