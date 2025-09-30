ARG NODE_VERSION=20.15.0

FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app

RUN npm install --no-save sequelize sequelize-cli pg dotenv typescript @types/node

COPY src/sequelize/sequelize.config.ts ./src/sequelize/
COPY src/sequelize/migrations ./src/sequelize/migrations
COPY .sequelizerc tsconfig.json ./

# Compile TypeScript to dist directory preserving structure
RUN npx tsc src/sequelize/sequelize.config.ts --outDir dist/sequelize --module commonjs --esModuleInterop --skipLibCheck --declaration false --rootDir src/sequelize

CMD npx sequelize-cli db:migrate
