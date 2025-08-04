# Server Dockerfile for Express.js API
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Add a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S expressjs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create uploads directory and set permissions
RUN mkdir -p uploads && chown -R expressjs:nodejs uploads

# Switch to non-root user
USER expressjs

# Expose port
EXPOSE 5000

# Health check with curl (more reliable)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]