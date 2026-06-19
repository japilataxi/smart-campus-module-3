FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/notification-service/package.json ./apps/notification-service/package.json

RUN pnpm install --frozen-lockfile

COPY apps/notification-service ./apps/notification-service

RUN pnpm --dir apps/notification-service build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/notification-service/package.json ./apps/notification-service/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/notification-service/dist ./apps/notification-service/dist

EXPOSE 3010

CMD ["node", "apps/notification-service/dist/main.js"]