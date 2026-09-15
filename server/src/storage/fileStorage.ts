import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../../data');
const PROJECTS_DIR = path.join(DATA_DIR, 'projects');

// Security: prevent path traversal
function safePath(base: string, ...segments: string[]): string {
  const resolved = path.resolve(base, ...segments);
  if (!resolved.startsWith(base)) {
    throw new Error('Path traversal detected');
  }
  return resolved;
}

// Sanitize project name for filesystem use
function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\- ]/g, '').trim().substring(0, 100);
}

export const fileStorage = {
  async listProjects(): Promise<any[]> {
    try {
      const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
      const projects = [];
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        try {
          const projectFile = safePath(PROJECTS_DIR, entry.name, 'project.json');
          const data = await fs.readFile(projectFile, 'utf-8');
          const project = JSON.parse(data);
          projects.push({
            id: project.id,
            name: project.name,
            designerName: project.designerName || '',
            collectionName: project.collectionName || '',
            sareeType: project.sareeType || '',
            gridWidth: project.jacquard?.gridWidth || 0,
            gridHeight: project.jacquard?.gridHeight || 0,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            thumbnail: project.thumbnail,
          });
        } catch (err) {
          logger.warn(`Skipping invalid project directory: ${entry.name}`);
        }
      }
      return projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch {
      return [];
    }
  },

  async getProject(id: string): Promise<any> {
    const projectFile = safePath(PROJECTS_DIR, id, 'project.json');
    const data = await fs.readFile(projectFile, 'utf-8');
    return JSON.parse(data);
  },

  async saveProject(project: any): Promise<void> {
    const projectDir = safePath(PROJECTS_DIR, project.id);
    await fs.mkdir(projectDir, { recursive: true });
    await fs.mkdir(path.join(projectDir, 'assets'), { recursive: true });
    await fs.mkdir(path.join(projectDir, 'exports'), { recursive: true });

    const projectFile = path.join(projectDir, 'project.json');
    await fs.writeFile(projectFile, JSON.stringify(project, null, 2));
    logger.info(`Saved project: ${project.id} (${project.name})`);
  },

  async deleteProject(id: string): Promise<void> {
    const projectDir = safePath(PROJECTS_DIR, id);
    await fs.rm(projectDir, { recursive: true, force: true });
    logger.info(`Deleted project: ${id}`);
  },

  async saveAsset(projectId: string, filename: string, data: Buffer | string): Promise<string> {
    const assetsDir = safePath(PROJECTS_DIR, projectId, 'assets');
    await fs.mkdir(assetsDir, { recursive: true });
    const sanitized = sanitizeName(filename) || 'asset';
    const filePath = path.join(assetsDir, sanitized);
    await fs.writeFile(filePath, data);
    return filePath;
  },

  async saveExport(projectId: string, filename: string, data: Buffer | string): Promise<string> {
    const exportsDir = safePath(PROJECTS_DIR, projectId, 'exports');
    await fs.mkdir(exportsDir, { recursive: true });
    const filePath = path.join(exportsDir, filename);
    await fs.writeFile(filePath, data);
    return filePath;
  },

  async projectExists(id: string): Promise<boolean> {
    try {
      const projectFile = safePath(PROJECTS_DIR, id, 'project.json');
      await fs.access(projectFile);
      return true;
    } catch {
      return false;
    }
  },
};
