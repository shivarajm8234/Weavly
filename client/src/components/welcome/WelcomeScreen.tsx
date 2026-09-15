import React, { useCallback, useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import { api } from '../../utils/api';
import { NewProjectDialog } from '../project/NewProjectDialog';

export const WelcomeScreen: React.FC = () => {
  const setShowWelcome = useUIStore((s) => s.setShowWelcome);
  const setShowNewProjectDialog = useUIStore((s) => s.setShowNewProjectDialog);
  const showNewProjectDialog = useUIStore((s) => s.showNewProjectDialog);
  const { setProject, setProjects, createNewProject } = useProjectStore();
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projects = await api.listProjects();
      setRecentProjects(projects as any[]);
      setProjects(projects as any[]);
    } catch {
      // Server might not be running yet
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = useCallback(() => {
    setShowNewProjectDialog(true);
  }, []);

  const handleOpenSample = useCallback(async () => {
    const project = createNewProject({
      name: 'Royal Lotus 400×400',
      designerName: 'Studio Sample',
      collectionName: 'Heritage Collection',
      sareeType: 'Traditional Silk Saree',
      fabricType: 'Pure Silk',
      designStyle: 'traditional',
      jacquard: {
        hookWidth: 400, hookHeight: 400,
        gridWidth: 400, gridHeight: 400,
        repeatWidth: 100, repeatHeight: 100,
        borderWidth: 40, palluLength: 100, bodyLength: 260,
      },
      body: {
        prompt: 'Dense lotus butta pattern with small repeating motifs',
        pattern: 'lotus', motifIds: [], density: 70, scale: 1,
        rotation: 0, symmetry: 'vertical', repeatType: 'tile',
        colors: ['#8B0000', '#D4AF37'],
      },
      border: {
        prompt: 'Traditional temple border with geometric triangles',
        pattern: 'temple', motifIds: [], density: 80, scale: 1,
        rotation: 0, symmetry: 'mirror', repeatType: 'tile',
        colors: ['#D4AF37', '#8B0000'],
      },
      pallu: {
        prompt: 'Large symmetrical peacock motif with ornate details',
        pattern: 'peacock', motifIds: [], density: 85, scale: 1.2,
        rotation: 0, symmetry: 'radial', repeatType: 'mirror',
        colors: ['#8B0000', '#D4AF37', '#F5E6B3'],
      },
      blouse: {
        prompt: 'Matching lotus motif with border elements',
        pattern: 'lotus', motifIds: [], density: 60, scale: 0.8,
        rotation: 0, symmetry: 'vertical', repeatType: 'tile',
        colors: ['#8B0000', '#D4AF37'],
      },
      palette: [
        { id: 'c1', name: 'Deep Maroon', hex: '#8B0000', role: 'primary' },
        { id: 'c2', name: 'Antique Gold', hex: '#D4AF37', role: 'secondary' },
        { id: 'c3', name: 'Warm Cream', hex: '#F5E6B3', role: 'accent' },
        { id: 'c4', name: 'Ivory', hex: '#FFFFF0', role: 'background' },
      ],
    });
    try {
      await api.createProject(project as any);
    } catch { /* save will be retried by autosave */ }
    setShowWelcome(false);
  }, []);

  const handleOpenProject = useCallback(async (id: string) => {
    try {
      const project = await api.getProject(id);
      setProject(project as any);
      setShowWelcome(false);
    } catch {
      useUIStore.getState().addToast({ type: 'error', message: 'Failed to open project' });
    }
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center bg-[var(--color-bg)]">
      <div className="max-w-2xl w-full mx-auto px-8">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-800 to-primary-600 mb-6 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M4 4h16v16H4z" />
              <path d="M4 8h16M4 12h16M4 16h16" />
              <path d="M8 4v16M12 4v16M16 4v16" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
            AI Jacquard Studio
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm max-w-md mx-auto">
            Create production-ready Jacquard textile designs from hook configuration and design requirements.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button
            onClick={handleNewProject}
            className="group relative p-6 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all duration-200 text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-tertiary)] group-hover:bg-[var(--color-accent)] group-hover:text-white flex items-center justify-center mb-3 transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h3 className="font-semibold text-[var(--color-text)] mb-1">Create New Design</h3>
            <p className="text-xs text-[var(--color-text-muted)]">Start a new Jacquard saree project from scratch</p>
          </button>

          <button
            onClick={handleOpenSample}
            className="group relative p-6 rounded-xl border-2 border-[var(--color-border)] hover:border-gold-500 transition-all duration-200 text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-tertiary)] group-hover:bg-gold-500 group-hover:text-gray-900 flex items-center justify-center mb-3 transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="font-semibold text-[var(--color-text)] mb-1">Open Sample Project</h3>
            <p className="text-xs text-[var(--color-text-muted)]">Royal Lotus 400×400 — Traditional Silk</p>
          </button>
        </div>

        {/* Recent Projects */}
        {!loading && recentProjects.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Recent Projects
            </h2>
            <div className="space-y-2">
              {recentProjects.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleOpenProject(p.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors duration-100 text-left"
                >
                  <div className="w-8 h-8 rounded bg-[var(--color-bg-tertiary)] flex items-center justify-center text-xs font-mono text-[var(--color-text-muted)]">
                    {p.gridWidth}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--color-text)] truncate">{p.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {p.gridWidth}×{p.gridHeight} · {new Date(p.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-[var(--color-text-muted)]">
          Local-first · No cloud required · Your designs stay on your machine
        </div>
      </div>

      {showNewProjectDialog && <NewProjectDialog />}
    </div>
  );
};
