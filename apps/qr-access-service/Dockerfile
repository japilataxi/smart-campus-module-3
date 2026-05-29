FROM node:22-alpine AS dependencies

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3003

CMD ["node", "dist/main.js"]
