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
