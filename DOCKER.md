# Docker Deployment Guide for Libre WebUI

This guide covers deploying Libre WebUI using Docker for both development and production environments.

## Quick Start

### Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd libre-webui

# Build and run with Docker Compose
docker-compose up -d

# Access the application at http://localhost:3001
```

### Production Environment

```bash
# Set required environment variables
export JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Deploy to production
docker-compose -f docker-compose.production.yml up -d

# Access the application at https://lwui.org
```

## Files Overview

- `Dockerfile` - Multi-stage build for both frontend and backend
- `docker-compose.yml` - Development environment with Ollama
- `docker-compose.production.yml` - Production environment with SSL proxy
- `nginx.conf` - Nginx configuration for SSL termination and reverse proxy
- `.dockerignore` - Optimizes Docker build context
- `scripts/build-docker.sh` - Build script for Docker images
- `scripts/deploy.sh` - Automated deployment script

## Environment Variables

### Required for Production

- `JWT_SECRET` - Secret key for JWT tokens (MUST be changed in production)

### Optional

- `SINGLE_USER_MODE` - Set to `true` for single user mode (default: false)
- `OLLAMA_BASE_URL` - Custom Ollama instance URL (default: http://ollama:11434)
- `CORS_ORIGIN` - CORS origin for frontend (default: https://lwui.org)
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)

## Production Deployment Steps

### 1. Prepare the Server

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clone and Configure

```bash
# Clone the repository
git clone <repository-url>
cd libre-webui

# Copy and configure environment variables
cp .env.production .env
# Edit .env with your production values
nano .env
```

### 3. SSL Certificate Setup

Place your SSL certificates in the project root:

- `ssl/cert.pem` - SSL certificate
- `ssl/key.pem` - Private key

Or use Let's Encrypt:

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d lwui.org

# Copy certificates
sudo cp /etc/letsencrypt/live/lwui.org/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/lwui.org/privkey.pem ssl/key.pem
```

### 4. Deploy

```bash
# Set JWT secret
export JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Deploy using script
./scripts/deploy.sh

# Or manually
docker-compose -f docker-compose.production.yml up -d
```

## Manual Build and Run

### Build Docker Image

```bash
# Build the image
docker build -t libre-webui:latest .

# Or use the build script
./scripts/build-docker.sh
```

### Run Container

```bash
# Run with default settings
docker run -d \
  --name libre-webui \
  -p 3001:3001 \
  -e JWT_SECRET="your-secret-key" \
  -v libre_webui_data:/app/backend/data \
  libre-webui:latest

# Run with custom Ollama URL
docker run -d \
  --name libre-webui \
  -p 3001:3001 \
  -e JWT_SECRET="your-secret-key" \
  -e OLLAMA_BASE_URL="http://your-ollama-server:11434" \
  -v libre_webui_data:/app/backend/data \
  libre-webui:latest
```

## Data Persistence

The application stores data in the following locations:

- `/app/backend/data` - SQLite database and user data
- `/app/backend/temp` - Temporary files

These are mounted as Docker volumes to ensure data persistence across container restarts.

## GPU Support for Ollama

To enable GPU support for Ollama, uncomment the GPU configuration in `docker-compose.yml`:

```yaml
# Uncomment for GPU support
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

## Monitoring and Logs

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f libre-webui
docker-compose logs -f ollama

# Check service status
docker-compose ps
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port mapping in docker-compose.yml
2. **JWT_SECRET not set**: Export the JWT_SECRET environment variable
3. **SSL certificate issues**: Ensure cert.pem and key.pem are in the ssl/ directory
4. **Ollama not responding**: Check if Ollama service is running and accessible

### Health Checks

The Docker image includes a health check that verifies the API is responding:

```bash
# Check container health
docker ps
# Look for "healthy" status
```

## Security Considerations

1. **Change JWT_SECRET**: Always use a secure, random JWT secret in production
2. **SSL/TLS**: Always use HTTPS in production
3. **Firewall**: Configure firewall rules to restrict access
4. **Updates**: Regularly update the Docker images and base OS
5. **Backup**: Regularly backup the data volume

## Scaling

For high-traffic deployments, consider:

- Using a load balancer with multiple instances
- Separating the database to an external service
- Using Redis for session storage
- Implementing CDN for static assets

## Support

For issues with Docker deployment, check:

1. Container logs: `docker-compose logs`
2. Health check status: `docker ps`
3. Environment variables: `docker-compose config`
4. Network connectivity: `docker network ls`
