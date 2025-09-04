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
