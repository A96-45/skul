import { router, protectedProcedure } from './create-context.js';
import { z } from 'zod';
import { eq, and, or } from 'drizzle-orm';
import { units, unitStudents, assignments, announcements, documents } from '../../db/schema.js';

// Input validation schemas
const createUnitSchema = z.object({
  name: z.string().min(1, 'Unit name is required'),
  code: z.string().min(1, 'Unit code is required'),
  description: z.string().optional(),
  university: z.string().min(1, 'University is required'),
  time: z.string().min(1, 'Schedule time is required'),
  date: z.string().min(1, 'Schedule date is required'),
  venue: z.string().optional(),
  restrictedTo: z.array(z.string()).optional(),
});

const joinUnitSchema = z.object({
  unitId: z.number('Invalid unit ID'),
});

const updateUnitSchema = z.object({
  unitId: z.number('Invalid unit ID'),
  name: z.string().min(1, 'Unit name is required').optional(),
  description: z.string().optional(),
  time: z.string().min(1, 'Schedule time is required').optional(),
  date: z.string().min(1, 'Schedule date is required').optional(),
  venue: z.string().optional(),
});

const createAssignmentSchema = z.object({
  unitId: z.number('Invalid unit ID'),
  title: z.string().min(1, 'Assignment title is required'),
  description: z.string().min(1, 'Assignment description is required'),
  dueDate: z.number('Invalid due date'),
  maxScore: z.number().positive('Max score must be positive').optional(),
});

const createAnnouncementSchema = z.object({
  unitId: z.number('Invalid unit ID'),
  title: z.string().min(1, 'Announcement title is required'),
  content: z.string().min(1, 'Announcement content is required'),
  important: z.boolean().optional(),
});

// Units router
export const unitsRouter = router({
  // Get all units for the current user
  getUserUnits: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const { db, user } = ctx;

        if (!user) {
          throw new Error('Not authenticated');
        }

        let userUnits = [];

        if (user.role === 'lecturer') {
          // Get units taught by lecturer
          userUnits = await db
            .select({
              id: units.id,
              name: units.name,
              code: units.code,
              description: units.description,
              university: units.university,
              time: units.time,
              date: units.date,
              venue: units.venue,
              lecturerId: units.lecturerId,
              createdBy: units.createdBy,
              restrictedTo: units.restrictedTo,
              createdAt: units.createdAt,
            })
            .from(units)
            .where(eq(units.lecturerId, user.id));
        } else {
          // Get units enrolled by student
          const enrolledUnits = await db
            .select({
              unitId: unitStudents.unitId,
            })
            .from(unitStudents)
            .where(eq(unitStudents.studentId, user.id));

          if (enrolledUnits.length > 0) {
            const unitIds = enrolledUnits.map(eu => eu.unitId);
            userUnits = await db
              .select({
                id: units.id,
                name: units.name,
                code: units.code,
                description: units.description,
                university: units.university,
                time: units.time,
                date: units.date,
                venue: units.venue,
                lecturerId: units.lecturerId,
                createdBy: units.createdBy,
                restrictedTo: units.restrictedTo,
                createdAt: units.createdAt,
              })
              .from(units)
              .where(units.id.in(unitIds));
          }
        }

        return {
          success: true,
          units: userUnits,
        };
      } catch (error) {
        console.error('Get user units error:', error);
        return {
          success: false,
          error: error.message || 'Failed to get user units',
        };
      }
    }),

  // Get all available units for enrollment
  getAvailableUnits: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const { db, user } = ctx;

        if (!user || user.role !== 'student') {
          throw new Error('Only students can browse available units');
        }

        // Get units not enrolled by student and not created by them
        const enrolledUnitIds = await db
          .select({ unitId: unitStudents.unitId })
          .from(unitStudents)
          .where(eq(unitStudents.studentId, user.id));

        const enrolledIds = enrolledUnitIds.map(eu => eu.unitId);

        let availableUnits = await db
          .select({
            id: units.id,
            name: units.name,
            code: units.code,
            description: units.description,
            university: units.university,
            time: units.time,
            date: units.date,
            venue: units.venue,
            lecturerId: units.lecturerId,
            createdBy: units.createdBy,
            restrictedTo: units.restrictedTo,
            createdAt: units.createdAt,
          })
          .from(units)
          .where(units.lecturerId.isNotNull());

        // Filter out already enrolled units and user's own units
        availableUnits = availableUnits.filter(unit =>
          !enrolledIds.includes(unit.id) && unit.createdBy !== user.id
        );

        return {
          success: true,
          units: availableUnits,
        };
      } catch (error) {
        console.error('Get available units error:', error);
        return {
          success: false,
          error: error.message || 'Failed to get available units',
        };
      }
    }),

  // Create a new unit
  createUnit: protectedProcedure
    .input(createUnitSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { db, user } = ctx;

        if (!user) {
          throw new Error('Not authenticated');
        }

        const newUnit = {
          name: input.name,
          code: input.code,
          description: input.description || '',
          university: input.university,
          time: input.time,
          date: input.date,
          venue: input.venue || '',
          lecturerId: user.role === 'lecturer' ? user.id : null,
          createdBy: user.id,
          restrictedTo: input.restrictedTo || null,
          createdAt: new Date(),
        };

        const [createdUnit] = await db
          .insert(units)
          .values(newUnit)
          .returning();

        return {
          success: true,
          unit: createdUnit,
          message: 'Unit created successfully',
        };
      } catch (error) {
        console.error('Create unit error:', error);
        return {
          success: false,
          error: error.message || 'Failed to create unit',
        };
      }
    }),

  // Join a unit (for students)
  joinUnit: protectedProcedure
    .input(joinUnitSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { db, user } = ctx;

        if (!user || user.role !== 'student') {
          throw new Error('Only students can join units');
        }

        // Check if unit exists
        const [unit] = await db
          .select()
          .from(units)
          .where(eq(units.id, input.unitId))
          .limit(1);

        if (!unit) {
          throw new Error('Unit not found');
        }

        // Check if already enrolled
        const [existingEnrollment] = await db
          .select()
          .from(unitStudents)
          .where(and(
            eq(unitStudents.unitId, input.unitId),
            eq(unitStudents.studentId, user.id)
          ))
          .limit(1);

        if (existingEnrollment) {
          throw new Error('Already enrolled in this unit');
        }

        // Check admission number restrictions
        if (unit.restrictedTo && unit.restrictedTo.length > 0 && user.admissionNumber) {
          const isAllowed = unit.restrictedTo.some(prefix =>
            user.admissionNumber.startsWith(prefix)
          );
          if (!isAllowed) {
            throw new Error(`Your admission number doesn't meet the requirements for this unit`);
          }
        }

        // Enroll student
        await db.insert(unitStudents).values({
          unitId: input.unitId,
          studentId: user.id,
          joinedAt: new Date(),
        });

        return {
          success: true,
          message: 'Successfully joined unit',
        };
      } catch (error) {
        console.error('Join unit error:', error);
        return {
          success: false,
          error: error.message || 'Failed to join unit',
        };
      }
    }),

  // Leave a unit (for students)
  leaveUnit: protectedProcedure
    .input(joinUnitSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { db, user } = ctx;

        if (!user || user.role !== 'student') {
          throw new Error('Only students can leave units');
        }

        // Check if enrolled
        const [enrollment] = await db
          .select()
          .from(unitStudents)
          .where(and(
            eq(unitStudents.unitId, input.unitId),
            eq(unitStudents.studentId, user.id)
          ))
          .limit(1);

        if (!enrollment) {
          throw new Error('Not enrolled in this unit');
        }

        // Remove enrollment
        await db
          .delete(unitStudents)
          .where(and(
            eq(unitStudents.unitId, input.unitId),
            eq(unitStudents.studentId, user.id)
          ));

        return {
          success: true,
          message: 'Successfully left unit',
        };
      } catch (error) {
        console.error('Leave unit error:', error);
        return {
          success: false,
          error: error.message || 'Failed to leave unit',
        };
      }
    }),

  // Get unit details with assignments and announcements
  getUnitDetails: protectedProcedure
    .input(z.object({ unitId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const { db, user } = ctx;

        if (!user) {
          throw new Error('Not authenticated');
        }

        // Get unit
        const [unit] = await db
          .select()
          .from(units)
          .where(eq(units.id, input.unitId))
          .limit(1);

        if (!unit) {
          throw new Error('Unit not found');
        }

        // Check if user has access to this unit
        let hasAccess = false;
        if (user.role === 'lecturer' && unit.lecturerId === user.id) {
          hasAccess = true;
        } else if (user.role === 'student') {
          const [enrollment] = await db
            .select()
            .from(unitStudents)
            .where(and(
              eq(unitStudents.unitId, input.unitId),
              eq(unitStudents.studentId, user.id)
            ))
            .limit(1);
          hasAccess = !!enrollment;
        }

        if (!hasAccess) {
          throw new Error('Access denied to this unit');
        }

        // Get assignments
        const unitAssignments = await db
          .select()
          .from(assignments)
          .where(eq(assignments.unitId, input.unitId))
          .orderBy(assignments.createdAt);

        // Get announcements
        const unitAnnouncements = await db
          .select()
          .from(announcements)
          .where(eq(announcements.unitId, input.unitId))
          .orderBy(announcements.createdAt);

        // Get documents
        const unitDocuments = await db
          .select()
          .from(documents)
          .where(eq(documents.unitId, input.unitId))
          .orderBy(documents.uploadedAt);

        return {
          success: true,
          unit,
          assignments: unitAssignments,
          announcements: unitAnnouncements,
          documents: unitDocuments,
        };
      } catch (error) {
        console.error('Get unit details error:', error);
        return {
          success: false,
          error: error.message || 'Failed to get unit details',
        };
      }
    }),
});
