import { GameState, SaveSlotMetadata, SaveSlotData } from '../types/game';
export type { SaveSlotMetadata } from '../types/game';

const SAVE_PREFIX = 'apex_save_file_';
const MANIFEST_KEY = 'apex_save_slots_manifest_v2';
const ACTIVE_SESSION_KEY = 'apex_football_executive_save_v2';

export const DEFAULT_MANUAL_SLOT_IDS = ['slot_1', 'slot_2', 'slot_3'] as const;

export function formatSaveDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function createMetadataFromState(
  slotId: string,
  state: GameState,
  customName?: string,
  isAutoSave: boolean = false
): SaveSlotMetadata {
  const club = state.selectedClub;
  const manager = state.managerProfile;
  const now = Date.now();

  let defaultName = isAutoSave ? 'Auto-Save' : `Save ${slotId.replace('slot_', '#')}`;
  if (customName && customName.trim()) {
    defaultName = customName.trim();
  } else if (!isAutoSave) {
    defaultName = `${club.name} (Wk ${state.currentWeek}, ${state.currentSeason})`;
  }

  const bankBalance = club.finances?.bankBalance ?? 10000000;
  const transferBudget = club.finances?.transferBudget ?? 5000000;

  return {
    id: slotId,
    name: defaultName,
    timestamp: now,
    dateFormatted: formatSaveDate(now),
    clubName: club.name,
    clubId: club.id,
    leagueName: club.leagueName || 'Premier League',
    currentWeek: state.currentWeek,
    currentSeason: state.currentSeason,
    managerName: manager?.fullName,
    managerNationality: manager?.nationality,
    managerNationalityFlag: manager?.nationalityFlag,
    managerLicense: manager?.licenseName,
    balance: bankBalance,
    transferBudget: transferBudget,
    squadCount: club.players?.length || 0,
    isAutoSave,
  };
}

export function getAllSaveSlots(): SaveSlotMetadata[] {
  try {
    const raw = localStorage.getItem(MANIFEST_KEY);
    if (raw) {
      const parsed: SaveSlotMetadata[] = JSON.parse(raw);
      // Validate that actual save data exists in localStorage for each metadata item
      return parsed.filter(item => {
        return !!localStorage.getItem(SAVE_PREFIX + item.id);
      }).sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (err) {
    console.warn('Failed to parse save slots manifest', err);
  }
  return [];
}

function updateManifest(metadata: SaveSlotMetadata, remove: boolean = false): void {
  try {
    let current = getAllSaveSlots();
    if (remove) {
      current = current.filter(m => m.id !== metadata.id);
    } else {
      const existingIndex = current.findIndex(m => m.id === metadata.id);
      if (existingIndex >= 0) {
        current[existingIndex] = metadata;
      } else {
        current.unshift(metadata);
      }
    }
    localStorage.setItem(MANIFEST_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to update save manifest', err);
  }
}

export function saveGameToSlot(
  slotId: string,
  state: GameState,
  customName?: string,
  isAutoSave: boolean = false
): boolean {
  try {
    const metadata = createMetadataFromState(slotId, state, customName, isAutoSave);
    const savePayload: SaveSlotData = {
      metadata,
      gameState: state,
    };
    
    // Save file data
    localStorage.setItem(SAVE_PREFIX + slotId, JSON.stringify(savePayload));
    // Update manifest
    updateManifest(metadata, false);

    // If this is an auto-save or active save, update active session cache as well
    if (isAutoSave) {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(state));
    }
    return true;
  } catch (err) {
    console.error('Error saving game to slot', slotId, err);
    return false;
  }
}

export function loadGameFromSlot(slotId: string): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + slotId);
    if (!raw) return null;
    const parsed: SaveSlotData = JSON.parse(raw);
    if (parsed && parsed.gameState && parsed.gameState.selectedClub) {
      // Sync to active session key
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(parsed.gameState));
      return parsed.gameState;
    }
  } catch (err) {
    console.error('Error loading game from slot', slotId, err);
  }
  return null;
}

export function deleteSaveSlot(slotId: string): boolean {
  try {
    localStorage.removeItem(SAVE_PREFIX + slotId);
    updateManifest({ id: slotId } as SaveSlotMetadata, true);
    return true;
  } catch (err) {
    console.error('Error deleting save slot', slotId, err);
    return false;
  }
}

export function hasAnySaveGame(): boolean {
  const slots = getAllSaveSlots();
  return slots.length > 0 || !!localStorage.getItem(ACTIVE_SESSION_KEY);
}

export function getAutoSaveSlot(): SaveSlotMetadata | null {
  const slots = getAllSaveSlots();
  return slots.find(s => s.id === 'autosave' || s.isAutoSave) || null;
}
