FROM node:22.11-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY apps/backend/package*.json ./apps/backend/

RUN yarn install

COPY . .

RUN yarn workspace backend prisma generate
RUN yarn workspace backend build

FROM node:22.11-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/

RUN yarn install

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD [ "yarn", "workspace", "backend", "start:prod" ]