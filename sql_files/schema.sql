-- Single schema as specified

CREATE SCHEMA university;

-- OLTP TABLES (Transactional)

-- Departments
CREATE TABLE university.department (
  dept_id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- Instructors
CREATE TABLE university.instructor (
  instructor_id SERIAL PRIMARY KEY,
  dept_id INT NOT NULL REFERENCES university.department(dept_id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Students
CREATE TABLE university.student (
  student_id SERIAL PRIMARY KEY,
  student_number VARCHAR(20) UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE INDEX idx_student_email ON university.student(email);

-- Courses (catalog)
CREATE TABLE university.course (
  course_id SERIAL PRIMARY KEY,
  dept_id INT NOT NULL REFERENCES university.department(dept_id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL, -- e.g., CS101
  title TEXT NOT NULL,
  credits NUMERIC(3,1) NOT NULL,
  UNIQUE(dept_id, code)
);

-- Sections (scheduled offerings)
CREATE TABLE university.section (
  section_id SERIAL PRIMARY KEY,
  course_id INT NOT NULL REFERENCES university.course(course_id) ON DELETE CASCADE,
  section_code VARCHAR(16) NOT NULL, -- e.g., A, B, LEC01
  instructor_id INT REFERENCES university.instructor(instructor_id) ON DELETE SET NULL,
  capacity INT NOT NULL CHECK (capacity >= 0),
  UNIQUE (course_id, section_code)
);

CREATE INDEX idx_section_course ON university.section(course_id);

-- Section Seat Tracker (for concurrency control)
CREATE TABLE university.section_seat (
  section_id INT PRIMARY KEY REFERENCES university.section(section_id) ON DELETE CASCADE,
  capacity INT NOT NULL CHECK (capacity >= 0),
  enrolled_count INT NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 1
);

-- Initialize seats from section capacity
INSERT INTO university.section_seat (section_id, capacity, enrolled_count)
SELECT section_id, capacity, 0 FROM university.section
ON CONFLICT (section_id) DO NOTHING;

-- Enrollments (linking students to sections)
CREATE TABLE university.enrollment (
  enrollment_id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES university.student(student_id) ON DELETE CASCADE,
  section_id INT NOT NULL REFERENCES university.section(section_id) ON DELETE CASCADE,
  UNIQUE (student_id, section_id)
);

CREATE INDEX idx_enrollment_section ON university.enrollment(section_id);
CREATE INDEX idx_enrollment_student ON university.enrollment(student_id);

-- OLAP TABLES (Analytical)

-- Department Dimension
CREATE TABLE university.dim_department (
  dept_key SERIAL PRIMARY KEY,
  dept_id INT,
  dept_name TEXT,
  dept_code VARCHAR(10)
);

-- Instructor Dimension
CREATE TABLE university.dim_instructor (
  instructor_key SERIAL PRIMARY KEY,
  instructor_id INT,
  full_name TEXT,
  email VARCHAR(100),
  dept_key INT REFERENCES university.dim_department(dept_key)
);

-- Course Dimension
CREATE TABLE university.dim_course (
  course_key SERIAL PRIMARY KEY,
  course_id INT,
  course_code VARCHAR(20),
  course_title TEXT,
  credits NUMERIC(3,1),
  dept_key INT REFERENCES university.dim_department(dept_key)
);

-- Section Dimension
CREATE TABLE university.dim_section (
  section_key SERIAL PRIMARY KEY,
  section_id INT,
  section_code VARCHAR(16),
  capacity INT,
  instructor_key INT REFERENCES university.dim_instructor(instructor_key),
  course_key INT REFERENCES university.dim_course(course_key)
);

-- Student Dimension
CREATE TABLE university.dim_student (
  student_key SERIAL PRIMARY KEY,
  student_id INT,
  student_number VARCHAR(20),
  full_name TEXT,
  email VARCHAR(100)
);

-- Fact Table
CREATE TABLE university.fact_enrollment (
  enrollment_key SERIAL PRIMARY KEY,
  student_key INT REFERENCES university.dim_student(student_key),
  section_key INT REFERENCES university.dim_section(section_key),
  course_key INT REFERENCES university.dim_course(course_key),
  instructor_key INT REFERENCES university.dim_instructor(instructor_key),
  dept_key INT REFERENCES university.dim_department(dept_key)
);