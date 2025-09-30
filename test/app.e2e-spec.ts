import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { ConfigType } from '@nestjs/config';
import request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import { Client } from 'pg';
import { AppModule } from '../src/app.module';
import appConfig from '../src/config/app.config';
import {
  DEFAULT_DB_HOST,
  DEFAULT_DB_PORT,
  DEFAULT_DB_USER,
  DEFAULT_DB_ADMIN_DATABASE,
} from '../src/common/constants/config.constants';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

jest.setTimeout(30000);

describe('App (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DB_DIALECT = 'postgres';
    const configuredDbName = process.env.DB_NAME;
    process.env.DB_NAME = configuredDbName
      ? configuredDbName.endsWith('_test')
        ? configuredDbName
        : `${configuredDbName}_test`
      : 'itwebs_db_test';
    process.env.DB_HOST = process.env.DB_HOST ?? DEFAULT_DB_HOST;
    process.env.DB_PORT = process.env.DB_PORT ?? `${DEFAULT_DB_PORT}`;
    process.env.DB_USERNAME = process.env.DB_USERNAME ?? DEFAULT_DB_USER;
    process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? '';
    process.env.JWT_SECRET = 'test-secret';

    await ensureTestDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.enableCors({ origin: '*' });

    const appCfg = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
    app.setGlobalPrefix(appCfg.globalPrefix);

    await app.init();

    sequelize = app.get(Sequelize);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (sequelize) {
      await sequelize.close();
    }
  });

  it('builds and boots the Nest application', () => {
    expect(app).toBeDefined();
    expect(app.getHttpServer()).toBeDefined();
  });

  it('registers a user, logs in, and fetches the profile', async () => {
    const server = app.getHttpServer();
    const email = `test-user-${Date.now()}@example.com`;
    const password = 'password123';

    const registerResponse = await request(server).post('/api/auth/register').send({ email, password }).expect(201);

    expect(registerResponse.body.success).toBe(true);
    expect(registerResponse.body.data.accessToken).toBeDefined();
    expect(registerResponse.body.data.user).toMatchObject({ email });

    const loginResponse = await request(server).post('/api/auth/login').send({ email, password }).expect(200);

    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data.accessToken).toBeDefined();
    expect(loginResponse.body.data.user).toMatchObject({ email });

    const {
      data: {
        accessToken,
        user: { userId },
      },
    } = loginResponse.body;

    const profileResponse = await request(server)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(profileResponse.body.success).toBe(true);
    expect(profileResponse.body.data).toMatchObject({
      userId,
      email,
      isActive: true,
    });
  });
});

async function ensureTestDatabase(): Promise<void> {
  const dbName = process.env.DB_NAME ?? 'itwebs_db_test';
  const host = process.env.DB_HOST ?? DEFAULT_DB_HOST;
  const port = parseInt(process.env.DB_PORT ?? `${DEFAULT_DB_PORT}`, 10);
  const user = process.env.DB_USERNAME ?? DEFAULT_DB_USER;
  const password = process.env.DB_PASSWORD ?? '';
  const adminDb = process.env.DB_DEFAULT_DB ?? DEFAULT_DB_ADMIN_DATABASE;

  const client = new Client({ host, port, user, password, database: adminDb });

  await client.connect();
  const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);

  if (result.rowCount === 0) {
    const safeName = dbName.replace(/"/g, '""');
    await client.query(`CREATE DATABASE "${safeName}"`);
  }

  await client.end();
}
