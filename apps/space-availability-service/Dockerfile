FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/space-availability-service/package.json ./apps/space-availability-service/package.json

RUN pnpm install --frozen-lockfile

COPY apps/space-availability-service ./apps/space-availability-service

RUN pnpm --dir apps/space-availability-service build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/space-availability-service/package.json ./apps/space-availability-service/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/space-availability-service/dist ./apps/space-availability-service/dist

EXPOSE 3023

CMD ["node", "apps/space-availability-service/dist/main.js"]