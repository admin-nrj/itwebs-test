ARG NODE_VERSION=20.15.0

FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app

COPY . .

RUN yarn add global sequelize sequelize-cli pg @babel/register @babel/preset-env @babel/core
CMD npx sequelize-cli db:migrate --config src/database/sequelize.config.cjs --migrations-path src/database/migrations
