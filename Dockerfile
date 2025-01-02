# Build stage
FROM node:16-alpine as builder

# Build client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# Production stage
FROM node:16-alpine
WORKDIR /app

# Copy built client
COPY --from=builder /app/client/build ./client/build

# Copy server
COPY --from=builder /app/server ./server

WORKDIR /app/server

EXPOSE 3001
CMD ["npm", "start"]