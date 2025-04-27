# Frontend build
FROM node:20 AS frontend

WORKDIR /frontend
COPY frontend/package.json frontend/vite.config.js frontend/index.html ./ 
COPY frontend/src ./src
RUN npm install && npm run build

# Backend build
FROM golang:1.22 AS backend

WORKDIR /backend

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o mod-manager


# Final container
FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /app

# Copy backend
COPY --from=backend /backend/mod-manager .

# Copy frontend
COPY --from=frontend /frontend/dist /var/www

# Expose API + static frontend
EXPOSE 8080

ENV MOD_DIR=/config/BepInEx/plugins

ENTRYPOINT ["./mod-manager"]
