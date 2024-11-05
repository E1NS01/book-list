FROM node:22.11-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY apps/frontend/package*.json ./apps/frontend/

RUN yarn install

COPY . .

RUN yarn workspace frontend build

FROM node:22.11-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/apps/frontend/package*.json ./apps/frontend/
COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist

RUN yarn install --production

EXPOSE 1234

CMD ["yarn", "workspace", "frontend", "preview"]