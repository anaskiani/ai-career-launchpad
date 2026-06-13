import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  experience: {
    type: Number,
    default: 0
  },
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  portfolio: {
    type: String,
    default: ''
  },
  // Profile fields
  profileImage: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  university: {
    type: String,
    default: ''
  },
  graduationYear: {
    type: Number,
    default: null
  },
  targetRole: {
    type: String,
    default: ''
  },
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, default: '' },
    startYear: { type: Number },
    endYear: { type: Number },
    current: { type: Boolean, default: false }
  }],
  workExperience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' }
  }],
  // 3-Factor Authentication
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailOTP: {
    code: String,
    expiresAt: Date
  },
  securityQuestion: {
    question: String,
    answer: String // Store hashed answer
  },
  securityPIN: {
    pin: String, // Store hashed PIN
    createdAt: Date
  },
  // Resume
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Profile completion virtual — calculates % of profile fields filled
userSchema.virtual('profileCompletion').get(function () {
  const fields = [
    { filled: !!this.name },
    { filled: !!this.phone },
    { filled: !!this.bio },
    { filled: this.skills && this.skills.length > 0 },
    { filled: this.experience > 0 },
    { filled: !!this.github || !!this.linkedin || !!this.portfolio },
    { filled: !!this.profileImage },
    { filled: !!this.location },
    { filled: !!this.targetRole },
    { filled: this.education && this.education.length > 0 },
    { filled: this.workExperience && this.workExperience.length > 0 },
    { filled: !!this.university },
  ];
  const filledCount = fields.filter(f => f.filled).length;
  return Math.round((filledCount / fields.length) * 100);
});

// Ensure virtuals are included in JSON/Object output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Auto-update updatedAt on every save
userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to hash security PIN/answer
userSchema.methods.hashSecurityData = async function(data) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(data, salt);
};

// Method to compare security data
userSchema.methods.compareSecurityData = async function(enteredData, hashedData) {
  return await bcrypt.compare(enteredData, hashedData);
};

export default mongoose.model('User', userSchema);
