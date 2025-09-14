import Class from '../models/Class.js';

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, year } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (year) {
      query.year = parseInt(year);
    }
    
    const classes = await Class.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ year: 1, name: 1 });

    const total = await Class.countDocuments(query);

    res.json({
      success: true,
      data: {
        classes,
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
      message: 'Server error fetching classes',
      error: error.message
    });
  }
};

// Get class by ID
const getClassById = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);
    
    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.json({
      success: true,
      data: { class: classDoc }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching class',
      error: error.message
    });
  }
};

// Create new class
const createClass = async (req, res) => {
  try {
    const classDoc = new Class(req.body);
    await classDoc.save();

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: { class: classDoc }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating class',
      error: error.message
    });
  }
};

// Update class
const updateClass = async (req, res) => {
  try {
    const classDoc = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.json({
      success: true,
      message: 'Class updated successfully',
      data: { class: classDoc }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating class',
      error: error.message
    });
  }
};

// Delete class
const deleteClass = async (req, res) => {
  try {
    const classDoc = await Class.findByIdAndDelete(req.params.id);

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting class',
      error: error.message
    });
  }
};

// Get classes by year
const getClassesByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const classes = await Class.find({ year: parseInt(year) }).sort({ name: 1 });

    res.json({
      success: true,
      data: { classes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching classes by year',
      error: error.message
    });
  }
};

export {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassesByYear
};
