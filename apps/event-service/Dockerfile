FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/event-service/package.json ./apps/event-service/package.json

RUN pnpm install --frozen-lockfile

COPY apps/event-service ./apps/event-service

RUN pnpm --dir apps/event-service build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/event-service/package.json ./apps/event-service/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/event-service/dist ./apps/event-service/dist

EXPOSE 3030

CMD ["node", "apps/event-service/dist/main.js"]