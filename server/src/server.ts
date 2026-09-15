import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { projectRoutes } from './routes/projects.js';
import { generateRoutes } from './routes/generate.js';
import { exportRoutes } from './routes/exports.js';
import { motifRoutes } from './routes/motifs.js';
import { logger } from './utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const DIRS = [
  path.join(ROOT, 'data/projects'),
  path.join(ROOT, 'data/motifs'),
  path.join(ROOT, 'data/exports'),
  path.join(ROOT, 'logs'),
];

async function ensureDirs() {
  for (const dir of DIRS) {
    await fs.mkdir(dir, { recursive: true });
  }
  logger.info('Data directories verified');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/projects', generateRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/projects', exportRoutes);
app.use('/api/motifs', motifRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({
    error: 'An unexpected error occurred.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

async function start() {
  await ensureDirs();
  app.listen(PORT, () => {
    logger.info(`AI Jacquard Studio server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  logger.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});
