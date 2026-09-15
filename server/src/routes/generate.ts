import { Router } from 'express';
import { logger } from '../utils/logger.js';
import { GroqProvider } from '../ai/groqProvider.js';
import { fileStorage } from '../storage/fileStorage.js';

export const generateRoutes = Router();

// Standalone direct generation from prompt parameters
generateRoutes.post('/direct', async (req, res) => {
  try {
    const {
      sareeType = 'Traditional Silk Saree',
      fabricType = 'Silk',
      designStyle = 'traditional',
      hookWidth = 400,
      hookHeight = 400,
      bodyPrompt,
      palluPrompt,
      borderPrompt,
      blousePrompt,
      paletteColors,
    } = req.body;

    logger.info(`Generating design via Groq for ${sareeType}`);
    const result = await GroqProvider.generateDesign({
      sareeType,
      fabricType,
      designStyle,
      hookWidth,
      hookHeight,
      bodyPrompt,
      palluPrompt,
      borderPrompt,
      blousePrompt,
      paletteColors,
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    logger.error(`Direct generation error: ${err.message}`);
    res.status(500).json({ error: err.message || 'Generation failed' });
  }
});

// Generate full design for existing project
generateRoutes.post('/:id/generate', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await fileStorage.getProject(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    logger.info(`Groq generating full design for project: ${id}`);
    const generated = await GroqProvider.generateDesign({
      sareeType: project.sareeType,
      fabricType: project.fabricType,
      designStyle: project.designStyle,
      hookWidth: project.jacquard.hookWidth,
      hookHeight: project.jacquard.hookHeight,
      bodyPrompt: project.regions.body.prompt,
      palluPrompt: project.regions.pallu.prompt,
      borderPrompt: project.regions.border.prompt,
      blousePrompt: project.regions.blouse.prompt,
      paletteColors: (project.palette || []).map((p: any) => p.hex),
    });

    // Update project with AI recommendations
    const updated = {
      ...project,
      name: project.name || generated.title,
      regions: {
        body: {
          ...project.regions.body,
          motifIds: [generated.regions.body.motifId],
          pattern: generated.regions.body.pattern as any,
          density: generated.regions.body.density,
          scale: generated.regions.body.scale,
          rotation: generated.regions.body.rotation,
          symmetry: generated.regions.body.symmetry as any,
          repeatType: generated.regions.body.repeatType as any,
          prompt: generated.regions.body.prompt,
        },
        border: {
          ...project.regions.border,
          motifIds: [generated.regions.border.motifId],
          pattern: generated.regions.border.pattern as any,
          density: generated.regions.border.density,
          scale: generated.regions.border.scale,
          rotation: generated.regions.border.rotation,
          symmetry: generated.regions.border.symmetry as any,
          repeatType: generated.regions.border.repeatType as any,
          prompt: generated.regions.border.prompt,
        },
        pallu: {
          ...project.regions.pallu,
          motifIds: [generated.regions.pallu.motifId],
          pattern: generated.regions.pallu.pattern as any,
          density: generated.regions.pallu.density,
          scale: generated.regions.pallu.scale,
          rotation: generated.regions.pallu.rotation,
          symmetry: generated.regions.pallu.symmetry as any,
          repeatType: generated.regions.pallu.repeatType as any,
          prompt: generated.regions.pallu.prompt,
        },
        blouse: {
          ...project.regions.blouse,
          motifIds: [generated.regions.blouse.motifId],
          pattern: generated.regions.blouse.pattern as any,
          density: generated.regions.blouse.density,
          scale: generated.regions.blouse.scale,
          rotation: generated.regions.blouse.rotation,
          symmetry: generated.regions.blouse.symmetry as any,
          repeatType: generated.regions.blouse.repeatType as any,
          prompt: generated.regions.blouse.prompt,
        },
      },
      palette: generated.palette.map((p, idx) => ({
        id: `pal_${idx}`,
        name: p.name,
        hex: p.hex,
        role: p.role,
      })),
      updatedAt: new Date().toISOString(),
    };

    await fileStorage.saveProject(updated);

    res.json({
      success: true,
      data: {
        project: updated,
        aiSpec: generated,
      },
    });
  } catch (err: any) {
    logger.error(`Failed to generate design: ${err.message}`);
    res.status(500).json({ error: err.message || 'Failed to generate design' });
  }
});

// Generate single region for existing project
generateRoutes.post('/:id/generate/:region', async (req, res) => {
  try {
    const { id, region } = req.params;
    const validRegions = ['body', 'border', 'pallu', 'blouse'] as const;
    if (!validRegions.includes(region as any)) {
      return res.status(400).json({ error: `Invalid region: ${region}` });
    }

    const project = await fileStorage.getProject(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    logger.info(`Groq generating region '${region}' for project: ${id}`);
    const generated = await GroqProvider.generateDesign({
      sareeType: project.sareeType,
      fabricType: project.fabricType,
      designStyle: project.designStyle,
      hookWidth: project.jacquard.hookWidth,
      hookHeight: project.jacquard.hookHeight,
      regionToRegenerate: region as any,
      bodyPrompt: project.regions.body.prompt,
      palluPrompt: project.regions.pallu.prompt,
      borderPrompt: project.regions.border.prompt,
      blousePrompt: project.regions.blouse.prompt,
      paletteColors: (project.palette || []).map((p: any) => p.hex),
    });

    const regSpec = generated.regions[region as keyof typeof generated.regions];
    project.regions[region as keyof typeof project.regions] = {
      ...project.regions[region as keyof typeof project.regions],
      motifIds: [regSpec.motifId],
      pattern: regSpec.pattern as any,
      density: regSpec.density,
      scale: regSpec.scale,
      rotation: regSpec.rotation,
      symmetry: regSpec.symmetry as any,
      repeatType: regSpec.repeatType as any,
      prompt: regSpec.prompt,
    };
    project.updatedAt = new Date().toISOString();

    await fileStorage.saveProject(project);

    res.json({
      success: true,
      data: {
        region,
        regionConfig: project.regions[region as keyof typeof project.regions],
        project,
      },
    });
  } catch (err: any) {
    logger.error(`Failed to generate region: ${err.message}`);
    res.status(500).json({ error: err.message || 'Failed to generate region' });
  }
});
