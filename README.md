# Backend Test Task (NestJS)

REST API сервис для управления пользователями, файлами и сообщениями.

## Основные возможности

- **JWT аутентификация** с refresh токенами
- **Валидация файлов по magic bytes** (сигнатура файлов)
- **Docker Compose** с автоматическим запуском миграций
- **Swagger документация** (`/api-docs`)
- **E2E тесты**
- **Архитектура**: модульная структура с DAL слоем, раздельные DTO, crypto сервис

## Быстрый старт

```bash
# С Docker (рекомендуется)
docker compose up -d

# Без Docker
npm install
npm run migration:run
npm run start:dev
```

- API доступен: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- Тестовый клиент: `http://localhost:8080` (nestjs_client.html)

Логин пароль по умолчанию:
  - admin@example.com
  - 111111


## Технологии

NestJS, TypeScript, Sequelize, PostgreSQL, JWT, PassportJS, Swagger
