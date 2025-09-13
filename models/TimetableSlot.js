import mongoose from 'mongoose';

const timetableSlotSchema = new mongoose.Schema({
  timetable_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
    required: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  period_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Period',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('TimetableSlot', timetableSlotSchema);
