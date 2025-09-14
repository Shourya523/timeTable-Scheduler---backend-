import Teacher from '../models/Teacher.js';

// Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    
    const teachers = await Teacher.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments(query);

    res.json({
      success: true,
      data: {
        teachers,
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
      message: 'Server error fetching teachers',
      error: error.message
    });
  }
};

// Get teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      data: { teacher }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching teacher',
      error: error.message
    });
  }
};

// Create new teacher
const createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: { teacher }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating teacher',
      error: error.message
    });
  }
};

// Update teacher
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: { teacher }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating teacher',
      error: error.message
    });
  }
};

// Delete teacher
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting teacher',
      error: error.message
    });
  }
};

// Get teachers by subject
const getTeachersBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const teachers = await Teacher.find({ subjects: subject });

    res.json({
      success: true,
      data: { teachers }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching teachers by subject',
      error: error.message
    });
  }
};

export {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeachersBySubject
};
