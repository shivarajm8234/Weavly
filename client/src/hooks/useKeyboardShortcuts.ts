import { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';
import { useProjectStore } from '../stores/projectStore';
import { useHistoryStore } from '../stores/historyStore';

export function useKeyboardShortcuts() {
  const {
    zoomIn, zoomOut, resetZoom,
    toggleGrid, toggleSidebar, toggleInspector,
    setViewMode, addToast,
  } = useUIStore();

  const { project, saveCurrentVersion } = useProjectStore();
  const { undo, redo, canUndo, canRedo } = useHistoryStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing inside form inputs / textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo / Redo
      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (canUndo()) {
          const prev = undo();
          if (prev) {
            useProjectStore.getState().loadProject(prev);
            addToast({ type: 'info', message: 'Undo' });
          }
        }
        return;
      }

      if ((cmdOrCtrl && e.key.toLowerCase() === 'y') || (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        if (canRedo()) {
          const next = redo();
          if (next) {
            useProjectStore.getState().loadProject(next);
            addToast({ type: 'info', message: 'Redo' });
          }
        }
        return;
      }

      // Save version
      if (cmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (project) {
          saveCurrentVersion(`Saved at ${new Date().toLocaleTimeString()}`);
          addToast({ type: 'success', message: 'Version checkpoint saved!' });
        }
        return;
      }

      // Zoom shortcuts
      if (cmdOrCtrl && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
        return;
      }
      if (cmdOrCtrl && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        zoomOut();
        return;
      }
      if (cmdOrCtrl && e.key === '0') {
        e.preventDefault();
        resetZoom();
        return;
      }

      // Single-key shortcuts (when not using cmd/ctrl)
      if (!cmdOrCtrl && !e.altKey) {
        if (e.key.toLowerCase() === 'g') {
          e.preventDefault();
          toggleGrid();
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          toggleSidebar();
        } else if (e.key.toLowerCase() === 'i') {
          e.preventDefault();
          toggleInspector();
        } else if (e.key === '1') {
          setViewMode('color');
        } else if (e.key === '2') {
          setViewMode('monochrome');
        } else if (e.key === '3') {
          setViewMode('grid');
        } else if (e.key === '4') {
          setViewMode('contrast');
        } else if (e.key === '5') {
          setViewMode('technical');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, undo, redo, canUndo, canRedo, zoomIn, zoomOut, resetZoom, toggleGrid, toggleSidebar, toggleInspector, setViewMode, saveCurrentVersion, addToast]);
}
