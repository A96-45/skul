# 🎓 Skola - University Communication Platform

**"Your Complete University Management Solution"**

[![📋 Project Overview](https://img.shields.io/badge/📋_Project_Overview-PROJECT_OVERVIEW.md-blue?style=for-the-badge)](PROJECT_OVERVIEW.md)
[![📖 Developer Guide](https://img.shields.io/badge/📖_Developer_Guide-Developer.md-green?style=for-the-badge)](Developer.md)
[![🚀 Production Ready](https://img.shields.io/badge/🚀_Production_Deployment-PRODUCTION_DEPLOYMENT.md-red?style=for-the-badge)](PRODUCTION_DEPLOYMENT.md)

A comprehensive fullstack application for university communication, built with React Native (Expo), Fastify, tRPC, and SQLite.

## 📊 **Current Status: Development → Production Ready**

### ✅ **What's Working Now**
- ✅ **Real Database Integration** - SQLite with Drizzle ORM
- ✅ **JWT Authentication** - Secure user registration/login
- ✅ **Cross-Platform Support** - Mobile (iOS/Android) + Web
- ✅ **Expo Tunnel Working** - QR code generation for mobile testing
- ✅ **Clean Architecture** - Well-organized, documented codebase
- ✅ **Type-Safe APIs** - tRPC with end-to-end TypeScript

### ⚠️ **Production Readiness Checklist**
- 🔄 **Database**: SQLite → PostgreSQL (for scalability)
- 🔄 **Security**: Add rate limiting, security headers
- 🔄 **File Storage**: Cloud storage for user uploads
- 🔄 **Monitoring**: Logging and error tracking
- 🔄 **Backup**: Automated data backup system
- 🔄 **CI/CD**: Automated testing and deployment

**📖 [Complete Production Guide](PRODUCTION_DEPLOYMENT.md)**

## 🚀 Quick Start Guide

### ⚡ Method 1: One-Command Setup (Recommended)
```bash
git clone <repository-url>
cd skola
chmod +x setup.sh start.sh stop.sh
./setup.sh
./start.sh
```
**That's it! 🎉** Your app will be running at `http://localhost:8085`

### 📖 Method 2: Developer Quick Start
For a detailed development setup guide:
- **[🚀 Developer Quick Start](DEVELOPER_QUICK_START.md)** - Get coding in 5 minutes
- **[📋 Project Overview](PROJECT_OVERVIEW.md)** - Complete project understanding
- **[📖 Technical Guide](Developer.md)** - Detailed technical documentation

---

### 🛠️ Method 2: Manual Setup (Step-by-Step)

#### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Bun** (recommended) - Install with: `curl -fsSL https://bun.sh/install | bash`
- **Git** - [Download here](https://git-scm.com/)

#### Installation Steps

1. **Clone the repository:**
```bash
git clone <repository-url>
cd skola
```

2. **Install dependencies:**
```bash
# Install frontend dependencies
bun install

# Install backend dependencies
cd backend
bun install
cd ..
```

3. **Setup the database:**
```bash
# Generate database schema
bun run db:generate

# Create and populate database
bun run db:push
```

4. **Create environment file (optional):**
```bash
# Create .env file (copy from docker.env if needed)
cp docker.env .env
# Edit .env with your preferred settings
```

#### Running the Application

**Option A: Manual Startup**
```bash
# Terminal 1: Start Backend API
cd backend && bun run dev

# Terminal 2: Start Frontend
bun run start
```

**Option B: Using Provided Scripts**
```bash
# Make scripts executable
chmod +x start.sh stop.sh

# Start application
./start.sh

# Stop application (when done)
./stop.sh
```

### 🐳 Method 3: Docker Setup (Recommended for Production)

Docker provides the easiest way to deploy and run Skola anywhere!

#### 🚀 Quick Docker Start
```bash
# Clone and setup
git clone <repository-url>
cd skola

# One-command setup and deployment
./setup.sh --docker
./deploy.sh
```

**That's it! 🎉** Your complete Skola system will be running with:
- **Frontend**: http://localhost:8085
- **Backend API**: http://localhost:3000
- **Database**: PostgreSQL on port 5432
- **Admin Panel**: http://localhost:5050 (PgAdmin)

#### 🐳 Docker Options

**Development with Docker:**
```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View status and logs
docker-compose -f docker-compose.dev.yml ps
docker-compose -f docker-compose.dev.yml logs -f
```

**Production Deployment:**
```bash
# Start production environment
docker-compose up -d --build

# Check health
curl http://localhost:3000/health/check
curl http://localhost:8085/health
```

**Docker Management:**
```bash
# Stop all services
docker-compose down

# Clean restart (removes volumes)
docker-compose down -v && docker-compose up -d --build

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### 🐳 Advanced Docker Features

**With Redis Caching:**
```bash
# Start with Redis for improved performance
docker-compose --profile with-cache up -d
```

**With Database Admin:**
```bash
# Start with PgAdmin for database management
docker-compose -f docker-compose.dev.yml --profile with-admin up -d
```

**With Reverse Proxy:**
```bash
# Start with Nginx reverse proxy
docker-compose -f docker-compose.dev.yml --profile with-proxy up -d
```

#### 🐳 Environment Configuration

**For Development:**
```bash
# Copy and customize
cp .env.example .env

# Edit with your settings
nano .env
```

**For Production:**
```bash
# Use production environment
cp .env.example .env.production

# ⚠️ IMPORTANT: Change these values for production:
# - DATABASE_URL: Use strong password
# - JWT_SECRET: Use 64+ character random string
# - CORS_ORIGIN: Restrict to your domain
```

#### 🐳 Docker Benefits

✅ **Easy Deployment** - Works on any computer with Docker
✅ **Production Ready** - Optimized containers with health checks
✅ **Database Included** - PostgreSQL with automatic setup
✅ **Development Features** - Hot reload, debugging, admin tools
✅ **Scalable** - Easy to deploy to cloud platforms
✅ **Isolated** - No dependency conflicts with your system

---

## 📱 How to Use the Application

### For Students:
1. **Register/Login** with your student email
2. **Select your role** (Student)
3. **Complete profile setup** with your admission number
4. **Browse and enroll** in available units
5. **Access assignments**, announcements, and study materials

### For Lecturers:
1. **Register/Login** with your lecturer email
2. **Select your role** (Lecturer)
3. **Create and manage** course units
4. **Post assignments** and announcements
5. **Grade submissions** and manage enrollments

### Mobile Testing:
1. Install **Expo Go** app on your phone
2. Run `bun run start:mobile` or use the start script
3. Scan the QR code with your phone's camera
4. Test the mobile interface!

---

## 🏗️ Architecture Overview

### Frontend (Mobile & Web)
- **Framework**: React Native with Expo
- **State Management**: Zustand + tRPC React Query
- **UI Components**: React Native + NativeWind (Tailwind CSS)
- **Routing**: Expo Router
- **Type Safety**: TypeScript

### Backend (API)
- **Framework**: Fastify (High-performance Node.js framework)
- **API**: tRPC (Type-safe API layer)
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas

### Database Schema
- **Users**: Students and lecturers with authentication
- **Units**: Course units with enrollment management
- **Assignments**: Coursework and submissions
- **Announcements**: Course communications
- **Documents**: File sharing and resources
- **Groups**: Student collaboration groups
- **Notifications**: Real-time updates

---

## 📋 Available Commands

### Quick Commands
```bash
./setup.sh          # One-time setup
./start.sh          # Start application
./stop.sh           # Stop application
```

### Manual Commands

**Frontend:**
- `bun run start` - Start development server (web)
- `bun run start:mobile` - Start for mobile development
- `bun run build` - Build for production

**Backend:**
- `bun run backend:dev` - Start backend development server
- `bun run db:generate` - Generate database migrations
- `bun run db:push` - Apply migrations to database
- `bun run db:studio` - Open Drizzle Studio for database management

**Docker:**
- `bun run docker:dev` - Start with Docker (development)
- `bun run docker:prod` - Start with Docker (production)
- `bun run docker:down` - Stop Docker containers

---

## 🔑 Authentication & User Roles

### User Types
- **Students**: Can enroll in units, submit assignments, access materials
- **Lecturers**: Can create units, post assignments, manage students

### Authentication Flow
1. **Register** with email and password
2. **Select role** (Student/Lecturer)
3. **Complete profile** (admission number for students)
4. **Access role-specific features**

### API Examples
```typescript
// Register new user
trpc.auth.register.mutate({
  email: "student@university.edu",
  password: "securepassword",
  name: "John Doe",
  role: "student",
  admissionNumber: "12345"
})

// Login
trpc.auth.login.mutate({
  email: "student@university.edu",
  password: "securepassword"
})
```

---

## 🛠️ Development & Customization

### Environment Setup
Create `.env` file in root directory:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this
DATABASE_URL=./backend/db/skola.db
```

### Database Management
```bash
# Generate new migrations after schema changes
bun run db:generate

# Apply migrations to database
bun run db:push

# View/edit database with GUI
bun run db:studio
```

### Adding New Features

1. **Database Schema** (backend/db/schema.js):
```javascript
// Add new table or modify existing
export const newTable = table('new_table', {
  id: text('id').primaryKey(),
  // ... fields
})
```

2. **API Routes** (backend/src/routes/):
```javascript
// Add new endpoint
export const newFeatureRoute = {
  method: 'GET',
  url: '/api/new-feature',
  handler: async (request, reply) => {
    // Implementation
  }
}
```

3. **Frontend Integration**:
```typescript
// Use in React components
const { data } = trpc.newFeature.getData.useQuery()
```

---

## ✨ Key Features

### 🎓 Student Features
- ✅ **Unit Enrollment**: Browse and join course units
- ✅ **Assignment Management**: View, download, and submit assignments
- ✅ **Announcement Access**: Stay updated with course communications
- ✅ **Document Sharing**: Access study materials and resources
- ✅ **Study Groups**: Collaborate with classmates
- ✅ **Progress Tracking**: Monitor grades and academic progress

### 👨‍🏫 Lecturer Features
- ✅ **Unit Management**: Create and manage course units
- ✅ **Assignment Creation**: Post assignments with deadlines
- ✅ **Student Management**: View enrollments and student progress
- ✅ **Resource Upload**: Share documents and course materials
- ✅ **Announcement System**: Post course updates and notices
- ✅ **Grade Management**: Review and grade submissions

### 🌟 General Features
- ✅ **Cross-Platform**: Works on mobile (iOS/Android) and web
- ✅ **Real-time Updates**: Live notifications and updates
- ✅ **File Management**: Upload/download documents and assignments
- ✅ **Search & Filter**: Find units, assignments, and resources quickly
- ✅ **User Profiles**: Manage personal information and preferences
- ✅ **Responsive Design**: Optimized for all screen sizes

---

## 🚀 Deployment Options

### 🐳 Docker Deployment (Recommended)

**One-Command Production Deployment:**
```bash
# Setup and deploy everything
./setup.sh --production
./deploy.sh

# Your app will be live at http://localhost:8085
```

**Docker Cloud Deployment:**
```bash
# Deploy to any cloud platform with Docker support:

# AWS ECS/Fargate
aws ecs create-service --service-name skola \
  --task-definition skola-task \
  --desired-count 1

# Google Cloud Run
gcloud run deploy skola \
  --source . \
  --platform managed \
  --allow-unauthenticated

# DigitalOcean App Platform
# Just connect your GitHub repo with docker-compose.yml

# Railway
# Connect GitHub repo, Railway auto-detects Docker

# Render
# Create Web Service from Docker, point to your repo
```

### 🌐 Web Deployment
```bash
# Build for web production
bun run build

# Deploy to:
# - Vercel: Connect your GitHub repo
# - Netlify: Drag & drop the 'web-build' folder
# - Firebase: Use Firebase Hosting
# - Any static web host + API on Railway/Render
```

### 📱 Mobile App Deployment
```bash
# Build for mobile stores
npx expo build:android  # For Google Play Store
npx expo build:ios      # For Apple App Store

# Or use Expo Application Services (EAS)
npx eas build --platform android
npx eas build --platform ios

# Submit to stores
npx eas submit --platform android
npx eas submit --platform ios
```

### ☁️ Cloud Platform Deployment

**Backend API Deployment:**
```bash
# Railway (Recommended)
# 1. Connect GitHub repo
# 2. Deploy backend folder
# 3. Set environment variables
# 4. Get API URL for frontend

# Render
# 1. Create Web Service
# 2. Connect GitHub repo
# 3. Set build command: npm run build
# 4. Set start command: npm start
```

**Database Deployment:**
```bash
# Use managed PostgreSQL:
# - Railway PostgreSQL (Free tier available)
# - Render PostgreSQL
# - AWS RDS PostgreSQL
# - Google Cloud SQL
# - DigitalOcean Managed Databases
```

---

## 🔧 Troubleshooting

### Common Issues

**❌ "Port already in use"**
```bash
# Find process using port
lsof -i :3000  # or :8085

# Kill the process
kill -9 <PID>
```

**❌ "Database connection failed"**
```bash
# Reset database
bun run db:push

# Or delete and recreate
rm backend/db/skola.db
bun run db:generate
bun run db:push
```

**❌ "Dependencies installation failed"**
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lock
bun install

# Or use npm instead
npm install
```

**❌ "Expo app not connecting"**
```bash
# Clear Expo cache
npx expo start --clear

# Or use tunnel mode
npx expo start --tunnel
```

### Docker Troubleshooting

**❌ "Docker not running"**
```bash
# Start Docker service
sudo systemctl start docker  # Linux
# Or open Docker Desktop on Mac/Windows
```

**❌ "Port already in use"**
```bash
# Find what's using the port
lsof -i :3000  # or :8085, :5432

# Stop conflicting service or change ports in docker-compose.yml
docker-compose down
```

**❌ "Permission denied"**
```bash
# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
# Logout and login again, or run: newgrp docker
```

**❌ "Database connection failed"**
```bash
# Check database status
docker-compose logs postgres

# Reset database
docker-compose down -v  # Removes volumes
docker-compose up -d postgres
```

**❌ "Frontend not accessible"**
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

**❌ "Out of disk space"**
```bash
# Clean up Docker
docker system prune -a --volumes

# Or clean up specific images
docker-compose down --rmi all
```

### Getting Help
1. **Check the logs**: `docker-compose logs -f`
2. **View service status**: `docker-compose ps`
3. **Restart services**: `docker-compose restart`
4. **Clean restart**: `docker-compose down && docker-compose up -d`
5. **Create an issue** on GitHub with error details

---

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/skola`
3. **Create feature branch**: `git checkout -b feature/amazing-feature`
4. **Make changes** and test thoroughly
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**

### Code Standards
- Use TypeScript for type safety
- Follow existing code patterns
- Add comments for complex logic
- Test your changes before submitting
- Update documentation if needed

### Need Help Contributing?
- Check existing issues for ideas
- Read the Developer.md file for detailed technical docs
- Join our community discussions

---

## 📋 Project Structure

```
skola/
├── 📱 app/                    # React Native (Expo Router)
│   ├── (auth)/               # Authentication flow screens
│   ├── (tabs)/               # Main app navigation tabs
│   ├── unit/[id].tsx         # Dynamic unit detail pages
│   ├── assignment/[id].tsx   # Assignment detail pages
│   ├── group/[id].tsx        # Group detail pages
│   ├── _layout.tsx           # Root layout & navigation
│   └── +not-found.tsx        # 404 error page
│
├── 🔧 backend/               # Fastify API Server
│   ├── src/
│   │   ├── server.js         # Main server entry point
│   │   └── routes/           # tRPC route definitions
│   ├── db/
│   │   ├── schema.js         # Database schema (Drizzle ORM)
│   │   └── index.js          # Database connection
│   ├── drizzle.config.js     # Drizzle configuration
│   └── README.md             # Backend documentation
│
├── 🧩 components/            # Reusable UI Components
│   ├── Button.tsx            # Universal button component
│   ├── Input.tsx             # Form input with validation
│   ├── UnitCard.tsx          # Course unit display card
│   ├── AnnouncementCard.tsx  # Announcement display
│   ├── AssignmentCard.tsx    # Assignment display
│   ├── EmptyState.tsx        # Empty state placeholder
│   ├── TimetableWidget.tsx   # Schedule/timetable display
│   └── index.ts              # Component library exports
│
├── 🎣 hooks/                 # Custom React Hooks
│   ├── auth-store.ts         # Authentication state management
│   ├── units-store.ts        # Academic data management
│   └── use-profile-photo.ts  # Profile photo handling
│
├── 📊 lib/                   # Utilities & API Configuration
│   ├── trpc/                 # tRPC client setup
│   └── trpc-hooks.ts         # Auto-generated tRPC hooks
│
├── 🎨 constants/             # App Constants
│   └── colors.ts             # Color theme definitions
│
├── 📋 types/                 # TypeScript Definitions
│   ├── index.ts              # Core data models
│   └── store-types.ts        # Store state types
│
├── 🧪 mocks/                 # Development Mock Data
│   └── data.ts               # Sample users, units, etc.
│
├── 📚 providers/             # React Context Providers
│   └── app-providers.tsx     # Global state & API setup
│
├── 🛠️ setup.sh               # One-time project setup
├── 🚀 start.sh               # Development startup script
├── 🛑 stop.sh                # Development shutdown script
│
├── 📖 PROJECT_OVERVIEW.md    # Complete project overview
├── 🚀 DEVELOPER_QUICK_START.md # Quick development guide
├── 📖 Developer.md           # Technical documentation
└── 🐳 docker files          # Containerization configs
```

---

## 📝 License & Support

### License
This project is licensed under the **MIT License** - see the LICENSE file for details.

### Support
- 📧 **Issues**: [GitHub Issues](https://github.com/your-repo/skola/issues)
- 📖 **Documentation**: Check Developer.md for technical details
- 💬 **Community**: Join our discussions for help and feedback
- 🐛 **Bug Reports**: Include steps to reproduce and system info

---

## 🎉 Acknowledgments

Built with ❤️ for university communities worldwide using:
- **React Native** & **Expo** for cross-platform development
- **Fastify** for high-performance backend
- **tRPC** for type-safe APIs
- **SQLite** with **Drizzle ORM** for reliable data storage
- **NativeWind** for beautiful, responsive UI

**Happy coding! 🚀**