import express from 'express';
import {
  getAllTimetables,
  getTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  publishTimetable,
  archiveTimetable
} from '../controllers/timetableController.js';
import { validateTimetable } from '../middlewares/validation.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all timetables (accessible by all roles)
router.get('/', getAllTimetables);

// Get timetable by ID (accessible by all roles)
router.get('/:id', getTimetableById);

// Create timetable (admin and teacher only)
router.post('/', requireRole(['admin', 'teacher']), validateTimetable, createTimetable);

// Update timetable (admin and teacher only)
router.put('/:id', requireRole(['admin', 'teacher']), validateTimetable, updateTimetable);

// Delete timetable (admin only)
router.delete('/:id', requireRole(['admin']), deleteTimetable);

// Publish timetable (admin and teacher only)
router.patch('/:id/publish', requireRole(['admin', 'teacher']), publishTimetable);

// Archive timetable (admin and teacher only)
router.patch('/:id/archive', requireRole(['admin', 'teacher']), archiveTimetable);

export default router;
