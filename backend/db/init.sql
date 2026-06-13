CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30) DEFAULT '',
  bio TEXT,
  skills_json JSON,
  experience INT DEFAULT 0,
  github VARCHAR(255) DEFAULT '',
  linkedin VARCHAR(255) DEFAULT '',
  portfolio VARCHAR(255) DEFAULT '',
  profile_image VARCHAR(255) DEFAULT '',
  location VARCHAR(120) DEFAULT '',
  university VARCHAR(120) DEFAULT '',
  graduation_year INT NULL,
  target_role VARCHAR(120) DEFAULT '',
  education_json JSON,
  work_experience_json JSON,
  email_verified TINYINT(1) DEFAULT 0,
  email_otp_code VARCHAR(10) NULL,
  email_otp_expires_at DATETIME NULL,
  security_question_text VARCHAR(255) NULL,
  security_question_answer_hash VARCHAR(255) NULL,
  security_pin_hash VARCHAR(255) NULL,
  resume_id VARCHAR(36) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  title VARCHAR(120) DEFAULT 'My Resume',
  personal_info_json JSON,
  experiences_json JSON,
  education_json JSON,
  skills_json JSON,
  certifications_json JSON,
  projects_json JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_resume_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS skill_gaps (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  target_role VARCHAR(120) NOT NULL,
  user_skills_json JSON,
  required_skills_json JSON,
  matching_skills_json JSON,
  missing_skills_json JSON,
  match_percentage DECIMAL(5,2) DEFAULT 0,
  missing_details_json JSON,
  roadmap_json JSON,
  recommendations_json JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_skill_gaps_user_created (user_id, created_at),
  CONSTRAINT fk_skill_gaps_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  type VARCHAR(60),
  description TEXT,
  skills_json JSON,
  salary_json JSON,
  posted_date DATETIME NULL,
  application_deadline DATETIME NULL,
  url TEXT,
  source VARCHAR(80),
  is_remote TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_jobs (
  user_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(120) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, job_id),
  CONSTRAINT fk_saved_jobs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_saved_jobs_job FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interviews (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  role VARCHAR(120) NOT NULL,
  category VARCHAR(30) DEFAULT 'Technical',
  status VARCHAR(30) DEFAULT 'in_progress',
  questions_json JSON,
  total_duration INT NULL,
  score DECIMAL(5,2) NULL,
  feedback TEXT NULL,
  completed_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_interviews_user_created (user_id, created_at),
  CONSTRAINT fk_interviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  role VARCHAR(20) NOT NULL,
  topic VARCHAR(50) DEFAULT 'career-guidance',
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_chat_messages_user_created (user_id, created_at),
  CONSTRAINT fk_chat_messages_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
