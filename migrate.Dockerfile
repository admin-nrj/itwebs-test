ARG NODE_VERSION=20.15.0

FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app

RUN npm install --no-save sequelize sequelize-cli pg dotenv typescript @types/node

COPY src/dal/sequelize.config.ts ./src/dal/
COPY src/dal/migrations ./src/dal/migrations
COPY .sequelizerc tsconfig.json ./

# Compile TypeScript to dist directory preserving structure
RUN npx tsc src/dal/sequelize.config.ts --outDir dist/dal --module commonjs --esModuleInterop --skipLibCheck --declaration false --rootDir src/dal

CMD npx sequelize-cli db:migrate
