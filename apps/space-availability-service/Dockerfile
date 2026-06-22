FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/space-availability-service/package.json apps/space-availability-service/package.json
RUN pnpm install --filter space-availability-service --frozen-lockfile

FROM deps AS build
COPY apps/space-availability-service apps/space-availability-service
RUN pnpm --filter space-availability-service build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/space-availability-service/node_modules ./apps/space-availability-service/node_modules
COPY --from=build /app/apps/space-availability-service/dist ./apps/space-availability-service/dist
COPY apps/space-availability-service/package.json ./apps/space-availability-service/package.json
WORKDIR /app/apps/space-availability-service
EXPOSE 3023
CMD ["node", "dist/main"]
