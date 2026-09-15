import { Router } from 'express';
import { logger } from '../utils/logger.js';

export const motifRoutes = Router();

// Return built-in motifs (motif data is primarily stored client-side)
motifRoutes.get('/', async (_req, res) => {
  try {
    res.json({ message: 'Motifs are loaded from client-side library' });
  } catch (err: any) {
    logger.error(`Failed to get motifs: ${err.message}`);
    res.status(500).json({ error: 'Failed to get motifs' });
  }
});
