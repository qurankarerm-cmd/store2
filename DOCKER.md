# 🐳 Docker Setup Guide - أعمالي بالطين

This guide will help you run the Arabic Polymer Clay Store using Docker containers.

## 📋 Prerequisites

Before getting started, make sure you have the following installed:

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose** (usually included with Docker Desktop)
- At least **4GB RAM** available for containers
- **10GB** of free disk space

### Install Docker

#### Windows/Mac
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Install and start Docker Desktop
3. Verify installation: `docker --version`

#### Linux (Ubuntu/Debian)
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Add user to docker group (optional)
sudo usermod -aG docker $USER
```

## 🚀 Quick Start

### Method 1: Using the Setup Script (Linux/Mac)

```bash
# Make script executable
chmod +x docker-setup.sh

# Run the interactive setup
./docker-setup.sh
```

### Method 2: Manual Setup

#### Production Environment
```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Development Environment (with hot reload)
```bash
# Build and start development services
docker-compose -f docker-compose.dev.yml up --build -d

# Check status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🏗️ Architecture

The Docker setup includes 4 main services:

```
┌─────────────────────────────────────┐
│            Arabic Clay Store         │
└─────────────────────────────────────┘
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   MongoDB   │   Server    │   Client    │    Admin    │
│   Database  │   Express   │   Next.js   │   Next.js   │
│             │     API     │   Public    │  Dashboard  │
│  Port 27017 │  Port 5000  │  Port 3000  │  Port 3001  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Services Details

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| **mongodb** | `arabic_clay_mongodb` | 27017 | MongoDB database with initialization |
| **server** | `arabic_clay_server` | 5000 | Express.js API backend |
| **client** | `arabic_clay_client` | 3000 | Next.js public website |
| **admin** | `arabic_clay_admin` | 3001 | Next.js admin dashboard |

## 🔧 Configuration

### Environment Variables

The Docker setup uses these key environment variables:

#### Production (`docker-compose.yml`)
```yaml
# MongoDB
MONGO_INITDB_ROOT_USERNAME: admin
MONGO_INITDB_ROOT_PASSWORD: admin123

# Server
MONGODB_URI: mongodb://admin:admin123@mongodb:27017/arabic-clay-store?authSource=admin
JWT_SECRET: your-super-secret-jwt-key-change-this-in-production
WHATSAPP_NUMBER: 201234567890

# Frontend
API_BASE_URL: http://server:5000/api
```

#### Development (`docker-compose.dev.yml`)
- Uses development database: `arabic-clay-store-dev`
- Enables hot reload for all services
- Mounts source code as volumes
- Uses development JWT secret

### Persistent Data

Docker volumes are used to persist data:

- **mongodb_data**: Database files
- **uploads_data**: User uploaded images
- **mongodb_dev_data**: Development database
- **uploads_dev_data**: Development uploads

## 📱 Access Points

Once running, access the application at:

| Service | URL | Description |
|---------|-----|-------------|
| **Public Website** | http://localhost:3000 | Arabic RTL storefront |
| **Admin Dashboard** | http://localhost:3001 | Management panel |
| **API Endpoints** | http://localhost:5000/api | REST API |
| **Health Check** | http://localhost:5000/api/health | Server status |
| **MongoDB** | localhost:27017 | Database (admin/admin123) |

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

## 🛠️ Common Commands

### Starting Services
```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up -d

# Build and start
docker-compose up --build -d
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f admin
docker-compose logs -f mongodb
```

### Managing Data
```bash
# Backup database
docker exec arabic_clay_mongodb mongodump --out /backup

# Restore database
docker exec arabic_clay_mongodb mongorestore /backup

# Access MongoDB shell
docker exec -it arabic_clay_mongodb mongosh -u admin -p admin123
```

### Debugging
```bash
# Check service status
docker-compose ps

# Enter container shell
docker exec -it arabic_clay_server /bin/sh
docker exec -it arabic_clay_client /bin/sh

# View container logs
docker logs arabic_clay_server
```

## 🔧 Development Workflow

### Hot Reload Setup
The development configuration enables hot reload:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Your changes will be reflected immediately:
# - Server: Nodemon restarts on file changes
# - Client: Next.js hot reload
# - Admin: Next.js hot reload
```

### File Watching
Source code is mounted as volumes in development:

```yaml
volumes:
  - ./server:/app          # Server code
  - ./client:/app          # Client code  
  - ./admin-dashboard:/app # Admin code
  - /app/node_modules      # Preserve node_modules
```

## 🛡️ Security Considerations

### Production Security
1. **Change Default Passwords**
   ```bash
   # Update in docker-compose.yml
   MONGO_INITDB_ROOT_PASSWORD: your-secure-password
   JWT_SECRET: your-secure-jwt-secret
   ```

2. **Use Environment Files**
   ```bash
   # Create .env file
   echo "JWT_SECRET=your-secure-secret" > .env
   ```

3. **Network Security**
   - Services communicate via internal Docker network
   - Only necessary ports exposed to host
   - MongoDB not exposed in production

4. **Volume Permissions**
   - Non-root users in containers
   - Proper file permissions on volumes

## 📊 Monitoring & Health Checks

### Health Checks
All services include health checks:

```bash
# Check health status
docker-compose ps

# Manual health check
curl http://localhost:5000/api/health
curl http://localhost:3000/
curl http://localhost:3001/
```

### Resource Usage
```bash
# View resource usage
docker stats

# View disk usage
docker system df
```

## 🧹 Cleanup

### Selective Cleanup
```bash
# Stop services only
docker-compose down

# Remove containers and networks
docker-compose down --remove-orphans

# Remove containers, networks, and volumes
docker-compose down -v
```

### Complete Cleanup
```bash
# Remove everything related to the project
docker-compose down -v --remove-orphans
docker rmi $(docker images "arabic-clay*" -q)
docker volume prune
docker network prune
```

### Using Cleanup Script
```bash
# Interactive cleanup (Linux/Mac)
./docker-setup.sh
# Choose option 3: Clean Up
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
netstat -an | grep :3000
lsof -i :3000

# Kill process using port
kill -9 $(lsof -t -i:3000)
```

#### MongoDB Connection Issues
```bash
# Check MongoDB logs
docker logs arabic_clay_mongodb

# Test connection
docker exec -it arabic_clay_mongodb mongosh -u admin -p admin123

# Restart MongoDB
docker-compose restart mongodb
```

#### Out of Disk Space
```bash
# Clean Docker system
docker system prune -a

# Remove unused volumes
docker volume prune

# Check space usage
docker system df
```

#### Memory Issues
```bash
# Check container memory usage
docker stats

# Restart services
docker-compose restart

# Increase Docker Desktop memory (Windows/Mac)
# Docker Desktop → Settings → Resources → Memory
```

### Service-Specific Issues

#### Server Won't Start
```bash
# Check server logs
docker logs arabic_clay_server

# Common fixes:
# 1. MongoDB not ready - wait 30 seconds and retry
# 2. Port conflict - change port in docker-compose.yml
# 3. Environment variables - check .env file
```

#### Client Build Fails
```bash
# Check client logs
docker logs arabic_clay_client

# Rebuild without cache
docker-compose build --no-cache client
```

#### Database Initialization Fails
```bash
# Remove and recreate MongoDB volume
docker-compose down -v
docker volume rm arabic_clay_mongodb_data
docker-compose up mongodb
```

## 📚 Advanced Configuration

### Custom Configuration

#### Using Environment Files
Create `.env` file in project root:
```env
# Database
MONGODB_ROOT_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-secure-jwt-secret

# WhatsApp
WHATSAPP_NUMBER=201234567890

# Social Media
FACEBOOK_PAGE=your-page
INSTAGRAM_USERNAME=your-username
```

#### Custom Docker Compose
Create `docker-compose.override.yml`:
```yaml
version: '3.8'
services:
  server:
    environment:
      - CUSTOM_VAR=custom-value
    ports:
      - "5001:5000"  # Custom port mapping
```

### Scaling Services
```bash
# Scale specific services
docker-compose up --scale client=2 -d

# Load balancer configuration needed for multiple instances
```

### Production Optimization
```yaml
# In docker-compose.yml
services:
  server:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

## 🌐 Deployment

### Production Deployment
1. **Update Environment Variables**
2. **Use Production Docker Compose**
3. **Set up Reverse Proxy (Nginx)**
4. **Configure SSL Certificates**
5. **Set up Monitoring**

### Cloud Deployment
The Docker setup works with:
- **AWS ECS/EKS**
- **Google Cloud Run/GKE**
- **Azure Container Instances/AKS**
- **DigitalOcean App Platform**

### Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml arabic-clay
```

---

## 📞 Support

If you encounter issues:

1. **Check Logs**: `docker-compose logs -f`
2. **Verify Prerequisites**: Docker version, available memory
3. **Clean and Rebuild**: `docker-compose down -v && docker-compose up --build`
4. **Check Documentation**: Review this guide and README.md

For additional help, check the main project documentation or create an issue in the repository.

---

**Happy Dockerizing! 🐳**