import React from 'react';
import { TopBar } from './TopBar';
import { LeftSidebar } from './LeftSidebar';
import { RightInspector } from './RightInspector';
import { DesignCanvas } from '../canvas/DesignCanvas';
import { NewProjectDialog } from '../project/NewProjectDialog';
import { ExportPanel } from '../export/ExportPanel';
import { useUIStore } from '../../stores/uiStore';

export const AppShell: React.FC = () => {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const inspectorCollapsed = useUIStore((s) => s.inspectorCollapsed);
  const showNewProjectDialog = useUIStore((s) => s.showNewProjectDialog);
  const showExportDialog = useUIStore((s) => s.showExportDialog);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--color-bg)]">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-hidden relative bg-[var(--color-canvas-bg)]">
          <DesignCanvas />
        </main>
        <RightInspector collapsed={inspectorCollapsed} />
      </div>
      {showNewProjectDialog && <NewProjectDialog />}
      {showExportDialog && <ExportPanel />}
    </div>
  );
};
