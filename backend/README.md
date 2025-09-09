# 🚀 Skola Backend API

**Fastify + tRPC Backend for University Management**

---

## 📋 **Overview**

The Skola backend provides a type-safe API using Fastify and tRPC. It handles:
- User authentication and authorization
- Course/unit management
- Assignment submission and grading
- Announcements and notifications
- Document sharing and file management
- Real-time updates and notifications

## 🏗️ **Architecture**

```
Fastify Server (Port 3000)
├── tRPC Plugin (/trpc/*)
├── JWT Authentication
├── CORS Configuration
└── SQLite Database (Drizzle ORM)
```

## 🚀 **Quick Start**

```bash
# Install dependencies
bun install

# Setup database
bun run db:generate
bun run db:push

# Start development server
bun run dev

# View database
bun run db:studio
```

## 📡 **API Endpoints**

### **Health Check**
```
GET /health
```
Returns server status and health information.

### **tRPC Routes** (Type-Safe)
```
POST /trpc/*
```
All API calls go through tRPC for end-to-end type safety.

## 🗄️ **Database Schema**

### **Core Tables**
- `users` - Authentication and profiles
- `units` - Courses and classes
- `unit_students` - Enrollment relationships
- `assignments` - Coursework and grading
- `submissions` - Student submissions
- `announcements` - Course communications
- `documents` - File sharing
- `groups` - Study groups
- `notifications` - Real-time updates

### **Database Commands**
```bash
# Generate migrations
bun run db:generate

# Apply migrations
bun run db:push

# View/edit database
bun run db:studio
```

## 🔐 **Authentication**

### **JWT Tokens**
- Access tokens for API authentication
- Refresh tokens for session management
- Password hashing with bcrypt

### **Protected Routes**
```javascript
// In tRPC procedures
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('Not authenticated');
  }
  return next();
});
```

## 📝 **Adding New API Routes**

### **1. Define Route in Router**
```javascript
// backend/src/routes/app-router.js
export const appRouter = router({
  // Existing routes...

  // Add new route
  newFeature: router({
    getData: publicProcedure.query(() => {
      return { message: "New feature data" };
    }),
  }),
});
```

### **2. Update Database Schema** (if needed)
```javascript
// backend/db/schema.js
export const newTable = table('new_table', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});
```

### **3. Generate Migration**
```bash
bun run db:generate
bun run db:push
```

## 🧪 **Development**

### **Environment Variables**
```bash
# .env file
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=./db/skola.db
NODE_ENV=development
PORT=3000
```

### **Available Scripts**
```bash
bun run dev          # Start development server
bun run start        # Start production server
bun run db:generate  # Generate database migrations
bun run db:push      # Apply database migrations
bun run db:studio    # Open Drizzle Studio
```

## 🔗 **Frontend Integration**

### **tRPC Client Setup**
```typescript
// lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../backend/src/routes/app-router';

export const trpc = createTRPCReact<AppRouter>();
```

### **Using API in Components**
```typescript
// In React components
const { data } = trpc.health.check.useQuery();
const mutation = trpc.user.create.useMutation();
```

## 📊 **Monitoring & Debugging**

### **Health Checks**
```bash
# Check server status
curl http://localhost:3000/health

# Check tRPC endpoints
curl http://localhost:3000/trpc/health.check
```

### **Database Debugging**
```bash
# Open Drizzle Studio
bun run db:studio

# View logs
tail -f logs/server.log
```

## 🚀 **Deployment**

### **Production Setup**
```bash
# Build for production
bun run build

# Start production server
NODE_ENV=production bun run start
```

### **Environment Configuration**
- Set `NODE_ENV=production`
- Configure proper `JWT_SECRET`
- Setup database backups
- Configure CORS origins
- Setup logging and monitoring

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Port already in use**: `lsof -ti:3000 | xargs kill -9`
2. **Database connection failed**: Check `DATABASE_URL`
3. **JWT token invalid**: Verify `JWT_SECRET`
4. **CORS errors**: Check allowed origins configuration

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* bun run dev

# Check database connectivity
bun run db:studio
```

## 📚 **API Documentation**

### **Auto-Generated Types**
TypeScript types are automatically generated from the tRPC router and shared with the frontend for complete type safety.

### **Schema Validation**
All API inputs and outputs are validated using Zod schemas defined in the tRPC procedures.

## 🔄 **Future Enhancements**

- [ ] Real-time WebSocket support
- [ ] File upload handling
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-tenant support
- [ ] API rate limiting
- [ ] Comprehensive testing suite

---

**🎯 Ready to build powerful APIs? Let's get started!**
