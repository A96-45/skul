# 🎓 Skola - University Communication Platform

**"Your Complete University Management Solution"**

[![🚀 Quick Start](https://img.shields.io/badge/🚀_Quick_Start-./setup.sh-green?style=for-the-badge)](./setup.sh)
[![📖 Developer Guide](https://img.shields.io/badge/📖_Developer_Guide-Developer.md-blue?style=for-the-badge)](Developer.md)
[![📋 API Docs](https://img.shields.io/badge/📋_API_Docs-backend/README.md-orange?style=for-the-badge)](backend/README.md)

---

## 🎯 **What is Skola?**

**Skola** is a comprehensive university management platform that connects students and lecturers in a seamless digital ecosystem. Built with modern technologies, it provides everything needed for effective academic communication and course management.

### 🌟 **Key Features**
- **📚 Course Management**: Create, join, and manage university units
- **👥 Role-Based Access**: Separate experiences for students and lecturers
- **📝 Assignment System**: Submit, grade, and track assignments
- **📢 Announcements**: Real-time communication between lecturers and students
- **📁 Document Sharing**: Upload and share course materials
- **👨‍👩‍👧‍👦 Study Groups**: Collaborative learning spaces
- **📅 Timetable Integration**: Class schedules and reminders
- **📱 Cross-Platform**: Works on mobile (iOS/Android) and web

---

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   📱 Frontend   │    │   🔗 API Layer   │    │   🗄️ Database   │
│   React Native  │◄──►│     tRPC        │◄──►│   SQLite        │
│     + Expo      │    │   Fastify       │    │   Drizzle ORM   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Frontend Stack**
- **React Native 0.79.1** + **Expo** - Cross-platform mobile/web development
- **Expo Router** - File-based navigation system
- **TypeScript** - Type-safe development
- **Zustand** - Lightweight state management
- **NativeWind** - Tailwind CSS for React Native
- **React Query** - Intelligent data fetching and caching

### **Backend Stack**
- **Fastify** - High-performance Node.js framework
- **tRPC** - End-to-end type-safe APIs
- **SQLite** + **Drizzle ORM** - Database and migrations
- **JWT** - Authentication and authorization
- **Zod** - Schema validation

### **Development Tools**
- **Bun** - Fast JavaScript runtime and package manager
- **Drizzle Kit** - Database schema management
- **Expo CLI** - Development and build tools

---

## 👥 **User Roles & Permissions**

### **🎓 Student Features**
- ✅ Browse and enroll in available units
- ✅ Access course materials and documents
- ✅ View announcements and timetable
- ✅ Submit assignments and track progress
- ✅ Join study groups and collaborate
- ✅ View grades and academic progress

### **👨‍🏫 Lecturer Features**
- ✅ Create and manage course units
- ✅ Upload course materials and documents
- ✅ Post announcements and updates
- ✅ Create and grade assignments
- ✅ Manage student enrollments
- ✅ Track student progress and attendance

---

## 📁 **Project Structure**

```
skola/
├── 📱 app/                          # React Native App (Expo Router)
│   ├── (auth)/                      # Authentication Screens
│   │   ├── login.tsx               # Login Form
│   │   ├── role-select.tsx         # Student/Lecturer Selection
│   │   └── profile-setup.tsx       # Profile Completion
│   ├── (tabs)/                      # Main App Tabs
│   │   ├── index.tsx               # Dashboard/Home Screen
│   │   ├── units.tsx               # Units Management
│   │   ├── create.tsx              # Create New Units
│   │   ├── discover.tsx            # Browse Available Units
│   │   ├── groups.tsx              # Study Groups
│   │   └── profile.tsx             # User Profile
│   ├── unit/[id].tsx               # Individual Unit Details
│   ├── assignment/[id].tsx         # Assignment Details
│   └── group/[id].tsx              # Group Details
│
├── 🔧 backend/                      # Fastify API Server
│   ├── src/
│   │   ├── server.js               # Main Server Entry Point
│   │   ├── routes/
│   │   │   ├── app-router.js       # tRPC Route Definitions
│   │   │   └── create-context.js   # tRPC Context & Middleware
│   │   └── plugins/                # Fastify Plugins
│   └── db/
│       ├── schema.js               # Database Schema (Drizzle)
│       └── index.js                # Database Connection
│
├── 🧩 components/                   # Reusable UI Components
│   ├── Button.tsx                  # Universal Button Component
│   ├── Input.tsx                   # Form Input Component
│   ├── UnitCard.tsx                # Unit Display Card
│   ├── AnnouncementCard.tsx        # Announcement Display
│   ├── AssignmentCard.tsx          # Assignment Display
│   └── ...
│
├── 🎣 hooks/                        # Custom React Hooks
│   ├── auth-store.ts               # Authentication State
│   ├── units-store.ts              # Units Data Management
│   └── use-profile-photo.ts        # Profile Photo Handling
│
├── 📊 lib/                          # Utilities & Configuration
│   ├── trpc/                       # tRPC Client Setup
│   └── trpc-hooks.ts               # Auto-generated tRPC Hooks
│
├── 🎨 constants/                    # App Constants
│   └── colors.ts                   # Color Theme Definitions
│
├── 📋 types/                        # TypeScript Definitions
│   ├── index.ts                    # Main Type Definitions
│   └── store-types.ts              # Store State Types
│
├── 🧪 mocks/                        # Mock Data for Development
│   └── data.ts                     # Sample Users, Units, etc.
│
└── 🛠️ setup.sh                     # One-Command Setup Script
```

---

## 🚀 **Getting Started**

### **⚡ Quick Setup (Recommended)**
```bash
# Clone and setup everything automatically
git clone <repository-url>
cd skola
chmod +x setup.sh start.sh stop.sh
./setup.sh
./start.sh
```
**Access at**: `http://localhost:8085`

### **🔧 Manual Setup**
```bash
# Install dependencies
bun install
cd backend && bun install

# Setup database
bun run db:generate
bun run db:push

# Start development servers
bun run start        # Frontend (port 8085)
cd backend && bun run dev  # Backend (port 3000)
```

### **📱 Mobile Development**
```bash
# Install Expo Go app on your phone
bun run start:mobile

# Scan QR code with Expo Go
# Or use web browser for testing
bun run start:web
```

---

## 🔑 **Authentication Flow**

```
1. 📧 Register/Login → 2. 🎭 Select Role → 3. 👤 Complete Profile → 4. 🏠 Dashboard
```

### **Demo Accounts**
- **Student**: `john.doe@student.university.edu` / `password`
- **Lecturer**: `jane.smith@university.edu` / `password`

---

## 🎯 **Development Workflow**

### **🏗️ Adding New Features**
1. **Design**: Plan the feature and user experience
2. **Backend**: Update database schema and API routes
3. **Frontend**: Create components and screens
4. **Integration**: Connect frontend to backend APIs
5. **Testing**: Test across different user roles and devices

### **📱 Screen Development**
```typescript
// 1. Create screen in app/ directory
// app/new-feature.tsx
export default function NewFeatureScreen() {
  return <View>{/* Your UI */}</View>;
}

// 2. Navigation is automatic with Expo Router
// Access at: /new-feature
```

### **🧩 Component Development**
```typescript
// components/NewComponent.tsx
interface NewComponentProps {
  title: string;
  onPress: () => void;
}

export default function NewComponent({ title, onPress }: NewComponentProps) {
  return <Button title={title} onPress={onPress} />;
}
```

---

## 📊 **Data Model**

### **Core Entities**
- **👤 Users**: Students and lecturers with authentication
- **📚 Units**: Course units with enrollment management
- **📝 Assignments**: Coursework with submissions and grading
- **📢 Announcements**: Course communications and updates
- **📁 Documents**: File sharing and course materials
- **👥 Groups**: Student collaboration spaces
- **📅 Timetable**: Class schedules and venues
- **🔔 Notifications**: Real-time updates and alerts

### **Database Schema**
```javascript
// Key relationships in backend/db/schema.js
Users → Units (lecturer relationship)
Units → Students (many-to-many via unitStudents)
Units → Assignments, Announcements, Documents
Assignments → Submissions
Users → Groups (many-to-many via groupMembers)
```

---

## 🛠️ **Available Scripts**

```bash
# Development
./setup.sh          # One-time project setup
./start.sh          # Start all services
./stop.sh           # Stop all services

# Manual commands
bun run start       # Frontend development server
bun run start:web   # Web-only development
bun run start:mobile # Mobile development

# Backend
cd backend && bun run dev    # Backend development server
bun run db:generate          # Generate database migrations
bun run db:push             # Apply database migrations
bun run db:studio           # Open database GUI

# Build & Deploy
bun run build               # Build for production
bun run docker:dev          # Docker development setup
bun run docker:prod         # Docker production setup
```

---

## 🔍 **Key Files to Know**

| File | Purpose | Importance |
|------|---------|------------|
| `app/_layout.tsx` | Root app layout & navigation | 🔴 Critical |
| `providers/app-providers.tsx` | Global state & API setup | 🔴 Critical |
| `hooks/auth-store.ts` | Authentication state management | 🔴 Critical |
| `hooks/units-store.ts` | Units data management | 🔴 Critical |
| `components/Button.tsx` | Reusable button component | 🟡 Important |
| `components/Input.tsx` | Reusable input component | 🟡 Important |
| `backend/src/server.js` | API server entry point | 🔴 Critical |
| `backend/db/schema.js` | Database schema definition | 🔴 Critical |
| `types/index.ts` | TypeScript type definitions | 🔴 Critical |
| `mocks/data.ts` | Sample data for development | 🟡 Important |

---

## 🎉 **Welcome to Skola!**

This project represents a modern, scalable university management platform with:
- **🏆 Production-ready architecture**
- **📱 Cross-platform compatibility**
- **🔒 Type-safe development**
- **⚡ High-performance backend**
- **🎨 Beautiful, accessible UI**

Whether you're a developer looking to contribute, a lecturer managing courses, or a student learning new concepts, Skola provides the tools you need for effective academic communication.

### **📞 Need Help?**
- 📖 **Developer Guide**: [Developer.md](Developer.md)
- 🐛 **Issues**: GitHub Issues
- 💬 **Discussions**: GitHub Discussions
- 📧 **Support**: Project maintainers

---

**🚀 Ready to build the future of education? Let's get started!**
