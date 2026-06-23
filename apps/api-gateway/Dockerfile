FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api-gateway ./apps/api-gateway

RUN pnpm --dir apps/api-gateway build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist

EXPOSE 3000

CMD ["node", "apps/api-gateway/dist/main.js"]