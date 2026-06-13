'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { Plus, Trash2, FolderOpen } from 'lucide-react';

export function ScenarioBar() {
  const { scenarioId, scenariosList, switchScenario, createNewScenario, deleteCurrentScenario } =
    useTools();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [baseId, setBaseId] = useState('');

  function handleCreate() {
    if (!newName.trim()) return;
    createNewScenario(newName.trim(), newDesc.trim(), baseId || undefined);
    setNewName('');
    setNewDesc('');
    setBaseId('');
    setShowCreate(false);
  }

  function handleDelete() {
    if (scenarioId === 'default') {
      alert('לא ניתן למחוק את תרחיש ברירת המחדל');
      return;
    }
    if (confirm('האם למחוק את התרחיש הנוכחי?')) {
      deleteCurrentScenario();
    }
  }

  return (
    <div className="bg-paper rounded-none border-2 border-ink/15 p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-ink/70">
          <FolderOpen className="w-5 h-5" />
          <span className="font-medium">תרחיש פעיל:</span>
        </div>
        <select
          value={scenarioId}
          onChange={(e) => switchScenario(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
        >
          {scenariosList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 px-3 py-2 bg-ink text-cream rounded-none hover:bg-ink-deep text-sm"
        >
          <Plus className="w-4 h-4" />
          חדש
        </button>
        {scenarioId !== 'default' && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-2 bg-red-600 text-cream rounded-none hover:bg-red-700 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            מחק
          </button>
        )}
      </div>

      {showCreate && (
        <div className="mt-4 pt-4 border-t border-ink/15 space-y-3">
          <input
            type="text"
            placeholder="שם התרחיש (למשל: תרחיש אופטימי)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-ink/15 rounded-none"
          />
          <textarea
            placeholder="תיאור (אופציונלי)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-ink/15 rounded-none"
          />
          <select
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
            className="w-full px-3 py-2 border border-ink/15 rounded-none"
          >
            <option value="">התחל מאפס</option>
            {scenariosList.map((s) => (
              <option key={s.id} value={s.id}>
                בסס על: {s.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="px-4 py-2 bg-ink text-cream rounded-none hover:bg-ink-deep disabled:opacity-50"
            >
              צור תרחיש
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 bg-cream-2 text-ink rounded-none hover:bg-paper-hover"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
