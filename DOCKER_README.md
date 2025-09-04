# 🐳 Skola Docker Deployment Guide

This guide covers how to run the Skola application using Docker containers for both development and production environments.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available
- Git

## 🚀 Quick Start

### Development Environment

1. **Clone and navigate to the project:**
```bash
git clone <repository-url>
cd skola
```

2. **Start development environment:**
```bash
# Build and start all services
docker-compose -f docker-compose.dev.yml up --build

# Or use npm script
npm run docker:dev
```

3. **Access the application:**
- **Frontend (Web)**: http://localhost:8085
- **Backend API**: http://localhost:3000
- **Database Studio**: Run `npm run db:studio` separately

### Production Environment

1. **Build production containers:**
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up --build -d

# Or use npm script
npm run docker:prod
```

2. **Access the application:**
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost/api (port 80, proxied)
- **Health Check**: http://localhost/health

## 🏗️ Architecture

### Development Setup
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (Expo Dev)    │◄──►│   (Hono.js)     │
│   Port: 8085    │    │   Port: 3000    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                Shared Network
```

### Production Setup
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Frontend      │    │   Backend       │
│   Load Balancer │◄──►│   (Web Build)   │◄──►│   (Hono.js)     │
│   Port: 80/443  │    │   Port: 8080    │    │   Port: 3000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 File Structure

```
skola/
├── docker-compose.yml          # Production setup
├── docker-compose.dev.yml      # Development setup
├── docker-compose.prod.yml     # Production with SSL
├── docker.env                  # Environment variables
├── Dockerfile.frontend         # Frontend production build
├── Dockerfile.dev              # Frontend development
├── nginx.conf                  # Nginx config for frontend
├── nginx/prod.conf             # Production nginx config
└── backend/
    ├── Dockerfile              # Backend production
    ├── Dockerfile.dev          # Backend development
    ├── .dockerignore           # Backend build exclusions
    └── ...backend files
```

## 🔧 Configuration

### Environment Variables

Create `docker.env` in the project root:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://backend:3000

# Security
JWT_SECRET=your-production-jwt-secret-change-this-in-production

# Database
DATABASE_URL=./db/skola.db

# Environment
NODE_ENV=production
```

### Customizing Ports

To change default ports, modify the `ports` section in `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3001:3000"  # Host:Container

  frontend:
    ports:
      - "8081:8080"  # Host:Container
```

## 🛠️ Development Workflow

### Starting Development Environment

```bash
# Start all services
npm run docker:dev

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Making Code Changes

With development containers, changes are automatically reflected:

1. **Frontend**: Edit files in the project root
2. **Backend**: Edit files in the `backend/` directory
3. **Hot Reload**: Both services support hot reloading

### Database Operations

```bash
# Access database container
docker exec -it skola-backend bash

# Run database commands
cd /app
bun run db:generate
bun run db:push
bun run db:studio
```

## 🚀 Production Deployment

### Basic Production Setup

```bash
# Build and start production containers
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### With SSL/TLS

```bash
# Place SSL certificates in ssl/ directory
# Update nginx/prod.conf with certificate paths
# Start with SSL profile
docker-compose --profile prod-ssl up -d
```

### Scaling

```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Scale frontend services
docker-compose up -d --scale frontend=2
```

## 📊 Monitoring & Troubleshooting

### Health Checks

```bash
# Check service health
docker-compose ps

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Common Issues

#### Port Conflicts
```bash
# Find conflicting processes
lsof -i :3000
lsof -i :8085

# Change ports in docker-compose.yml
ports:
  - "3001:3000"  # New host port
```

#### Permission Issues
```bash
# Fix database permissions
docker exec -it skola-backend chown -R node:node /app/db

# Rebuild containers
docker-compose down
docker-compose up --build
```

#### Memory Issues
```bash
# Increase Docker memory limit
# Docker Desktop: Settings > Resources > Memory

# Or limit container memory in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 1G
```

## 🔄 Updates & Maintenance

### Updating Images

```bash
# Pull latest base images
docker-compose pull

# Rebuild all services
docker-compose up --build -d

# Update specific service
docker-compose up --build -d backend
```

### Database Backups

```bash
# Backup database volume
docker run --rm -v skola_backend_data:/data -v $(pwd):/backup alpine tar czf /backup/db-backup.tar.gz -C /data .

# Restore from backup
docker run --rm -v skola_backend_data:/data -v $(pwd):/backup alpine tar xzf /backup/db-backup.tar.gz -C /data
```

### Logs Management

```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Export logs
docker-compose logs > logs.txt

# Clean old logs
docker system prune -f
```

## 🔒 Security Considerations

### Production Security

1. **Change JWT Secret**: Update `JWT_SECRET` in `docker.env`
2. **Enable SSL/TLS**: Configure HTTPS with certificates
3. **Network Security**: Use internal networks, don't expose DB
4. **Regular Updates**: Keep base images updated
5. **Access Control**: Implement proper authentication

### Environment Variables

```env
# Security
JWT_SECRET=very-long-random-secret-key
NODE_ENV=production

# Database
DATABASE_URL=secure-connection-string

# API
EXPO_PUBLIC_API_URL=https://yourdomain.com/api
```

## 📈 Performance Optimization

### Production Optimizations

```yaml
# In docker-compose.prod.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
    environment:
      - NODE_ENV=production

  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 256M
```

### Database Optimization

```bash
# Inside backend container
sqlite3 db/skola.db "PRAGMA optimize;"

# Enable WAL mode for better performance
sqlite3 db/skola.db "PRAGMA journal_mode=WAL;"
```

## 🎯 CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up --build -d
```

## 📞 Support

### Useful Commands

```bash
# View running containers
docker ps

# View container logs
docker logs skola-backend

# Access container shell
docker exec -it skola-backend bash

# Clean up everything
docker-compose down -v --rmi all
docker system prune -f
```

### Health Checks

```bash
# API Health
curl http://localhost/api/health

# Frontend Health
curl http://localhost/health

# Database Health (inside container)
sqlite3 db/skola.db "SELECT 1;"
```

---

**🎉 Your Skola application is now containerized and ready to run anywhere!**

For additional help, check the main README.md or create an issue in the repository.
