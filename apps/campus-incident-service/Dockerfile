FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/campus-incident-service/package.json ./apps/campus-incident-service/package.json

RUN pnpm install --frozen-lockfile

COPY apps/campus-incident-service ./apps/campus-incident-service

RUN pnpm --dir apps/campus-incident-service build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/campus-incident-service/package.json ./apps/campus-incident-service/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/campus-incident-service/dist ./apps/campus-incident-service/dist

EXPOSE 3020

CMD ["node", "apps/campus-incident-service/dist/main.js"]