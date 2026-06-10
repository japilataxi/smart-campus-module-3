FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api-gateway ./apps/api-gateway

RUN pnpm install --frozen-lockfile

RUN pnpm --dir apps/api-gateway build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist

EXPOSE 3000

CMD ["node", "apps/api-gateway/dist/main.js"]