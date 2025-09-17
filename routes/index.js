import express from 'express';

// Import all route modules
import authRoutes from './auth.js';
import teacherRoutes from './teachers.js';
import classRoutes from './classes.js';
import roomRoutes from './rooms.js';
import periodRoutes from './periods.js';
import timetableRoutes from './timetables.js';
import timetableSlotRoutes from './timetableSlots.js';

const router = express.Router();

// API version prefix
const API_VERSION = '/api/v1';

// Mount routes
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/teachers`, teacherRoutes);
router.use(`${API_VERSION}/classes`, classRoutes);
router.use(`${API_VERSION}/rooms`, roomRoutes);
router.use(`${API_VERSION}/periods`, periodRoutes);
router.use(`${API_VERSION}/timetables`, timetableRoutes);
router.use(`${API_VERSION}/timetable-slots`, timetableSlotRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Timetable Scheduler API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API documentation endpoint
router.get(`${API_VERSION}/docs`, (req, res) => {
  res.json({
    success: true,
    message: 'Timetable Scheduler API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/v1/auth/register': 'Register a new user',
        'POST /api/v1/auth/login': 'Login user',
        'GET /api/v1/auth/profile': 'Get user profile (protected)'
      },
      teachers: {
        'GET /api/v1/teachers': 'Get all teachers',
        'GET /api/v1/teachers/:id': 'Get teacher by ID',
        'GET /api/v1/teachers/subject/:subject': 'Get teachers by subject',
        'POST /api/v1/teachers': 'Create teacher (admin only)',
        'PUT /api/v1/teachers/:id': 'Update teacher (admin only)',
        'DELETE /api/v1/teachers/:id': 'Delete teacher (admin only)'
      },
      classes: {
        'GET /api/v1/classes': 'Get all classes',
        'GET /api/v1/classes/:id': 'Get class by ID',
        'GET /api/v1/classes/year/:year': 'Get classes by year',
        'POST /api/v1/classes': 'Create class (admin only)',
        'PUT /api/v1/classes/:id': 'Update class (admin only)',
        'DELETE /api/v1/classes/:id': 'Delete class (admin only)'
      },
      rooms: {
        'GET /api/v1/rooms': 'Get all rooms',
        'GET /api/v1/rooms/:id': 'Get room by ID',
        'GET /api/v1/rooms/capacity/search': 'Get rooms by capacity',
        'POST /api/v1/rooms': 'Create room (admin only)',
        'PUT /api/v1/rooms/:id': 'Update room (admin only)',
        'DELETE /api/v1/rooms/:id': 'Delete room (admin only)'
      },
      periods: {
        'GET /api/v1/periods': 'Get all periods',
        'GET /api/v1/periods/grouped': 'Get periods grouped by day',
        'GET /api/v1/periods/:id': 'Get period by ID',
        'GET /api/v1/periods/day/:day_index': 'Get periods by day',
        'POST /api/v1/periods': 'Create period (admin only)',
        'PUT /api/v1/periods/:id': 'Update period (admin only)',
        'DELETE /api/v1/periods/:id': 'Delete period (admin only)'
      },
      timetables: {
        'GET /api/v1/timetables': 'Get all timetables',
        'GET /api/v1/timetables/:id': 'Get timetable by ID',
        'POST /api/v1/timetables': 'Create timetable (admin/teacher)',
        'PUT /api/v1/timetables/:id': 'Update timetable (admin/teacher)',
        'DELETE /api/v1/timetables/:id': 'Delete timetable (admin only)',
        'PATCH /api/v1/timetables/:id/publish': 'Publish timetable (admin/teacher)',
        'PATCH /api/v1/timetables/:id/archive': 'Archive timetable (admin/teacher)'
      },
      timetableSlots: {
        'GET /api/v1/timetable-slots': 'Get all timetable slots',
        'GET /api/v1/timetable-slots/timetable/:timetable_id': 'Get slots by timetable',
        'GET /api/v1/timetable-slots/class/:class_id': 'Get slots by class',
        'GET /api/v1/timetable-slots/teacher/:teacher_id': 'Get slots by teacher',
        'GET /api/v1/timetable-slots/:id': 'Get slot by ID',
        'POST /api/v1/timetable-slots': 'Create slot (admin/teacher)',
        'PUT /api/v1/timetable-slots/:id': 'Update slot (admin/teacher)',
        'DELETE /api/v1/timetable-slots/:id': 'Delete slot (admin/teacher)'
      }
    }
  });
});

export default router;
