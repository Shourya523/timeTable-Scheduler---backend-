import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, role, linked_teacher_id, linked_class_id } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate linked IDs based on role
    if (role === 'teacher' && linked_teacher_id) {
      const teacher = await Teacher.findById(linked_teacher_id);
      if (!teacher) {
        return res.status(400).json({
          success: false,
          message: 'Linked teacher not found'
        });
      }
    }

    if (role === 'student' && linked_class_id) {
      const classDoc = await Class.findById(linked_class_id);
      if (!classDoc) {
        return res.status(400).json({
          success: false,
          message: 'Linked class not found'
        });
      }
    }

    // Create new user
    const user = new User({
      email,
      password_hash: password, // Will be hashed by pre-save hook
      role,
      linked_teacher_id: role === 'teacher' ? linked_teacher_id : undefined,
      linked_class_id: role === 'student' ? linked_class_id : undefined
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          linked_teacher_id: user.linked_teacher_id,
          linked_class_id: user.linked_class_id
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          linked_teacher_id: user.linked_teacher_id,
          linked_class_id: user.linked_class_id
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password_hash')
      .populate('linked_teacher_id', 'name email subjects')
      .populate('linked_class_id', 'name year');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
};

export {
  register,
  login,
  getProfile
};
