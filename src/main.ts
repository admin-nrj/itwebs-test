import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigType } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import appConfig from './config/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appCfg = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

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
  app.setGlobalPrefix(appCfg.globalPrefix);

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('ITWebs API')
    .setDescription('ITWebs API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(appCfg.port);
  Logger.log(`API service listening on port ${appCfg.port}`, 'Main');
  Logger.log(`Swagger documentation available at http://localhost:${appCfg.port}/api-docs`, 'Main');
}
bootstrap();
