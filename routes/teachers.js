import express from 'express';
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeachersBySubject
} from '../controllers/teacherController.js';
import { validateTeacher } from '../middlewares/validation.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all teachers (accessible by all roles)
router.get('/', getAllTeachers);

// Get teacher by ID (accessible by all roles)
router.get('/:id', getTeacherById);

// Get teachers by subject (accessible by all roles)
router.get('/subject/:subject', getTeachersBySubject);

// Create teacher (admin only)
router.post('/', requireRole(['admin']), validateTeacher, createTeacher);

// Update teacher (admin only)
router.put('/:id', requireRole(['admin']), validateTeacher, updateTeacher);

// Delete teacher (admin only)
router.delete('/:id', requireRole(['admin']), deleteTeacher);

export default router;
