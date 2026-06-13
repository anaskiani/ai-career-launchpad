import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technical', 'Behavioral', 'HR'],
    default: 'Technical'
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  questions: [{
    category: {
      type: String,
      enum: ['Technical', 'HR'],
      default: 'Technical'
    },
    question: String,
    answer: String,
    feedback: String,
    duration: Number
  }],
  totalDuration: Number,
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: String,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

interviewSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Interview', interviewSchema);
