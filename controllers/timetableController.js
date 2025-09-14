import Timetable from '../models/Timetable.js';
import TimetableSlot from '../models/TimetableSlot.js';

// Get all timetables
const getAllTimetables = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, school_id } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    if (school_id) {
      query.school_id = school_id;
    }
    
    const timetables = await Timetable.find(query)
      .populate('generated_by', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Timetable.countDocuments(query);

    res.json({
      success: true,
      data: {
        timetables,
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
      message: 'Server error fetching timetables',
      error: error.message
    });
  }
};

// Get timetable by ID
const getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('generated_by', 'name email');
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    // Get all slots for this timetable
    const slots = await TimetableSlot.find({ timetable_id: timetable._id })
      .populate('class_id', 'name year')
      .populate('teacher_id', 'name email subjects')
      .populate('room_id', 'name capacity')
      .populate('period_id', 'start_time end_time day_index');

    res.json({
      success: true,
      data: { 
        timetable,
        slots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching timetable',
      error: error.message
    });
  }
};

// Create new timetable
const createTimetable = async (req, res) => {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();

    res.status(201).json({
      success: true,
      message: 'Timetable created successfully',
      data: { timetable }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating timetable',
      error: error.message
    });
  }
};

// Update timetable
const updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    res.json({
      success: true,
      message: 'Timetable updated successfully',
      data: { timetable }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating timetable',
      error: error.message
    });
  }
};

// Delete timetable
const deleteTimetable = async (req, res) => {
  try {
    // Delete all associated slots first
    await TimetableSlot.deleteMany({ timetable_id: req.params.id });
    
    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    res.json({
      success: true,
      message: 'Timetable and associated slots deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting timetable',
      error: error.message
    });
  }
};

// Publish timetable
const publishTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true, runValidators: true }
    );

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    res.json({
      success: true,
      message: 'Timetable published successfully',
      data: { timetable }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error publishing timetable',
      error: error.message
    });
  }
};

// Archive timetable
const archiveTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      { status: 'archived' },
      { new: true, runValidators: true }
    );

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    res.json({
      success: true,
      message: 'Timetable archived successfully',
      data: { timetable }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error archiving timetable',
      error: error.message
    });
  }
};

export {
  getAllTimetables,
  getTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  publishTimetable,
  archiveTimetable
};
