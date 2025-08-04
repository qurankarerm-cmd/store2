# ⚡ Quick Start Guide - Arabic Clay Store on Windows

**Get your Arabic Clay Store running in 5 minutes!**

## 🚀 One-Click Deployment

### Option 1: Enhanced Deployment (Recommended)

1. **Open Command Prompt** in your project folder
2. **Run the pre-flight check**:
   ```cmd
   pre-flight-check.bat
   ```
3. **Follow the automated deployment** process

### Option 2: Manual Quick Start

1. **Ensure Docker Desktop is running** (green whale icon in system tray)
2. **Open PowerShell** in project directory:
   ```powershell
   cd "C:\Users\Admin\Desktop\New folder\arabic-clay-store"
   ```
3. **Start production deployment**:
   ```powershell
   docker-compose up --build -d
   ```

## 🌐 Access Your Store

Once deployment completes (5-10 minutes):

- **🏪 Public Store**: http://localhost:3000
- **⚙️ Admin Panel**: http://localhost:3001 
- **🔑 Login**: admin / admin123 (change immediately!)

## 📋 Available Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `pre-flight-check.bat` | System compatibility check | Before first deployment |
| `DEPLOY-WINDOWS-ENHANCED.bat` | Full-featured deployment | For production use |
| `DEPLOY-WINDOWS.bat` | Simple deployment | Quick testing |
| `COMPLETE-WINDOWS-DEPLOYMENT.md` | Comprehensive guide | Detailed instructions |
| `SECURITY-CONFIG.md` | Security hardening | Before going live |

## ⚠️ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Docker not found" | Install Docker Desktop, restart computer |
| "Port already in use" | Stop other services: `docker-compose down` |
| "Services not responding" | Wait 2-3 minutes, or restart: `docker-compose restart` |
| "Out of space" | Clean Docker: `docker system prune -f` |

## 🔄 Common Commands

```powershell
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Restart services
docker-compose restart

# Complete cleanup
docker-compose down -v
docker system prune -f
```

## 🎯 Next Steps

1. **Change admin password** at http://localhost:3001
2. **Add your products** through admin panel
3. **Update WhatsApp number** in docker-compose.yml
4. **Test customer flow** on public website
5. **Set up regular backups** using SECURITY-CONFIG.md

## 📞 Need Help?

- **Full Documentation**: See `COMPLETE-WINDOWS-DEPLOYMENT.md`
- **Security Setup**: See `SECURITY-CONFIG.md`
- **System Issues**: Run `pre-flight-check.bat`
- **Docker Issues**: Restart Docker Desktop

---

**Your Arabic Clay Store is ready for business! 🎨✨**