FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/library-service/package.json ./apps/library-service/package.json

RUN pnpm install --frozen-lockfile

COPY apps/library-service ./apps/library-service

RUN pnpm --dir apps/library-service build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/library-service/package.json ./apps/library-service/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/library-service/dist ./apps/library-service/dist

EXPOSE 3002

CMD ["node", "apps/library-service/dist/main.js"]