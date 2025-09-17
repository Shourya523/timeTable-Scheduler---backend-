import express from 'express';
import {
  getAllTimetableSlots,
  getTimetableSlotById,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  getSlotsByTimetable,
  getSlotsByClass,
  getSlotsByTeacher
} from '../controllers/timetableSlotController.js';
import { validateTimetableSlot } from '../middlewares/validation.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all timetable slots (accessible by all roles)
router.get('/', getAllTimetableSlots);

// Get slots by timetable (accessible by all roles)
router.get('/timetable/:timetable_id', getSlotsByTimetable);

// Get slots by class (accessible by all roles)
router.get('/class/:class_id', getSlotsByClass);

// Get slots by teacher (accessible by all roles)
router.get('/teacher/:teacher_id', getSlotsByTeacher);

// Get timetable slot by ID (accessible by all roles)
router.get('/:id', getTimetableSlotById);

// Create timetable slot (admin and teacher only)
router.post('/', requireRole(['admin', 'teacher']), validateTimetableSlot, createTimetableSlot);

// Update timetable slot (admin and teacher only)
router.put('/:id', requireRole(['admin', 'teacher']), validateTimetableSlot, updateTimetableSlot);

// Delete timetable slot (admin and teacher only)
router.delete('/:id', requireRole(['admin', 'teacher']), deleteTimetableSlot);

export default router;
