import { registerAs } from '@nestjs/config';
import path from 'node:path';
import {
  DEFAULT_API_PORT,
  DEFAULT_NODE_ENV,
  PRODUCTION_ENV,
  DEFAULT_GLOBAL_PREFIX,
  DEFAULT_UPLOADS_DIR,
  PRODUCTION_BCRYPT_SALT_ROUNDS,
  NON_PRODUCTION_BCRYPT_SALT_ROUNDS,
} from '../common/constants/config.constants';

export default registerAs('app', () => {
  const environment = process.env.NODE_ENV ?? DEFAULT_NODE_ENV;
  const uploadsDir = process.env.UPLOAD_FILES_FOLDER ?? DEFAULT_UPLOADS_DIR;

  return {
    port: parseInt(process.env.API_PORT ?? `${DEFAULT_API_PORT}`, 10),
    environment,
    globalPrefix: process.env.GLOBAL_PREFIX ?? DEFAULT_GLOBAL_PREFIX,
    uploadFolder: path.join(process.cwd(), uploadsDir),
    bcryptSaltRounds:
      environment === PRODUCTION_ENV ? PRODUCTION_BCRYPT_SALT_ROUNDS : NON_PRODUCTION_BCRYPT_SALT_ROUNDS,
  };
});
