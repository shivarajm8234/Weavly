import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';

export const VersionHistory: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const saveCurrentVersion = useProjectStore((s) => s.saveCurrentVersion);
  const restoreVersion = useProjectStore((s) => s.restoreVersion);
  const addToast = useUIStore((s) => s.addToast);

  const [description, setDescription] = useState('');

  if (!project) return null;

  const handleSave = () => {
    saveCurrentVersion(description || `Checkpoint ${project.versions.length + 1}`);
    setDescription('');
    addToast({ type: 'success', message: 'Design checkpoint saved!' });
  };

  const handleRestore = (versionId: string) => {
    restoreVersion(versionId);
    addToast({ type: 'info', message: 'Restored design version' });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="panel-header -mx-4 -mt-4 mb-4">Version History</div>

      {/* Snapshot creator */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">
          Create Checkpoint
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Pallu lotus added"
            className="input-field flex-1 text-xs"
          />
          <button
            onClick={handleSave}
            className="btn-primary text-xs px-3 py-1.5 whitespace-nowrap"
          >
            Save
          </button>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-2" />

      {/* Version timeline */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">
          Checkpoints ({project.versions.length})
        </label>

        {project.versions.length === 0 ? (
          <div className="p-4 text-center text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)]">
            No versions saved yet. Save a checkpoint to preserve milestones.
          </div>
        ) : (
          <div className="space-y-2">
            {[...project.versions].reverse().map((ver, idx) => (
              <div
                key={ver.id}
                className="p-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-2 transition-all hover:border-white/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[var(--color-text)]">
                      {ver.description || `Checkpoint ${project.versions.length - idx}`}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">
                      {new Date(ver.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestore(ver.id)}
                    className="text-xs text-[var(--color-accent)] hover:underline font-medium"
                  >
                    Restore ↺
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)] font-mono">
                  <span>Body: {ver.regions.body.pattern}</span>
                  <span>•</span>
                  <span>Pallu: {ver.regions.pallu.pattern}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
