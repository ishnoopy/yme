FROM node:20-alpine as base

# DOCU: Create a builder stage which builds the app using pnpm run build
# This will output a dist folder which we will use in the runner stage
FROM base as builder

# Install build dependencies
RUN apk add --no-cache libc6-compat && \
  npm install -g pnpm@9.1.1

WORKDIR /builder

COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build
# Remove dev dependencies as we don't need them in the final image when running the app in Production
RUN pnpm prune --prod


# DOCU: Create a runner stage which runs the app using pnpm run start
FROM base as runner

# Install runtime dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /runner

COPY --from=builder /builder/dist /runner/dist
COPY --from=builder /builder/node_modules /runner/node_modules
COPY --from=builder /builder/package.json /runner/package.json

# Copy the prisma folder which contains the schema.prisma
COPY --from=builder /builder/prisma /runner/prisma

COPY docker-entrypoint.sh /runner/
RUN chmod +x /runner/docker-entrypoint.sh

EXPOSE 3001

CMD [ "/runner/docker-entrypoint.sh" ]
