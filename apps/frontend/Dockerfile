FROM node:22.11-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY apps/backend/package*.json apps/frontend/

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "workspace","frontend", "start"]