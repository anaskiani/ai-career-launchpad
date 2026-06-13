import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  topic: {
    type: String,
    enum: ['resume', 'interview', 'skill-roadmap', 'job-advice', 'career-guidance'],
    default: 'career-guidance',
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

chatMessageSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
