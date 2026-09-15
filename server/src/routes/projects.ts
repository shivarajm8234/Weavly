import { Router } from 'express';
import { fileStorage } from '../storage/fileStorage.js';
import { logger } from '../utils/logger.js';

export const projectRoutes = Router();

// List all projects
projectRoutes.get('/', async (_req, res) => {
  try {
    const projects = await fileStorage.listProjects();
    res.json(projects);
  } catch (err: any) {
    logger.error(`Failed to list projects: ${err.message}`);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

// Get single project
projectRoutes.get('/:id', async (req, res) => {
  try {
    const project = await fileStorage.getProject(req.params.id);
    res.json(project);
  } catch (err: any) {
    logger.error(`Failed to get project ${req.params.id}: ${err.message}`);
    res.status(404).json({ error: 'Project not found' });
  }
});

// Create project
projectRoutes.post('/', async (req, res) => {
  try {
    const project = req.body;
    if (!project.id || !project.name) {
      return res.status(400).json({ error: 'Project must have an id and name' });
    }
    await fileStorage.saveProject(project);
    res.status(201).json(project);
  } catch (err: any) {
    logger.error(`Failed to create project: ${err.message}`);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
projectRoutes.put('/:id', async (req, res) => {
  try {
    const exists = await fileStorage.projectExists(req.params.id);
    if (!exists) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const project = { ...req.body, id: req.params.id };
    await fileStorage.saveProject(project);
    res.json(project);
  } catch (err: any) {
    logger.error(`Failed to update project ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
projectRoutes.delete('/:id', async (req, res) => {
  try {
    await fileStorage.deleteProject(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    logger.error(`Failed to delete project ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});
