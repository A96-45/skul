import { router, publicProcedure, protectedProcedure } from './create-context.js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { users } from '../../db/schema.js';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Input validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['student', 'lecturer'], { required_error: 'Role is required' }),
  admissionNumber: z.string().optional(),
  department: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  admissionNumber: z.string().optional(),
  department: z.string().optional(),
});

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const formatUserResponse = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Auth router
export const authRouter = router({
  // User registration
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { db } = ctx;

        // Check if user already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(input.password);

        // Create user
        const newUser = {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: input.role,
          profileComplete: !!(input.admissionNumber || input.department),
          createdAt: new Date(),
        };

        // Add role-specific fields
        if (input.role === 'student' && input.admissionNumber) {
          newUser.admissionNumber = input.admissionNumber;
        } else if (input.role === 'lecturer' && input.department) {
          newUser.department = input.department;
        }

        const [createdUser] = await db
          .insert(users)
          .values(newUser)
          .returning();

        // Generate JWT token
        const token = generateToken(createdUser.id);

        return {
          success: true,
          user: formatUserResponse(createdUser),
          token,
          message: 'User registered successfully',
        };
      } catch (error) {
        console.error('Registration error:', error);
        return {
          success: false,
          error: error.message || 'Registration failed',
        };
      }
    }),

  // User login
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { db } = ctx;

        // Find user by email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await verifyPassword(input.password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid email or password');
        }

        // Generate JWT token
        const token = generateToken(user.id);

        return {
          success: true,
          user: formatUserResponse(user),
          token,
          message: 'Login successful',
        };
      } catch (error) {
        console.error('Login error:', error);
        return {
          success: false,
          error: error.message || 'Login failed',
        };
      }
    }),

  // Get current user profile
  me: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const { db, user } = ctx;

        if (!user) {
          throw new Error('Not authenticated');
        }

        const [currentUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);

        if (!currentUser) {
          throw new Error('User not found');
        }

        return {
          success: true,
          user: formatUserResponse(currentUser),
        };
      } catch (error) {
        console.error('Get profile error:', error);
        return {
          success: false,
          error: error.message || 'Failed to get user profile',
        };
      }
    }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { db, user } = ctx;

        if (!user) {
          throw new Error('Not authenticated');
        }

        // Build update object
        const updateData = {};
        if (input.name) updateData.name = input.name;
        if (input.admissionNumber) updateData.admissionNumber = input.admissionNumber;
        if (input.department) updateData.department = input.department;

        // Update profile completion status
        if (Object.keys(updateData).length > 0) {
          updateData.profileComplete = true;
        }

        const [updatedUser] = await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, user.id))
          .returning();

        return {
          success: true,
          user: formatUserResponse(updatedUser),
          message: 'Profile updated successfully',
        };
      } catch (error) {
        console.error('Update profile error:', error);
        return {
          success: false,
          error: error.message || 'Failed to update profile',
        };
      }
    }),

  // Logout (client-side token removal)
  logout: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        // In a real implementation, you might want to blacklist the token
        // For now, we just return success (client will remove token)
        return {
          success: true,
          message: 'Logged out successfully',
        };
      } catch (error) {
        console.error('Logout error:', error);
        return {
          success: false,
          error: error.message || 'Logout failed',
        };
      }
    }),

  // Verify token (useful for client-side token validation)
  verifyToken: publicProcedure
    .mutation(async ({ ctx }) => {
      try {
        const { user } = ctx;

        if (!user) {
          return {
            success: false,
            error: 'Token invalid or expired',
          };
        }

        return {
          success: true,
          user: formatUserResponse(user),
          message: 'Token is valid',
        };
      } catch (error) {
        console.error('Token verification error:', error);
        return {
          success: false,
          error: error.message || 'Token verification failed',
        };
      }
    }),
});
