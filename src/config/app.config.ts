import { registerAs } from '@nestjs/config';
import path from 'node:path';

export default registerAs('app', () => ({
  port: parseInt(process.env.API_PORT || '3003', 10),
  environment: process.env.NODE_ENV || 'development',
  globalPrefix: process.env.GLOBAL_PREFIX || 'api',
  uploadFolder: path.join(process.cwd(), `./${process.env.UPLOAD_FILES_FOLDER || './uploads'}`),
}));
