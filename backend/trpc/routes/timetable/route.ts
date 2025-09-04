import { z } from "zod";
import { publicProcedure } from "../../create-context";

const createTimetableEntrySchema = z.object({
  unitId: z.string(),
  userId: z.string(),
  dayOfWeek: z.number().min(0).max(6), // 0 = Sunday, 6 = Saturday
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  venue: z.string().optional(),
});

const getTimetableSchema = z.object({
  userId: z.string(),
});

export const createTimetableEntryProcedure = publicProcedure
  .input(createTimetableEntrySchema)
  .mutation(async ({ input }: { input: z.infer<typeof createTimetableEntrySchema> }) => {
    try {
      // In a real app, you'd save to database
      const timetableEntry = {
        id: Math.random().toString(36).substring(2, 9),
        unitId: input.unitId,
        userId: input.userId,
        dayOfWeek: input.dayOfWeek,
        startTime: input.startTime,
        endTime: input.endTime,
        venue: input.venue,
        createdAt: new Date(),
      };

      return {
        success: true,
        entry: timetableEntry,
      };
    } catch (error) {
      console.error("Timetable entry creation error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to create timetable entry");
    }
  });

export const getTimetableProcedure = publicProcedure
  .input(getTimetableSchema)
  .query(async ({ input }: { input: z.infer<typeof getTimetableSchema> }) => {
    try {
      // In a real app, you'd fetch from database
      // For demo purposes, return mock timetable data
      const mockTimetable = [
        {
          id: "1",
          unitId: "unit1",
          userId: input.userId,
          dayOfWeek: 1, // Monday
          startTime: "09:00",
          endTime: "11:00",
          venue: "Room A101",
          unitName: "Computer Science",
          unitCode: "CS101",
        },
        {
          id: "2",
          unitId: "unit2",
          userId: input.userId,
          dayOfWeek: 3, // Wednesday
          startTime: "14:00",
          endTime: "16:00",
          venue: "Lab B202",
          unitName: "Data Structures",
          unitCode: "CS201",
        },
        {
          id: "3",
          unitId: "unit3",
          userId: input.userId,
          dayOfWeek: 5, // Friday
          startTime: "10:00",
          endTime: "12:00",
          venue: "Room C303",
          unitName: "Mathematics",
          unitCode: "MATH101",
        },
      ];

      return {
        success: true,
        timetable: mockTimetable,
      };
    } catch (error) {
      console.error("Timetable fetch error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to fetch timetable");
    }
  });