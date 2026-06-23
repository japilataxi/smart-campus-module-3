FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/qr-access-service/package.json ./apps/qr-access-service/package.json

RUN pnpm install --frozen-lockfile

COPY apps/qr-access-service ./apps/qr-access-service

RUN pnpm --dir apps/qr-access-service build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/qr-access-service/package.json ./apps/qr-access-service/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/qr-access-service/dist ./apps/qr-access-service/dist

EXPOSE 3021

CMD ["node", "apps/qr-access-service/dist/main.js"]