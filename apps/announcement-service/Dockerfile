FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/announcement-service/package.json ./apps/announcement-service/package.json

RUN pnpm install --frozen-lockfile

COPY apps/announcement-service ./apps/announcement-service

RUN pnpm --dir apps/announcement-service build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/announcement-service/package.json ./apps/announcement-service/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/announcement-service/dist ./apps/announcement-service/dist

EXPOSE 3007

CMD ["node", "apps/announcement-service/dist/main.js"]