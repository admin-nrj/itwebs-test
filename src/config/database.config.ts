import { registerAs } from '@nestjs/config';
import dbConfigs from '../dal/sequelize.config';
import { DEFAULT_NODE_ENV } from '../common/constants/config.constants';

const env = (process.env.NODE_ENV || DEFAULT_NODE_ENV) as keyof typeof dbConfigs;

export default registerAs('database', () => dbConfigs[env]);
