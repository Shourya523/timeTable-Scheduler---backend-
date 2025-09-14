import Period from '../models/Period.js';

// Get all periods
const getAllPeriods = async (req, res) => {
  try {
    const { page = 1, limit = 10, day_index } = req.query;
    let query = {};
    
    if (day_index !== undefined) {
      query.day_index = parseInt(day_index);
    }
    
    const periods = await Period.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ day_index: 1, start_time: 1 });

    const total = await Period.countDocuments(query);

    res.json({
      success: true,
      data: {
        periods,
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
      message: 'Server error fetching periods',
      error: error.message
    });
  }
};

// Get period by ID
const getPeriodById = async (req, res) => {
  try {
    const period = await Period.findById(req.params.id);
    
    if (!period) {
      return res.status(404).json({
        success: false,
        message: 'Period not found'
      });
    }

    res.json({
      success: true,
      data: { period }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching period',
      error: error.message
    });
  }
};

// Create new period
const createPeriod = async (req, res) => {
  try {
    const period = new Period(req.body);
    await period.save();

    res.status(201).json({
      success: true,
      message: 'Period created successfully',
      data: { period }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating period',
      error: error.message
    });
  }
};

// Update period
const updatePeriod = async (req, res) => {
  try {
    const period = await Period.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!period) {
      return res.status(404).json({
        success: false,
        message: 'Period not found'
      });
    }

    res.json({
      success: true,
      message: 'Period updated successfully',
      data: { period }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating period',
      error: error.message
    });
  }
};

// Delete period
const deletePeriod = async (req, res) => {
  try {
    const period = await Period.findByIdAndDelete(req.params.id);

    if (!period) {
      return res.status(404).json({
        success: false,
        message: 'Period not found'
      });
    }

    res.json({
      success: true,
      message: 'Period deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting period',
      error: error.message
    });
  }
};

// Get periods by day
const getPeriodsByDay = async (req, res) => {
  try {
    const { day_index } = req.params;
    const periods = await Period.find({ day_index: parseInt(day_index) })
      .sort({ start_time: 1 });

    res.json({
      success: true,
      data: { periods }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching periods by day',
      error: error.message
    });
  }
};

// Get all periods grouped by day
const getPeriodsGroupedByDay = async (req, res) => {
  try {
    const periods = await Period.find({}).sort({ day_index: 1, start_time: 1 });
    
    const groupedPeriods = periods.reduce((acc, period) => {
      if (!acc[period.day_index]) {
        acc[period.day_index] = [];
      }
      acc[period.day_index].push(period);
      return acc;
    }, {});

    res.json({
      success: true,
      data: { periods: groupedPeriods }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching periods grouped by day',
      error: error.message
    });
  }
};

export {
  getAllPeriods,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod,
  getPeriodsByDay,
  getPeriodsGroupedByDay
};
