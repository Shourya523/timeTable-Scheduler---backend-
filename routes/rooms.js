import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByCapacity
} from '../controllers/roomController.js';
import { validateRoom } from '../middlewares/validation.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all rooms (accessible by all roles)
router.get('/', getAllRooms);

// Get room by ID (accessible by all roles)
router.get('/:id', getRoomById);

// Get rooms by capacity (accessible by all roles)
router.get('/capacity/search', getRoomsByCapacity);

// Create room (admin only)
router.post('/', requireRole(['admin']), validateRoom, createRoom);

// Update room (admin only)
router.put('/:id', requireRole(['admin']), validateRoom, updateRoom);

// Delete room (admin only)
router.delete('/:id', requireRole(['admin']), deleteRoom);

export default router;
