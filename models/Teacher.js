import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  subjects: {
    type: [String],
    required: true
  },
  max_periods_per_day: {
    type: Number,
    default: 6
  },
  unavailable_slots: {
    type: [{
      day: Number,
      period: Number
    }],
    default: []
  },
  preferences: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.model('Teacher', teacherSchema);
