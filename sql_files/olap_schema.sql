CREATE SCHEMA IF NOT EXISTS university_oltp; -- This will be used as staging tables

CREATE TABLE university_oltp.department (
  dept_id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE university_oltp.instructor (
  instructor_id SERIAL PRIMARY KEY,
  dept_id INT NOT NULL REFERENCES university_oltp.department(dept_id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE university_oltp.student (
  student_id SERIAL PRIMARY KEY,
  student_number VARCHAR(20) UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE INDEX idx_student_email ON university_oltp.student(email);

CREATE TABLE university_oltp.course (
  course_id SERIAL PRIMARY KEY,
  dept_id INT NOT NULL REFERENCES university_oltp.department(dept_id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL,
  title TEXT NOT NULL,
  credits NUMERIC(3,1) NOT NULL,
  UNIQUE(dept_id, code)
);

CREATE TABLE university_oltp.section (
  section_id SERIAL PRIMARY KEY,
  course_id INT NOT NULL REFERENCES university_oltp.course(course_id) ON DELETE CASCADE,
  section_code VARCHAR(16) NOT NULL,
  instructor_id INT REFERENCES university_oltp.instructor(instructor_id) ON DELETE SET NULL,
  capacity INT NOT NULL CHECK (capacity >= 0),
  remaining_slots INT NOT NULL CHECK (remaining_slots >= 0),
  UNIQUE (course_id, section_code)
);

CREATE TABLE university_oltp.section_schedule (
  schedule_id SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES university_oltp.section(section_id) ON DELETE CASCADE,
  day_of_week VARCHAR(10) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE (section_id, day_of_week, start_time, end_time)
);

CREATE TABLE university_oltp.enrollment (
  enrollment_id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES university_oltp.student(student_id) ON DELETE CASCADE,
  section_id INT NOT NULL REFERENCES university_oltp.section(section_id) ON DELETE CASCADE,
  UNIQUE (student_id, section_id)
);

CREATE INDEX idx_enrollment_section ON university_oltp.enrollment(section_id);
CREATE INDEX idx_enrollment_student ON university_oltp.enrollment(student_id);

CREATE SCHEMA university_olap;

CREATE TABLE university_olap.dim_department (
    dept_key SERIAL PRIMARY KEY,
    dept_id INT UNIQUE,
    dept_name TEXT,
    dept_code VARCHAR(10)
);

CREATE TABLE university_olap.dim_instructor (
    instructor_key SERIAL PRIMARY KEY,
    instructor_id INT UNIQUE,
    full_name TEXT,
    email VARCHAR(100),
    dept_key INT REFERENCES university_olap.dim_department(dept_key)
);

CREATE TABLE university_olap.dim_course (
    course_key SERIAL PRIMARY KEY,
    course_id INT UNIQUE,
    course_code VARCHAR(20),
    course_title TEXT,
    credits NUMERIC(3,1),
    dept_key INT REFERENCES university_olap.dim_department(dept_key)
);

CREATE TABLE university_olap.dim_section (
    section_key SERIAL PRIMARY KEY,
    section_id INT UNIQUE,
    section_code VARCHAR(16),
    capacity INT,
    instructor_key INT REFERENCES university_olap.dim_instructor(instructor_key),
    course_key INT REFERENCES university_olap.dim_course(course_key)
);

CREATE TABLE university_olap.dim_student (
    student_key SERIAL PRIMARY KEY,
    student_id INT UNIQUE,
    student_number VARCHAR(20),
    full_name TEXT,
    email VARCHAR(100)
);

CREATE TABLE university_olap.fact_enrollment (
    enrollment_key SERIAL PRIMARY KEY,
    student_key INT REFERENCES university_olap.dim_student(student_key),
    section_key INT REFERENCES university_olap.dim_section(section_key),
    course_key INT REFERENCES university_olap.dim_course(course_key),
    instructor_key INT REFERENCES university_olap.dim_instructor(instructor_key),
    dept_key INT REFERENCES university_olap.dim_department(dept_key)
);

CREATE INDEX idx_section_course_id ON university_oltp.section(course_id);
CREATE INDEX idx_enrollment_section_id ON university_oltp.enrollment(section_id);
CREATE INDEX idx_section_instructor_id ON university_oltp.section(instructor_id);