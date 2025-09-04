# 🎓 Skola - University Communication Platform

A comprehensive fullstack application for university communication, built with React Native (Expo), Fastify, tRPC, and SQLite.

## 🚀 Quick Start Guide

**Choose your preferred setup method:**

### ⚡ Method 1: One-Command Setup (Recommended)
```bash
git clone <repository-url>
cd skola
chmod +x setup.sh start.sh stop.sh
./setup.sh
./start.sh
```
**That's it!** Your app will be running at `http://localhost:8085`

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

### 🐳 Method 3: Docker Setup (Alternative)

If you prefer Docker:

```bash
# Build and run with Docker
docker-compose -f docker-compose.dev.yml up --build

# Or use the npm script
bun run docker:dev
```

**Access URLs:**
- **Web App**: http://localhost:8085
- **API**: http://localhost:3000
- **Mobile**: Use Expo Go app and scan QR code

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

### Web Deployment
```bash
# Build for web production
bun run build

# Deploy to:
# - Vercel: Connect your GitHub repo
# - Netlify: Drag & drop the 'dist' folder
# - Firebase: Use Firebase Hosting
# - Any static web host
```

### Mobile App Deployment
```bash
# Build for mobile
npx expo build:android  # For Android
npx expo build:ios      # For iOS

# Or use Expo Application Services (EAS)
npx eas build --platform android
npx eas build --platform ios
```

### Full-Stack Deployment
```bash
# Use Docker for production
docker-compose -f docker-compose.prod.yml up -d

# Or deploy to:
# - Railway
# - Render
# - AWS/GCP/Azure
# - DigitalOcean App Platform
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

### Getting Help
1. **Check the logs**: `bun run docker:logs`
2. **View database**: `bun run db:studio`
3. **Restart services**: `./stop.sh && ./start.sh`
4. **Create an issue** on GitHub with error details

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
├── app/                    # Expo/React Native app
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── ...                # Other screens
├── backend/               # Fastify API server
│   ├── db/               # Database schemas & migrations
│   ├── src/              # Server source code
│   └── package.json      # Backend dependencies
├── components/           # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
├── constants/           # App constants (colors, etc.)
├── types/               # TypeScript type definitions
├── setup.sh             # One-time setup script
├── start.sh             # Application startup script
└── stop.sh              # Application shutdown script
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