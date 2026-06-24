FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web-app/package.json ./apps/web-app/package.json

RUN pnpm install --frozen-lockfile

COPY apps/web-app ./apps/web-app

RUN pnpm --dir apps/web-app build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003
ENV HOSTNAME=0.0.0.0

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web-app/package.json ./apps/web-app/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/web-app/.next ./apps/web-app/.next
COPY --from=builder /app/apps/web-app/public ./apps/web-app/public

EXPOSE 3003


CMD ["pnpm", "--dir", "apps/web-app", "start"]