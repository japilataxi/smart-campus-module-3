FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/transport-service/package.json ./apps/transport-service/package.json

RUN pnpm install --frozen-lockfile

COPY apps/transport-service ./apps/transport-service

RUN pnpm --dir apps/transport-service build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/transport-service/package.json ./apps/transport-service/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/transport-service/dist ./apps/transport-service/dist

EXPOSE 3022

CMD ["node", "apps/transport-service/dist/main.js"]