FROM node:20-alpine AS base
WORKDIR /app
RUN apk upgrade --no-cache

# cache dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit dev


FROM base AS build
RUN npm ci --include dev
COPY tsconfig.json .
COPY src ./src
RUN npm run build


FROM base AS app
COPY --from=build /app/out ./out
ENTRYPOINT [ "npm", "start" ]
