import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Teacher validation rules
const validateTeacher = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subjects').isArray({ min: 1 }).withMessage('At least one subject is required'),
  body('max_periods_per_day').optional().isInt({ min: 1, max: 12 }).withMessage('Max periods per day must be between 1 and 12'),
  handleValidationErrors
];

// Class validation rules
const validateClass = [
  body('name').trim().notEmpty().withMessage('Class name is required'),
  body('year').isInt({ min: 1, max: 12 }).withMessage('Year must be between 1 and 12'),
  body('size').isInt({ min: 1 }).withMessage('Class size must be a positive integer'),
  body('required_subjects').isArray({ min: 1 }).withMessage('At least one required subject is needed'),
  handleValidationErrors
];

// Room validation rules
const validateRoom = [
  body('name').trim().notEmpty().withMessage('Room name is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('resources').optional().isArray().withMessage('Resources must be an array'),
  handleValidationErrors
];

// Period validation rules
const validatePeriod = [
  body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in HH:MM format'),
  body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in HH:MM format'),
  body('day_index').isInt({ min: 0, max: 6 }).withMessage('Day index must be between 0 and 6'),
  handleValidationErrors
];

// User validation rules
const validateUser = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['admin', 'teacher', 'student', 'canteen_staff']).withMessage('Invalid role'),
  handleValidationErrors
];

// Login validation rules
const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Timetable validation rules
const validateTimetable = [
  body('school_id').isMongoId().withMessage('Valid school ID is required'),
  body('generated_by').isMongoId().withMessage('Valid teacher ID is required'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  handleValidationErrors
];

// TimetableSlot validation rules
const validateTimetableSlot = [
  body('timetable_id').isMongoId().withMessage('Valid timetable ID is required'),
  body('class_id').isMongoId().withMessage('Valid class ID is required'),
  body('teacher_id').isMongoId().withMessage('Valid teacher ID is required'),
  body('room_id').isMongoId().withMessage('Valid room ID is required'),
  body('period_id').isMongoId().withMessage('Valid period ID is required'),
  handleValidationErrors
];

export {
  handleValidationErrors,
  validateTeacher,
  validateClass,
  validateRoom,
  validatePeriod,
  validateUser,
  validateLogin,
  validateTimetable,
  validateTimetableSlot
};
