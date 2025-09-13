import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  required_subjects: {
    type: [String],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Class', classSchema);
