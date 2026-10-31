import React, { useState } from 'react';
import { 
  Save, 
  Download, 
  Trash2, 
  Clock, 
  X, 
  Building2, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Home,
  ShieldCheck
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { DEFAULT_MANUAL_SLOT_IDS, SaveSlotMetadata } from '../../services/saveGameService';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'save' | 'load';
  onReturnToMainMenu?: () => void;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'save',
  onReturnToMainMenu,
}) => {
  const { 
    state, 
    saveGame, 
    loadGame, 
    deleteSave, 
    getSaveSlots, 
    triggerAutoSave,
    setInMainMenu 
  } = useGame();

  const [mode, setMode] = useState<'save' | 'load'>(initialMode);
  const [customNameInput, setCustomNameInput] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const slots = getSaveSlots();
  const autoSaveSlot = slots.find(s => s.id === 'autosave' || s.isAutoSave);

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleManualSave = (slotId: string) => {
    const success = saveGame(slotId, customNameInput.trim() || undefined);
    if (success) {
      showFeedback(`Successfully saved to ${slotId.replace('_', ' ').toUpperCase()}!`, 'success');
      setCustomNameInput('');
    } else {
      showFeedback('Failed to save game.', 'error');
    }
  };

  const handleAutoSaveNow = () => {
    const success = triggerAutoSave();
    if (success) {
      showFeedback('Auto-Save updated with current club state!', 'success');
    } else {
      showFeedback('Failed to update Auto-Save.', 'error');
    }
  };

  const handleLoad = (slotId: string) => {
    const success = loadGame(slotId);
    if (success) {
      showFeedback('Loaded saved game point successfully!', 'success');
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      showFeedback('Could not load save file.', 'error');
    }
  };

  const handleDelete = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this save file? This cannot be undone.')) {
      const ok = deleteSave(slotId);
      if (ok) {
        showFeedback('Save file deleted.', 'success');
      }
    }
  };

  const handleGoToMainMenu = () => {
    // Prompt to auto-save before leaving
    triggerAutoSave();
    onClose();
    if (onReturnToMainMenu) {
      onReturnToMainMenu();
    } else {
      setInMainMenu(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              {mode === 'save' ? <Save className="w-5 h-5" /> : <Download className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                {mode === 'save' ? 'Save Executive State' : 'Load Saved Point'}
              </h2>
              <p className="text-xs text-slate-400">
                {state.selectedClub.name} • Week {state.currentWeek}, Season {state.currentSeason}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl my-4">
          <button
            onClick={() => setMode('save')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'save' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            Save Game
          </button>
          <button
            onClick={() => setMode('load')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'load' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Load Game
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
            feedback.type === 'success' 
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Save/Load List Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Auto-Save Slot */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Auto-Save Slot</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-medium">Automatic</span>
              </div>
              {autoSaveSlot && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {autoSaveSlot.dateFormatted}
                </span>
              )}
            </div>

            {autoSaveSlot ? (
              <div className="flex items-center justify-between pt-1">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-200">
                    {autoSaveSlot.clubName} • Week {autoSaveSlot.currentWeek}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    {autoSaveSlot.managerNationalityFlag && <span>{autoSaveSlot.managerNationalityFlag}</span>}
                    <span>{autoSaveSlot.managerName || 'Chief Executive'}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-amber-400 font-mono text-[10px]">{autoSaveSlot.managerLicense || 'Licensed'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {mode === 'save' && (
                    <button
                      onClick={handleAutoSaveNow}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Update Auto-Save
                    </button>
                  )}
                  {mode === 'load' && (
                    <button
                      onClick={() => handleLoad('autosave')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Load Point
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-1 flex items-center justify-between">
                <span>Auto-save will automatically trigger after your first match week.</span>
                {mode === 'save' && (
                  <button
                    onClick={handleAutoSaveNow}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Save Now
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Optional Custom Label for Manual Saving */}
          {mode === 'save' && (
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-medium text-slate-400">Custom Save Label (Optional)</label>
              <input
                type="text"
                value={customNameInput}
                onChange={e => setCustomNameInput(e.target.value)}
                placeholder={`e.g., Before Cup Final or Jan Transfer Window`}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Predefined Manual Save Slots */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Manual Save Slots
            </div>
            {DEFAULT_MANUAL_SLOT_IDS.map((slotId, index) => {
              const slotMetadata = slots.find(s => s.id === slotId);
              const slotNum = index + 1;

              return (
                <div
                  key={slotId}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    slotMetadata
                      ? 'bg-slate-900/90 border-slate-700 hover:border-slate-600'
                      : 'bg-slate-900/40 border-slate-800 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                        #{slotNum}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          {slotMetadata ? slotMetadata.name : `Slot ${slotNum} (Empty)`}
                        </div>
                        {slotMetadata ? (
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                            <span>Wk {slotMetadata.currentWeek}, {slotMetadata.currentSeason}</span>
                            <span>•</span>
                            <span>£{(slotMetadata.balance / 1000000).toFixed(1)}M Balance</span>
                            <span>•</span>
                            <span>{slotMetadata.dateFormatted}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500">Ready for manual checkpoint</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {mode === 'save' && (
                        <button
                          onClick={() => handleManualSave(slotId)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{slotMetadata ? 'Overwrite' : 'Save'}</span>
                        </button>
                      )}

                      {mode === 'load' && slotMetadata && (
                        <>
                          <button
                            onClick={() => handleLoad(slotId)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Load
                          </button>
                          <button
                            onClick={e => handleDelete(slotId, e)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Save"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleGoToMainMenu}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Return to Main Menu</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
