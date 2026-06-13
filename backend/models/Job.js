import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: String,
  company: String,
  location: String,
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Freelance', 'Internship', 'Contract'],
  },
  description: String,
  skills: [String],
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  postedDate: Date,
  applicationDeadline: Date,
  url: String,
  source: String,
  isRemote: {
    type: Boolean,
    default: false,
  },
  saved: [mongoose.Schema.Types.ObjectId], // User IDs who saved
  applied: [mongoose.Schema.Types.ObjectId], // User IDs who applied
  createdAt: {
    type: Date,
    default: Date.now
  }
});

jobSchema.index({ saved: 1, createdAt: -1 });

export default mongoose.model('Job', jobSchema);
