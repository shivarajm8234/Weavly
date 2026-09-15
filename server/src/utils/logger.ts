import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.resolve(__dirname, '../../../logs');

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private async writeToFile(level: LogLevel, message: string) {
    try {
      await fs.mkdir(LOG_DIR, { recursive: true });
      const date = new Date().toISOString().split('T')[0];
      const logFile = path.join(LOG_DIR, `${date}.log`);
      const entry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n`;
      await fs.appendFile(logFile, entry);
    } catch {
      // Silently fail for file logging
    }
  }

  info(message: string) {
    console.log(`[INFO] ${message}`);
    this.writeToFile('info', message);
  }

  warn(message: string) {
    console.warn(`[WARN] ${message}`);
    this.writeToFile('warn', message);
  }

  error(message: string) {
    console.error(`[ERROR] ${message}`);
    this.writeToFile('error', message);
  }

  debug(message: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`);
    }
    this.writeToFile('debug', message);
  }
}

export const logger = new Logger();
