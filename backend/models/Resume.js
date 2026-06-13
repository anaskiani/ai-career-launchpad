import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'My Resume'
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    summary: String
  },
  experiences: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    graduationDate: Date,
    gpa: String
  }],
  skills: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  }],
  certifications: [{
    title: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    url: String
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Resume', resumeSchema);
