FROM oven/bun:1 AS builder
WORKDIR /usr/src/app

COPY . .

RUN bun install --frozen-lockfile --production
RUN bun run build

FROM oven/bun:1 AS runner
ENV NODE_ENV=production
USER bun
WORKDIR /app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/static ./static

ENTRYPOINT [ "bun", "run", "." ]
