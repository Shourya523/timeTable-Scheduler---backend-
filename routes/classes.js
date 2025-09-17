import express from 'express';
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassesByYear
} from '../controllers/classController.js';
import { validateClass } from '../middlewares/validation.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all classes (accessible by all roles)
router.get('/', getAllClasses);

// Get class by ID (accessible by all roles)
router.get('/:id', getClassById);

// Get classes by year (accessible by all roles)
router.get('/year/:year', getClassesByYear);

// Create class (admin only)
router.post('/', requireRole(['admin']), validateClass, createClass);

// Update class (admin only)
router.put('/:id', requireRole(['admin']), validateClass, updateClass);

// Delete class (admin only)
router.delete('/:id', requireRole(['admin']), deleteClass);

export default router;
