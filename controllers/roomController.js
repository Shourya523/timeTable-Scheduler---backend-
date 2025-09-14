import Room from '../models/Room.js';

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, minCapacity } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (minCapacity) {
      query.capacity = { $gte: parseInt(minCapacity) };
    }
    
    const rooms = await Room.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Room.countDocuments(query);

    res.json({
      success: true,
      data: {
        rooms,
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
      message: 'Server error fetching rooms',
      error: error.message
    });
  }
};

// Get room by ID
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: { room }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching room',
      error: error.message
    });
  }
};

// Create new room
const createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating room',
      error: error.message
    });
  }
};

// Update room
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: { room }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating room',
      error: error.message
    });
  }
};

// Delete room
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting room',
      error: error.message
    });
  }
};

// Get rooms by capacity
const getRoomsByCapacity = async (req, res) => {
  try {
    const { minCapacity, maxCapacity } = req.query;
    let query = {};
    
    if (minCapacity && maxCapacity) {
      query.capacity = { $gte: parseInt(minCapacity), $lte: parseInt(maxCapacity) };
    } else if (minCapacity) {
      query.capacity = { $gte: parseInt(minCapacity) };
    } else if (maxCapacity) {
      query.capacity = { $lte: parseInt(maxCapacity) };
    }
    
    const rooms = await Room.find(query).sort({ capacity: 1 });

    res.json({
      success: true,
      data: { rooms }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching rooms by capacity',
      error: error.message
    });
  }
};

export {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByCapacity
};
