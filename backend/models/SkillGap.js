import mongoose from 'mongoose';

const skillGapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  userSkills: [String],
  requiredSkills: [String],
  matchingSkills: [String],
  missingSkills: [String],
  matchPercentage: {
    type: Number,
    default: 0
  },
  missingDetails: [{
    name: String,
    category: String,
    priority: String,
    resource: {
      url: String,
      platform: String,
      duration: String,
    }
  }],
  roadmap: [{
    phase: Number,
    title: String,
    duration: String,
    skills: [{
      name: String,
      category: String,
      resource: {
        url: String,
        platform: String,
        duration: String,
      }
    }]
  }],
  recommendations: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast user lookups
skillGapSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('SkillGap', skillGapSchema);
