-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS university;

-- ==========================
-- OLTP TABLES (Transactional)
-- ==========================

-- Departments
CREATE TABLE IF NOT EXISTS university.department (
  dept_id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- Instructors
CREATE TABLE IF NOT EXISTS university.instructor (
  instructor_id SERIAL PRIMARY KEY,
  dept_id INT NOT NULL REFERENCES university.department(dept_id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Students
CREATE TABLE IF NOT EXISTS university.student (
  student_id SERIAL PRIMARY KEY,
  student_number VARCHAR(20) UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_student_email ON university.student(email);

-- Courses
CREATE TABLE IF NOT EXISTS university.course (
  course_id SERIAL PRIMARY KEY,
  dept_id INT NOT NULL REFERENCES university.department(dept_id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL,
  title TEXT NOT NULL,
  credits NUMERIC(3,1) NOT NULL,
  UNIQUE(dept_id, code)
);

-- Sections
CREATE TABLE IF NOT EXISTS university.section (
  section_id SERIAL PRIMARY KEY,
  course_id INT NOT NULL REFERENCES university.course(course_id) ON DELETE CASCADE,
  section_code VARCHAR(16) NOT NULL,
  instructor_id INT REFERENCES university.instructor(instructor_id) ON DELETE SET NULL,
  capacity INT NOT NULL CHECK (capacity >= 0),
  UNIQUE (course_id, section_code)
);
CREATE INDEX IF NOT EXISTS idx_section_course ON university.section(course_id);

-- Section Seat Tracker
CREATE TABLE IF NOT EXISTS university.section_seat (
  section_id INT PRIMARY KEY REFERENCES university.section(section_id) ON DELETE CASCADE,
  capacity INT NOT NULL CHECK (capacity >= 0),
  enrolled_count INT NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 1
);

-- Initialize section seats
INSERT INTO university.section_seat (section_id, capacity, enrolled_count)
SELECT section_id, capacity, 0 FROM university.section
ON CONFLICT (section_id) DO NOTHING;

-- Enrollments
CREATE TABLE IF NOT EXISTS university.enrollment (
  enrollment_id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES university.student(student_id) ON DELETE CASCADE,
  section_id INT NOT NULL REFERENCES university.section(section_id) ON DELETE CASCADE,
  UNIQUE (student_id, section_id)
);
CREATE INDEX IF NOT EXISTS idx_enrollment_section ON university.enrollment(section_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_student ON university.enrollment(student_id);

-- ==========================
-- OLAP TABLES (Analytical)
-- ==========================

-- Department Dimension
CREATE TABLE IF NOT EXISTS university.dim_department (
  dept_key SERIAL PRIMARY KEY,
  dept_id INT,
  dept_name TEXT,
  dept_code VARCHAR(10)
);

-- Instructor Dimension
CREATE TABLE IF NOT EXISTS university.dim_instructor (
  instructor_key SERIAL PRIMARY KEY,
  instructor_id INT,
  full_name TEXT,
  email VARCHAR(100),
  dept_key INT REFERENCES university.dim_department(dept_key)
);

-- Course Dimension
CREATE TABLE IF NOT EXISTS university.dim_course (
  course_key SERIAL PRIMARY KEY,
  course_id INT,
  course_code VARCHAR(20),
  course_title TEXT,
  credits NUMERIC(3,1),
  dept_key INT REFERENCES university.dim_department(dept_key)
);

-- Section Dimension
CREATE TABLE IF NOT EXISTS university.dim_section (
  section_key SERIAL PRIMARY KEY,
  section_id INT,
  section_code VARCHAR(16),
  capacity INT,
  instructor_key INT REFERENCES university.dim_instructor(instructor_key),
  course_key INT REFERENCES university.dim_course(course_key)
);

-- Student Dimension
CREATE TABLE IF NOT EXISTS university.dim_student (
  student_key SERIAL PRIMARY KEY,
  student_id INT,
  student_number VARCHAR(20),
  full_name TEXT,
  email VARCHAR(100)
);

-- Fact Table
CREATE TABLE IF NOT EXISTS university.fact_enrollment (
  enrollment_key SERIAL PRIMARY KEY,
  student_key INT REFERENCES university.dim_student(student_key),
  section_key INT REFERENCES university.dim_section(section_key),
  course_key INT REFERENCES university.dim_course(course_key),
  instructor_key INT REFERENCES university.dim_instructor(instructor_key),
  dept_key INT REFERENCES university.dim_department(dept_key)
);

INSERT INTO university.department (code, name) VALUES
('CS', 'Computer Science'),
('ENG', 'Engineering'),
('BIO', 'Biology'),
('CHE', 'Chemistry'),
('PHY', 'Physics'),
('CLA', 'Liberal Arts'),
('MUS', 'Music'),
('ART', 'Art'),
('EDU', 'Education'),
('MATH', 'Mathematics')
ON CONFLICT (code) DO NOTHING;

INSERT INTO university.instructor (dept_id, first_name, last_name, email) VALUES
(1, 'Alice', 'Reyes', 'alice.reyes@univ.edu'),
(1, 'Bob', 'Tan', 'bob.tan@univ.edu'),
(2, 'Clara', 'Dela Cruz', 'clara@univ.edu'),
(2, 'David', 'Lim', 'david.lim@univ.edu'),
(3, 'Eva', 'Garcia', 'eva.garcia@univ.edu'),
(4, 'Frank', 'Wong', 'frank.wong@univ.edu'),
(5, 'Grace', 'Nguyen', 'grace.nguyen@univ.edu'),
(6, 'Hannah', 'Lee', 'hannah.lee@univ.edu'),
(7, 'Ian', 'Martinez', 'ian.martinez@univ.edu'),
(8, 'Jasmine', 'Lopez', 'jasmine.lopez@univ.edu'),
(9, 'Kevin', 'Hernandez', 'kevin.hernandez@univ.edu'),
(10, 'Lily', 'Gonzalez', 'lily.gonzalez@univ.edu'),
(1, 'Michael', 'Smith', 'michael.smith@univ.edu'),
(2, 'Nina', 'Johnson', 'nina.johnson@univ.edu'),
(3, 'Oscar', 'Brown', 'oscar.brown@univ.edu'),
(4, 'Paula', 'Davis', 'paula.davis@univ.edu'),
(5, 'Quinn', 'Miller', 'quinn.miller@univ.edu'),
(6, 'Rachel', 'Wilson', 'rachel.wilson@univ.edu'),
(7, 'Sam', 'Moore', 'sam.moore@univ.edu'),
(8, 'Tina', 'Taylor', 'tina.taylor@univ.edu'),
(9, 'Uma', 'Anderson', 'uma.anderson@univ.edu'),
(10, 'Victor', 'Thomas', 'victor.thomas@univ.edu'),
(1, 'Wendy', 'Jackson', 'wendy.jackson@univ.edu'),
(2, 'Xander', 'White', 'xander.white@univ.edu'),
(3, 'Yara', 'Harris', 'yara.harris@univ.edu'),
(4, 'Zane', 'Martin', 'zane.martin@univ.edu'),
(5, 'Aaron', 'Thompson', 'aaron.thompson@univ.edu'),
(6, 'Bella', 'Scott', 'bella.scott@univ.edu'),
(7, 'Carlos', 'Adams', 'carlos.adams@univ.edu'),
(8, 'Diana', 'Nelson', 'diana.nelson@univ.edu'),
(9, 'Ethan', 'Carter', 'ethan.carter@univ.edu'),
(10, 'Fiona', 'Mitchell', 'fiona.mitchell@univ.edu'),
(1, 'George', 'Perez', 'george.perez@univ.edu'),
(2, 'Hailey', 'Roberts', 'hailey.roberts@univ.edu'),
(3, 'Isaac', 'Turner', 'isaac.turner@univ.edu'),
(4, 'Jocelyn', 'Phillips', 'jocelyn.phillips@univ.edu'),
(5, 'Kyle', 'Campbell', 'kyle.campbell@univ.edu'),
(6, 'Laura', 'Parker', 'laura.parker@univ.edu'),
(7, 'Mason', 'Evans', 'mason.evans@univ.edu'),
(8, 'Nora', 'Edwards', 'nora.edwards@univ.edu'),
(9, 'Owen', 'Collins', 'owen.collins@univ.edu'),
(10, 'Penelope', 'Stewart', 'penelope.stewart@univ.edu'),
(1, 'Quentin', 'Sanchez', 'quentin.sanchez@univ.edu'),
(2, 'Riley', 'Morris', 'riley.morris@univ.edu'),
(3, 'Sophia', 'Rogers', 'sophia.rogers@univ.edu'),
(4, 'Tristan', 'Cook', 'tristan.cook@univ.edu'),
(5, 'Ursula', 'Murphy', 'ursula.murphy@univ.edu'),
(6, 'Victor', 'Bailey', 'victor.bailey@univ.edu'),
(7, 'Willow', 'Rivera', 'willow.rivera@univ.edu'),
(8, 'Xavier', 'Cooper', 'xavier.cooper@univ.edu'),
(9, 'Yvonne', 'Richardson', 'yvonne.richardson@univ.edu'),
(10, 'Zachary', 'Howard', 'zachary.howard@univ.edu'),
(1, 'Ariana', 'Ward', 'ariana.ward@univ.edu'),
(2, 'Benjamin', 'Brooks', 'benjamin.brooks@univ.edu'),
(3, 'Caitlyn', 'Gray', 'caitlyn.gray@univ.edu'),
(4, 'Derrick', 'Watson', 'derrick.watson@univ.edu'),
(5, 'Elena', 'James', 'elena.james@univ.edu')
ON CONFLICT (email) DO NOTHING;

INSERT INTO university.student (student_number, first_name, last_name, email) VALUES
('S1001', 'Julian', 'Briones', 'julian@univ.edu'),
('S1002', 'Ella', 'Dela Cruz', 'ella@univ.edu'),
('S1003', 'Mark', 'Villanueva', 'mark@univ.edu')
ON CONFLICT (student_number) DO NOTHING;

-- still need to add courses and sections
INSERT INTO university.course (dept_id, code, title, credits) VALUES
(1, 'CS101', 'Intro to Programming', 3.0),
(1, 'CS102', 'Data Structures', 3.0),
(2, 'ENG101', 'Statics', 3.0)
ON CONFLICT (dept_id, code) DO NOTHING;

INSERT INTO university.section (course_id, section_code, instructor_id, capacity) VALUES
(1, 'A', 1, 30),
(1, 'B', 2, 25),
(2, 'A', 3, 40)
ON CONFLICT (course_id, section_code) DO NOTHING;