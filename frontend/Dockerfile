FROM node:22.11-bookworm-slim AS builder

RUN corepack enable

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY ./app ./app
COPY ./src/ ./src/
COPY ./tsconfig.json ./
COPY ./next-env.d.ts ./next-env.d.ts
COPY ./.env ./

RUN yarn build

FROM node:22.11-bookworm-slim AS production

WORKDIR /app

COPY --from=builder /app/yarn.lock ./yarn.lock
COPY package.json .
RUN corepack enable
RUN yarn workspaces focus --all --production

COPY --from=builder /app/.next/ ./.next/
COPY ./.env ./

CMD ["yarn", "start"]