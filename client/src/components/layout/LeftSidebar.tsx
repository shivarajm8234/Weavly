import React from 'react';
import { useUIStore, type SidebarTab } from '../../stores/uiStore';
import { DesignInputPanel } from '../designer/DesignInputPanel';
import { GenerationPanel } from '../ai/GenerationPanel';
import { MotifLibrary } from '../motifs/MotifLibrary';
import { GridControls } from '../grid/GridControls';
import { VersionHistory } from '../versions/VersionHistory';
import { ProjectList } from '../project/ProjectList';

interface Props {
  collapsed: boolean;
}

const TABS: { id: SidebarTab; icon: React.ReactNode; label: string }[] = [
  {
    id: 'projects', label: 'Projects',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>,
  },
  {
    id: 'design', label: 'Design',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  },
  {
    id: 'generate', label: 'AI Generate',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    id: 'motifs', label: 'Motifs',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/></svg>,
  },
  {
    id: 'grid', label: 'Grid',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,
  },
  {
    id: 'layers', label: 'Versions',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>,
  },
  {
    id: 'settings', label: 'Settings',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  },
];

export const LeftSidebar: React.FC<Props> = ({ collapsed }) => {
  const { sidebarTab, setSidebarTab, toggleSidebar } = useUIStore();

  if (collapsed) {
    return (
      <aside className="w-12 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col items-center py-2 gap-1 shrink-0">
        <button onClick={toggleSidebar} className="btn-ghost p-2 mb-2" title="Expand sidebar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSidebarTab(tab.id)}
            className={`p-2 rounded-md transition-colors duration-100 ${
              sidebarTab === tab.id
                ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
            title={tab.label}
          >
            {tab.icon}
          </button>
        ))}
      </aside>
    );
  }

  return (
    <aside className="w-[var(--sidebar-width)] bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col shrink-0 animate-slide-in-left">
      {/* Tab Navigation */}
      <div className="flex items-center px-2 py-2 gap-0.5 border-b border-[var(--color-border)] overflow-x-auto scrollbar-thin">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSidebarTab(tab.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors duration-100 ${
              sidebarTab === tab.id
                ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            {tab.icon}
            <span className="hidden xl:inline">{tab.label}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={toggleSidebar} className="btn-ghost p-1.5" title="Collapse sidebar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {sidebarTab === 'projects' && <ProjectList />}
        {sidebarTab === 'design' && <DesignInputPanel />}
        {sidebarTab === 'generate' && <GenerationPanel />}
        {sidebarTab === 'motifs' && <MotifLibrary />}
        {sidebarTab === 'grid' && <GridControls />}
        {sidebarTab === 'layers' && <VersionHistory />}
        {sidebarTab === 'settings' && <SettingsPanel />}
      </div>
    </aside>
  );
};

// Settings panel
const SettingsPanel: React.FC = () => {
  const { theme, toggleTheme, showGrid, setShowGrid, showRuler, setShowRuler, showRegionBounds, setShowRegionBounds, snapToGrid, setSnapToGrid } = useUIStore();

  return (
    <div className="p-4 space-y-4">
      <div className="panel-header -mx-4 -mt-4 mb-4">Settings</div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text)]">Dark Mode</span>
          <button onClick={toggleTheme} className={`w-10 h-5 rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text)]">Show Grid</span>
          <button onClick={() => setShowGrid(!showGrid)} className={`w-10 h-5 rounded-full transition-colors duration-200 ${showGrid ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${showGrid ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text)]">Show Ruler</span>
          <button onClick={() => setShowRuler(!showRuler)} className={`w-10 h-5 rounded-full transition-colors duration-200 ${showRuler ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${showRuler ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text)]">Show Regions</span>
          <button onClick={() => setShowRegionBounds(!showRegionBounds)} className={`w-10 h-5 rounded-full transition-colors duration-200 ${showRegionBounds ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${showRegionBounds ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text)]">Snap to Grid</span>
          <button onClick={() => setSnapToGrid(!snapToGrid)} className={`w-10 h-5 rounded-full transition-colors duration-200 ${snapToGrid ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${snapToGrid ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
