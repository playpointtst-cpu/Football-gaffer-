import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GameState,
  ClubProfile,
  TacticalStyle,
  HeadCoach,
  Player,
  SponsorContract,
  GroundSustainability,
  CommercialAmenities,
  ManagerProfile,
} from '../types/game';
import { INITIAL_CLUBS, INITIAL_LEAGUE_TABLE } from '../data/initialClubs';
import { advanceGameWeek, generateSeasonFixtures, generateYouthIntakeBatch } from '../services/simulationEngine';
import { SCOUTED_TRANSFER_TARGETS } from '../data/sponsorCatalog';

interface GameContextType {
  state: GameState;
  isSimulating: boolean;
  simulationWeekTarget: number | null;
  scoutedPlayers: Player[];
  advanceWeek: () => void;
  advanceMonth: () => void;
  selectClub: (clubId: string) => void;
  resetGame: () => void;
  setTacticalDirective: (style: TacticalStyle) => void;
  updateTicketPrices: (general: number, season: number, vip: number) => void;
  commissionStandUpgrade: (standId: string) => boolean;
  investInSustainability: (key: 'solarArray' | 'rainwater' | 'led' | 'zeroWaste' | 'evCharging' | 'hybridTurf' | 'undersoil' | 'drainage') => boolean;
  investInAmenity: (key: keyof CommercialAmenities) => boolean;
  signSponsorship: (sponsor: SponsorContract) => void;
  terminateSponsorship: (sponsorId: string) => void;
  appointHeadCoach: (coach: HeadCoach) => void;
  upgradeStaff: (role: 'chiefScout' | 'headPhysio' | 'academyDirector') => boolean;
  buyPlayer: (target: Player, fee: number, wage: number, years: number) => { success: boolean; message: string };
  sellPlayer: (playerId: string, offerFee: number) => void;
  renewPlayerContract: (playerId: string, wage: number, additionalYears: number) => void;
  resolveDilemma: (messageId: string, choice: 'A' | 'B') => void;
  markMessageRead: (messageId: string) => void;
  takeBankLoan: (amount: number) => void;
  updateBudgetAllocation: (alloc: Partial<import('../types/game').BudgetAllocation>) => void;
  issueDebt: (name: string, type: import('../types/game').DebtInstrument['type'], amount: number, termWeeks: number, interestRate: number) => void;
  payoffDebt: (debtId: string) => boolean;
  refinanceDebt: (debtId: string, newRate: number) => boolean;
  upgradeTrainingGround: () => boolean;
  upgradeYouthAcademy: () => boolean;
  promoteYouthPlayer: (player: Player) => void;
  triggerYouthIntake: () => Player[];
  dispatchYouthMission: (region: import('../types/game').YouthScoutingMission['region']) => boolean;
  setProspectTrainingFocus: (prospectId: string, focus: import('../types/game').AcademyProspect['trainingFocus']) => void;
  promoteProspectToSenior: (prospectId: string, wage: number, contractYears: number) => boolean;
  loanOutProspect: (prospectId: string, loanClub: string) => boolean;
  recallProspectFromLoan: (prospectId: string) => boolean;
  releaseProspect: (prospectId: string) => void;
  closeMatchModal: () => void;
  showMatchModal: boolean;
  scoutTargetPlayer: (playerId: string) => boolean;
  reallocateBudget: (transferDelta: number) => void;
  setManagerProfile: (profile: ManagerProfile) => void;
}

const STORAGE_KEY = 'apex_football_executive_save_v2';

function initializeNewGame(clubId: string = 'metro'): GameState {
  const chosenClub = INITIAL_CLUBS.find(c => c.id === clubId) || INITIAL_CLUBS[0];
  const leagueTable = JSON.parse(JSON.stringify(INITIAL_LEAGUE_TABLE));
  const fixtures = generateSeasonFixtures(leagueTable);

  return {
    currentWeek: 1,
    currentSeason: 2026,
    isTransferWindowOpen: true,
    selectedClub: JSON.parse(JSON.stringify(chosenClub)),
    leagueTable,
    fixtures,
    inbox: [
      {
        id: 'msg_welcome',
        week: 1,
        season: 2026,
        sender: 'Boardroom of Directors',
        senderRole: 'Board of Directors',
        subject: 'Appointment Confirmation: Chief Executive & Sporting Director',
        preview: `Welcome to ${chosenClub.name}. The Board has entrusted you with total executive authority.`,
        body: `Welcome to ${chosenClub.name}. As Chief Executive Officer and Sporting Director, you command all sporting, ground, financial, and strategic operations. Your mandate is clear: build a self-sustaining powerhouse without sacrificing football pedigree.\n\nNote that match tactics and on-pitch substitutions are executed by your appointed Head Coach, who reports directly to your sporting directives. Monitor our stadium expansion, green utility footprint, commercial agreements, and squad architecture closely.`,
        isRead: false,
        urgent: true,
      },
      {
        id: 'msg_ground_brief',
        week: 1,
        season: 2026,
        sender: 'Senior Facilities Architect',
        senderRole: 'Head Groundsman',
        subject: 'Stadium Infrastructure & Sustainability Audit',
        preview: 'Executive summary on pitch condition, energy efficiency, and stand capacities.',
        body: `We have finalized our pre-season facilities audit. Pitch condition stands at ${chosenClub.stadium.pitchCondition}%. Investing in our hybrid turf system and sub-air drainage will reduce soft-tissue player injuries and eliminate match postponements. Review our roof solar array proposals to permanently reduce monthly energy overheads.`,
        isRead: false,
        urgent: false,
      },
    ],
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.selectedClub?.players && parsed?.selectedClub?.youthAcademy && parsed?.selectedClub?.academyProspects) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved game state', e);
    }
    return initializeNewGame('metro');
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationWeekTarget, setSimulationWeekTarget] = useState<number | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [scoutedPlayers, setScoutedPlayers] = useState<Player[]>(SCOUTED_TRANSFER_TARGETS);

  // Save on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save game state to storage', e);
    }
  }, [state]);

  const advanceWeek = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setState(prev => {
        const next = advanceGameWeek(prev);
        return next;
      });
      setIsSimulating(false);
      setShowMatchModal(true);
    }, 450);
  };

  const advanceMonth = () => {
    setIsSimulating(true);
    const target = state.currentWeek + 4;
    setSimulationWeekTarget(target);

    let current = state;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      current = advanceGameWeek(current);
      setState(current);

      if (step >= 4 || current.currentWeek >= 38) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationWeekTarget(null);
        setShowMatchModal(true);
      }
    }, 350);
  };

  const setManagerProfile = (profile: ManagerProfile) => {
    setState(prev => ({
      ...prev,
      managerProfile: profile,
    }));
  };

  const selectClub = (clubId: string) => {
    const newState = initializeNewGame(clubId);
    if (state.managerProfile) {
      newState.managerProfile = {
        ...state.managerProfile,
        selectedClubId: clubId,
        selectedClubName: newState.selectedClub.name,
      };
    }
    setState(newState);
    setShowMatchModal(false);
  };

  const resetGame = () => {
    const fresh = initializeNewGame(state.selectedClub.id);
    if (state.managerProfile) {
      fresh.managerProfile = state.managerProfile;
    }
    setState(fresh);
    setShowMatchModal(false);
  };

  const setTacticalDirective = (style: TacticalStyle) => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        tacticalDirective: style,
        headCoach: {
          ...prev.selectedClub.headCoach,
          tacticalStyle: style,
        },
      },
    }));
  };

  const updateTicketPrices = (general: number, season: number, vip: number) => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        stadium: {
          ...prev.selectedClub.stadium,
          ticketPrices: {
            generalAdmission: general,
            seasonTicket: season,
            vipHospitality: vip,
          },
        },
      },
    }));
  };

  const commissionStandUpgrade = (standId: string): boolean => {
    const stand = state.selectedClub.stadium.stands.find(s => s.id === standId);
    if (!stand) return false;
    if (state.selectedClub.finances.bankBalance < stand.upgradeCost) return false;
    if (stand.isUpgrading) return false;
    if (stand.capacity >= stand.maxCapacity) return false;

    setState(prev => {
      const updatedBalance = prev.selectedClub.finances.bankBalance - stand.upgradeCost;
      const updatedStands = prev.selectedClub.stadium.stands.map(s => {
        if (s.id === standId) {
          return {
            ...s,
            isUpgrading: true,
            upgradeWeeksRemaining: 6, // 6 weeks construction
          };
        }
        return s;
      });

      return {
        ...prev,
        selectedClub: {
          ...prev.selectedClub,
          stadium: {
            ...prev.selectedClub.stadium,
            stands: updatedStands,
          },
          finances: {
            ...prev.selectedClub.finances,
            bankBalance: updatedBalance,
            recentTransactions: [
              {
                id: `tx_stand_${Date.now()}`,
                week: prev.currentWeek,
                season: prev.currentSeason,
                type: 'EXPENSE',
                category: 'Infrastructure',
                description: `Commissioned expansion works for ${stand.name} (+2,500 capacity)`,
                amount: stand.upgradeCost,
              },
              ...prev.selectedClub.finances.recentTransactions,
            ],
          },
        },
      };
    });
    return true;
  };

  const investInSustainability = (key: 'solarArray' | 'rainwater' | 'led' | 'zeroWaste' | 'evCharging' | 'hybridTurf' | 'undersoil' | 'drainage'): boolean => {
    const costs: Record<string, { cost: number; utilitySavings: number; greenBonus: number; label: string }> = {
      solarArray: { cost: 7500000, utilitySavings: 9500, greenBonus: 18, label: 'Roof Solar Microgrid Array' },
      rainwater: { cost: 1800000, utilitySavings: 3000, greenBonus: 8, label: 'Rainwater Harvesting & Filtration' },
      led: { cost: 1200000, utilitySavings: 2500, greenBonus: 7, label: 'Ultra-Efficiency Smart LED Floodlights' },
      zeroWaste: { cost: 950000, utilitySavings: 1800, greenBonus: 10, label: 'Zero-Waste & Compost Concourse System' },
      evCharging: { cost: 1500000, utilitySavings: 2000, greenBonus: 9, label: 'EV Charging Plaza & Solar Canopies' },
      hybridTurf: { cost: 3800000, utilitySavings: 0, greenBonus: 12, label: 'Hybrid Desso GrassMaster Pitch' },
      undersoil: { cost: 2200000, utilitySavings: 0, greenBonus: 5, label: 'Sub-Surface Geothermal Undersoil Heating' },
      drainage: { cost: 1900000, utilitySavings: 1500, greenBonus: 8, label: 'Vacuum Sub-Air Pitch Drainage System' },
    };

    const target = costs[key];
    if (!target) return false;
    if (state.selectedClub.finances.bankBalance < target.cost) return false;

    setState(prev => {
      const curSust = { ...prev.selectedClub.stadium.sustainability };
      let newScore = curSust.greenRatingScore + target.greenBonus;
      let newWeeklySavings = curSust.weeklyUtilityCostReduction + target.utilitySavings;

      if (key === 'solarArray') curSust.solarArrayLevel = Math.min(3, curSust.solarArrayLevel + 1);
      if (key === 'rainwater') curSust.rainwaterHarvesting = true;
      if (key === 'led') curSust.ledFloodlights = true;
      if (key === 'zeroWaste') curSust.zeroWasteProgram = true;
      if (key === 'evCharging') curSust.evChargingPiazza = true;
      if (key === 'hybridTurf') {
        curSust.hybridTurfSystem = true;
        prev.selectedClub.stadium.pitchCondition = 98;
      }
      if (key === 'undersoil') curSust.undersoilHeating = true;
      if (key === 'drainage') curSust.subAirDrainage = true;

      curSust.greenRatingScore = Math.min(100, newScore);
      curSust.weeklyUtilityCostReduction = newWeeklySavings;

      return {
        ...prev,
        selectedClub: {
          ...prev.selectedClub,
          stadium: {
            ...prev.selectedClub.stadium,
            sustainability: curSust,
          },
          finances: {
            ...prev.selectedClub.finances,
            bankBalance: prev.selectedClub.finances.bankBalance - target.cost,
            recentTransactions: [
              {
                id: `tx_sust_${Date.now()}`,
                week: prev.currentWeek,
                season: prev.currentSeason,
                type: 'EXPENSE',
                category: 'Infrastructure',
                description: `Installed ground sustainability tech: ${target.label}`,
                amount: target.cost,
              },
              ...prev.selectedClub.finances.recentTransactions,
            ],
          },
        },
      };
    });

    return true;
  };

  const investInAmenity = (key: keyof CommercialAmenities): boolean => {
    const costs: Record<keyof CommercialAmenities, { cost: number; label: string }> = {
      megaStoreLevel: { cost: 4000000, label: 'Superstore Expansion Tier' },
      museumAndTourCenter: { cost: 3500000, label: 'Heritage Museum & Stadium Tour Complex' },
      craftBreweryFanZone: { cost: 2800000, label: 'Fan Plaza & Artisan Brewery Taproom' },
      corporateConferenceCenter: { cost: 5200000, label: 'Executive Conference & Events Hub' },
      hotelAndWellnessSuites: { cost: 12000000, label: 'On-Site Luxury Stadium Hotel & Sports Science Spa' },
    };

    const target = costs[key];
    if (state.selectedClub.finances.bankBalance < target.cost) return false;

    setState(prev => {
      const curAmenities = { ...prev.selectedClub.stadium.amenities };
      if (key === 'megaStoreLevel') {
        curAmenities.megaStoreLevel = Math.min(4, curAmenities.megaStoreLevel + 1);
      } else {
        (curAmenities[key] as boolean) = true;
      }

      return {
        ...prev,
        selectedClub: {
          ...prev.selectedClub,
          stadium: {
            ...prev.selectedClub.stadium,
            amenities: curAmenities,
          },
          finances: {
            ...prev.selectedClub.finances,
            bankBalance: prev.selectedClub.finances.bankBalance - target.cost,
            recentTransactions: [
              {
                id: `tx_amenity_${Date.now()}`,
                week: prev.currentWeek,
                season: prev.currentSeason,
                type: 'EXPENSE',
                category: 'Infrastructure',
                description: `Constructed commercial ground asset: ${target.label}`,
                amount: target.cost,
              },
              ...prev.selectedClub.finances.recentTransactions,
            ],
          },
        },
      };
    });
    return true;
  };

  const signSponsorship = (sponsor: SponsorContract) => {
    setState(prev => {
      // Replace existing contract in same category or add
      const filtered = prev.selectedClub.sponsors.filter(s => s.category !== sponsor.category);
      const updatedSponsors = [...filtered, sponsor];
      const fanImpact = sponsor.fanSentimentImpact || 0;
      const newFanTrust = Math.min(100, Math.max(10, prev.selectedClub.boardMandate.fanTrustRating + fanImpact));

      return {
        ...prev,
        selectedClub: {
          ...prev.selectedClub,
          sponsors: updatedSponsors,
          boardMandate: {
            ...prev.selectedClub.boardMandate,
            fanTrustRating: newFanTrust,
          },
          finances: {
            ...prev.selectedClub.finances,
            recentTransactions: [
              {
                id: `tx_sp_sign_${Date.now()}`,
                week: prev.currentWeek,
                season: prev.currentSeason,
                type: 'INCOME',
                category: 'Sponsorship',
                description: `Executed official commercial deal with ${sponsor.brandName} (${sponsor.category})`,
                amount: sponsor.annualValue,
              },
              ...prev.selectedClub.finances.recentTransactions,
            ],
          },
        },
      };
    });
  };

  const terminateSponsorship = (sponsorId: string) => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        sponsors: prev.selectedClub.sponsors.filter(s => s.id !== sponsorId),
      },
    }));
  };

  const appointHeadCoach = (coach: HeadCoach) => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        headCoach: coach,
        tacticalDirective: coach.tacticalStyle,
      },
      inbox: [
        {
          id: `msg_coach_${Date.now()}`,
          week: prev.currentWeek,
          season: prev.currentSeason,
          sender: coach.name,
          senderRole: 'Head Coach',
          subject: 'First Day at Training Ground: Coaching Mandate Agreed',
          preview: 'New head coach outlines initial tactical assessment of the squad.',
          body: `Sporting Director, thank you for placing your trust in me. My staff and I have commenced training sessions aligning with our ${coach.tacticalStyle} directive. We will ensure competitive consistency each matchday.`,
          isRead: false,
          urgent: true,
        },
        ...prev.inbox,
      ],
    }));
  };

  const upgradeStaff = (role: 'chiefScout' | 'headPhysio' | 'academyDirector'): boolean => {
    const cost = 850000;
    if (state.selectedClub.finances.bankBalance < cost) return false;

    setState(prev => {
      const currentStaff = { ...prev.selectedClub.staff };
      if (role === 'chiefScout') {
        currentStaff.chiefScout = {
          ...currentStaff.chiefScout,
          level: Math.min(5, currentStaff.chiefScout.level + 1),
          scoutingAccuracy: Math.min(98, currentStaff.chiefScout.scoutingAccuracy + 6),
          salary: currentStaff.chiefScout.salary + 4000,
        };
      } else if (role === 'headPhysio') {
        currentStaff.headPhysio = {
          ...currentStaff.headPhysio,
          level: Math.min(5, currentStaff.headPhysio.level + 1),
          recoverySpeedBonus: Math.min(45, currentStaff.headPhysio.recoverySpeedBonus + 8),
          salary: currentStaff.headPhysio.salary + 4500,
        };
      } else if (role === 'academyDirector') {
        currentStaff.academyDirector = {
          ...currentStaff.academyDirector,
          level: Math.min(5, currentStaff.academyDirector.level + 1),
          talentIntakeQuality: Math.min(98, currentStaff.academyDirector.talentIntakeQuality + 7),
          salary: currentStaff.academyDirector.salary + 5000,
        };
      }

      return {
        ...prev,
        selectedClub: {
          ...prev.selectedClub,
          staff: currentStaff,
          finances: {
            ...prev.selectedClub.finances,
            bankBalance: prev.selectedClub.finances.bankBalance - cost,
            recentTransactions: [
              {
                id: `tx_staff_${Date.now()}`,
                week: prev.currentWeek,
                season: prev.currentSeason,
                type: 'EXPENSE',
                category: 'Wages',
                description: `Upgraded executive sports science/scouting department (${role})`,
                amount: cost,
              },
              ...prev.selectedClub.finances.recentTransactions,
            ],
          },
        },
      };
    });

    return true;
  };

  const buyPlayer = (target: Player, fee: number, wage: number, years: number) => {
    if (state.selectedClub.finances.transferBudget < fee || state.selectedClub.finances.bankBalance < fee) {
      return { success: false, message: 'Insufficient transfer funds in bank balance.' };
    }

    const newPlayer: Player = {
      ...target,
      id: `pl_signed_${Date.now()}`,
      wage,
      contractYears: years,
      morale: 92,
      fitness: 96,
      form: 8,
      goals: 0,
      assists: 0,
      appearances: 0,
    };

    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        players: [newPlayer, ...prev.selectedClub.players],
        finances: {
          ...prev.selectedClub.finances,
          bankBalance: prev.selectedClub.finances.bankBalance - fee,
          transferBudget: prev.selectedClub.finances.transferBudget - fee,
          weeklyWageBill: prev.selectedClub.finances.weeklyWageBill + wage,
          recentTransactions: [
            {
              id: `tx_transfer_in_${Date.now()}`,
              week: prev.currentWeek,
              season: prev.currentSeason,
              type: 'EXPENSE',
              category: 'Transfers',
              description: `Signed ${target.name} (${target.position}, ${target.age}yo) on a ${years}-year contract`,
              amount: fee,
            },
            ...prev.selectedClub.finances.recentTransactions,
          ],
        },
      },
    }));

    // Remove from scouted targets
    setScoutedPlayers(prev => prev.filter(p => p.id !== target.id));
    return { success: true, message: `Successfully completed signing of ${target.name}!` };
  };

  const sellPlayer = (playerId: string, offerFee: number) => {
    const player = state.selectedClub.players.find(p => p.id === playerId);
    if (!player) return;

    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        players: prev.selectedClub.players.filter(p => p.id !== playerId),
        finances: {
          ...prev.selectedClub.finances,
          bankBalance: prev.selectedClub.finances.bankBalance + offerFee,
          transferBudget: prev.selectedClub.finances.transferBudget + Math.round(offerFee * 0.85),
          weeklyWageBill: Math.max(0, prev.selectedClub.finances.weeklyWageBill - player.wage),
          recentTransactions: [
            {
              id: `tx_transfer_out_${Date.now()}`,
              week: prev.currentWeek,
              season: prev.currentSeason,
              type: 'INCOME',
              category: 'Transfers',
              description: `Sold ${player.name} (${player.position}) to transfer bidder`,
              amount: offerFee,
            },
            ...prev.selectedClub.finances.recentTransactions,
          ],
        },
      },
    }));
  };

  const renewPlayerContract = (playerId: string, wage: number, additionalYears: number) => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        players: prev.selectedClub.players.map(p => {
          if (p.id === playerId) {
            return {
              ...p,
              wage,
              contractYears: p.contractYears + additionalYears,
              morale: Math.min(100, p.morale + 10),
            };
          }
          return p;
        }),
      },
    }));
  };

  const scoutTargetPlayer = (playerId: string): boolean => {
    const fee = 25000;
    if (state.selectedClub.finances.bankBalance < fee) return false;

    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        finances: {
          ...prev.selectedClub.finances,
          bankBalance: prev.selectedClub.finances.bankBalance - fee,
          recentTransactions: [
            {
              id: `tx_scout_${Date.now()}`,
              week: prev.currentWeek,
              season: prev.currentSeason,
              type: 'EXPENSE',
              category: 'Transfers',
              description: `Chief Scout reconnaissance dispatch fee`,
              amount: fee,
            },
            ...prev.selectedClub.finances.recentTransactions,
          ],
        },
      },
    }));

    setScoutedPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          scoutingStatus: 'fully_scouted',
          tacticalFitScore: Math.round(78 + (p.overall % 18)),
          personalityTrait: p.potential > 88 ? 'Generational Ambition' : 'Model Professional',
        };
      }
      return p;
    }));

    return true;
  };

  const reallocateBudget = (transferDelta: number) => {
    setState(prev => {
      const currentTransfer = prev.selectedClub.finances.transferBudget;
      const currentWageMargin = prev.selectedClub.finances.remainingWageBudget;
      const weeklyEquivalent = Math.round(transferDelta / 52);

      const newTransfer = currentTransfer + transferDelta;
      const newWageMargin = currentWageMargin - weeklyEquivalent;

      if (newTransfer < 0 || newWageMargin < 0) return prev;

      return {
        ...prev,
        selectedClub: {
          ...prev.selectedClub,
          finances: {
            ...prev.selectedClub.finances,
            transferBudget: newTransfer,
            remainingWageBudget: newWageMargin,
          },
        },
      };
    });
  };

  const resolveDilemma = (messageId: string, choice: 'A' | 'B') => {
    setState(prev => {
      const msg = prev.inbox.find(m => m.id === messageId);
      if (!msg || !msg.decision) return prev;

      let bankChange = 0;
      let fanTrustChange = 0;
      let desc = '';

      const consequence = choice === 'A' ? msg.decision.choiceA.consequenceKey : msg.decision.choiceB.consequenceKey;

      if (consequence === 'ACCEPT_SKYBOX_LEASE') {
        bankChange = 6500000;
        desc = 'Executive skyboxes 3-season upfront payment received';
      } else if (consequence === 'DECLINE_SKYBOX_LEASE') {
        fanTrustChange = 4;
        desc = 'Maintained open hospitality and flexible seating';
      } else if (consequence === 'APPROVE_YOUTH_PATHWAY') {
        bankChange = -200000;
        fanTrustChange = 5;
        desc = 'Authorized youth biometric tracking & academy incentives';
      } else if (consequence === 'ACCEPT_FAN_FREEZE') {
        bankChange = -80000;
        fanTrustChange = 8;
        desc = 'Subsidized youth & junior away matchday ticket freeze';
      } else if (consequence === 'REJECT_FAN_FREEZE') {
        fanTrustChange = -6;
        desc = 'Maintained market ticket pricing despite supporters petition';
      }

      const updatedInbox = prev.inbox.map(m => {
        if (m.id === messageId && m.decision) {
          return {
            ...m,
            isRead: true,
            decision: {
              ...m.decision,
              resolved: true,
              chosenChoice: choice,
            },
          };
        }
        return m;
      });

      return {
        ...prev,
        inbox: updatedInbox,
        selectedClub: {
          ...prev.selectedClub,
          boardMandate: {
            ...prev.selectedClub.boardMandate,
            fanTrustRating: Math.min(100, Math.max(10, prev.selectedClub.boardMandate.fanTrustRating + fanTrustChange)),
          },
          finances: {
            ...prev.selectedClub.finances,
            bankBalance: prev.selectedClub.finances.bankBalance + bankChange,
            transferBudget: prev.selectedClub.finances.transferBudget + (bankChange > 0 ? bankChange : 0),
            recentTransactions: bankChange !== 0 ? [
              {
                id: `tx_dilemma_${Date.now()}`,
                week: prev.currentWeek,
                season: prev.currentSeason,
                type: bankChange >= 0 ? 'INCOME' : 'EXPENSE',
                category: bankChange >= 0 ? 'Sponsorship' : 'Infrastructure',
                description: desc,
                amount: Math.abs(bankChange),
              },
              ...prev.selectedClub.finances.recentTransactions,
            ] : prev.selectedClub.finances.recentTransactions,
          },
        },
      };
    });
  };

  const markMessageRead = (messageId: string) => {
    setState(prev => ({
      ...prev,
      inbox: prev.inbox.map(m => (m.id === messageId ? { ...m, isRead: true } : m)),
    }));
  };

  const takeBankLoan = (amount: number) => {
    setState(prev => {
      const weeklyRepayment = Math.round((amount * 1.15) / 104); // 2 year loan with 15% total interest
      const newLoan: import('../types/game').DebtInstrument = {
        id: `loan_${Date.now()}`,
        name: 'Commercial Bank Credit Facility',
        type: 'Commercial Term Loan',
        principal: amount,
        remainingPrincipal: amount,
        interestRate: 5.5,
        weeklyRepayment,
        totalWeeks: 104,
        weeksRemaining: 104,
        earlyPayoffPenalty: 1.5,
      };

      return {
        ...prev,
        selectedClub: {
          ...prev.selectedClub,
          finances: {
            ...prev.selectedClub.finances,
            bankBalance: prev.selectedClub.finances.bankBalance + amount,
            bankLoans: [...prev.selectedClub.finances.bankLoans, newLoan],
            recentTransactions: [
              {
                id: `tx_loan_${Date.now()}`,
                week: prev.currentWeek,
                season: prev.currentSeason,
                type: 'INCOME',
                category: 'Loan',
                description: `Secured commercial bank credit facility (£${amount.toLocaleString()})`,
                amount,
              },
              ...prev.selectedClub.finances.recentTransactions,
            ],
          },
        },
      };
    });
  };

  const updateBudgetAllocation = (alloc: Partial<import('../types/game').BudgetAllocation>) => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        finances: {
          ...prev.selectedClub.finances,
          budgetAllocation: {
            ...prev.selectedClub.finances.budgetAllocation,
            ...alloc,
          },
          transferBudget: alloc.transferBudgetCap !== undefined ? alloc.transferBudgetCap : prev.selectedClub.finances.transferBudget,
        },
      },
    }));
  };

  const issueDebt = (
    name: string,
    type: import('../types/game').DebtInstrument['type'],
    amount: number,
    termWeeks: number,
    interestRate: number
  ) => {
    setState(prev => {
      const totalRepay = amount * (1 + (interestRate / 100) * (termWeeks / 52));
      const weeklyRepayment = Math.round(totalRepay / termWeeks);
      const newDebt: import('../types/game').DebtInstrument = {
        id: `debt_${Date.now()}`,
        name,
        type,
        principal: amount,
        remainingPrincipal: amount,
        interestRate,
        weeklyRepayment,
        totalWeeks: termWeeks,
        weeksRemaining: termWeeks,
        earlyPayoffPenalty: 1.5,
      };

      return {
        ...prev,
        selectedClub: {
          ...prev.selectedClub,
          finances: {
            ...prev.selectedClub.finances,
            bankBalance: prev.selectedClub.finances.bankBalance + amount,
            bankLoans: [...(prev.selectedClub.finances.bankLoans || []), newDebt],
            recentTransactions: [
              {
                id: `tx_debt_issue_${Date.now()}`,
                week: prev.currentWeek,
                season: prev.currentSeason,
                type: 'INCOME',
                category: 'Loan',
                description: `Issued new debt facility: ${name} (£${amount.toLocaleString()})`,
                amount,
              },
              ...prev.selectedClub.finances.recentTransactions,
            ],
          },
        },
      };
    });
  };

  const payoffDebt = (debtId: string): boolean => {
    const debt = state.selectedClub.finances.bankLoans?.find(d => d.id === debtId);
    if (!debt) return false;
    const totalCost = Math.round(debt.remainingPrincipal * (1 + (debt.earlyPayoffPenalty || 0) / 100));
    if (state.selectedClub.finances.bankBalance < totalCost) return false;

    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        finances: {
          ...prev.selectedClub.finances,
          bankBalance: prev.selectedClub.finances.bankBalance - totalCost,
          bankLoans: prev.selectedClub.finances.bankLoans.filter(d => d.id !== debtId),
          recentTransactions: [
            {
              id: `tx_payoff_${Date.now()}`,
              week: prev.currentWeek,
              season: prev.currentSeason,
              type: 'EXPENSE',
              category: 'Loan',
              description: `Early settlement of ${debt.name} (Principal: £${debt.remainingPrincipal.toLocaleString()})`,
              amount: totalCost,
            },
            ...prev.selectedClub.finances.recentTransactions,
          ],
        },
      },
    }));
    return true;
  };

  const refinanceDebt = (debtId: string, newRate: number): boolean => {
    const fee = 250000;
    if (state.selectedClub.finances.bankBalance < fee) return false;

    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        finances: {
          ...prev.selectedClub.finances,
          bankBalance: prev.selectedClub.finances.bankBalance - fee,
          bankLoans: prev.selectedClub.finances.bankLoans.map(d => {
            if (d.id === debtId) {
              const remainingWeeks = d.weeksRemaining;
              const totalRepay = d.remainingPrincipal * (1 + (newRate / 100) * (remainingWeeks / 52));
              return {
                ...d,
                interestRate: newRate,
                weeklyRepayment: Math.round(totalRepay / remainingWeeks),
              };
            }
            return d;
          }),
          recentTransactions: [
            {
              id: `tx_refinance_${Date.now()}`,
              week: prev.currentWeek,
              season: prev.currentSeason,
              type: 'EXPENSE',
              category: 'Loan',
              description: `Refinanced debt to ${newRate}% interest rate (Legal/Advisory fee paid)`,
              amount: fee,
            },
            ...prev.selectedClub.finances.recentTransactions,
          ],
        },
      },
    }));
    return true;
  };

  const upgradeTrainingGround = (): boolean => {
    const tg = state.selectedClub.trainingGround;
    if (!tg) return false;
    if (state.selectedClub.finances.bankBalance < tg.upgradeCost) return false;
    if (tg.isUpgrading || tg.level >= 5) return false;

    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        trainingGround: {
          ...prev.selectedClub.trainingGround,
          isUpgrading: true,
          upgradeWeeksRemaining: tg.upgradeWeeks,
        },
        finances: {
          ...prev.selectedClub.finances,
          bankBalance: prev.selectedClub.finances.bankBalance - tg.upgradeCost,
          recentTransactions: [
            {
              id: `tx_tg_up_${Date.now()}`,
              week: prev.currentWeek,
              season: prev.currentSeason,
              type: 'EXPENSE',
              category: 'Infrastructure',
              description: `Commissioned training campus modernization (Target: Level ${tg.level + 1})`,
              amount: tg.upgradeCost,
            },
            ...prev.selectedClub.finances.recentTransactions,
          ],
        },
      },
    }));
    return true;
  };

  const upgradeYouthAcademy = (): boolean => {
    const ya = state.selectedClub.youthAcademy;
    if (!ya) return false;
    if (state.selectedClub.finances.bankBalance < ya.upgradeCost) return false;
    if (ya.isUpgrading || ya.academyLevel >= 5) return false;

    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        youthAcademy: {
          ...prev.selectedClub.youthAcademy,
          isUpgrading: true,
          upgradeWeeksRemaining: ya.upgradeWeeks,
        },
        finances: {
          ...prev.selectedClub.finances,
          bankBalance: prev.selectedClub.finances.bankBalance - ya.upgradeCost,
          recentTransactions: [
            {
              id: `tx_ya_up_${Date.now()}`,
              week: prev.currentWeek,
              season: prev.currentSeason,
              type: 'EXPENSE',
              category: 'Infrastructure',
              description: `Commissioned youth academy and education campus expansion`,
              amount: ya.upgradeCost,
            },
            ...prev.selectedClub.finances.recentTransactions,
          ],
        },
      },
    }));
    return true;
  };

  const promoteYouthPlayer = (player: Player) => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        players: [player, ...prev.selectedClub.players],
        finances: {
          ...prev.selectedClub.finances,
          weeklyWageBill: prev.selectedClub.finances.weeklyWageBill + player.wage,
        },
      },
    }));
  };

  const triggerYouthIntake = (): Player[] => {
    const ya = state.selectedClub.youthAcademy;
    const prodigies = generateYouthIntakeBatch(ya?.categoryGrade || 1, ya?.academyLevel || 4);
    return prodigies;
  };

  const dispatchYouthMission = (region: import('../types/game').YouthScoutingMission['region']): boolean => {
    const missionSpecs: Record<import('../types/game').YouthScoutingMission['region'], { cost: number; weeks: number; yield: number }> = {
      'Local Grassroots': { cost: 120000, weeks: 2, yield: 2 },
      'National Academy Network': { cost: 280000, weeks: 3, yield: 3 },
      'Continental Europe': { cost: 450000, weeks: 4, yield: 3 },
      'Global Wonderkid Expedition': { cost: 650000, weeks: 5, yield: 3 },
    };

    const spec = missionSpecs[region];
    if (state.selectedClub.finances.bankBalance < spec.cost) return false;

    const newMission: import('../types/game').YouthScoutingMission = {
      id: `msn_${Date.now()}`,
      region,
      cost: spec.cost,
      weeksRemaining: spec.weeks,
      totalWeeks: spec.weeks,
      expectedYield: spec.yield,
    };

    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        youthScoutingMissions: [...(prev.selectedClub.youthScoutingMissions || []), newMission],
        finances: {
          ...prev.selectedClub.finances,
          bankBalance: prev.selectedClub.finances.bankBalance - spec.cost,
          recentTransactions: [
            {
              id: `tx_scout_msn_${Date.now()}`,
              week: prev.currentWeek,
              season: prev.currentSeason,
              type: 'EXPENSE',
              category: 'Transfers',
              description: `Dispatched youth scouting mission: ${region}`,
              amount: spec.cost,
            },
            ...prev.selectedClub.finances.recentTransactions,
          ],
        },
      },
    }));
    return true;
  };

  const setProspectTrainingFocus = (prospectId: string, focus: import('../types/game').AcademyProspect['trainingFocus']) => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        academyProspects: (prev.selectedClub.academyProspects || []).map(p =>
          p.id === prospectId ? { ...p, trainingFocus: focus } : p
        ),
      },
    }));
  };

  const promoteProspectToSenior = (prospectId: string, wage: number, contractYears: number): boolean => {
    const prospect = state.selectedClub.academyProspects?.find(p => p.id === prospectId);
    if (!prospect) return false;

    const newSeniorPlayer: Player = {
      id: `pl_grad_${Date.now()}`,
      name: prospect.name,
      nationality: prospect.nationality,
      age: prospect.age,
      position: prospect.position,
      overall: prospect.currentAbility,
      potential: prospect.potentialMax,
      wage,
      marketValue: Math.round(prospect.currentAbility * prospect.currentAbility * 3000),
      contractYears,
      fitness: 100,
      morale: 95,
      form: 7,
      goals: 0,
      assists: 0,
      appearances: 0,
      isInjured: false,
      isTransferListed: false,
      academyGraduate: true,
    };

    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        players: [newSeniorPlayer, ...prev.selectedClub.players],
        academyProspects: prev.selectedClub.academyProspects.filter(p => p.id !== prospectId),
        youthAcademy: {
          ...prev.selectedClub.youthAcademy,
          recentGraduatesCount: (prev.selectedClub.youthAcademy.recentGraduatesCount || 0) + 1,
        },
        finances: {
          ...prev.selectedClub.finances,
          weeklyWageBill: prev.selectedClub.finances.weeklyWageBill + wage,
        },
        boardMandate: {
          ...prev.selectedClub.boardMandate,
          fanTrustRating: Math.min(100, prev.selectedClub.boardMandate.fanTrustRating + 3),
        },
      },
      inbox: [
        {
          id: `msg_grad_${Date.now()}`,
          week: prev.currentWeek,
          season: prev.currentSeason,
          sender: 'Academy Director',
          senderRole: 'Board of Directors',
          subject: `Senior Contract Signed: ${prospect.name}`,
          preview: `${prospect.name} (${prospect.position}) has graduated into the first-team dressing room.`,
          body: `Sporting Director, we are proud to confirm that ${prospect.name} (${prospect.position}, ${prospect.age}yo) has signed their first professional contract. Supporters love seeing homegrown graduates in the squad, and this reinforces our club identity.`,
          isRead: false,
          urgent: false,
        },
        ...prev.inbox,
      ],
    }));
    return true;
  };

  const loanOutProspect = (prospectId: string, loanClub: string): boolean => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        academyProspects: prev.selectedClub.academyProspects.map(p =>
          p.id === prospectId ? { ...p, isOnLoan: true, loanClub } : p
        ),
      },
    }));
    return true;
  };

  const recallProspectFromLoan = (prospectId: string): boolean => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        academyProspects: prev.selectedClub.academyProspects.map(p =>
          p.id === prospectId ? { ...p, isOnLoan: false, loanClub: undefined } : p
        ),
      },
    }));
    return true;
  };

  const releaseProspect = (prospectId: string) => {
    setState(prev => ({
      ...prev,
      selectedClub: {
        ...prev.selectedClub,
        academyProspects: prev.selectedClub.academyProspects.filter(p => p.id !== prospectId),
      },
    }));
  };

  const closeMatchModal = () => {
    setShowMatchModal(false);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        isSimulating,
        simulationWeekTarget,
        scoutedPlayers,
        advanceWeek,
        advanceMonth,
        selectClub,
        resetGame,
        setTacticalDirective,
        updateTicketPrices,
        commissionStandUpgrade,
        investInSustainability,
        investInAmenity,
        signSponsorship,
        terminateSponsorship,
        appointHeadCoach,
        upgradeStaff,
        buyPlayer,
        sellPlayer,
        renewPlayerContract,
        resolveDilemma,
        markMessageRead,
        takeBankLoan,
        updateBudgetAllocation,
        issueDebt,
        payoffDebt,
        refinanceDebt,
        upgradeTrainingGround,
        upgradeYouthAcademy,
        promoteYouthPlayer,
        triggerYouthIntake,
        dispatchYouthMission,
        setProspectTrainingFocus,
        promoteProspectToSenior,
        loanOutProspect,
        recallProspectFromLoan,
        releaseProspect,
        closeMatchModal,
        showMatchModal,
        scoutTargetPlayer,
        reallocateBudget,
        setManagerProfile,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
