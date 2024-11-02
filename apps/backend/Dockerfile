FROM node:22.11-alpine


WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY apps/backend/package*.json ./apps/backend/

RUN yarn install

COPY . .


EXPOSE 3000
RUN yarn workspace backend prisma generate
CMD [ "yarn","workspace", "backend", "start:dev" ]