import TimetableSlot from '../models/TimetableSlot.js';

// Get all timetable slots
const getAllTimetableSlots = async (req, res) => {
  try {
    const { page = 1, limit = 10, timetable_id, class_id, teacher_id, room_id, period_id } = req.query;
    let query = {};
    
    if (timetable_id) query.timetable_id = timetable_id;
    if (class_id) query.class_id = class_id;
    if (teacher_id) query.teacher_id = teacher_id;
    if (room_id) query.room_id = room_id;
    if (period_id) query.period_id = period_id;
    
    const slots = await TimetableSlot.find(query)
      .populate('timetable_id', 'status school_id')
      .populate('class_id', 'name year')
      .populate('teacher_id', 'name email subjects')
      .populate('room_id', 'name capacity')
      .populate('period_id', 'start_time end_time day_index')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await TimetableSlot.countDocuments(query);

    res.json({
      success: true,
      data: {
        slots,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching timetable slots',
      error: error.message
    });
  }
};

// Get timetable slot by ID
const getTimetableSlotById = async (req, res) => {
  try {
    const slot = await TimetableSlot.findById(req.params.id)
      .populate('timetable_id', 'status school_id')
      .populate('class_id', 'name year')
      .populate('teacher_id', 'name email subjects')
      .populate('room_id', 'name capacity')
      .populate('period_id', 'start_time end_time day_index');
    
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Timetable slot not found'
      });
    }

    res.json({
      success: true,
      data: { slot }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching timetable slot',
      error: error.message
    });
  }
};

// Create new timetable slot
const createTimetableSlot = async (req, res) => {
  try {
    const slot = new TimetableSlot(req.body);
    await slot.save();

    // Populate the created slot
    await slot.populate([
      { path: 'timetable_id', select: 'status school_id' },
      { path: 'class_id', select: 'name year' },
      { path: 'teacher_id', select: 'name email subjects' },
      { path: 'room_id', select: 'name capacity' },
      { path: 'period_id', select: 'start_time end_time day_index' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Timetable slot created successfully',
      data: { slot }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating timetable slot',
      error: error.message
    });
  }
};

// Update timetable slot
const updateTimetableSlot = async (req, res) => {
  try {
    const slot = await TimetableSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'timetable_id', select: 'status school_id' },
      { path: 'class_id', select: 'name year' },
      { path: 'teacher_id', select: 'name email subjects' },
      { path: 'room_id', select: 'name capacity' },
      { path: 'period_id', select: 'start_time end_time day_index' }
    ]);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Timetable slot not found'
      });
    }

    res.json({
      success: true,
      message: 'Timetable slot updated successfully',
      data: { slot }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating timetable slot',
      error: error.message
    });
  }
};

// Delete timetable slot
const deleteTimetableSlot = async (req, res) => {
  try {
    const slot = await TimetableSlot.findByIdAndDelete(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Timetable slot not found'
      });
    }

    res.json({
      success: true,
      message: 'Timetable slot deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting timetable slot',
      error: error.message
    });
  }
};

// Get slots by timetable
const getSlotsByTimetable = async (req, res) => {
  try {
    const { timetable_id } = req.params;
    const slots = await TimetableSlot.find({ timetable_id })
      .populate('class_id', 'name year')
      .populate('teacher_id', 'name email subjects')
      .populate('room_id', 'name capacity')
      .populate('period_id', 'start_time end_time day_index')
      .sort({ 'period_id.day_index': 1, 'period_id.start_time': 1 });

    res.json({
      success: true,
      data: { slots }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching slots by timetable',
      error: error.message
    });
  }
};

// Get slots by class
const getSlotsByClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    const slots = await TimetableSlot.find({ class_id })
      .populate('timetable_id', 'status school_id')
      .populate('teacher_id', 'name email subjects')
      .populate('room_id', 'name capacity')
      .populate('period_id', 'start_time end_time day_index')
      .sort({ 'period_id.day_index': 1, 'period_id.start_time': 1 });

    res.json({
      success: true,
      data: { slots }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching slots by class',
      error: error.message
    });
  }
};

// Get slots by teacher
const getSlotsByTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const slots = await TimetableSlot.find({ teacher_id })
      .populate('timetable_id', 'status school_id')
      .populate('class_id', 'name year')
      .populate('room_id', 'name capacity')
      .populate('period_id', 'start_time end_time day_index')
      .sort({ 'period_id.day_index': 1, 'period_id.start_time': 1 });

    res.json({
      success: true,
      data: { slots }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching slots by teacher',
      error: error.message
    });
  }
};

export {
  getAllTimetableSlots,
  getTimetableSlotById,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  getSlotsByTimetable,
  getSlotsByClass,
  getSlotsByTeacher
};
