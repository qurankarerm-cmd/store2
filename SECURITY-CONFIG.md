# 🛡️ Security Configuration Guide - أعمالي بالطين

This guide covers essential security configurations for your Arabic Clay Store deployment.

## 🔐 Environment Variables Security

### Step 1: Create Secure Environment File

Create a `.env` file in your project root with the following secure configurations:

```env
# ==================== DATABASE SECURITY ====================
# Change these default passwords!
MONGODB_ROOT_USERNAME=admin
MONGODB_ROOT_PASSWORD=SecurePassword123!@#
MONGODB_DATABASE=arabic-clay-store

# ==================== JWT SECURITY ====================
# Generate a strong JWT secret (minimum 32 characters)
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-chars-long
JWT_EXPIRE=7d

# ==================== BUSINESS CONFIGURATION ====================
WHATSAPP_NUMBER=201234567890
FACEBOOK_PAGE=amali.bilteen
INSTAGRAM_USERNAME=amali_bilteen
TIKTOK_USERNAME=amali.bilteen
FACEBOOK_MESSENGER=amali.bilteen

# ==================== APPLICATION URLS ====================
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
API_BASE_URL=http://server:5000/api

# ==================== SECURITY HEADERS ====================
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=15

# ==================== UPLOAD SECURITY ====================
MAX_FILE_SIZE=10
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

### Step 2: Generate Secure Passwords

**PowerShell commands to generate secure passwords:**

```powershell
# Generate secure MongoDB password
$mongoPassword = [System.Web.Security.Membership]::GeneratePassword(20, 5)
Write-Host "MongoDB Password: $mongoPassword"

# Generate secure JWT secret
$jwtSecret = [System.Web.Security.Membership]::GeneratePassword(40, 8)
Write-Host "JWT Secret: $jwtSecret"

# Generate admin password
$adminPassword = [System.Web.Security.Membership]::GeneratePassword(16, 4)
Write-Host "Admin Password: $adminPassword"
```

## 🔒 Docker Compose Security Updates

### Step 1: Update docker-compose.yml

Replace the default environment variables in your `docker-compose.yml`:

```yaml
services:
  mongodb:
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGODB_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGODB_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGODB_DATABASE}

  server:
    environment:
      MONGODB_URI: mongodb://${MONGODB_ROOT_USERNAME}:${MONGODB_ROOT_PASSWORD}@mongodb:27017/${MONGODB_DATABASE}?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRE: ${JWT_EXPIRE}
      WHATSAPP_NUMBER: ${WHATSAPP_NUMBER}
      FACEBOOK_PAGE: ${FACEBOOK_PAGE}
      INSTAGRAM_USERNAME: ${INSTAGRAM_USERNAME}
```

### Step 2: Remove MongoDB Port Exposure (Production Only)

For production deployment, remove MongoDB port exposure:

```yaml
# Remove this from mongodb service in production:
# ports:
#   - "27017:27017"
```

## 🛡️ Windows Security Configuration

### Step 1: Windows Defender Exclusions

Add Docker directories to Windows Defender exclusions for better performance:

```powershell
# Run PowerShell as Administrator
Add-MpPreference -ExclusionPath "C:\Program Files\Docker"
Add-MpPreference -ExclusionPath "C:\ProgramData\Docker"
Add-MpPreference -ExclusionPath "C:\Users\$env:USERNAME\.docker"
```

### Step 2: Windows Firewall Configuration

Configure Windows Firewall rules:

```powershell
# Allow Docker Desktop
New-NetFirewallRule -DisplayName "Docker Desktop" -Direction Inbound -Program "C:\Program Files\Docker\Docker\Docker Desktop.exe" -Action Allow

# Allow specific ports (if needed for external access)
New-NetFirewallRule -DisplayName "Arabic Clay Store - Public" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
New-NetFirewallRule -DisplayName "Arabic Clay Store - Admin" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

### Step 3: User Account Security

Ensure Docker runs with appropriate user privileges:

```powershell
# Add current user to docker-users group
net localgroup docker-users $env:USERNAME /add

# Verify membership
net localgroup docker-users
```

## 🔐 Application Security Hardening

### Step 1: Change Default Admin Credentials

**After deployment, immediately change default admin credentials:**

1. Go to http://localhost:3001
2. Login with: admin / admin123
3. Navigate to Profile/Settings
4. Change password to a strong password
5. **Document the new password securely**

### Step 2: Secure File Uploads

The application is configured with secure upload restrictions:

- **Max file size**: 10MB
- **Allowed types**: JPEG, PNG, WebP only
- **Upload directory**: Isolated from application code
- **File validation**: Server-side validation enabled

### Step 3: Rate Limiting

Built-in rate limiting protects against abuse:

- **API requests**: 100 requests per 15 minutes per IP
- **File uploads**: 5 uploads per minute per IP
- **Authentication**: 5 login attempts per 15 minutes per IP

## 🚨 Security Monitoring

### Step 1: Enable Security Logging

Update your `.env` file:

```env
ENABLE_LOGGING=true
LOG_LEVEL=info
ENABLE_SECURITY_LOGS=true
```

### Step 2: Monitor Security Events

**PowerShell script to monitor Docker container logs:**

```powershell
# Monitor security events
docker-compose logs -f server | findstr "security\|error\|unauthorized\|failed"
```

### Step 3: Regular Security Checks

**Weekly security checklist:**

```powershell
# Check for failed login attempts
docker logs arabic_clay_server | findstr "unauthorized\|failed login"

# Monitor file upload attempts
docker logs arabic_clay_server | findstr "upload\|file"

# Check system resource usage
docker stats --no-stream

# Verify container integrity
docker-compose ps
```

## 🔄 Security Backup Strategy

### Step 1: Automated Backup Script

Create `backup-security.bat`:

```batch
@echo off
set "BACKUP_DATE=%date:~10,4%-%date:~4,2%-%date:~7,2%"
set "BACKUP_DIR=.\security-backups\%BACKUP_DATE%"

mkdir "%BACKUP_DIR%" 2>nul

:: Backup environment configuration
copy ".env" "%BACKUP_DIR%\.env.backup"
copy "docker-compose.yml" "%BACKUP_DIR%\docker-compose.yml.backup"

:: Backup database
docker exec arabic_clay_mongodb mongodump --archive="%BACKUP_DIR%\database.archive"

:: Backup uploads (images)
docker cp arabic_clay_server:/app/uploads "%BACKUP_DIR%\uploads"

echo Backup completed: %BACKUP_DIR%
```

### Step 2: Secure Backup Storage

- **Store backups on external drive**
- **Encrypt sensitive backup files**
- **Keep backups for 30 days minimum**
- **Test restore procedures monthly**

## ⚠️ Security Incident Response

### Step 1: Immediate Response

If you suspect a security breach:

```powershell
# Immediately stop all services
docker-compose down

# Check logs for suspicious activity
docker logs arabic_clay_server > security-incident-logs.txt
docker logs arabic_clay_admin >> security-incident-logs.txt

# Backup current state
docker commit arabic_clay_server arabic_clay_server_incident_backup
docker commit arabic_clay_admin arabic_clay_admin_incident_backup
```

### Step 2: Investigation

1. **Review logs** for unauthorized access attempts
2. **Check file modifications** in upload directories  
3. **Verify database integrity**
4. **Examine network connections**

### Step 3: Recovery

1. **Change all passwords** (admin, database, JWT secret)
2. **Update environment variables**
3. **Rebuild containers** from clean images
4. **Restore from known-good backup** if needed

## 🌐 Production Deployment Security

### Additional Production Considerations

1. **Use HTTPS/SSL certificates**
2. **Implement reverse proxy** (Nginx)
3. **Set up VPN access** for admin dashboard
4. **Enable database encryption at rest**
5. **Implement log aggregation**
6. **Set up intrusion detection**

### Production Environment Variables

```env
NODE_ENV=production
HTTPS_ENABLED=true
SSL_CERT_PATH=/certs/certificate.pem
SSL_KEY_PATH=/certs/private-key.pem
ADMIN_IP_WHITELIST=192.168.1.100,10.0.0.50
ENABLE_2FA=true
```

## 📞 Security Support

### Emergency Contacts

- **System Administrator**: [Your contact]
- **Hosting Provider**: [Provider support]
- **Backup Service**: [Backup contact]

### Security Resources

- [OWASP Security Guidelines](https://owasp.org/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

---

## ✅ Security Checklist

### Initial Setup
- [ ] Changed default MongoDB password
- [ ] Generated secure JWT secret
- [ ] Created environment variables file
- [ ] Updated Docker Compose configuration
- [ ] Changed default admin credentials

### Ongoing Security
- [ ] Weekly log reviews
- [ ] Monthly backup tests
- [ ] Quarterly password updates
- [ ] Regular security patches
- [ ] Monitor for suspicious activity

### Production Deployment
- [ ] HTTPS/SSL configured
- [ ] Reverse proxy implemented
- [ ] Database encryption enabled
- [ ] Firewall rules configured
- [ ] Monitoring systems active

---

**Remember: Security is an ongoing process, not a one-time setup!**

**Keep your Arabic Clay Store secure and your customers' data protected! 🛡️✨**