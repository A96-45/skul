# 🚀 Skola PWA Setup Guide

**Install Skola as a Native App on Any Device - No App Stores Required!**

---

## 📱 **What is Skola PWA?**

Progressive Web Apps (PWAs) combine the best of web and mobile apps:
- ✅ **Install like a native app** - Add to home screen/desktop
- ✅ **Works offline** - Access cached content without internet
- ✅ **Cross-platform** - Same app on Windows, Mac, Linux, Android, iOS
- ✅ **No app store approval** - Direct installation from browser
- ✅ **Automatic updates** - Always get the latest version
- ✅ **Native app feel** - Desktop shortcuts, notifications, full-screen

---

## 🛠️ **Quick Setup (5 minutes)**

### **Option 1: One-Command Setup (Recommended)**

```bash
# 1. Make sure Docker is installed and running
sudo systemctl start docker

# 2. Clone and setup everything
git clone <your-repo-url>
cd skola

# 3. Start PWA + Backend
docker-compose -f docker-compose.pwa.yml up -d

# 4. Open your browser and visit:
# http://localhost:8080
```

### **Option 2: Manual Setup**

```bash
# 1. Install dependencies
npm install

# 2. Build for web
npm run build

# 3. Start backend separately
cd backend && npm run dev

# 4. Serve PWA files (in another terminal)
npx serve web-build -p 8080
```

---

## 📱 **How to Install Skola PWA**

### **Step 1: Access the App**
1. Open your browser (Chrome, Edge, Safari, Firefox)
2. Go to: `http://localhost:8080` (or your deployed URL)

### **Step 2: Install the App**

#### **On Desktop (Windows/Mac/Linux):**
1. Look for the **install icon** in the address bar:
   - Chrome: 📱 or "Install Skola" button
   - Edge: 📱 icon
   - Firefox: May show "Install this site as an app"
2. Click **"Install"** or **"Install Skola"**
3. The app will appear on your desktop/taskbar

#### **On Mobile (Android/iOS):**
1. Look for the **share button** (📤) in your browser
2. Scroll down and find **"Add to Home Screen"**
3. Tap **"Add"**
4. The app icon will appear on your home screen

#### **Alternative Method:**
1. In the browser address bar, click the **padlock** or **"i"** icon
2. Select **"Install Skola"** or **"Add to Home Screen"**

---

## 🌐 **Browser-Specific Installation**

### **Google Chrome:**
```
1. Visit: http://localhost:8080
2. Click the 📱 icon in the address bar
3. Click "Install"
4. App installs instantly!
```

### **Microsoft Edge:**
```
1. Visit: http://localhost:8080
2. Click the 📱 icon in the address bar
3. Click "Install"
4. App appears in Start Menu
```

### **Mozilla Firefox:**
```
1. Visit: http://localhost:8080
2. Click the menu (☰) → "Install This Site as an App"
3. Click "Install"
4. App appears on desktop
```

### **Safari (macOS/iOS):**
```
1. Visit: http://localhost:8080
2. Click Share button (📤) → "Add to Home Screen"
3. Click "Add"
4. App appears on home screen
```

---

## 🔧 **PWA Features & Capabilities**

### **✅ What Skola PWA Can Do:**

**Offline Access:**
- View cached course materials
- Access previously loaded assignments
- Use the app without internet connection

**Native App Experience:**
- Desktop shortcuts and start menu integration
- Full-screen mode capability
- System notifications (when enabled)
- Background sync for offline actions

**Cross-Device Sync:**
- Same experience on phone, tablet, and desktop
- Automatic data synchronization
- Seamless switching between devices

### **📋 PWA Permissions:**
When you install, you may be asked to allow:
- **Notifications** - For assignment reminders
- **Background Sync** - To sync data when online
- **Storage** - To cache app data locally

---

## 🚀 **Advanced Setup Options**

### **With Database Admin Panel:**
```bash
# Start with PgAdmin for database management
docker-compose -f docker-compose.pwa.yml --profile with-admin up -d

# Access PgAdmin at: http://localhost:5050
# Email: admin@skola.local
# Password: admin123
```

### **With Redis Caching:**
```bash
# Start with Redis for improved performance
docker-compose -f docker-compose.pwa.yml --profile with-cache up -d
```

### **Custom Configuration:**
```bash
# Create custom environment file
cp .env.example .env.production

# Edit with your settings
nano .env.production

# Start with custom config
docker-compose -f docker-compose.pwa.yml --env-file .env.production up -d
```

---

## 🔄 **Updates & Maintenance**

### **Automatic Updates:**
- PWAs update automatically when you have internet
- No manual update process required
- Always get the latest features and fixes

### **Manual Update Check:**
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.pwa.yml up -d --build
```

### **Clear Cache (if needed):**
1. Open browser DevTools (F12)
2. Go to **Application** → **Storage**
3. Click **"Clear site data"**
4. Refresh the page

---

## 🐛 **Troubleshooting**

### **❌ PWA Won't Install:**
**Solution:**
- Make sure you're using HTTPS (or localhost)
- Try a different browser
- Clear browser cache and cookies
- Restart browser

### **❌ App Won't Load:**
**Solution:**
```bash
# Check if services are running
docker-compose -f docker-compose.pwa.yml ps

# View logs
docker-compose -f docker-compose.pwa.yml logs -f

# Restart services
docker-compose -f docker-compose.pwa.yml restart
```

### **❌ Can't Connect to Backend:**
**Solution:**
```bash
# Check backend health
curl http://localhost:3000/health/check

# Restart backend
docker-compose -f docker-compose.pwa.yml restart backend
```

### **❌ Offline Features Not Working:**
**Solution:**
- Make sure Service Worker is registered
- Check browser DevTools → Application → Service Workers
- Clear site data and reinstall PWA

---

## 🌐 **Deployment Options**

### **Local Network Access:**
```bash
# Allow access from other devices on your network
# Edit docker-compose.pwa.yml and change ports to:
# ports:
#   - "0.0.0.0:8080:80"

# Then access from other devices using your IP:
# http://YOUR_IP_ADDRESS:8080
```

### **Custom Domain:**
```bash
# Use nginx reverse proxy for custom domain
# Add to docker-compose.pwa.yml:
# services:
#   nginx-proxy:
#     image: nginx:alpine
#     ports:
#       - "80:80"
#       - "443:443"
#     volumes:
#       - ./nginx.conf:/etc/nginx/nginx.conf
```

### **Cloud Deployment:**
```bash
# Deploy to any cloud platform
# 1. Build the PWA: npm run build
# 2. Upload web-build folder to:
#    - Netlify
#    - Vercel
#    - GitHub Pages
#    - AWS S3 + CloudFront
#    - Azure Static Web Apps
```

---

## 📊 **System Requirements**

### **Minimum Requirements:**
- **Browser:** Chrome 70+, Edge 79+, Firefox 68+, Safari 12.1+
- **RAM:** 2GB free
- **Storage:** 100MB free space
- **OS:** Windows 10+, macOS 10.13+, Linux (any), Android 7+, iOS 11.3+

### **Recommended Requirements:**
- **Browser:** Latest Chrome or Edge
- **RAM:** 4GB+
- **Storage:** 500MB free space
- **Internet:** Stable connection for initial setup

---

## 🎯 **User Experience Flow**

```
1. 🎯 User visits website → 2. 📱 Sees install prompt → 3. 🏠 App on home screen
4. 🚀 Launches like native app → 5. 💾 Works offline → 6. 🔄 Auto-updates
7. 📱 Same experience everywhere → 8. 🎉 Happy user!
```

---

## 🆘 **Getting Help**

### **Common Issues & Solutions:**

**"Install button not showing":**
- Try refreshing the page
- Use Chrome or Edge browser
- Make sure you're on localhost or HTTPS

**"App not working after install":**
- Check internet connection
- Try reinstalling the PWA
- Clear browser cache

**"Data not syncing":**
- Check if backend is running
- Verify API endpoints
- Check browser console for errors

### **Debug Mode:**
```bash
# View detailed logs
docker-compose -f docker-compose.pwa.yml logs -f pwa

# Access container shell
docker-compose -f docker-compose.pwa.yml exec pwa sh

# Check service worker
# Open DevTools → Application → Service Workers
```

---

## 🎉 **Success! You're All Set!**

**Your Skola PWA is now installed and ready to use!** 🎓📚

### **What You Have:**
- ✅ **Installable app** on any device
- ✅ **Offline functionality** for core features
- ✅ **Cross-platform compatibility**
- ✅ **No app store dependencies**
- ✅ **Automatic updates**
- ✅ **Native app experience**

### **Share with Users:**
- **Web URL:** `http://localhost:8080` (or your deployed URL)
- **Installation:** Click "Install" in the browser
- **Offline:** Works without internet connection
- **Updates:** Automatic when online

**Enjoy your new PWA-powered Skola application!** 🚀📱

---

*Need help? Check the troubleshooting section or create an issue on GitHub.*
