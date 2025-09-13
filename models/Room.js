import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true
  },
  resources: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model('Room', roomSchema);
