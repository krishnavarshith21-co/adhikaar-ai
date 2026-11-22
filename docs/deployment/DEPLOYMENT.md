# Deployment & Production Operations

## Docker Deployment
ADHIKAAR AI provides a multi-container Docker deployment orchestrated via Docker Compose.

```bash
# Build and start both postgres and backend services
export DB_PASSWORD=your_secure_password
docker compose up --build -d
```

## Production Web Build
```bash
# Compile optimized static bundle and server chunks
npm run build

# Start production server
npm run start
```

## Local HTTP Preview
To preview the production bundle on `localhost` over HTTP:
```bash
COOKIE_SECURE=false npm run start -- --hostname localhost --port 3100
```
Note: `COOKIE_SECURE=false` is strictly for localhost HTTP testing. In production with TLS/HTTPS, omit this flag so cookies enforce `Secure`.
