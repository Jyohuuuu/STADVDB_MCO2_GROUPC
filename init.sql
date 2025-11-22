-- ill leave lots of comments in the docs for easier understanding
CREATE SCHEMA IF NOT EXISTS university;

-- ==========================
-- OLTP TABLES (Transactional)
-- ==========================
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
  code VARCHAR(20) NOT NULL,
  title TEXT NOT NULL,
  credits NUMERIC(3,1) NOT NULL,
  UNIQUE(dept_id, code)
);

-- Sections (scheduled offerings)
CREATE TABLE university.section (
  section_id SERIAL PRIMARY KEY,
  course_id INT NOT NULL REFERENCES university.course(course_id) ON DELETE CASCADE,
  section_code VARCHAR(16) NOT NULL,
  instructor_id INT REFERENCES university.instructor(instructor_id) ON DELETE SET NULL,
  capacity INT NOT NULL CHECK (capacity >= 0),
  remaining_slots INT NOT NULL CHECK (remaining_slots >= 0),
  UNIQUE (course_id, section_code)
);

CREATE TABLE university.section_schedule (
  schedule_id SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES university.section(section_id) ON DELETE CASCADE,
  day_of_week VARCHAR(10) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE (section_id, day_of_week, start_time, end_time)
);


-- Enrollments (linking students to sections)
CREATE TABLE university.enrollment (
  enrollment_id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES university.student(student_id) ON DELETE CASCADE,
  section_id INT NOT NULL REFERENCES university.section(section_id) ON DELETE CASCADE,
  UNIQUE (student_id, section_id)
);

CREATE INDEX idx_enrollment_section ON university.enrollment(section_id);
CREATE INDEX idx_enrollment_student ON university.enrollment(student_id);

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
(1, 'Alice', 'Reyes', 'alice.reyes@univ.edu'), -- ins_id 1
(1, 'Bob', 'Tan', 'bob.tan@univ.edu'), -- ins_id 2
(2, 'Clara', 'Dela Cruz', 'clara@univ.edu'),
(2, 'David', 'Lim', 'david.lim@univ.edu'),
(3, 'Eva', 'Garcia', 'eva.garcia@univ.edu'),
(4, 'Frank', 'Wong', 'frank.wong@univ.edu'),
(5, 'Grace', 'Nguyen', 'grace.nguyen@univ.edu'), -- ins_id 7
(6, 'Hannah', 'Lee', 'hannah.lee@univ.edu'),
(7, 'Ian', 'Martinez', 'ian.martinez@univ.edu'), --ins_id 9
(8, 'Jasmine', 'Lopez', 'jasmine.lopez@univ.edu'),
(9, 'Kevin', 'Hernandez', 'kevin.hernandez@univ.edu'),
(10, 'Lily', 'Gonzalez', 'lily.gonzalez@univ.edu'),
(1, 'Michael', 'Smith', 'michael.smith@univ.edu'), -- ins_id 13
(2, 'Nina', 'Johnson', 'nina.johnson@univ.edu'),
(3, 'Oscar', 'Brown', 'oscar.brown@univ.edu'),
(4, 'Paula', 'Davis', 'paula.davis@univ.edu'),
(5, 'Quinn', 'Miller', 'quinn.miller@univ.edu'),
(6, 'Rachel', 'Wilson', 'rachel.wilson@univ.edu'),
(7, 'Sam', 'Moore', 'sam.moore@univ.edu'),
(8, 'Tina', 'Taylor', 'tina.taylor@univ.edu'),
(9, 'Uma', 'Anderson', 'uma.anderson@univ.edu'), -- ins_id 21
(10, 'Victor', 'Thomas', 'victor.thomas@univ.edu'),
(1, 'Wendy', 'Jackson', 'wendy.jackson@univ.edu'), -- ins_id 23
(2, 'Xander', 'White', 'xander.white@univ.edu'),
(3, 'Yara', 'Harris', 'yara.harris@univ.edu'),
(4, 'Zane', 'Martin', 'zane.martin@univ.edu'),
(5, 'Aaron', 'Thompson', 'aaron.thompson@univ.edu'),
(6, 'Bella', 'Scott', 'bella.scott@univ.edu'),
(7, 'Carlos', 'Adams', 'carlos.adams@univ.edu'),
(8, 'Diana', 'Nelson', 'diana.nelson@univ.edu'), -- ins_id 30
(9, 'Ethan', 'Carter', 'ethan.carter@univ.edu'),
(10, 'Fiona', 'Mitchell', 'fiona.mitchell@univ.edu'),
(1, 'George', 'Perez', 'george.perez@univ.edu'),
(2, 'Hailey', 'Roberts', 'hailey.roberts@univ.edu'),
(3, 'Isaac', 'Turner', 'isaac.turner@univ.edu'),
(4, 'Jocelyn', 'Phillips', 'jocelyn.phillips@univ.edu'),
(5, 'Kyle', 'Campbell', 'kyle.campbell@univ.edu'),
(6, 'Laura', 'Parker', 'laura.parker@univ.edu'),
(7, 'Mason', 'Evans', 'mason.evans@univ.edu'),
(8, 'Nora', 'Edwards', 'nora.edwards@univ.edu'), -- ins_id 40
(9, 'Owen', 'Collins', 'owen.collins@univ.edu'),
(10, 'Penelope', 'Stewart', 'penelope.stewart@univ.edu'),
(1, 'Quentin', 'Sanchez', 'quentin.sanchez@univ.edu'),
(2, 'Riley', 'Morris', 'riley.morris@univ.edu'),
(3, 'Sophia', 'Rogers', 'sophia.rogers@univ.edu'),
(4, 'Tristan', 'Cook', 'tristan.cook@univ.edu'),
(5, 'Ursula', 'Murphy', 'ursula.murphy@univ.edu'),
(6, 'Victor', 'Bailey', 'victor.bailey@univ.edu'),
(7, 'Willow', 'Rivera', 'willow.rivera@univ.edu'),
(8, 'Xavier', 'Cooper', 'xavier.cooper@univ.edu'), -- ins_id 50
(9, 'Yvonne', 'Richardson', 'yvonne.richardson@univ.edu'),
(10, 'Zachary', 'Howard', 'zachary.howard@univ.edu'),
(1, 'Ariana', 'Ward', 'ariana.ward@univ.edu'),
(2, 'Benjamin', 'Brooks', 'benjamin.brooks@univ.edu'),
(3, 'Caitlyn', 'Gray', 'caitlyn.gray@univ.edu'),
(4, 'Derrick', 'Watson', 'derrick.watson@univ.edu'),
(5, 'Elena', 'James', 'elena.james@univ.edu'),
(6, 'Felix', 'Scott', 'felix.scott@univ.edu'),
(7, 'Gabriella', 'Adams', 'gabriella.adams@univ.edu'),
(8, 'Henry', 'Nelson', 'henry.nelson@univ.edu'), -- ins_id 60
(9, 'Isabel', 'Carter', 'isabel.carter@univ.edu'),
(10, 'Jack', 'Mitchell', 'jack.mitchell@univ.edu'),
(1, 'Katherine', 'Perez', 'katherine.perez@univ.edu'),
(2, 'Landon', 'Roberts', 'landon.roberts@univ.edu'),
(3, 'Maya', 'Turner', 'maya.turner@univ.edu'),
(4, 'Nathan', 'Phillips', 'nathan.phillips@univ.edu'),
(5, 'Olivia', 'Campbell', 'olivia.campbell@univ.edu'),
(6, 'Patrick', 'Parker', 'patrick.parker@univ.edu'),
(7, 'Quincy', 'Evans', 'quincy.evans@univ.edu'),
(8, 'Rebecca', 'Edwards', 'rebecca.edwards@univ.edu'), -- ins_id 70
(9, 'Steven', 'Collins', 'steven.collins@univ.edu'),
(10, 'Theresa', 'Stewart', 'theresa.stewart@univ.edu')
ON CONFLICT (email) DO NOTHING;

INSERT INTO university.student (student_number, first_name, last_name, email) VALUES
('S1001', 'Julian', 'Briones', 'julian.briones@univ.edu'),
('S1002', 'Ella', 'Dela Cruz', 'ella.dela.cruz@univ.edu'),
('S1003', 'Mark', 'Villanueva', 'mark.villanueva@univ.edu'),
('S1004', 'Sophia', 'Garcia', 'sophia.garcia@univ.edu'),
('S1005', 'Liam', 'Reyes', 'liam.reyes@univ.edu'),
('S1006', 'Olivia', 'Tan', 'olivia.tan@univ.edu'),
('S1007', 'Noah', 'Davis', 'noah.davis@univ.edu'),
('S1008', 'Ava', 'Martinez', 'ava.martinez@univ.edu'),
('S1009', 'Elijah', 'Hernandez', 'elijah.hernandez@univ.edu'),
('S1010', 'Isabella', 'Lopez', 'isabella.lopez@univ.edu'),
('S1011', 'James', 'Gonzalez', 'james.gonzalez@univ.edu'),
('S1012', 'Mia', 'Wilson', 'mia.wilson@univ.edu'),
('S1013', 'Benjamin', 'Anderson', 'benjamin.anderson@univ.edu'),
('S1014', 'Charlotte', 'Thomas', 'charlotte.thomas@univ.edu'),
('S1015', 'Lucas', 'Moore', 'lucas.moore@univ.edu'),
('S1016', 'Amelia', 'Taylor', 'amelia.taylor@univ.edu'),
('S1017', 'Mason', 'Jackson', 'mason.jackson@univ.edu'),
('S1018', 'Harper', 'White', 'harper.white@univ.edu'),
('S1019', 'Ethan', 'Harris', 'ethan.harris@univ.edu'),
('S1020', 'Evelyn', 'Martin', 'evelyn.martin@univ.edu'),
('S1021', 'Alexander', 'Thompson', 'alexander.thompson@univ.edu'),
('S1022', 'Sofia', 'Scott', 'sofia.scott@univ.edu'),
('S1023', 'Henry', 'Adams', 'henry.adams@univ.edu'),
('S1024', 'Ella', 'Nelson', 'ella.nelson@univ.edu'),
('S1025', 'Jacob', 'Carter', 'jacob.carter@univ.edu'),
('S1026', 'Scarlett', 'Mitchell', 'scarlett.mitchell@univ.edu'),
('S1027', 'Michael', 'Perez', 'michael.perez@univ.edu'),
('S1028', 'Aria', 'Roberts', 'aria.roberts@univ.edu'),
('S1029', 'Daniel', 'Turner', 'daniel.turner@univ.edu'),
('S1030', 'Luna', 'Phillips', 'luna.phillips@univ.edu'),
('S1031', 'Matthew', 'Campbell', 'matthew.campbell@univ.edu'),
('S1032', 'Zoe', 'Parker', 'zoe.parker@univ.edu'),
('S1033', 'Joseph', 'Evans', 'joseph.evans@univ.edu'),
('S1034', 'Lily', 'Edwards', 'lily.edwards@univ.edu'),
('S1035', 'Samuel', 'Collins', 'samuel.collins@univ.edu'),
('S1036', 'Hannah', 'Stewart', 'hannah.stewart@univ.edu'),
('S1037', 'David', 'Sanchez', 'david.sanchez@univ.edu'),
('S1038', 'Grace', 'Morris', 'grace.morris@univ.edu'),
('S1039', 'Carter', 'Rogers', 'carter.rogers@univ.edu'),
('S1040', 'Chloe', 'Cook', 'chloe.cook@univ.edu'),
('S1041', 'Owen', 'Murphy', 'owen.murphy@univ.edu'),
('S1042', 'Penelope', 'Bailey', 'penelope.bailey@univ.edu'),
('S1043', 'Wyatt', 'Rivera', 'wyatt.rivera@univ.edu'),
('S1044', 'Lillian', 'Cooper', 'lillian.cooper@univ.edu'),
('S1045', 'Jack', 'Richardson', 'jack.richardson@univ.edu'),
('S1046', 'Nora', 'Howard', 'nora.howard@univ.edu'),
('S1047', 'Luke', 'Ward', 'luke.ward@univ.edu'),
('S1048', 'Zara', 'Brooks', 'zara.brooks@univ.edu'),
('S1049', 'Gabriel', 'Gray', 'gabriel.gray@univ.edu'),
('S1050', 'Violet', 'Watson', 'violet.watson@univ.edu'),
('S1051', 'Cameron', 'James', 'cameron.james@univ.edu'),
('S1052', 'Aurora', 'Scott', 'aurora.scott@univ.edu'),
('S1053', 'Eli', 'Adams', 'eli.adams@univ.edu'),
('S1054', 'Savannah', 'Nelson', 'savannah.nelson@univ.edu'),
('S1055', 'Isaiah', 'Carter', 'isaiah.carter@univ.edu'),
('S1056', 'Audrey', 'Mitchell', 'audrey.mitchell@univ.edu'),
('S1057', 'Anthony', 'Perez', 'anthony.perez@univ.edu'),
('S1058', 'Brooklyn', 'Roberts', 'brooklyn.roberts@univ.edu'),
('S1059', 'Thomas', 'Turner', 'thomas.turner@univ.edu'),
('S1060', 'Claire', 'Phillips', 'claire.phillips@univ.edu'),
('S1061', 'Charles', 'Campbell', 'charles.campbell@univ.edu'),
('S1062', 'Skylar', 'Parker', 'skylar.parker@univ.edu'),
('S1063', 'Josiah', 'Evans', 'josiah.evans@univ.edu'),
('S1064', 'Genesis', 'Edwards', 'genesis.edwards@univ.edu'),
('S1065', 'Hudson', 'Collins', 'hudson.collins@univ.edu'),
('S1066', 'Aaliyah', 'Stewart', 'aaliyah.stewart@univ.edu'),
('S1067', 'Lincoln', 'Sanchez', 'lincoln.sanchez@univ.edu'),
('S1068', 'Madelyn', 'Morris', 'madelyn.morris@univ.edu'),
('S1069', 'Nathan', 'Rogers', 'nathan.rogers@univ.edu'),
('S1070', 'Ruby', 'Cook', 'ruby.cook@univ.edu'),
('S1071', 'Caleb', 'Murphy', 'caleb.murphy@univ.edu'),
('S1072', 'Serenity', 'Bailey', 'serenity.bailey@univ.edu'),
('S1073', 'Ryan', 'Rivera', 'ryan.rivera@univ.edu'),
('S1074', 'Eva', 'Cooper', 'eva.cooper@univ.edu'),
('S1075', 'Adrian', 'Richardson', 'adrian.richardson@univ.edu'),
('S1076', 'Autumn', 'Howard', 'autumn.howard@univ.edu'),
('S1077', 'Christian', 'Ward', 'christian.ward@univ.edu'),
('S1078', 'Hailey', 'Brooks', 'hailey.brooks@univ.edu'),
('S1079', 'Ezekiel', 'Gray', 'ezekiel.gray@univ.edu'),
('S1080', 'Alice', 'Watson', 'alice.watson@univ.edu'),
('S1081', 'Colton', 'James', 'colton.james@univ.edu'),
('S1082', 'Anna', 'Scott', 'anna.scott@univ.edu'),
('S1083', 'Jordan', 'Adams', 'jordan.adams@univ.edu'),
('S1084', 'Vivian', 'Nelson', 'vivian.nelson@univ.edu'),
('S1085', 'Brayden', 'Carter', 'brayden.carter@univ.edu'),
('S1086', 'Kennedy', 'Mitchell', 'kennedy.mitchell@univ.edu'),
('S1087', 'Ian', 'Perez', 'ian.perez@univ.edu'),
('S1088', 'Sadie', 'Roberts', 'sadie.roberts@univ.edu'),
('S1089', 'Austin', 'Turner', 'austin.turner@univ.edu'),
('S1090', 'Peyton', 'Phillips', 'peyton.phillips@univ.edu'),
('S1091', 'Jordan', 'Campbell', 'jordan.campbell@univ.edu'),
('S1092', 'Clara', 'Parker', 'clara.parker@univ.edu'),
('S1093', 'Adam', 'Evans', 'adam.evans@univ.edu'),
('S1094', 'Ariana', 'Edwards', 'ariana.edwards@univ.edu'),
('S1095', 'Evan', 'Collins', 'evan.collins@univ.edu'),
('S1096', 'Liliana', 'Stewart', 'liliana.stewart@univ.edu'),
('S1097', 'Jason', 'Sanchez', 'jason.sanchez@univ.edu'),
('S1098', 'Maria', 'Morris', 'maria.morris@univ.edu'),
('S1099', 'Cole', 'Rogers', 'cole.rogers@univ.edu'),
('S1100', 'Kinsley', 'Cook', 'kinsley.cook@univ.edu')
ON CONFLICT (student_number) DO NOTHING;

INSERT INTO university.course (dept_id, code, title, credits) VALUES
(1,'CS101','Intro to Programming',3.0),
(1,'CS102','Data Structures',3.0),
(1,'CS201','Algorithms',3.0),
(1,'CS202','Computer Architecture',3.0),
(1,'CS301','Operating Systems',3.0),

(2,'ENG101','Statics',3.0),
(2,'ENG102','Dynamics',3.0),
(2,'ENG201','Thermodynamics',3.0),
(2,'ENG202','Fluid Mechanics',3.0),
(2,'ENG301','Engineering Materials',3.0),

(3,'BIO101','General Biology',3.0),
(3,'BIO102','Cell Biology',3.0),
(3,'BIO201','Genetics',3.0),
(3,'BIO202','Microbiology',3.0),
(3,'BIO301','Molecular Biology',3.0),

(4,'CHE101','General Chemistry',3.0),
(4,'CHE102','Organic Chemistry',3.0),
(4,'CHE201','Physical Chemistry',3.0),
(4,'CHE202','Analytical Chemistry',3.0),
(4,'CHE301','Biochemistry',3.0),

(5,'PHY101','Classical Mechanics',3.0),
(5,'PHY102','Electromagnetism',3.0),
(5,'PHY201','Quantum Physics',3.0),
(5,'PHY202','Thermodynamics',3.0),
(5,'PHY301','Optics',3.0),

(6,'CLA101','World Literature',3.0),
(6,'CLA102','Creative Writing',3.0),
(6,'CLA201','Philosophy',3.0),
(6,'CLA202','Ethics',3.0),
(6,'CLA301','Humanities Seminar',3.0),

(7,'MUS101','Music Theory',3.0),
(7,'MUS102','Music History',3.0),
(7,'MUS201','Composition',3.0),
(7,'MUS202','Conducting',3.0),
(7,'MUS301','Advanced Performance',3.0),

(8,'ART101','Drawing I',3.0),
(8,'ART102','Painting I',3.0),
(8,'ART201','Sculpture',3.0),
(8,'ART202','Digital Arts',3.0),
(8,'ART301','Advanced Studio',3.0),

(9,'EDU101','Foundations of Education',3.0),
(9,'EDU102','Educational Psychology',3.0),
(9,'EDU201','Assessment of Learning',3.0),
(9,'EDU202','Curriculum Development',3.0),
(9,'EDU301','Teaching Strategies',3.0),

(10,'MATH101','College Algebra',3.0),
(10,'MATH102','Trigonometry',3.0),
(10,'MATH201','Calculus I',3.0),
(10,'MATH202','Calculus II',3.0),
(10,'MATH301','Linear Algebra',3.0)
ON CONFLICT (dept_id, code) DO NOTHING;

INSERT INTO university.section (course_id, section_code, instructor_id, capacity, remaining_slots) VALUES
(1, 'A', 1, 40, 40),
(1, 'B', 1, 40, 40),
(1, 'C', 2, 40, 40),
(1, 'D', 2, 40, 40),
-- Data Structures Sections
(2, 'A', 1, 35, 35),
(2, 'B', 1, 35, 35),
(2, 'C', 2, 35, 35),
(2, 'D', 2, 35, 35),
-- Algorithms Sections
(3, 'A', 13, 40, 40),
(3, 'B', 13, 40, 40),
(3, 'C', 23, 40, 40),
(3, 'D', 23, 40, 40),
-- Computer Architecture Sections
(4, 'A', 1, 25, 25),
(4, 'B', 2, 25, 25),
(4, 'C', 13, 25, 25),
(4, 'D', 23, 25, 25),
-- Operating Systems Sections
(5, 'A', 33, 25, 25),
(5, 'B', 33, 25, 25),
(5, 'C', 43, 25, 25),
(5, 'D', 43, 25, 25),
-- Dept: ENG Statistics
(6, 'A', 4, 40, 40),
(6, 'B', 4, 40, 40),
(6, 'C', 14, 40, 40),
(6, 'D', 14, 40, 40),
-- Dynamics
(7, 'A', 4, 25, 25),
(7, 'B', 4, 25, 25),
(7, 'C', 24, 25, 25),
(7, 'D', 24, 25, 25),
-- Thermodynamics
(8, 'A', 34, 40, 40),
(8, 'B', 34, 40, 40),
(8, 'C', 44, 40, 40),
(8, 'D', 44, 40, 40),
-- Fluid Mechanics
(9, 'A', 4, 25, 25),
(9, 'B', 4, 25, 25),
(9, 'C', 14, 25, 25),
(9, 'D', 14, 25, 25),
-- Engineering Materials
(10, 'A', 54, 25, 25),
(10, 'B', 54, 25, 25),
(10, 'C', 64, 25, 25),
(10, 'D', 64, 25, 25),
-- Dept: BIO General Biology
(11, 'A', 5, 40, 40),
(11, 'B', 5, 40, 40),
(11, 'C', 15, 40, 40),
(11, 'D', 15, 40, 40),
-- Cell Biology
(12, 'A', 5, 40, 40),
(12, 'B', 5, 40, 40),
(12, 'C', 25, 40, 40),
(12, 'D', 25, 40, 40),
-- Genetics
(13, 'A', 35, 40, 40),
(13, 'B', 35, 40, 40),
(13, 'C', 45, 40, 40),
(13, 'D', 45, 40, 40),
-- Microbiology
(14, 'A', 5, 25, 25),
(14, 'B', 5, 25, 25),
(14, 'C', 15, 25, 25),
(14, 'D', 15, 25, 25),
-- Molecular Biology
(15, 'A', 55, 25, 25),
(15, 'B', 55, 25, 25),
(15, 'C', 65, 25, 25),
(15, 'D', 65, 25, 25),
-- Dept: CHE General Chemistry
(16, 'A', 6, 60, 60),
(16, 'B', 6, 60, 60),
(16, 'C', 16, 60, 60),
(16, 'D', 16, 60, 60),
-- Organic Chemistry
(17, 'A', 6, 40, 40),
(17, 'B', 6, 40, 40),
(17, 'C', 26, 40, 40),
(17, 'D', 26, 40, 40),
-- Physical Chemistry
(18, 'A', 36, 40, 40),
(18, 'B', 36, 40, 40),
(18, 'C', 46, 40, 40),
(18, 'D', 46, 40, 40),
-- Analytical Chemistry
(19, 'A', 6, 25, 25),
(19, 'B', 6, 25, 25),
(19, 'C', 16, 25, 25),
(19, 'D', 16, 25, 25),
-- Biochemistry
(20, 'A', 56, 25, 25),
(20, 'B', 56, 25, 25),
(20, 'C', 66, 25, 25),
(20, 'D', 66, 25, 25),
-- Dept: PHY Classical Mechanics
(21, 'A', 7, 40, 40),
(21, 'B', 7, 40, 40),
(21, 'C', 17, 40, 40),
(21, 'D', 17, 40, 40),
-- Electromagnetism
(22, 'A', 7, 40, 40),
(22, 'B', 7, 40, 40),
(22, 'C', 27, 40, 40),
(22, 'D', 27, 40, 40),
-- Quantum Physics
(23, 'A', 37, 25, 25),
(23, 'B', 37, 25, 25),
(23, 'C', 47, 25, 25),
(23, 'D', 47, 25, 25),
-- Thermodynamics
(24, 'A', 7, 25, 25),
(24, 'B', 7, 25, 25),
(24, 'C', 17, 25, 25),
(24, 'D', 17, 25, 25),
-- Optics
(25, 'A', 57, 25, 25),
(25, 'B', 57, 25, 25),
(25, 'C', 67, 25, 25),
(25, 'D', 67, 25, 25),
-- Dept: CLA World Literature
(26, 'A', 8, 40, 40),
(26, 'B', 8, 40, 40),
(26, 'C', 18, 40, 40),
(26, 'D', 18, 40, 40),
-- Creative Writing
(27, 'A', 8, 40, 40),
(27, 'B', 8, 40, 40),
(27, 'C', 28, 40, 40),
(27, 'D', 28, 40, 40),
-- Philosophy
(28, 'A', 38, 25, 25),
(28, 'B', 38, 25, 25),
(28, 'C', 48, 25, 25),
(28, 'D', 48, 25, 25),
-- Ethics
(29, 'A', 8, 40, 40),
(29, 'B', 8, 40, 40),
(29, 'C', 18, 40, 40),
(29, 'D', 18, 40, 40),
-- Humanities Seminar
(30, 'A', 58, 40, 40),
(30, 'B', 58, 40, 40),
(30, 'C', 68, 40, 40),
(30, 'D', 68, 40, 40),
-- Dept: MUS Music Theory
(31, 'A', 9, 40, 40),
(31, 'B', 9, 40, 40),
(31, 'C', 19, 40, 40),
(31, 'D', 19, 40, 40),
-- Music History
(32, 'A', 9, 40, 40),
(32, 'B', 9, 40, 40),
(32, 'C', 29, 40, 40),
(32, 'D', 29, 40, 40),
-- Composition
(33, 'A', 39, 25, 25),
(33, 'B', 39, 25, 25),
(33, 'C', 49, 25, 25),
(33, 'D', 49, 25, 25),
-- Conducting
(34, 'A', 9, 25, 25),
(34, 'B', 9, 25, 25),
(34, 'C', 19, 25, 25),
(34, 'D', 19, 25, 25),
-- Advanced Performance
(35, 'A', 59, 25, 25),
(35, 'B', 59, 25, 25),
(35, 'C', 69, 25, 25),
(35, 'D', 69, 25, 25),
-- Dept: ART Drawing I
(36, 'A', 10, 40, 40),
(36, 'B', 10, 40, 40),
(36, 'C', 20, 40, 40),
(36, 'D', 20, 40, 40),
-- Painting I
(37, 'A', 10, 40, 40),
(37, 'B', 10, 40, 40),
(37, 'C', 30, 40, 40),
(37, 'D', 30, 40, 40),
-- Sculpture
(38, 'A', 40, 25, 25),
(38, 'B', 40, 25, 25),
(38, 'C', 50, 25, 25),
(38, 'D', 50, 25, 25),
-- Digital Arts
(39, 'A', 10, 40, 40),
(39, 'B', 10, 40, 40),
(39, 'C', 20, 40, 40),
(39, 'D', 20, 40, 40),
-- Advanced Studio
(40, 'A', 60, 25, 25),
(40, 'B', 60, 25, 25),
(40, 'C', 70, 25, 25),
(40, 'D', 70, 25, 25),
-- Dept: EDU Foundations of Education
(41, 'A', 11, 60, 60),
(41, 'B', 11, 60, 60),
(41, 'C', 21, 60, 60),
(41, 'D', 21, 60, 60),
-- Educational Psychology
(42, 'A', 11, 40, 40),
(42, 'B', 11, 40, 40),
(42, 'C', 31, 40, 40),
(42, 'D', 31, 40, 40),
-- Assessment of Learning
(43, 'A', 41, 40, 40),
(43, 'B', 41, 40, 40),
(43, 'C', 51, 40, 40),
(43, 'D', 51, 40, 40),
-- Curriculum Development
(44, 'A', 11, 25, 25),
(44, 'B', 11, 25, 25),
(44, 'C', 21, 25, 25),
(44, 'D', 21, 25, 25),
-- Teaching Strategies
(45, 'A', 61, 25, 25),
(45, 'B', 61, 25, 25),
(45, 'C', 71, 25, 25),
(45, 'D', 71, 25, 25),
-- Dept: MATH College Algebra
(46, 'A', 12, 60, 60),
(46, 'B', 12, 60, 60),
(46, 'C', 22, 60, 60),
(46, 'D', 22, 60, 60),
-- Trigonometry
(47, 'A', 12, 40, 40),
(47, 'B', 12, 40, 40),
(47, 'C', 32, 40, 40),
(47, 'D', 32, 40, 40),
-- Calculus I
(48, 'A', 42, 40, 40),
(48, 'B', 42, 40, 40),
(48, 'C', 52, 40, 40),
(48, 'D', 52, 40, 40),
-- Calculus II
(49, 'A', 12, 25, 25),
(49, 'B', 12, 25, 25),
(49, 'C', 22, 25, 25),
(49, 'D', 22, 25, 25),
-- Linear Algebra
(50, 'A', 62, 25, 25),
(50, 'B', 62, 25, 25),
(50, 'C', 72, 25, 25),
(50, 'D', 72, 25, 25)
ON CONFLICT (course_id, section_code) DO NOTHING;

INSERT INTO university.section_schedule (section_id, day_of_week, start_time, end_time) VALUES
(1, 'Monday', '07:30', '09:00'),
(1, 'Tuesday', '07:30', '09:00'),
(2, 'Monday', '07:30', '09:00'),
(2, 'Tuesday', '07:30', '09:00'),
(3, 'Monday', '07:30', '09:00'),
(3, 'Tuesday', '07:30', '09:00'),
(4, 'Monday', '07:30', '09:00'),
(4, 'Tuesday', '07:30', '09:00'),

(5, 'Monday', '10:15', '11:45'),
(5, 'Tuesday', '10:15', '11:45'),
(6, 'Monday', '10:15', '11:45'),
(6, 'Tuesday', '10:15', '11:45'),
(7, 'Monday', '10:15', '11:45'),
(7, 'Tuesday', '10:15', '11:45'),
(8, 'Monday', '10:15', '11:45'),
(8, 'Tuesday', '10:15', '11:45'),

(9, 'Monday', '12:00', '13:30'),
(9, 'Tuesday', '12:00', '13:30'),
(10, 'Monday', '12:00', '13:30'),
(10, 'Tuesday', '12:00', '13:30'),
(11, 'Monday', '12:00', '13:30'),
(11, 'Tuesday', '12:00', '13:30'),
(12, 'Monday', '12:00', '13:30'),
(12, 'Tuesday', '12:00', '13:30'),

(13, 'Monday', '13:45', '15:15'),
(13, 'Tuesday', '13:45', '15:15'),
(14, 'Monday', '13:45', '15:30'),
(14, 'Tuesday', '13:45', '15:30'),
(15, 'Monday', '13:45', '15:30'),
(15, 'Tuesday', '13:45', '15:30'),
(16, 'Monday', '13:45', '15:30'),
(16, 'Tuesday', '13:45', '15:30')
ON CONFLICT (section_id, day_of_week, start_time, end_time) DO NOTHING;