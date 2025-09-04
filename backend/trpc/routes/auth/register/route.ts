import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["student", "lecturer"]),
  admissionNumber: z.string().optional(),
  department: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1), // In a real app, you'd hash passwords
});

export const registerProcedure = publicProcedure
  .input(registerSchema)
  .mutation(async ({ input }: { input: z.infer<typeof registerSchema> }) => {
    try {
      // For now, we'll simulate user creation
      // In a real app, you'd save to database
      const userId = Math.random().toString(36).substring(2, 9);
      const newUser = {
        id: userId,
        name: input.name,
        email: input.email,
        role: input.role,
        admissionNumber: input.admissionNumber,
        department: input.department,
      };

      // Return user without sensitive data
      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
  });

export const loginProcedure = publicProcedure
  .input(loginSchema)
  .mutation(async ({ input }: { input: z.infer<typeof loginSchema> }) => {
    try {
      // For demo purposes, we'll simulate login
      // In a real app, you'd verify against database
      const mockUser = {
        id: "demo-user",
        name: "Demo User",
        email: input.email,
        role: "student" as const,
      };

      return {
        success: true,
        user: mockUser,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  });