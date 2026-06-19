FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/auth-service/package.json ./apps/auth-service/package.json

RUN pnpm install --frozen-lockfile

COPY apps/auth-service ./apps/auth-service

RUN pnpm --dir apps/auth-service build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/auth-service/package.json ./apps/auth-service/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist

EXPOSE 3001

CMD ["node", "apps/auth-service/dist/main.js"]