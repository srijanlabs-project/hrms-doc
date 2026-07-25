# Staffsy UAT deployment image: builds both npm workspaces (apps/api, apps/web) and runs
# the NestJS API as a single process that also serves the built web SPA from the same
# origin (see src/main.ts) — avoids cross-origin cookie/CORS setup entirely for UAT.
# Simplicity over image size: the runtime stage reuses the build stage's full
# node_modules rather than a second scoped install, since this is a UAT image.

FROM node:20-slim AS build
WORKDIR /app

# Install once for the whole workspace (single root lockfile covers both apps).
COPY app/package.json app/package-lock.json ./
COPY app/apps/api/package.json ./apps/api/package.json
COPY app/apps/web/package.json ./apps/web/package.json
RUN npm ci

COPY app/ ./
RUN npx prisma generate --schema apps/api/prisma/schema.prisma
RUN npm run build --workspace @staffsy/api
RUN npm run build --workspace @staffsy/web

# --- Runtime image ---
# Everything lives under /app/apps/api so `process.cwd()` inside main.ts matches
# both the "uploads" and "web-dist" relative paths it expects.
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/web/dist ./apps/api/web-dist

WORKDIR /app/apps/api
RUN mkdir -p uploads

EXPOSE 3000
# Applies any pending migrations (including the hand-appended RLS SQL already committed in
# each migration's migration.sql) against DATABASE_URL, then starts the API — which also
# serves the SPA from ./web-dist per main.ts's existsSync(join(process.cwd(), "web-dist")).
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
