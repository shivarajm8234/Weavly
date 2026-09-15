import { Router } from 'express';
import { fileStorage } from '../storage/fileStorage.js';
import { logger } from '../utils/logger.js';

export const exportRoutes = Router();

// Export project
exportRoutes.post('/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    const { format, data, filename } = req.body;

    if (!format) {
      return res.status(400).json({ error: 'Export format is required' });
    }

    const validFormats = ['png', 'svg', 'json', 'csv', 'pdf'];
    if (!validFormats.includes(format)) {
      return res.status(400).json({ error: `Invalid format: ${format}` });
    }

    if (data && filename) {
      // Client sent export data to save
      const buffer = Buffer.from(data, 'base64');
      const filePath = await fileStorage.saveExport(id, filename, buffer);
      logger.info(`Exported ${format} for project ${id}: ${filename}`);
      return res.json({ success: true, filename, path: filePath });
    }

    res.json({ success: true, message: `Export ${format} initiated for ${id}` });
  } catch (err: any) {
    logger.error(`Failed to export: ${err.message}`);
    res.status(500).json({ error: 'Failed to export' });
  }
});
