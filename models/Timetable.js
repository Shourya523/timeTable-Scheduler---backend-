import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  generated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  status: {
    type: String,
    default: 'draft',
    enum: ['draft', 'published', 'archived']
  },
  solution_json: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.model('Timetable', timetableSchema);
