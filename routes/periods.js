import express from 'express';
import {
  getAllPeriods,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod,
  getPeriodsByDay,
  getPeriodsGroupedByDay
} from '../controllers/periodController.js';
import { validatePeriod } from '../middlewares/validation.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all periods (accessible by all roles)
router.get('/', getAllPeriods);

// Get periods grouped by day (accessible by all roles)
router.get('/grouped', getPeriodsGroupedByDay);

// Get period by ID (accessible by all roles)
router.get('/:id', getPeriodById);

// Get periods by day (accessible by all roles)
router.get('/day/:day_index', getPeriodsByDay);

// Create period (admin only)
router.post('/', requireRole(['admin']), validatePeriod, createPeriod);

// Update period (admin only)
router.put('/:id', requireRole(['admin']), validatePeriod, updatePeriod);

// Delete period (admin only)
router.delete('/:id', requireRole(['admin']), deletePeriod);

export default router;
