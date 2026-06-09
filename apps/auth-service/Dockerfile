FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile

ARG APP_NAME

RUN pnpm --dir apps/auth-service build
FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages
COPY --from=builder /app/apps ./apps

RUN pnpm install --prod --frozen-lockfile

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

EXPOSE 3000

CMD ["pnpm", "--dir", "apps/auth-service", "start:prod"]