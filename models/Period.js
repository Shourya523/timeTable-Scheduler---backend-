import mongoose from 'mongoose';

const periodSchema = new mongoose.Schema({
  start_time: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  end_time: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  day_index: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  }
}, {
  timestamps: true
});

export default mongoose.model('Period', periodSchema);
