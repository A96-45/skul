# 🎓 Skola University Management System - Complete Developer Guide

## 📋 What This Guide Covers

This comprehensive developer guide provides:
- **Detailed breakdown of every file** and its purpose
- **Code connections and data flow** between components
- **Where to make changes** for specific features
- **Development workflows** and best practices
- **Troubleshooting** for common issues
- **Architecture decisions** and their rationale

---

## 🎓 Project Overview

Skola is a comprehensive university management system built as a full-stack application with React Native (Expo) frontend and Fastify backend. It provides features for both lecturers and students to manage courses, assignments, announcements, groups, and real-time timetables.

### 🏗️ Architecture Decision Records (ADRs)

1. **Frontend Framework**: React Native + Expo chosen for cross-platform mobile/web development
2. **Backend Framework**: Fastify over Express for better performance and developer experience
3. **State Management**: Zustand over Redux for simpler API and better TypeScript support
4. **API Layer**: tRPC for end-to-end type safety between frontend and backend
5. **Database**: SQLite + Drizzle ORM for development ease and production readiness
6. **Routing**: Expo Router for file-based routing with automatic deep linking

## 🏗️ Technology Stack & Architecture

### Frontend Technologies
- **React Native 0.79.1 + Expo**: Cross-platform mobile/web application framework
- **Expo Router ~5.0.7**: File-based routing system for React Native
- **TypeScript ~5.8.3**: Type-safe JavaScript for better development experience
- **Zustand ~5.0.8**: Lightweight state management solution
- **tRPC + React Query**: Type-safe API layer with intelligent caching
- **AsyncStorage 2.1.2**: Local data persistence for React Native
- **NativeWind ~4.1.23**: Tailwind CSS for React Native

### Backend Technologies
- **Fastify ~4.28.1**: High-performance Node.js web framework
- **tRPC ~11.5.0**: Type-safe API layer between frontend and backend
- **SQLite + Drizzle ORM**: Database and ORM for data persistence
- **JWT (jsonwebtoken ~9.0.2)**: Authentication and authorization
- **bcryptjs ~2.4.3**: Password hashing for security

### DevOps & Deployment
- **Docker + Podman Compose**: Containerization and orchestration
- **Nginx**: Reverse proxy for production deployment
- **Bun**: Fast JavaScript runtime and package manager
- **Drizzle Kit ~0.31.4**: Database migration and schema management

---

## 📁 DETAILED FILE-BY-FILE BREAKDOWN

### 🎯 Frontend Application (`/app/`)

#### **Root Layout & Navigation**
```
app/_layout.tsx
├── Purpose: Root layout component that wraps the entire app
├── Dependencies: SafeAreaProvider, Stack navigation setup
├── Key Features:
│   ├── Safe area handling for different devices
│   ├── Global error boundaries
│   └── Navigation container setup
├── Connections:
│   └── Provides layout for all screens in app/
├── Where to Modify:
│   ├── Add global modals or overlays
│   ├── Change app-wide navigation behavior
│   ├── Add global state providers
```

```
app/+not-found.tsx
├── Purpose: 404/error page for invalid routes
├── Dependencies: None (standalone component)
├── Key Features:
│   ├── User-friendly error messages
│   ├── Navigation back to home
│   └── Consistent error UI
├── Connections:
│   └── Automatically rendered by Expo Router
├── Where to Modify:
│   ├── Customize error messages
│   ├── Add error reporting
│   ├── Style error page
```

#### **Authentication Flow (`/app/(auth)/`)**
```
app/(auth)/_layout.tsx
├── Purpose: Layout for authentication screens
├── Dependencies: Stack navigation
├── Key Features:
│   ├── Clean authentication flow
│   ├── Prevents authenticated users from accessing auth screens
│   └── Consistent auth UI
├── Connections:
│   └── Wraps all auth screens (login, profile-setup, role-select)
├── Where to Modify:
│   ├── Add authentication guards
│   ├── Change auth flow navigation
│   ├── Add auth-related providers
```

```
app/(auth)/login.tsx
├── Purpose: User login form and authentication
├── Dependencies: useAuth hook, Button, Input components
├── Key Features:
│   ├── Email/password login form
│   ├── Form validation
│   ├── Error handling
│   ├── Navigation to role selection after login
├── Data Flow:
│   ├── Form Input → useAuth.login() → Auth Store → AsyncStorage
│   └── Success → Navigation to role-select
├── Connections:
│   └── Connects to auth-store.ts for authentication logic
├── Where to Modify:
│   ├── Add social login options
│   ├── Change validation rules
│   ├── Modify login UI/UX
│   ├── Add "Forgot Password" functionality
```

```
app/(auth)/role-select.tsx
├── Purpose: Role selection for new users (Student/Lecturer)
├── Dependencies: useAuth hook, Button component
├── Key Features:
│   ├── Role selection UI
│   ├── User onboarding flow
│   ├── Navigation to profile setup
├── Data Flow:
│   ├── Role Selection → useAuth.selectRole() → Auth Store
│   └── Success → Navigation to profile-setup
├── Connections:
│   └── Updates user role in auth-store.ts
├── Where to Modify:
│   ├── Add more user roles
│   ├── Change role selection UI
│   ├── Add role-specific information
│   ├── Modify onboarding flow
```

```
app/(auth)/profile-setup.tsx
├── Purpose: Complete user profile setup after role selection
├── Dependencies: useAuth hook, Button, Input components
├── Key Features:
│   ├── Profile completion form
│   ├── Role-specific fields (admission number for students)
│   ├── Form validation
│   ├── Navigation to main app
├── Data Flow:
│   ├── Form Data → useAuth.updateProfile() → Auth Store → AsyncStorage
│   └── Success → Navigation to main app (tabs)
├── Connections:
│   └── Updates user profile in auth-store.ts
├── Where to Modify:
│   ├── Add more profile fields
│   ├── Change validation rules
│   ├── Modify profile setup flow
│   ├── Add profile picture upload here
```

#### **Main App Tabs (`/app/(tabs)/`)**
```
app/(tabs)/_layout.tsx
├── Purpose: Tab navigation layout for main app
├── Dependencies: Tab navigation, useAuth hook
├── Key Features:
│   ├── Bottom tab navigation
│   ├── Role-based tab visibility
│   ├── Authentication guards
│   ├── Tab bar customization
├── Connections:
│   └── Guards access to main app, redirects to login if not authenticated
├── Where to Modify:
│   ├── Change tab order/structure
│   ├── Add new tabs
│   ├── Modify tab icons/labels
│   ├── Change role-based access rules
```

```
app/(tabs)/index.tsx
├── Purpose: Main dashboard/home screen
├── Dependencies: useAuth, useUnits hooks, TimetableWidget
├── Key Features:
│   ├── Role-based dashboard content
│   ├── Real-time timetable widget
│   ├── Quick actions and shortcuts
│   ├── Recent activity
├── Data Flow:
│   ├── Auth Store → Role-based UI rendering
│   ├── Units Store → Dashboard data
│   └── Real-time clock → Timetable updates
├── Connections:
│   └── Connects to auth-store.ts and units-store.ts
├── Where to Modify:
│   ├── Change dashboard layout
│   ├── Add new dashboard widgets
│   ├── Modify role-based content
│   ├── Add dashboard customizations
```

```
app/(tabs)/create.tsx
├── Purpose: Create new units (primarily for lecturers)
├── Dependencies: useAuth, useUnits hooks, Button, Input
├── Key Features:
│   ├── Unit creation form
│   ├── Lecturer invitation system
│   ├── Form validation
│   ├── Success/error handling
├── Data Flow:
│   ├── Form Data → useUnits.createUnit() → Units Store → API
│   └── Success → Navigation to unit detail page
├── Connections:
│   └── Connects to units-store.ts for unit management
├── Where to Modify:
│   ├── Add more unit fields
│   ├── Change creation workflow
│   ├── Modify lecturer invitation system
│   ├── Add unit templates
```

```
app/(tabs)/discover.tsx
├── Purpose: Discover and join available units
├── Dependencies: useAuth, useUnits hooks, UnitCard component
├── Key Features:
│   ├── Browse available units
│   ├── Search and filter units
│   ├── Unit enrollment
│   ├── Unit details preview
├── Data Flow:
│   ├── Units Store → Available units list
│   ├── User Action → useUnits.joinUnit() → API call
│   └── Success → Update user's enrolled units
├── Connections:
│   └── Connects to units-store.ts for unit discovery and enrollment
├── Where to Modify:
│   ├── Add search/filter functionality
│   ├── Change unit discovery UI
│   ├── Modify enrollment process
│   ├── Add unit categories/tags
```

```
app/(tabs)/units.tsx
├── Purpose: View and manage enrolled units
├── Dependencies: useAuth, useUnits hooks, UnitCard component
├── Key Features:
│   ├── List enrolled units
│   ├── Unit management options
│   ├── Quick access to unit content
│   ├── Role-based actions
├── Data Flow:
│   ├── Auth Store → User role and permissions
│   ├── Units Store → User's enrolled units
│   └── User Actions → Navigation to unit details
├── Connections:
│   └── Connects to units-store.ts and auth-store.ts
├── Where to Modify:
│   ├── Change units list layout
│   ├── Add unit management features
│   ├── Modify role-based permissions
│   ├── Add unit sorting/filtering
```

```
app/(tabs)/groups.tsx
├── Purpose: Manage study groups and collaborations
├── Dependencies: useAuth hook, GroupCard component
├── Key Features:
│   ├── View user's groups
│   ├── Create new groups
│   ├── Join existing groups
│   ├── Group management
├── Data Flow:
│   ├── Auth Store → User information
│   ├── User Actions → Group creation/joining API calls
│   └── Success → Update group memberships
├── Connections:
│   └── Connects to auth-store.ts for user context
├── Where to Modify:
│   ├── Add group creation forms
│   ├── Implement group discovery
│   ├── Add group management features
│   ├── Create group detail views
```

```
app/(tabs)/profile.tsx
├── Purpose: User profile management and settings
├── Dependencies: useAuth hook, useProfilePhoto hook, Button, Input
├── Key Features:
│   ├── Display user information
│   ├── Profile photo upload/management
│   ├── Edit profile functionality
│   ├── Account settings
├── Data Flow:
│   ├── Auth Store → User profile data
│   ├── Photo Upload → useProfilePhoto → File system/API
│   └── Profile Updates → useAuth.updateProfile() → API
├── Connections:
│   └── Connects to auth-store.ts and use-profile-photo.ts
├── Where to Modify:
│   ├── Add more profile fields
│   ├── Enhance photo upload features
│   ├── Add account settings
│   ├── Implement profile customization
```

#### **Dynamic Routes**
```
app/unit/[id].tsx
├── Purpose: Individual unit detail page
├── Dependencies: useAuth, useUnits hooks, various UI components
├── Key Features:
│   ├── Unit information display
│   ├── Assignments list
│   ├── Announcements
│   ├── Group discussions
│   ├── Role-based content
├── Data Flow:
│   ├── Route Parameter → Fetch unit data
│   ├── Auth Store → Role-based permissions
│   └── User Actions → Navigate to assignments/groups
├── Connections:
│   └── Connects to units-store.ts and auth-store.ts
├── Where to Modify:
│   ├── Change unit detail layout
│   ├── Add more unit features
│   ├── Modify role-based access
│   ├── Enhance unit content display
```

```
app/assignment/[id].tsx
├── Purpose: Individual assignment detail and submission
├── Dependencies: useAuth hook, assignment-related components
├── Key Features:
│   ├── Assignment details display
│   ├── Submission form (students)
│   ├── Grading interface (lecturers)
│   ├── File attachments
├── Data Flow:
│   ├── Route Parameter → Fetch assignment data
│   ├── Auth Store → Role-based UI
│   └── Submissions → File upload + API call
├── Connections:
│   └── Connects to auth-store.ts for user context
├── Where to Modify:
│   ├── Add file upload functionality
│   ├── Enhance submission workflow
│   ├── Implement grading system
│   ├── Add assignment feedback
```

```
app/group/[id].tsx
├── Purpose: Individual group detail and management
├── Dependencies: useAuth hook, group-related components
├── Key Features:
│   ├── Group information
│   ├── Member management
│   ├── Group discussions
│   ├── Shared resources
├── Data Flow:
│   ├── Route Parameter → Fetch group data
│   ├── Auth Store → Member permissions
│   └── Group Actions → API calls for updates
├── Connections:
│   └── Connects to auth-store.ts for user context
├── Where to Modify:
│   ├── Add group discussion features
│   ├── Implement member management
│   ├── Add shared file system
│   ├── Enhance group collaboration tools
```

### 🧩 Reusable Components (`/components/`)

#### **UI Components**
```
components/Button.tsx
├── Purpose: Reusable button component with multiple variants
├── Dependencies: React Native components, Colors
├── Key Features:
│   ├── Multiple variants (primary, outline, secondary)
│   ├── Loading states
│   ├── Icon support
│   ├── Size variants (small, medium, large)
├── Props Interface:
│   ├── title: string
│   ├── onPress: () => void
│   ├── variant?: 'primary' | 'outline' | 'secondary'
│   ├── size?: 'small' | 'medium' | 'large'
│   ├── loading?: boolean
│   ├── disabled?: boolean
│   ├── icon?: ReactNode
│   └── fullWidth?: boolean
├── Where to Modify:
│   ├── Add new button variants
│   ├── Change button styling
│   ├── Add new button features
│   ├── Modify loading animations
```

```
components/Input.tsx
├── Purpose: Reusable input component with validation
├── Dependencies: React Native components, Colors
├── Key Features:
│   ├── Text input with validation
│   ├── Icon support (left/right)
│   ├── Error state handling
│   ├── Multiline support
│   ├── Keyboard type options
├── Props Interface:
│   ├── label?: string
│   ├── placeholder?: string
│   ├── value: string
│   ├── onChangeText: (text: string) => void
│   ├── error?: string
│   ├── leftIcon?: ReactNode
│   ├── rightIcon?: ReactNode
│   ├── multiline?: boolean
│   ├── numberOfLines?: number
│   ├── keyboardType?: KeyboardTypeOptions
│   └── secureTextEntry?: boolean
├── Where to Modify:
│   ├── Add new input types
│   ├── Change validation styling
│   ├── Add input masks
│   ├── Modify error handling
```

### 🎣 Custom Hooks (`/hooks/`)

#### **Authentication Hook**
```
hooks/auth-store.ts
├── Purpose: Centralized authentication state management
├── Dependencies: AsyncStorage, createContextHook
├── Key Features:
│   ├── User authentication state
│   ├── Login/logout functionality
│   ├── Profile management
│   ├── Role-based permissions
│   ├── Persistent storage
├── State Interface:
│   ├── user: User | null
│   ├── loading: boolean
│   ├── isAuthenticated: boolean
│   ├── isProfileComplete: boolean
├── Methods:
│   ├── login(email, password): Promise<Result>
│   ├── logout(): Promise<void>
│   ├── selectRole(role): User
│   ├── updateProfile(data): Result
├── Data Persistence:
│   └── AsyncStorage for offline user data
├── Where to Modify:
│   ├── Add new authentication methods
│   ├── Change user data structure
│   ├── Add authentication guards
│   ├── Modify role permissions
│   ├── Add token refresh logic
```

#### **Units Management Hook**
```
hooks/units-store.ts
├── Purpose: Unit-related state management
├── Dependencies: createContextHook, Unit types
├── Key Features:
│   ├── Units data management
│   ├── Unit enrollment
│   ├── Unit creation
│   ├── Unit discovery
├── State Interface:
│   ├── units: Unit[]
│   ├── currentUnit: Unit | null
│   ├── enrolledUnits: Unit[]
│   ├── loading: boolean
├── Methods:
│   ├── createUnit(data): Promise<Result>
│   ├── joinUnit(unitId): Promise<Result>
│   ├── leaveUnit(unitId): Promise<Result>
│   ├── getUnit(unitId): Promise<Unit>
│   ├── getAvailableUnits(): Promise<Unit[]>
├── Where to Modify:
│   ├── Add unit filtering/search
│   ├── Change enrollment logic
│   ├── Add unit permissions
│   ├── Modify unit data structure
│   ├── Add offline unit caching
```

#### **Profile Photo Hook**
```
hooks/use-profile-photo.ts
├── Purpose: Handle profile photo upload functionality
├── Dependencies: expo-image-picker
├── Key Features:
│   ├── Camera permission handling
│   ├── Photo library access
│   ├── Image selection and cropping
│   ├── Error handling
├── Methods:
│   ├── pickImage(): Promise<string | null>
│   ├── takePhoto(): Promise<string | null>
│   ├── requestPermissions(): Promise<boolean>
├── Where to Modify:
│   ├── Change image quality settings
│   ├── Add image compression
│   ├── Modify cropping aspect ratio
│   ├── Add image filters
│   ├── Change permission handling
```

---

## 🛠️ DEVELOPMENT WORKFLOWS

### **Adding a New Feature**

1. **Plan the Feature:**
   - Define requirements and user stories
   - Design UI/UX mockups
   - Plan database schema changes
   - Identify required API endpoints

2. **Backend Development:**
   ```bash
   # Update database schema
   cd backend/db/schema.js  # Add new tables/columns

   # Generate migrations
   bun run db:generate

   # Create API routes
   cd backend/src/routes/
   # Add new route file or modify existing

   # Update main router
   cd backend/src/routes/app-router.js
   # Add new routes to router
   ```

3. **Frontend Development:**
   ```typescript
   // Add types (types/index.ts)
   interface NewFeature {
     id: string;
     name: string;
     // ... properties
   }

   // Add API hooks (lib/trpc-hooks.ts - auto-generated)
   // Add state management (hooks/new-feature-store.ts)
   // Add UI components (components/NewFeatureCard.tsx)
   // Add screens (app/new-feature/index.tsx)
   ```

4. **Testing:**
   - Test API endpoints with tRPC client
   - Test UI components with different props
   - Test user flows end-to-end
   - Test error scenarios

### **Database Schema Changes**

1. **Modify Schema:**
   ```javascript
   // backend/db/schema.js
   export const newTable = table('new_table', {
     id: text('id').primaryKey(),
     name: text('name').notNull(),
     // ... columns
   });
   ```

2. **Generate Migration:**
   ```bash
   cd backend
   bun run db:generate
   ```

3. **Apply Migration:**
   ```bash
   bun run db:push
   ```

4. **Update Types:**
   ```typescript
   // types/index.ts
   interface NewEntity {
     id: string;
     name: string;
     // ... properties
   }
   ```

### **Adding a New Screen**

1. **Create Screen Component:**
   ```typescript
   // app/new-screen.tsx
   import React from 'react';
   import { View, Text } from 'react-native';

   export default function NewScreen() {
     return (
       <View>
         <Text>New Screen</Text>
       </View>
     );
   }
   ```

2. **Add Navigation:**
   ```typescript
   // Update navigation in relevant layout files
   // Add to app/(tabs)/_layout.tsx for tab navigation
   // Or add to app/_layout.tsx for stack navigation
   ```

3. **Add Routing:**
   - Expo Router automatically creates routes based on file structure
   - File: `app/new-screen.tsx` → Route: `/new-screen`

### **Component Development**

1. **Create Component:**
   ```typescript
   // components/NewComponent.tsx
   interface NewComponentProps {
     title: string;
     onPress: () => void;
   }

   export default function NewComponent({ title, onPress }: NewComponentProps) {
     return (
       <Button title={title} onPress={onPress} />
     );
   }
   ```

2. **Add to Component Library:**
   - Export from components/index.ts (if exists)
   - Update component documentation
   - Add to component showcase (if exists)

3. **Usage in Screens:**
   ```typescript
   import NewComponent from '@/components/NewComponent';

   export default function SomeScreen() {
     return (
       <NewComponent
         title="Click me"
         onPress={() => console.log('Pressed!')}
       />
     );
   }
   ```

---

## 🚨 TROUBLESHOOTING GUIDE

### **Build Errors**

#### **Metro Bundler Issues**
```
Error: Unable to resolve module
```
**Solutions:**
1. Clear Metro cache: `npx expo start --clear`
2. Delete node_modules: `rm -rf node_modules && bun install`
3. Check import paths: Ensure `@/` paths are correct
4. Restart development server

#### **TypeScript Errors**
```
Type 'X' is not assignable to type 'Y'
```
**Solutions:**
1. Check type definitions in `types/index.ts`
2. Update interface properties
3. Add type assertions if necessary
4. Check tRPC type generation

### **Runtime Errors**

#### **tRPC Connection Issues**
```
Error: Failed to connect to API
```
**Solutions:**
1. Check backend server is running: `cd backend && bun run dev`
2. Verify API URL in `.env`: `EXPO_PUBLIC_API_URL=http://localhost:3000`
3. Check network connectivity
4. Restart both frontend and backend

#### **Database Connection Issues**
```
Error: Database connection failed
```
**Solutions:**
1. Check database file exists: `ls backend/db/`
2. Regenerate database: `bun run db:push`
3. Check file permissions
4. Restart backend server

### **UI/UX Issues**

#### **Component Not Rendering**
**Debug Steps:**
1. Check component imports
2. Verify props are passed correctly
3. Check conditional rendering logic
4. Inspect component state

#### **Styling Issues**
**Debug Steps:**
1. Check StyleSheet definitions
2. Verify Colors constants are imported
3. Check parent container styling
4. Use React Native Debugger

### **Performance Issues**

#### **Slow App Performance**
**Optimizations:**
1. Implement React.memo for components
2. Use useMemo for expensive calculations
3. Optimize images and assets
4. Implement proper loading states

#### **Memory Leaks**
**Solutions:**
1. Clean up event listeners
2. Cancel async operations on unmount
3. Use proper key props for lists
4. Monitor with React DevTools

---

## 📋 DEVELOPMENT CHECKLIST

### **Before Starting Development**
- [ ] Read this guide thoroughly
- [ ] Understand project architecture
- [ ] Set up development environment
- [ ] Review existing code patterns
- [ ] Check current issues/feature requests

### **During Development**
- [ ] Follow TypeScript strict mode
- [ ] Use existing UI components
- [ ] Implement proper error handling
- [ ] Add loading states
- [ ] Test on multiple screen sizes
- [ ] Follow naming conventions

### **Before Committing**
- [ ] Run linting: Check for ESLint errors
- [ ] Test functionality: Manual testing of features
- [ ] Check types: Ensure TypeScript compilation
- [ ] Update documentation: Modify this guide if needed
- [ ] Clean code: Remove console.logs and unused imports

### **Code Review Checklist**
- [ ] Code follows project patterns
- [ ] Proper error handling implemented
- [ ] UI is responsive and accessible
- [ ] Performance considerations addressed
- [ ] Documentation updated
- [ ] Tests added (if applicable)

---

## 🎯 ADVANCED TOPICS

### **Adding Real-time Features**

1. **WebSocket Integration:**
   ```typescript
   // Add to tRPC router
   export const realtimeRouter = createTRPCRouter({
     onMessage: publicProcedure.subscription(() => {
       return observable((emit) => {
         // WebSocket logic here
       });
     }),
   });
   ```

2. **Real-time UI Updates:**
   ```typescript
   // In React components
   const { data } = trpc.realtime.onMessage.useSubscription();

   useEffect(() => {
     if (data) {
       // Update UI with real-time data
     }
   }, [data]);
   ```

### **Offline Support**

1. **Data Caching:**
   ```typescript
   // Use React Query for caching
   const { data } = useQuery({
     queryKey: ['units'],
     queryFn: fetchUnits,
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

2. **Offline Storage:**
   ```typescript
   // Use AsyncStorage for offline data
   const saveOfflineData = async (data) => {
     await AsyncStorage.setItem('offline_data', JSON.stringify(data));
   };
   ```

### **Testing Strategy**

1. **Unit Tests:**
   ```typescript
   // __tests__/Button.test.tsx
   import { render, fireEvent } from '@testing-library/react-native';

   test('Button renders correctly', () => {
     const { getByText } = render(<Button title="Test" onPress={() => {}} />);
     expect(getByText('Test')).toBeTruthy();
   });
   ```

2. **Integration Tests:**
   ```typescript
   // Test user authentication flow
   test('User can login successfully', async () => {
     // Test login API call
     // Test navigation after login
     // Test user state update
   });
   ```

### **Deployment Pipeline**

1. **CI/CD Setup:**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   on: [push]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Install dependencies
           run: bun install
         - name: Run tests
           run: bun run test
         - name: Build
           run: bun run build
   ```

2. **Environment Configuration:**
   ```bash
   # Production environment variables
   EXPO_PUBLIC_API_URL=https://api.skola.com
   JWT_SECRET=production-secret-key
   DATABASE_URL=production-db-url
   ```

---

## 📞 SUPPORT & RESOURCES

### **Getting Help**
1. **Check this documentation first**
2. **Review existing code patterns**
3. **Check GitHub issues for similar problems**
4. **Use React Native Debugger for UI issues**
5. **Check tRPC DevTools for API issues**

### **Key Resources**
- **React Native Docs**: https://reactnative.dev/docs
- **Expo Documentation**: https://docs.expo.dev
- **tRPC Documentation**: https://trpc.io/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **NativeWind**: https://www.nativewind.dev

### **Community & Learning**
- **React Native Community**: Discord and forums
- **Expo Community**: GitHub discussions
- **TypeScript Community**: Stack Overflow and Reddit
- **Open Source**: Contribute back to improve the ecosystem

---

**🎉 Happy Coding!** This comprehensive guide should help you navigate and contribute to the Skola project effectively. Remember to update this documentation as the project evolves!


---

# 📋 Project Overview

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


---

# 🚀 Developer Quick Start Guide

# 🚀 Developer Quick Start Guide

**"Get Skola Running in 5 Minutes"**

---

## ⚡ **Quick Setup (Copy & Paste)**

```bash
# 1. Clone and setup
git clone <repository-url>
cd skola
chmod +x setup.sh start.sh stop.sh

# 2. One-command setup
./setup.sh

# 3. Start development
./start.sh

# 4. Open browser
# Frontend: http://localhost:8085
# Backend API: http://localhost:3000
```

**That's it! 🎉** Your Skola development environment is ready.

---

## 🔑 **Demo Accounts for Testing**

### **Student Account**
- **Email**: `john.doe@student.university.edu`
- **Password**: `password`

### **Lecturer Account**
- **Email**: `jane.smith@university.edu`
- **Password**: `password`

---

## 🛠️ **Development Workflow**

### **Adding a New Feature**

1. **📋 Plan the Feature**
   ```typescript
   // Define your data types first
   interface NewFeature {
     id: string;
     title: string;
     description: string;
   }
   ```

2. **🎨 Create UI Component**
   ```typescript
   // components/NewFeatureCard.tsx
   export default function NewFeatureCard({ feature }: { feature: NewFeature }) {
     return <View>{/* Your UI */}</View>;
   }
   ```

3. **📱 Add Screen**
   ```typescript
   // app/new-feature.tsx (automatic routing!)
   export default function NewFeatureScreen() {
     return <View>{/* Screen content */}</View>;
   }
   ```

4. **🔧 Add State Management**
   ```typescript
   // hooks/use-new-feature.ts
   export const [NewFeatureContext, useNewFeature] = createContextHook(() => {
     // Your state logic here
   });
   ```

5. **🔗 Connect to Backend** (when ready)
   ```typescript
   // Use tRPC for type-safe API calls
   const { data } = trpc.newFeature.getAll.useQuery();
   ```

### **Common Patterns Used in Skola**

#### **1. Screen with Auth Check**
```typescript
export default function ProtectedScreen() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <ActivityIndicator />;
  if (!isAuthenticated) return <Redirect href="/login" />;

  return <View>{/* Your screen content */}</View>;
}
```

#### **2. Role-Based UI**
```typescript
const isLecturer = user?.role === "lecturer";

return (
  <View>
    {isLecturer ? (
      <LecturerView />
    ) : (
      <StudentView />
    )}
  </View>
);
```

#### **3. Data Fetching Pattern**
```typescript
const { units, loading } = useUnits();

if (loading) return <Text>Loading...</Text>;

return (
  <FlatList
    data={units}
    renderItem={({ item }) => <UnitCard unit={item} />}
  />
);
```

---

## 📁 **Where to Find Things**

| What | Location | Purpose |
|------|----------|---------|
| **📱 Screens** | `app/` | UI screens (automatic routing) |
| **🧩 Components** | `components/` | Reusable UI elements |
| **🎣 State Logic** | `hooks/` | Data management & business logic |
| **📋 Types** | `types/` | TypeScript definitions |
| **🎨 Styling** | `constants/colors.ts` | App color scheme |
| **🧪 Mock Data** | `mocks/data.ts` | Sample data for development |
| **🔗 API Setup** | `lib/trpc/` | API client configuration |
| **🗄️ Database** | `backend/db/` | Schema & migrations |
| **🚀 API Routes** | `backend/src/routes/` | Backend endpoints |

---

## 🔧 **Common Development Tasks**

### **🎨 Changing Colors**
```typescript
// constants/colors.ts
export const Colors = {
  primary: "#1A73E8",      // Change this
  secondary: "#00BFA5",    // And this
  // ... rest of colors
};
```

### **📱 Adding a New Screen**
```typescript
// app/new-screen.tsx
export default function NewScreen() {
  return <Text>My New Screen</Text>;
}
// ✨ Automatically available at /new-screen
```

### **🧩 Creating a Component**
```typescript
// components/MyButton.tsx
interface MyButtonProps {
  title: string;
  onPress: () => void;
}

export default function MyButton({ title, onPress }: MyButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

### **📊 Adding Mock Data**
```typescript
// mocks/data.ts
export const mockNewFeature = [
  {
    id: "1",
    title: "Sample Feature",
    description: "This is a sample",
  },
];
```

---

## 🐛 **Troubleshooting**

### **Port Already in Use**
```bash
# Kill process on port 8085 (frontend)
lsof -ti:8085 | xargs kill -9

# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9
```

### **Clear Cache & Restart**
```bash
# Clear all caches
rm -rf node_modules/.cache
bun run start --clear

# Or use the stop script
./stop.sh
```

### **Database Issues**
```bash
# Reset database
cd backend
bun run db:push

# View database
bun run db:studio
```

### **Expo Issues**
```bash
# Clear Expo cache
npx expo start --clear

# Use tunnel mode (for mobile testing)
npx expo start --tunnel
```

---

## 📚 **Learning Resources**

### **Key Files to Study**
1. **`app/_layout.tsx`** - App structure & navigation
2. **`providers/app-providers.tsx`** - Global state setup
3. **`hooks/auth-store.ts`** - Authentication logic
4. **`hooks/units-store.ts`** - Data management patterns
5. **`components/Button.tsx`** - Component patterns
6. **`types/index.ts`** - Data models

### **Recommended Reading Order**
1. **PROJECT_OVERVIEW.md** - High-level understanding
2. **Developer.md** - Detailed technical guide
3. **This Quick Start** - Practical development
4. **Source Code** - Implementation details

---

## 🎯 **Development Best Practices**

### **✅ Do's**
- Use TypeScript for all new code
- Follow existing component patterns
- Add file headers for documentation
- Test on both mobile and web
- Use the existing color constants
- Follow the established folder structure

### **❌ Don'ts**
- Don't create new folders without purpose
- Don't duplicate existing components
- Don't hardcode colors or strings
- Don't ignore TypeScript errors
- Don't forget to update types when changing data

### **🔍 Code Review Checklist**
- [ ] TypeScript types are correct
- [ ] Component follows existing patterns
- [ ] File has proper header documentation
- [ ] Colors use the constants file
- [ ] No console.logs in production code
- [ ] Works on both mobile and web

---

## 🚀 **Next Steps**

### **Beginner Projects**
1. **Change the app colors** - Modify `constants/colors.ts`
2. **Add a new screen** - Create `app/test-screen.tsx`
3. **Create a component** - Build a custom button variant
4. **Add mock data** - Extend `mocks/data.ts`

### **Intermediate Projects**
1. **Implement a new feature** - Add notifications system
2. **Create role-based UI** - Different views for students/lecturers
3. **Add form validation** - Enhance existing forms
4. **Implement search/filter** - Add search functionality

### **Advanced Projects**
1. **Backend integration** - Connect to real tRPC endpoints
2. **Database design** - Add new entities and relationships
3. **Real-time features** - WebSocket integration
4. **Offline support** - Add offline data persistence

---

## 💬 **Need Help?**

### **Quick Help**
1. **Check PROJECT_OVERVIEW.md** for big picture
2. **Read Developer.md** for detailed docs
3. **Look at existing code** for patterns
4. **Check the troubleshooting section** above

### **Community Resources**
- **GitHub Issues** - Report bugs or request features
- **Developer.md** - Technical documentation
- **Source Code** - Learn from implementation
- **Expo Docs** - Framework-specific help

---

**🎉 Happy coding! You've got this! 🚀**


---

# 🚀 Production Deployment Guide

# 🚀 Production Deployment Guide

**Making Skola Production-Ready for Heavy Usage**

---

## 📊 **Current Status Assessment**

### ✅ **What's Working Now**
- ✅ Database connection enabled
- ✅ Real JWT authentication implemented
- ✅ User registration/login with database
- ✅ Unit management with enrollment
- ✅ Cross-platform mobile/web support
- ✅ Expo tunnel working for testing

### ⚠️ **Production Readiness Gaps**
- ❌ **Database**: SQLite won't handle heavy concurrent usage
- ❌ **File Storage**: No cloud storage for user uploads
- ❌ **Security**: Missing security headers and rate limiting
- ❌ **Monitoring**: No logging or error tracking
- ❌ **Backup**: No automated backup system
- ❌ **Caching**: No performance optimization
- ❌ **CI/CD**: No automated testing/deployment

---

## 🎯 **Immediate Production Fixes (What I Can Do Now)**

### **1. 🔄 Database Migration: SQLite → PostgreSQL**

**Problem**: SQLite can't handle concurrent users or heavy traffic
**Solution**: Migrate to PostgreSQL for production

```bash
# Install PostgreSQL dependencies
cd backend
bun add postgres @types/pg

# Update database configuration
# DATABASE_URL=postgresql://user:pass@localhost:5432/skola_prod
```

### **2. 🔐 Security Hardening**

**Problem**: Missing security headers and rate limiting
**Solution**: Add comprehensive security middleware

```javascript
// Add to backend/src/server.js
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

// Register security plugins
await fastify.register(helmet);
await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});
```

### **3. 📁 Cloud File Storage**

**Problem**: No file upload system for Gmail/phone storage
**Solution**: Add AWS S3 or Google Cloud Storage integration

```javascript
// File upload configuration
const uploadRouter = router({
  uploadFile: protectedProcedure
    .input(z.object({ file: z.any(), type: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Upload to S3/Google Cloud
      // Return secure URL
    })
});
```

### **4. 📊 Monitoring & Logging**

**Problem**: No visibility into system performance
**Solution**: Add structured logging and health checks

```javascript
// Add to backend/src/server.js
import pino from 'pino';

// Structured logging
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty'
  }
});
```

### **5. 🔄 Backup & Recovery System**

**Problem**: No data backup strategy
**Solution**: Automated database backups

```bash
# Add backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
# Upload to cloud storage
```

---

## 🏗️ **Complete Production Setup (Step-by-Step)**

### **Phase 1: Database & Security (Day 1)**

```bash
# 1. Install production dependencies
cd backend
bun add postgres @types/pg @fastify/helmet @fastify/rate-limit pino

# 2. Update database schema for PostgreSQL
# backend/db/schema.js - change sqliteTable to pgTable

# 3. Add security middleware
# backend/src/server.js - add helmet and rate limiting

# 4. Setup environment variables
cp .env.example .env.production
# Edit with production values
```

### **Phase 2: File Storage & Monitoring (Day 2)**

```bash
# 1. Add file storage service
bun add aws-sdk multer @types/multer

# 2. Create file upload router
# backend/src/routes/upload-router.js

# 3. Add monitoring
bun add @sentry/node @sentry/react-native

# 4. Setup error tracking
# Initialize Sentry in both frontend and backend
```

### **Phase 3: Performance & Scaling (Day 3)**

```bash
# 1. Add Redis for caching
bun add redis @types/redis

# 2. Implement caching layer
# Cache frequently accessed data (units, user profiles)

# 3. Add connection pooling
# Configure PostgreSQL connection pool

# 4. Optimize queries
# Add database indexes for performance
```

### **Phase 4: Deployment & CI/CD (Day 4)**

```bash
# 1. Setup Docker production build
# Update docker-compose.prod.yml

# 2. Configure reverse proxy (nginx)
# Production nginx configuration

# 3. Setup CI/CD pipeline
# GitHub Actions or similar

# 4. Add health checks and monitoring
# Application monitoring dashboard
```

---

## 📱 **Mobile & Gmail Integration Solutions**

### **Gmail/Phone Storage Integration**

**Current**: AsyncStorage (local device only)
**Production**: Cloud sync with user accounts

```typescript
// Production data sync
const syncUserData = async (userId: string) => {
  // Sync local data with cloud
  // Backup to Google Drive/Gmail
  // Multi-device synchronization
};
```

### **Cross-Device Data Access**

```typescript
// Cloud data management
interface CloudStorage {
  uploadFile(file: File): Promise<string>;
  downloadFile(url: string): Promise<File>;
  syncData(userId: string): Promise<void>;
  backupData(userId: string): Promise<void>;
}
```

---

## 🚀 **Quick Production Setup (What I Can Implement Now)**

Let me implement the most critical production features:

### **1. Real Database Integration**
- ✅ Enable database connection (done)
- ✅ Implement auth with real DB (done)
- 🔄 Migrate to PostgreSQL (next)

### **2. Security Basics**
```javascript
// Add to backend/src/server.js
await fastify.register(require('@fastify/helmet'));
await fastify.register(require('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
});
```

### **3. File Upload System**
```javascript
// Add file upload capability
const uploadRouter = router({
  uploadAvatar: protectedProcedure
    .input(z.object({ file: z.any() }))
    .mutation(async ({ ctx, input }) => {
      // Save to local storage initially
      // Later migrate to cloud storage
    })
});
```

### **4. Error Handling & Logging**
```javascript
// Structured error responses
const handleError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message
  };
};
```

---

## 📈 **Scaling Strategy**

### **Immediate (Week 1)**
- ✅ Database connection enabled
- ✅ Real authentication implemented
- 🔄 PostgreSQL migration
- 🔄 Basic security headers
- 🔄 File upload system

### **Short-term (Month 1)**
- 🔄 Cloud file storage (AWS S3)
- 🔄 Redis caching
- 🔄 Comprehensive logging
- 🔄 Automated backups
- 🔄 Rate limiting

### **Medium-term (Months 2-3)**
- 🔄 Multi-region deployment
- 🔄 Advanced monitoring
- 🔄 CI/CD pipeline
- 🔄 Performance optimization
- 🔄 Mobile push notifications

### **Long-term (Months 4-6)**
- 🔄 Advanced analytics
- 🔄 Machine learning features
- 🔄 Third-party integrations
- 🔄 Mobile app store deployment
- 🔄 Enterprise features

---

## 🔧 **What I Can Implement Right Now**

### **Immediate Actions I Can Take:**

1. **Enable PostgreSQL Support**
   - Update database schema for PostgreSQL
   - Add connection pooling
   - Migration scripts

2. **Add Security Middleware**
   - Helmet for security headers
   - Rate limiting
   - CORS configuration
   - Input validation

3. **Implement File Upload System**
   - Basic file upload to server
   - File type validation
   - Storage management
   - Ready for cloud migration

4. **Add Comprehensive Logging**
   - Structured logging with Pino
   - Request/response logging
   - Error tracking
   - Performance monitoring

5. **Setup Backup System**
   - Automated database backups
   - File backup scripts
   - Recovery procedures

Let me implement these critical features now!

---

## 🎯 **Bottom Line**

**Your app CAN be made production-ready for heavy usage**, but it needs these critical upgrades:

### **✅ Already Working:**
- Authentication system with JWT
- Database integration
- Cross-platform support
- Expo tunnel working

### **🔄 What I Can Fix Now:**
- Database scalability (PostgreSQL)
- Security hardening
- File upload system
- Monitoring & logging
- Backup system

### **📅 Production Timeline:**
- **Week 1**: Core production features
- **Month 1**: Full production readiness
- **Months 2-3**: Advanced scaling features

**Would you like me to implement the immediate production fixes now?**


---

# 🐳 Comprehensive Deployment Guide

# 🚀 Skola PWA Deployment Guide

**Deploy Skola as an Installable Progressive Web App - Works Everywhere!**

---

## 📱 **What Makes Skola Special?**

Skola uses **Progressive Web App (PWA) technology** to provide:
- ✅ **Native App Experience** - Install on any device like a real app
- ✅ **Cross-Platform** - Works on Windows, Mac, Linux, Android, iOS
- ✅ **Offline Functionality** - Use without internet connection
- ✅ **No App Stores** - Direct installation from browser
- ✅ **Automatic Updates** - Always get latest features
- ✅ **Zero Cost Hosting** - Host on free platforms

---

## 📋 **Quick Deployment Options**

| Deployment Type | Difficulty | Cost | Time | Best For |
|---|---|---|---|---|
| **PWA + Docker** | ⭐⭐ | **FREE** | ⏱️ 10min | **Recommended** - Complete solution |
| **GitHub Pages** | ⭐ | **FREE** | ⏱️ 5min | Free static hosting |
| **Netlify** | ⭐⭐ | **FREE** | ⏱️ 5min | Advanced features |
| **Vercel** | ⭐⭐ | **FREE** | ⏱️ 5min | Fast deployment |
| **Railway** | ⭐⭐⭐ | 💰 | ⏱️ 15min | Full-stack hosting |
| **Self-Hosted** | ⭐⭐⭐ | 💰 | ⏱️ 20min | Complete control |

---

## 🎯 **Option 1: PWA + Docker (Recommended - 10 minutes)**

### Why PWA + Docker?
- ✅ **Complete offline solution** - Works without internet
- ✅ **Installable on any device** - No app stores needed
- ✅ **Local data storage** - Your data stays on your device
- ✅ **Cross-platform** - Windows, Mac, Linux, Android, iOS
- ✅ **Zero hosting costs** - Run locally or use free tiers
- ✅ **Full control** - Your own backend and database

### Step-by-Step Deployment

1. **Install Docker**
   ```bash
   # Install Docker if not already installed
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo systemctl start docker
   ```

2. **Clone and Setup**
   ```bash
   # Clone the repository
   git clone <your-repo-url>
   cd skola
   ```

3. **Start PWA + Backend**
   ```bash
   # Start all services
   docker-compose -f docker-compose.pwa.yml up -d

   # Check if everything is running
   docker-compose -f docker-compose.pwa.yml ps
   ```

4. **Access Your PWA**
   - Open browser: `http://localhost:8080`
   - Click "Install Skola" when prompted
   - App installs on your device!

5. **Verify Installation**
   ```bash
   # Check health endpoints
   curl http://localhost:3000/health/check
   curl http://localhost:8080/health
   ```

6. **Optional: Database Admin**
   ```bash
   # Start with PgAdmin for database management
   docker-compose -f docker-compose.pwa.yml --profile with-admin up -d
   # Access at: http://localhost:5050
   ```

**✅ Result**: Your installable PWA is ready at `http://localhost:8080`

---

## ☁️ **Option 2: Azure Container Instances (25 minutes)**

### Why Azure ACI?
- ✅ **Serverless containers** - No infrastructure management
- ✅ **Azure Database for PostgreSQL** included
- ✅ **Integrated security** with Azure Key Vault
- ✅ **Microsoft ecosystem** - Great if you use other Microsoft services
- ✅ **Pay-per-second** billing

### Prerequisites
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login
```

### One-Command Deployment
```bash
# Deploy everything to Azure
./deploy-azure.sh
```

### What Gets Created
- **Azure Container Registry** (ACR) - Private container registry
- **Azure Database for PostgreSQL** - Managed database
- **Azure Key Vault** - Secure secrets storage
- **Azure Container Instances** - Serverless containers
- **Azure Application Gateway** (optional) - Load balancing and SSL

### Access Your App
- **Web App**: `http://skola-frontend-[timestamp].[region].azurecontainer.io`
- **API**: `https://skola-backend-[timestamp].[region].azurecontainer.io:3000`
- **Database**: Managed PostgreSQL with connection pooling

### Azure Benefits
- ✅ **No server management** - Azure handles everything
- ✅ **Auto-scaling** - Scales based on demand
- ✅ **Enterprise security** - Azure Active Directory integration
- ✅ **Microsoft 365 integration** - Perfect for university environments
- ✅ **Compliance ready** - Meets enterprise security standards

---

## 🐳 **Option 3: Docker Self-Hosted (20 minutes)**

### Perfect for:
- VPS hosting (DigitalOcean, Linode, etc.)
- Local servers
- Full control over infrastructure

### Prerequisites
```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### One-Command Deployment
```bash
# Clone and deploy
git clone <your-repo-url>
cd skola
chmod +x deploy.sh

# Deploy everything
./deploy.sh
```

### Manual Docker Deployment
```bash
# Build and start all services
docker-compose up -d --build

# Check everything is running
docker-compose ps
docker-compose logs -f

# Run database migrations
docker-compose exec backend npm run db:push
```

### Access Your App
- **Web App**: http://your-server-ip:8085
- **API**: http://your-server-ip:3000
- **Database**: your-server-ip:5432

### Production Optimizations
```bash
# Enable SSL with Let's Encrypt
sudo certbot --nginx -d yourdomain.com

# Setup firewall
sudo ufw allow 80,443,8085,3000
sudo ufw enable

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/skola
```

---

## ☁️ **Option 4: AWS ECS Fargate (30 minutes)**

### For Enterprise Deployments

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS
aws configure

# Deploy to ECS
# 1. Create ECR repository
aws ecr create-repository --repository-name skola

# 2. Build and push Docker images
docker build -t skola-backend ./backend
docker build -t skola-frontend .

# 3. Deploy to ECS (see detailed AWS guide below)
```

---

## 📱 **Mobile App Distribution**

### Build for App Stores

```bash
# Install EAS CLI
npm install -g @expo/cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### OTA Updates (Over-The-Air)

```bash
# Configure for updates
npx expo install expo-updates

# Build update
eas update --branch production --message "Bug fixes and improvements"

# Users get updates automatically
```

---

## 🌐 **Option 5: Web Deployment Options**

### Vercel + Railway (Hybrid)

```bash
# Deploy frontend to Vercel
npm i -g vercel
vercel

# Deploy backend to Railway
# (Follow Railway steps above)

# Update frontend environment
VERCEL_ENV=production
VERCEL_API_URL=https://your-railway-app.up.railway.app
```

### Netlify + Railway

```bash
# Build web version
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=web-build
```

---

## 🔧 **Environment Configuration**

### Production Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/skola_prod
DB_SSL=true

# Security
JWT_SECRET=your-64-character-super-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# API Configuration
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/app/uploads

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
```

### Mobile App Configuration

```javascript
// app.json
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-production-api.com",
      "trpcUrl": "https://your-production-api.com/trpc",
      "environment": "production"
    }
  }
}
```

---

## 📊 **Monitoring & Maintenance**

### Health Checks

```bash
# API Health Check
curl https://your-api.com/health/check

# Database Health Check
curl https://your-api.com/health/metrics

# Docker Health Checks
docker-compose ps
docker stats
```

### Backup Strategy

```bash
# Database Backup
docker-compose exec postgres pg_dump -U skola_user skola_prod > backup_$(date +%Y%m%d).sql

# File Backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/

# Automated Backups (crontab)
0 2 * * * /path/to/backup-script.sh
```

### Log Management

```bash
# View application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# System monitoring
docker stats
htop
```

---

## 🚀 **Scaling Strategies**

### Horizontal Scaling

```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Load balancer configuration
upstream backend {
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}
```

### Database Optimization

```bash
# Add database indexes
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_units_lecturer ON units(lecturer_id);

# Connection pooling
# Configure PostgreSQL with PgBouncer
```

### CDN Integration

```bash
# Cloudflare setup
# 1. Add your domain to Cloudflare
# 2. Configure DNS records
# 3. Enable SSL/TLS
# 4. Setup caching rules
```

---

## 🔒 **Security Checklist**

### Pre-Deployment
- [ ] Change default database passwords
- [ ] Use strong JWT secret (64+ characters)
- [ ] Configure CORS properly
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall rules
- [ ] Disable debug mode

### Production Security
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities
- [ ] Backup encryption
- [ ] Access control (least privilege)
- [ ] Rate limiting enabled

---

## 🆘 **Troubleshooting Guide**

### Common Issues

**❌ Database Connection Failed**
```bash
# Check database status
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

**❌ Port Already in Use**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change ports in docker-compose.yml
```

**❌ SSL Certificate Issues**
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

**❌ Mobile App Not Connecting**
```bash
# Check API endpoints
curl https://your-api.com/health/check

# Update app configuration
# Ensure CORS allows your app's origin
```

---

## 📈 **Performance Optimization**

### Frontend Optimizations
```bash
# Enable Expo optimizations
EXPO_WEB_PACKAGER_PROXY=true
EXPO_WEB_BUNDLE_ANALYZER=true

# Code splitting
# Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Backend Optimizations
```javascript
// Enable compression
await fastify.register(import('@fastify/compress'));

// Caching with Redis
const redis = require('redis');
const client = redis.createClient();

// Database query optimization
// Add indexes for frequently queried fields
```

### Database Optimizations
```sql
-- Add performance indexes
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_submissions_student ON submissions(student_id);

-- Query optimization
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

---

## 🎯 **Deployment Checklist**

### Pre-Deployment
- [ ] Code tested and working locally
- [ ] Environment variables configured
- [ ] Database schema migrated
- [ ] SSL certificates obtained
- [ ] Domain configured
- [ ] DNS records updated

### Post-Deployment
- [ ] Application accessible
- [ ] Database connections working
- [ ] File uploads functioning
- [ ] User registration/login working
- [ ] Mobile app connecting properly
- [ ] Performance monitoring setup
- [ ] Backup system configured

### Maintenance
- [ ] Regular security updates
- [ ] Performance monitoring
- [ ] Automated backups
- [ ] Log rotation
- [ ] Database maintenance

---

## 📞 **Support & Resources**

### Getting Help
- 📧 **Issues**: Create GitHub issue with error details
- 📖 **Docs**: Check this guide and Developer.md
- 💬 **Community**: Join discussions for help
- 🐛 **Debugging**: Include logs and system info

### Useful Commands
```bash
# Quick health check
curl -f https://your-app.com/health/check

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update deployment
git pull && docker-compose up -d --build
```

---

**🎉 Your Skola deployment is complete! Your university management platform is now live and accessible worldwide.**

**Need help with any step? Check the troubleshooting section or create an issue on GitHub.**


---

# 🔄 Azure vs AWS Comparison

# ☁️ Azure vs AWS: Skola Deployment Comparison

## 🎯 **Which One Should You Choose?**

| Feature | Azure ACI | AWS ECS | Winner |
|---|---|---|---|
| **Ease of Use** | ⭐⭐⭐⭐ | ⭐⭐⭐ | **Azure** |
| **Cost** | 💰💰💰 (~$50-80/month) | 💰💰💰 (~$40-70/month) | **Similar** |
| **Microsoft Integration** | ⭐⭐⭐⭐⭐ | ⭐⭐ | **Azure** |
| **Learning Curve** | ⭐⭐⭐⭐ | ⭐⭐⭐ | **Azure** |
| **Enterprise Features** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Equal** |
| **Documentation** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Equal** |
| **Community Support** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **AWS** |

## 🎓 **For University/Academic Use**

### ✅ **Azure is Better If:**
- Your university uses **Microsoft 365** or **Azure AD**
- You need **compliance** with educational standards
- You prefer **simpler setup** and management
- You're new to cloud platforms
- You want **integrated security** with university systems

### ✅ **AWS is Better If:**
- You have **existing AWS experience**
- You need **maximum customization**
- You're building for **high-scale enterprise**
- You want **more service options**
- You're comfortable with **complex configurations**

## 💰 **Cost Comparison (Estimated Monthly)**

### Azure ACI Deployment:
- **Container Instances**: ~$30-50/month
- **PostgreSQL Database**: ~$20-30/month
- **Container Registry**: ~$5/month
- **Key Vault**: ~$1/month
- **Total**: **$56-86/month**

### AWS ECS Deployment:
- **ECS Fargate**: ~$25-40/month
- **RDS PostgreSQL**: ~$20-25/month
- **ECR**: ~$3/month
- **Secrets Manager**: ~$2/month
- **Total**: **$50-70/month**

## 🚀 **Deployment Time**

| Platform | Time | Difficulty |
|---|---|---|
| **Azure ACI** | ⏱️ 25 minutes | ⭐⭐⭐ |
| **AWS ECS** | ⏱️ 30 minutes | ⭐⭐⭐⭐ |

## 🛡️ **Security Features**

### Azure ACI:
- ✅ **Azure Key Vault** for secrets
- ✅ **Azure Active Directory** integration
- ✅ **Azure Security Center**
- ✅ **Compliance certifications** (ISO, SOC, etc.)
- ✅ **Network security groups**

### AWS ECS:
- ✅ **AWS Secrets Manager**
- ✅ **AWS IAM** fine-grained permissions
- ✅ **AWS Security Hub**
- ✅ **Compliance certifications**
- ✅ **Security groups & NACLs**

## 🔧 **Management & Monitoring**

### Azure ACI:
- ✅ **Azure Monitor** for logging
- ✅ **Azure Application Insights**
- ✅ **Simple scaling**
- ✅ **Integrated dashboards**

### AWS ECS:
- ✅ **CloudWatch** for monitoring
- ✅ **X-Ray** for tracing
- ✅ **Auto-scaling groups**
- ✅ **Detailed cost analytics**

## 🎯 **Recommendation for Skola**

### **Choose Azure ACI if:**
```bash
# You want the simplest deployment
./deploy-azure.sh
```

### **Choose AWS ECS if:**
```bash
# You need maximum control and scaling
./deploy-aws.sh
```

## 📊 **Bottom Line**

**For most university deployments, Azure ACI is the better choice because:**

1. **Simpler setup** - Less configuration required
2. **Better Microsoft integration** - Works great with university Microsoft accounts
3. **Equal performance** - Both handle production workloads well
4. **Similar costs** - No significant price difference
5. **Better for education** - Microsoft has strong education partnerships

## 🏃‍♂️ **Quick Start**

### For Azure (Recommended for universities):
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az login

# Deploy
./deploy-azure.sh
```

### For AWS (If you prefer):
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws configure

# Deploy
./deploy-aws.sh
```

## 🤔 **Still Not Sure?**

**Ask yourself:**
- Do you use Microsoft 365 at your university? → **Azure**
- Are you familiar with AWS? → **AWS**
- Do you want the simplest setup? → **Azure**
- Do you need maximum customization? → **AWS**

**Both will work perfectly for Skola! The choice is yours.** 🎉


---

# 📱 PWA Setup Guide

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
