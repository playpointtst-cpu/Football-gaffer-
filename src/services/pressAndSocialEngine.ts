import {
  ClubProfile,
  MatchFixture,
  Player,
  PressConference,
  PressQuestion,
  PressResponseOption,
  SocialPost,
} from '../types/game';

// Realistic Journalistic Outlets
const JOURNALISTS = [
  {
    name: 'David Ornstein',
    outlet: 'The Athletic',
    outletType: 'Tactical Journal' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Jamie Carragher',
    outlet: 'Sky Sports Premier',
    outletType: 'Broadcaster' as const,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fabrizio Romano',
    outlet: 'Here We Go Transfers',
    outletType: 'Tabloid' as const,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Liam Twomey',
    outlet: 'Daily Football Gazette',
    outletType: 'National Newspaper' as const,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Marcus Bell',
    outlet: 'The Supporters Voice TV',
    outletType: 'Fan Media' as const,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
  },
];

export function generatePostMatchPressConference(
  fixture: MatchFixture,
  club: ClubProfile,
  week: number,
  season: number
): PressConference {
  const isHome = fixture.homeTeam === club.name;
  const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;
  const clubScore = isHome ? (fixture.homeScore ?? 0) : (fixture.awayScore ?? 0);
  const oppScore = isHome ? (fixture.awayScore ?? 0) : (fixture.homeScore ?? 0);
  const isWin = clubScore > oppScore;
  const isDraw = clubScore === oppScore;
  const isLoss = clubScore < oppScore;

  const resultType: 'WIN' | 'DRAW' | 'LOSS' = isWin ? 'WIN' : isDraw ? 'DRAW' : 'LOSS';
  const scoreString = `${clubScore}-${oppScore}`;

  let triggerEvent: PressConference['triggerEvent'] = 'Post-Match';
  let headline = `Post-Match Press Conference: ${club.name} vs ${opponent} (${scoreString})`;

  if (isWin && (clubScore - oppScore >= 3 || oppScore === 0)) {
    triggerEvent = 'Big Win';
    headline = `Resounding Victory Media Room: ${club.name} Dominate ${opponent} ${scoreString}`;
  } else if (isLoss && oppScore - clubScore >= 2) {
    triggerEvent = 'Shock Defeat';
    headline = `Tense Press Room: Scrutiny Mounts After ${scoreString} Defeat to ${opponent}`;
  }

  const questions: PressQuestion[] = [];

  // Question 1: The General Result & Performance
  if (isWin) {
    questions.push({
      id: `pq_1_${week}_${Date.now()}`,
      journalistName: JOURNALISTS[0].name,
      outlet: JOURNALISTS[0].outlet,
      outletType: JOURNALISTS[0].outletType,
      journalistAvatar: JOURNALISTS[0].avatar,
      topic: 'Match Result',
      question: `A sensational ${scoreString} win today against ${opponent}. Did that performance reflect the exact sporting directive and identity you are instilling at ${club.name}?`,
      options: [
        {
          id: 'opt_1_a',
          tone: 'passionate',
          label: 'Total Praise & Title Statement',
          quote: `"The players gave everything today. Our tactical press suffocated them from minute one. We aren't here to make up numbers—we're building a title-challenging machine."`,
          effects: {
            squadMoraleDelta: 8,
            fanTrustDelta: 6,
            boardConfidenceDelta: 4,
            reputationDelta: 1,
            coachJobSecurityDelta: 5,
            headlineOutcome: `CEO: 'WE ARE BUILDING A TITLE-CHALLENGING MACHINE'`,
          },
        },
        {
          id: 'opt_1_b',
          tone: 'diplomatic',
          label: 'Measured & Grounded Focus',
          quote: `"It's a very satisfying three points, but the season is 38 games. We must stay humble, focus on recovery, and let the Head Coach prepare for the next battle."`,
          effects: {
            squadMoraleDelta: 4,
            fanTrustDelta: 3,
            boardConfidenceDelta: 5,
            coachJobSecurityDelta: 4,
            headlineOutcome: `EXECUTIVE URGES CALM: 'SATISFYING, BUT 38 GAMES REMAIN'`,
          },
        },
        {
          id: 'opt_1_c',
          tone: 'candid',
          label: 'Demand Higher Perfection',
          quote: `"We took the points, but our final ball was sloppy in the second half. Against European heavyweights, those lapses will be punished. We have higher levels to reach."`,
          effects: {
            squadMoraleDelta: -2,
            fanTrustDelta: 4,
            boardConfidenceDelta: 3,
            coachJobSecurityDelta: 2,
            headlineOutcome: `CEO WARNS SQUAD: 'LAPSES IN FOCUS WILL BE PUNISHED'`,
          },
        },
      ],
    });
  } else if (isDraw) {
    questions.push({
      id: `pq_1_${week}_${Date.now()}`,
      journalistName: JOURNALISTS[1].name,
      outlet: JOURNALISTS[1].outlet,
      outletType: JOURNALISTS[1].outletType,
      journalistAvatar: JOURNALISTS[1].avatar,
      topic: 'Match Result',
      question: `A grueling ${scoreString} stalemate with ${opponent}. Two points dropped or a hard-earned point secured under tactical pressure?`,
      options: [
        {
          id: 'opt_1_draw_a',
          tone: 'diplomatic',
          label: 'Respect the Battle & Value the Point',
          quote: `"In this league, away points and hard-fought draws test your backbone. Our defensive discipline held strong and we take a solid foundation forward."`,
          effects: {
            squadMoraleDelta: 3,
            fanTrustDelta: 2,
            boardConfidenceDelta: 3,
            coachJobSecurityDelta: 3,
            headlineOutcome: `CEO: 'A SOLID POINT THAT TESTS OUR SQUAD CHARACTER'`,
          },
        },
        {
          id: 'opt_1_draw_b',
          tone: 'candid',
          label: 'Frustration with Dropped Points',
          quote: `"Frankly, we are disappointed. With our stadium investment and squad payroll, we should be finishing off games like this. We lacked cutting edge in front of goal."`,
          effects: {
            squadMoraleDelta: -4,
            fanTrustDelta: 4,
            boardConfidenceDelta: 2,
            coachJobSecurityDelta: -3,
            headlineOutcome: `CEO FUMES AT DROPPED POINTS: 'WE MUST FINISH TEAMS OFF'`,
          },
        },
        {
          id: 'opt_1_draw_c',
          tone: 'defensive',
          label: 'Blame Match Officials / Schedule Fatigue',
          quote: `"Playing three intense matches in eight days stretches any squad to the limit. Some questionable refereeing decisions didn't help either."`,
          effects: {
            squadMoraleDelta: 5,
            fanTrustDelta: 3,
            boardConfidenceDelta: -2,
            coachJobSecurityDelta: 3,
            headlineOutcome: `CEO SLAMS FIXTURE CONGESTION & REFEREE DECISIONS`,
          },
        },
      ],
    });
  } else {
    // Loss
    questions.push({
      id: `pq_1_${week}_${Date.now()}`,
      journalistName: JOURNALISTS[3].name,
      outlet: JOURNALISTS[3].outlet,
      outletType: JOURNALISTS[3].outletType,
      journalistAvatar: JOURNALISTS[3].avatar,
      topic: 'Match Result',
      question: `A painful ${scoreString} defeat to ${opponent}. The away supporters made their frustration heard at the whistle. How do you assess the breakdown?`,
      options: [
        {
          id: 'opt_1_loss_a',
          tone: 'defensive',
          label: 'Shield Players & Assume Responsibility',
          quote: `"Point the finger at executive management, not the players or coach. They executed our instructions, but tactical luck deserted us today. We take full responsibility."`,
          effects: {
            squadMoraleDelta: 6,
            fanTrustDelta: -3,
            boardConfidenceDelta: -2,
            coachJobSecurityDelta: 6,
            headlineOutcome: `CEO SHIELDS DRESSING ROOM: 'CRITICISE ME, NOT MY PLAYERS'`,
          },
        },
        {
          id: 'opt_1_loss_b',
          tone: 'candid',
          label: 'Uncompromising Demand for Standards',
          quote: `"That was far below the standard expected at ${club.name}. Every player collecting a wage here must show heart and technical courage. Things will change on the training ground on Monday."`,
          effects: {
            squadMoraleDelta: -8,
            fanTrustDelta: 7,
            boardConfidenceDelta: 4,
            coachJobSecurityDelta: -5,
            headlineOutcome: `DRESSING ROOM PUT ON NOTICE: 'THAT WAS UNACCEPTABLE'`,
          },
        },
        {
          id: 'opt_1_loss_c',
          tone: 'diplomatic',
          label: 'Process & Long-Term Perspective',
          quote: `"Defeats are painful, but building a sustainable modern club is a journey with bumps. We review the tape analytically with Julian Navarro and respond next weekend."`,
          effects: {
            squadMoraleDelta: 2,
            fanTrustDelta: 1,
            boardConfidenceDelta: 3,
            coachJobSecurityDelta: 4,
            headlineOutcome: `EXECUTIVE APPEALS FOR CALM AS CLUB ANALYSES DEFEAT`,
          },
        },
      ],
    });
  }

  // Question 2: Head Coach Tactics & Staff Management
  questions.push({
    id: `pq_2_${week}_${Date.now()}`,
    journalistName: JOURNALISTS[1].name,
    outlet: JOURNALISTS[1].outlet,
    outletType: JOURNALISTS[1].outletType,
    journalistAvatar: JOURNALISTS[1].avatar,
    topic: 'Tactics',
    question: `Your appointed Head Coach ${club.headCoach.name} set up in a ${club.headCoach.preferredFormation} with ${club.tacticalDirective}. Are you fully satisfied with his on-pitch game management?`,
    options: [
      {
        id: 'opt_2_a',
        tone: 'passionate',
        label: 'Unconditional Backing of Head Coach',
        quote: `"Julian Navarro has our total, unshakeable confidence. His tactical acumen is among the finest in the league and he has the dressing room 100% behind him."`,
        effects: {
          squadMoraleDelta: 5,
          fanTrustDelta: 3,
          boardConfidenceDelta: 3,
          coachJobSecurityDelta: 10,
          headlineOutcome: `FULL BACKING: 'HEAD COACH ENJOYS TOTAL EXECUTIVE SUPPORT'`,
        },
      },
      {
        id: 'opt_2_b',
        tone: 'diplomatic',
        label: 'Review System Cooperatively',
        quote: `"As Sporting Director, we hold weekly tactical debriefs. There are areas where we can be more adaptive, and we continue refining our game models together."`,
        effects: {
          squadMoraleDelta: 2,
          fanTrustDelta: 2,
          boardConfidenceDelta: 4,
          coachJobSecurityDelta: 2,
          headlineOutcome: `SPORTING DIRECTOR IN REGULAR TACTICAL AUDITS WITH STAFF`,
        },
      },
      {
        id: 'opt_2_c',
        tone: 'candid',
        label: 'Demand Greater Tactical Flexibility',
        quote: `"We dictate the tactical directive of the club. When teams pack the box, our coaching staff must find proactive answers faster from the technical area."`,
        effects: {
          squadMoraleDelta: -3,
          fanTrustDelta: 4,
          boardConfidenceDelta: 1,
          coachJobSecurityDelta: -8,
          headlineOutcome: `COACHING STAFF CHALLENGED TO DELIVER FASTER IN-GAME FIXES`,
        },
      },
    ],
  });

  // Question 3: Squad Depth & Academy or Transfer Window
  const starPlayer = club.players[0];
  questions.push({
    id: `pq_3_${week}_${Date.now()}`,
    journalistName: JOURNALISTS[4].name,
    outlet: JOURNALISTS[4].outlet,
    outletType: JOURNALISTS[4].outletType,
    journalistAvatar: JOURNALISTS[4].avatar,
    topic: 'Youth Integration',
    question: `With player workloads at record levels and supporters keeping tabs on academy graduates, will we see more homegrown youth prospects in the starting XI?`,
    options: [
      {
        id: 'opt_3_a',
        tone: 'passionate',
        label: 'Commit to Youth Academy Pathway',
        quote: `"Our youth academy is the lifeblood of this club. We won't spend millions on vanity signings when our Carrington-grade academy has generational talent waiting."`,
        effects: {
          squadMoraleDelta: 4,
          fanTrustDelta: 8,
          boardConfidenceDelta: 4,
          reputationDelta: 1,
          headlineOutcome: `CEO: 'YOUTH ACADEMY GRADUATES WILL EARN SENIOR MINUTES'`,
        },
      },
      {
        id: 'opt_3_b',
        tone: 'candid',
        label: 'Meritocracy: Only Ready Players Feature',
        quote: `"We don't hand out senior shirts as charity. If an academy boy is better than a multi-million pound international, he plays. If not, he works harder in the U21s."`,
        effects: {
          squadMoraleDelta: 2,
          fanTrustDelta: -1,
          boardConfidenceDelta: 5,
          headlineOutcome: `NO CHARITY SHIRTS: 'MERITOCRACY RULES AT THE FIRST TEAM'`,
        },
      },
      {
        id: 'opt_3_c',
        tone: 'diplomatic',
        label: 'Balanced Commercial & Sporting Approach',
        quote: `"We combine homegrown talent with established international experience. That blend delivers both financial sustainability and matchday victories."`,
        effects: {
          squadMoraleDelta: 3,
          fanTrustDelta: 4,
          boardConfidenceDelta: 4,
          headlineOutcome: `SUSTAINABLE SQUAD ARCHITECTURE PROMISED BY DIRECTORS`,
        },
      },
    ],
  });

  return {
    id: `pc_${week}_${Date.now()}`,
    week,
    season,
    headline,
    triggerEvent,
    matchContext: {
      opponent,
      score: scoreString,
      result: resultType,
      venue: isHome ? 'Home' : 'Away',
    },
    questions,
    isCompleted: false,
  };
}

// Generate dynamic social media feed reflecting the recent match
export function generateWeeklySocialFeed(
  club: ClubProfile,
  fixture: MatchFixture | undefined,
  week: number
): SocialPost[] {
  const posts: SocialPost[] = [];
  const now = 'Just now';

  if (!fixture || !fixture.isPlayed) {
    // Pre-season or bye week feed
    return getPreSeasonSocialFeed(club, week);
  }

  const isHome = fixture.homeTeam === club.name;
  const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;
  const clubScore = isHome ? (fixture.homeScore ?? 0) : (fixture.awayScore ?? 0);
  const oppScore = isHome ? (fixture.awayScore ?? 0) : (fixture.homeScore ?? 0);
  const isWin = clubScore > oppScore;
  const isDraw = clubScore === oppScore;
  const isLoss = clubScore < oppScore;

  const resultType: 'WIN' | 'DRAW' | 'LOSS' = isWin ? 'WIN' : isDraw ? 'DRAW' : 'LOSS';
  const score = `${clubScore}-${oppScore}`;

  // 1. Squad Player Post
  const topPlayer = club.players.slice().sort((a, b) => b.overall - a.overall)[0] || club.players[0];
  const captain = club.players.find(p => p.position === 'CB' || p.position === 'CM') || club.players[1];

  if (isWin) {
    posts.push({
      id: `sp_player_win_${week}`,
      week,
      authorName: topPlayer.name,
      authorHandle: `@${topPlayer.name.toLowerCase().replace(/\s+/g, '')}_official`,
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Player',
      verified: true,
      timeAgo: '42m ago',
      content: `What a battle! Incredible shift from every single boy out there today. ${clubScore} goals and 3 massive points. The atmosphere at ${isHome ? club.stadium.name : 'the away end'} was electric! 🔥⚽️ Onto the next! #UpTheMetro #${club.nickname.replace(/\s+/g, '')}`,
      sentiment: 'ecstatic',
      likes: Math.floor(18000 + Math.random() * 9000),
      reposts: Math.floor(2400 + Math.random() * 1200),
      commentsCount: Math.floor(620 + Math.random() * 300),
      tags: ['#Matchday', '#ThreePoints', '#Winners'],
      matchContext: { opponent, score, result: resultType },
    });
  } else if (isDraw) {
    posts.push({
      id: `sp_player_draw_${week}`,
      week,
      authorName: captain.name,
      authorHandle: `@${captain.name.toLowerCase().replace(/\s+/g, '')}_cpt`,
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Player',
      verified: true,
      timeAgo: '1h ago',
      content: `Tough, physical 90 minutes against ${opponent}. Wanted all 3 points today but we dug deep with 10 men behind the ball when tested. We take the point and push harder on the training ground. Appreciate your support as always! 🤝 #Focus #Together`,
      sentiment: 'neutral',
      likes: Math.floor(9500 + Math.random() * 4000),
      reposts: Math.floor(980 + Math.random() * 500),
      commentsCount: Math.floor(340 + Math.random() * 180),
      tags: ['#HardFought', '#PointGained', '#Together'],
      matchContext: { opponent, score, result: resultType },
    });
  } else {
    posts.push({
      id: `sp_player_loss_${week}`,
      week,
      authorName: topPlayer.name,
      authorHandle: `@${topPlayer.name.toLowerCase().replace(/\s+/g, '')}_official`,
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Player',
      verified: true,
      timeAgo: '1h ago',
      content: `No excuses today. As a group we know that wasn't anywhere near good enough for this badge. We hear your frustrations and we take full responsibility. Back in Monday to put things right. We need to stay united. 🙏💔`,
      sentiment: 'critical',
      likes: Math.floor(14200 + Math.random() * 6000),
      reposts: Math.floor(1800 + Math.random() * 900),
      commentsCount: Math.floor(1450 + Math.random() * 700),
      tags: ['#Accountability', '#StayUnited'],
      matchContext: { opponent, score, result: resultType },
    });
  }

  // 2. Verified Tactical Journalist Post
  if (isWin) {
    posts.push({
      id: `sp_journo_win_${week}`,
      week,
      authorName: 'David Ornstein',
      authorHandle: '@David_Ornstein',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Journalist',
      verified: true,
      timeAgo: '15m ago',
      content: `Tactical breakdown on ${club.name}'s ${score} demolition of ${opponent}: Noticeable compactness in half-spaces and rapid transitional pressing. Executive leadership's tactical directive paying huge dividends. Opponent coach completely outmaneuvered in second half. Detailed piece on @TheAthletic now live.`,
      sentiment: 'positive',
      likes: Math.floor(24500 + Math.random() * 8000),
      reposts: Math.floor(5200 + Math.random() * 2000),
      commentsCount: Math.floor(890 + Math.random() * 400),
      tags: ['#TacticalAnalysis', '#PremierChampionship', '#PressingMasterclass'],
      matchContext: { opponent, score, result: resultType },
    });
  } else if (isLoss) {
    posts.push({
      id: `sp_journo_loss_${week}`,
      week,
      authorName: 'Jamie Carragher',
      authorHandle: '@Carra23_Tactics',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Pundit',
      verified: true,
      timeAgo: '25m ago',
      content: `Look at the gaps between the midfield pivot and back four for ${club.name} today against ${opponent}. Absolute suicide in modern football. You can't play that high line without intense pressure on the ball. Serious questions for the boardroom and coaching staff this week.`,
      sentiment: 'critical',
      likes: Math.floor(31000 + Math.random() * 12000),
      reposts: Math.floor(7800 + Math.random() * 3000),
      commentsCount: Math.floor(2100 + Math.random() * 800),
      tags: ['#MNF', '#TacticalFlaws', '#DefensiveShambles'],
      matchContext: { opponent, score, result: resultType },
    });
  } else {
    posts.push({
      id: `sp_journo_draw_${week}`,
      week,
      authorName: 'Liam Twomey',
      authorHandle: '@LiamTwomey_Athletic',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Journalist',
      verified: true,
      timeAgo: '30m ago',
      content: `FT: ${club.name} ${score} ${opponent}. A match defined by tactical conservatism. Neither manager wanted to overcommit into transition. Result keeps ${club.name} in European contention but leaves fans wanting more attacking flair.`,
      sentiment: 'neutral',
      likes: Math.floor(8200 + Math.random() * 3000),
      reposts: Math.floor(1100 + Math.random() * 500),
      commentsCount: Math.floor(410 + Math.random() * 200),
      tags: ['#PostMatch', '#Stalemate'],
      matchContext: { opponent, score, result: resultType },
    });
  }

  // 3. Passionate Fan Channel / Ultras
  if (isWin) {
    posts.push({
      id: `sp_fan_win_${week}`,
      week,
      authorName: 'Metro Faithful TV',
      authorHandle: '@MetroFaithful_FanChannel',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Fan',
      verified: false,
      timeAgo: '8m ago',
      content: `WE ARE ACTUALLY PLAYING CHAMPIONS LEAGUE FOOTBALL NEXT SEASON I CAN'T BELIEVE WHAT I WITNESSED! Best £45 ticket I've ever spent in my life! The pressing, the hunger, the stadium noise! The Sporting Director is cooking something special! GET IN THERE! 🔵⚪️🍾 #UpTheMetro`,
      sentiment: 'ecstatic',
      likes: Math.floor(12400 + Math.random() * 5000),
      reposts: Math.floor(2900 + Math.random() * 1100),
      commentsCount: Math.floor(480 + Math.random() * 200),
      tags: ['#LimbsInTheStands', '#BestDayEver', '#MetroTillIDie'],
      matchContext: { opponent, score, result: resultType },
    });
  } else if (isLoss) {
    posts.push({
      id: `sp_fan_loss_${week}`,
      week,
      authorName: 'Angry Metro Ultra',
      authorHandle: '@RealMetroSupporter',
      authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Fan',
      verified: false,
      timeAgo: '5m ago',
      content: `Travelled 4 hours in the rain for THAT?! Conceding twice in 10 minutes because nobody tracks back?! Why did we not make tactical subs until the 83rd minute?! Complete lack of urgency. The board needs to address squad depth IMMEDIATELY in the transfer market! 🤬😤`,
      sentiment: 'furious',
      likes: Math.floor(8900 + Math.random() * 4000),
      reposts: Math.floor(2100 + Math.random() * 900),
      commentsCount: Math.floor(1320 + Math.random() * 600),
      tags: ['#DisasterClass', '#WakeUpBoard', '#SortItOut'],
      matchContext: { opponent, score, result: resultType },
    });
  } else {
    posts.push({
      id: `sp_fan_draw_${week}`,
      week,
      authorName: 'The North Stand Banter',
      authorHandle: '@NorthStandBanter',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Fan',
      verified: false,
      timeAgo: '18m ago',
      content: `Not the prettiest football, but honestly away at ${opponent} is never easy. Clean sheet is positive. Now let's see some ambition next week at home! Need our strikers to be ruthless! 🛡️⚽️`,
      sentiment: 'neutral',
      likes: Math.floor(4100 + Math.random() * 2000),
      reposts: Math.floor(620 + Math.random() * 300),
      commentsCount: Math.floor(210 + Math.random() * 100),
      tags: ['#CleanSheet', '#Onward'],
      matchContext: { opponent, score, result: resultType },
    });
  }

  // 4. Official Club Media Post
  posts.push({
    id: `sp_club_official_${week}`,
    week,
    authorName: `${club.name} Official`,
    authorHandle: `@${club.nickname.toLowerCase().replace(/\s+/g, '')}_fc`,
    authorAvatar: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=120&auto=format&fit=crop&q=80',
    authorRole: 'Club Official',
    verified: true,
    timeAgo: '12m ago',
    content: `FULL TIME: ${club.name} ${score} ${opponent}.\n\nThank you to the 4,200 traveling supporters who sang non-stop in the away end today. Safe travels back to all travelling fans. We go again next Saturday at ${club.stadium.name}. 🔵⚪️ #MetroTogether`,
    sentiment: isWin ? 'positive' : isLoss ? 'neutral' : 'neutral',
    likes: Math.floor(34000 + Math.random() * 15000),
    reposts: Math.floor(8100 + Math.random() * 3500),
    commentsCount: Math.floor(1900 + Math.random() * 800),
    tags: ['#MatchdayFinal', '#FullTime'],
    matchContext: { opponent, score, result: resultType },
  });

  // 5. Transfer Insider / Scouting rumor
  posts.push({
    id: `sp_transfer_insider_${week}`,
    week,
    authorName: 'Fabrizio Romano',
    authorHandle: '@FabrizioRomano',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    authorRole: 'Journalist',
    verified: true,
    timeAgo: '48m ago',
    content: `Excl: ${club.name} scouting department highly active today watching multiple European targets. Sporting Director is monitoring young continental wingers and defensive midfield anchors ahead of the upcoming market window. Talks expected soon with player agents. ⏳👀 #Transfers`,
    sentiment: 'positive',
    likes: Math.floor(48000 + Math.random() * 18000),
    reposts: Math.floor(12300 + Math.random() * 4000),
    commentsCount: Math.floor(2400 + Math.random() * 900),
    tags: ['#HereWeGo', '#Transfers', '#Scouting'],
  });

  return posts;
}

export function getPreSeasonSocialFeed(club: ClubProfile, week: number): SocialPost[] {
  return [
    {
      id: `sp_init_1_${week}`,
      week,
      authorName: `${club.name} Official`,
      authorHandle: `@${club.nickname.toLowerCase().replace(/\s+/g, '')}_fc`,
      authorAvatar: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Club Official',
      verified: true,
      timeAgo: '2h ago',
      content: `The new executive structure is officially underway! Sporting Director and Chief Executive have addressed the senior squad at the training ground. Facilities upgrades, squad optimization, and stadium expansions underway ahead of the campaign! 🏛️⚡️`,
      sentiment: 'positive',
      likes: 21500,
      reposts: 4200,
      commentsCount: 610,
      tags: ['#NewEra', '#ExecutiveLeadership'],
    },
    {
      id: `sp_init_2_${week}`,
      week,
      authorName: 'David Ornstein',
      authorHandle: '@David_Ornstein',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Journalist',
      verified: true,
      timeAgo: '4h ago',
      content: `Inside ${club.name}'s ambitious boardroom roadmap: Total sporting directive granted to the new Chief Executive. Heavy emphasis on wage-to-turnover discipline, sustainable green facilities, and Carrington-tier academy scouting. One of the most forward-thinking projects in world football.`,
      sentiment: 'positive',
      likes: 31200,
      reposts: 7400,
      commentsCount: 1120,
      tags: ['#ClubRebuild', '#ModernFootball'],
    },
    {
      id: `sp_init_3_${week}`,
      week,
      authorName: 'Metro Faithful TV',
      authorHandle: '@MetroFaithful_FanChannel',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      authorRole: 'Fan',
      verified: false,
      timeAgo: '6h ago',
      content: `Buzz around ${club.stadium.name} right now is unreal. The pitch looks pristine with the new hybrid turf and the boys look sharp in training! If we back the gaffer with two smart signings, top 4 is absolutely achievable! 🔵⚪️ #Excited`,
      sentiment: 'ecstatic',
      likes: 9800,
      reposts: 1950,
      commentsCount: 430,
      tags: ['#PreSeasonHype', '#SupportersVoice'],
    },
  ];
}
