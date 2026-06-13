import { randomUUID } from 'crypto';

export const newId = () => randomUUID();

export const toJson = (value, fallback = []) => JSON.stringify(value ?? fallback);

export const fromJson = (value, fallback = []) => {
  if (!value) {
    return fallback;
  }

  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
};

export const calculateProfileCompletion = (user) => {
  const skills = fromJson(user.skills_json, []);
  const education = fromJson(user.education_json, []);
  const workExperience = fromJson(user.work_experience_json, []);

  const fields = [
    { filled: Boolean(user.name) },
    { filled: Boolean(user.phone) },
    { filled: Boolean(user.bio) },
    { filled: skills.length > 0 },
    { filled: Number(user.experience || 0) > 0 },
    { filled: Boolean(user.github || user.linkedin || user.portfolio) },
    { filled: Boolean(user.profile_image) },
    { filled: Boolean(user.location) },
    { filled: Boolean(user.target_role) },
    { filled: education.length > 0 },
    { filled: workExperience.length > 0 },
    { filled: Boolean(user.university) },
  ];

  const filledCount = fields.filter((field) => field.filled).length;
  return Math.round((filledCount / fields.length) * 100);
};

export const mapUserPublic = (row) => ({
  _id: row.id,
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone || '',
  bio: row.bio || '',
  skills: fromJson(row.skills_json, []),
  experience: Number(row.experience || 0),
  github: row.github || '',
  linkedin: row.linkedin || '',
  portfolio: row.portfolio || '',
  profileImage: row.profile_image || '',
  location: row.location || '',
  university: row.university || '',
  graduationYear: row.graduation_year,
  targetRole: row.target_role || '',
  education: fromJson(row.education_json, []),
  workExperience: fromJson(row.work_experience_json, []),
  emailVerified: Boolean(row.email_verified),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  profileCompletion: calculateProfileCompletion(row),
});
