FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/workflow-service/package.json ./apps/workflow-service/package.json

RUN pnpm install --frozen-lockfile

COPY apps/workflow-service ./apps/workflow-service

RUN pnpm --dir apps/workflow-service build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/workflow-service/package.json ./apps/workflow-service/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/workflow-service/dist ./apps/workflow-service/dist

EXPOSE 3024

CMD ["node", "apps/workflow-service/dist/main.js"]
