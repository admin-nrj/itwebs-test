import { config } from 'dotenv';

config({ path: ['.env.local', '.env'] });

interface DialectOptions {
  ssl?: {
    require: boolean;
    rejectUnauthorized: boolean;
  };
}

export interface SequelizeConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'postgres';
  logging?: boolean;
  synchronize?: boolean;
  ssl?: boolean;
  dialectOptions?: DialectOptions;
}

interface SequelizeConfigs {
  development: SequelizeConfig;
  test: SequelizeConfig;
  production: SequelizeConfig;
}

const configs: SequelizeConfigs = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'itwebs_dev',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: (process.env.DB_NAME || 'itwebs') + '_test',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: false,
    synchronize: true,
  },
  production: {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: false,
  },
};

export default configs;

// Для совместимости с sequelize-cli (CommonJS)
module.exports = configs;
