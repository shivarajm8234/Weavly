import { useEffect, useRef } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { api } from '../utils/api';

export function useAutosave(debounceMs = 2500) {
  const project = useProjectStore((s) => s.project);
  const isDirty = useProjectStore((s) => s.isDirty);
  const markClean = useProjectStore((s) => s.markClean);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!project || !isDirty) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        await api.updateProject(project.id, {
          name: project.name,
          designerName: project.designerName,
          collectionName: project.collectionName,
          sareeType: project.sareeType,
          fabricType: project.fabricType,
          designStyle: project.designStyle,
          jacquard: project.jacquard,
          regions: project.regions,
          palette: project.palette,
          currentGrid: project.currentGrid,
        });
        markClean();
      } catch (err) {
        console.warn('Autosave failed:', err);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [project, isDirty, debounceMs, markClean]);
}
