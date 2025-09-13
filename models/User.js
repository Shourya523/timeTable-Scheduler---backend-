import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student', 'canteen_staff'],
    required: true
  },
  linked_teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  linked_class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

export default mongoose.model('User', userSchema);
