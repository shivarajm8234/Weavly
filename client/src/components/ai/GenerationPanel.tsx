import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { api } from '../../utils/api';

const PROMPT_PRESETS = [
  {
    title: 'Royal Kanjivaram Temple',
    body: 'Continuous fine rudraksha butti across ruby silk',
    border: 'Heavy gopuram temple spires woven with pure gold zari',
    pallu: 'Grand ceremonial peacock medallion flanked by sacred lotuses',
    blouse: 'Coordinated coin butti on contrast emerald sleeve',
  },
  {
    title: 'Banarasi Shikargah Brocade',
    body: 'All-over mughal jali lattice with delicate kairi leaves',
    border: 'Flowing floral bel vine with gold and silver zari relief',
    pallu: 'Ornate hunting forest scenes with royal deer and peacocks',
    blouse: 'Fine floral vine border on crimson ground',
  },
  {
    title: 'Paithani Heritage Peacock',
    body: 'Scattered radiant sun suryamukhi buttis in pure gold',
    border: 'Traditional narali coconut border with zari bands',
    pallu: 'Asawali flowering vase and dancing peacocks in polychrome weft',
    blouse: 'Plain body with rich peacock border',
  },
];

export const GenerationPanel: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const loadProject = useProjectStore((s) => s.loadProject);
  const addToast = useUIStore((s) => s.addToast);

  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<'groq-gpt' | 'local'>('groq-gpt');
  const [bodyPrompt, setBodyPrompt] = useState(project?.regions.body.prompt || '');
  const [palluPrompt, setPalluPrompt] = useState(project?.regions.pallu.prompt || '');
  const [borderPrompt, setBorderPrompt] = useState(project?.regions.border.prompt || '');
  const [blousePrompt, setBlousePrompt] = useState(project?.regions.blouse.prompt || '');
  const [aiNotes, setAiNotes] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="p-4 text-xs text-[var(--color-text-muted)] text-center">
        Open a project to generate saree designs using AI.
      </div>
    );
  }

  const applyPreset = (preset: typeof PROMPT_PRESETS[0]) => {
    setBodyPrompt(preset.body);
    setBorderPrompt(preset.border);
    setPalluPrompt(preset.pallu);
    setBlousePrompt(preset.blouse);
  };

  const handleGenerate = async () => {
    setLoading(true);
    addToast({ type: 'info', message: 'Generating saree design with Groq AI...' });

    try {
      const response = await fetch(`http://localhost:3001/api/projects/${project.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          bodyPrompt,
          borderPrompt,
          palluPrompt,
          blousePrompt,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'AI generation failed');
      }

      if (json.data?.project) {
        loadProject(json.data.project);
      }

      if (json.data?.aiSpec) {
        setAiNotes(
          `${json.data.aiSpec.conceptSummary}\n\nWeave: ${json.data.aiSpec.technique}\nStructure: ${json.data.aiSpec.jacquardNotes?.weaveStructure}`
        );
      }

      addToast({ type: 'success', message: 'Saree design generated successfully!' });
    } catch (err: any) {
      console.error(err);
      addToast({ type: 'error', message: err.message || 'Generation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="panel-header -mx-4 -mt-4 mb-4">AI Saree Studio (Groq)</div>

      {/* Model selector */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1.5">
          AI Engine
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setModel('groq-gpt')}
            className={`p-2 rounded-lg border text-left text-xs transition-all ${
              model === 'groq-gpt'
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-white'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
            }`}
          >
            <div className="font-semibold flex items-center gap-1">
              <span>⚡ Groq AI</span>
            </div>
            <div className="text-[10px] opacity-70">openai/gpt-oss-20b</div>
          </button>

          <button
            onClick={() => setModel('local')}
            className={`p-2 rounded-lg border text-left text-xs transition-all ${
              model === 'local'
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-white'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
            }`}
          >
            <div className="font-semibold flex items-center gap-1">
              <span>💻 Local Procedural</span>
            </div>
            <div className="text-[10px] opacity-70">Deterministic Engine</div>
          </button>
        </div>
      </div>

      {/* Inspiration presets */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1.5">
          Design Presets
        </label>
        <div className="space-y-1.5">
          {PROMPT_PRESETS.map((p) => (
            <button
              key={p.title}
              onClick={() => applyPreset(p)}
              className="w-full text-left p-2 rounded-lg bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-xs transition-all flex items-center justify-between"
            >
              <span className="font-medium text-[var(--color-text)]">{p.title}</span>
              <span className="text-[10px] text-[var(--color-gold)]">Use →</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompts for regions */}
      <div className="space-y-2.5">
        <div>
          <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-1">
            Body Pattern Requirement
          </label>
          <textarea
            value={bodyPrompt}
            onChange={(e) => setBodyPrompt(e.target.value)}
            rows={2}
            placeholder="e.g. Fine geometric floral kalka butti"
            className="input-field w-full text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-1">
            Pallu Requirement (Grand End)
          </label>
          <textarea
            value={palluPrompt}
            onChange={(e) => setPalluPrompt(e.target.value)}
            rows={2}
            placeholder="e.g. Ornate royal lotus with dancing peacocks"
            className="input-field w-full text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-1">
            Border Requirement
          </label>
          <textarea
            value={borderPrompt}
            onChange={(e) => setBorderPrompt(e.target.value)}
            rows={2}
            placeholder="e.g. Temple spire gopuram border with zari bands"
            className="input-field w-full text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-1">
            Blouse Piece Requirement
          </label>
          <textarea
            value={blousePrompt}
            onChange={(e) => setBlousePrompt(e.target.value)}
            rows={2}
            placeholder="e.g. Subtle coin medallion matching body"
            className="input-field w-full text-xs"
          />
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="btn-primary w-full py-2.5 font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Weaving AI Design...</span>
          </>
        ) : (
          <>
            <span>✨ Generate Saree Design</span>
          </>
        )}
      </button>

      {/* AI Notes output */}
      {aiNotes && (
        <div className="bg-[var(--color-bg-primary)] p-3 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] space-y-1 animate-fade-in">
          <div className="font-semibold text-[var(--color-gold)] text-[11px] uppercase tracking-wider">
            AI Master Weaver Notes
          </div>
          <p className="whitespace-pre-line text-[11px] leading-relaxed text-[var(--color-text)]">
            {aiNotes}
          </p>
        </div>
      )}
    </div>
  );
};
