INSERT INTO university_olap.dim_department (dept_id, dept_name, dept_code)
SELECT dept_id, name, code
FROM university_oltp.department
ON CONFLICT (dept_id) DO UPDATE
SET dept_name = EXCLUDED.dept_name,
    dept_code = EXCLUDED.dept_code;

INSERT INTO university_olap.dim_student (student_id, student_number, full_name, email)
SELECT student_id, student_number, first_name || ' ' || last_name, email
FROM university_oltp.student
ON CONFLICT (student_id) DO UPDATE
SET student_number = EXCLUDED.student_number,
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

INSERT INTO university_olap.dim_instructor (
    instructor_id,
    full_name,
    email,
    dept_key
)
SELECT
    i.instructor_id,
    i.first_name || ' ' || i.last_name AS full_name,
    i.email,
    d.dept_key
FROM university_oltp.instructor i
JOIN university_olap.dim_department d
  ON i.dept_id = d.dept_id
ON CONFLICT (instructor_id) DO UPDATE
SET full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    dept_key = EXCLUDED.dept_key;

INSERT INTO university_olap.dim_course (
    course_id, 
    course_code, 
    course_title, 
    credits,
    dept_key
)
SELECT 
    c.course_id,
    c.code,
    c.title,
    c.credits,
    d.dept_key
FROM university_oltp.course c
JOIN university_olap.dim_department d
  ON c.dept_id = d.dept_id
ON CONFLICT (course_id) DO UPDATE
SET course_code = EXCLUDED.course_code,
    course_title = EXCLUDED.course_title,
    credits = EXCLUDED.credits,
    dept_key = EXCLUDED.dept_key;

INSERT INTO university_olap.dim_section (
    section_id,
    section_code,
    capacity,
    instructor_key,
    course_key
)
SELECT
    s.section_id,
    s.section_code,
    s.capacity,
    di.instructor_key,
    dc.course_key
FROM university_oltp.section s
LEFT JOIN university_olap.dim_instructor di
  ON s.instructor_id = di.instructor_id
JOIN university_olap.dim_course dc
  ON s.course_id = dc.course_id
ON CONFLICT (section_id) DO UPDATE
SET section_code = EXCLUDED.section_code,
    capacity = EXCLUDED.capacity,
    instructor_key = EXCLUDED.instructor_key,
    course_key = EXCLUDED.course_key;

INSERT INTO university_olap.fact_enrollment (
    student_key,
    section_key,
    course_key,
    instructor_key,
    dept_key
)
SELECT 
    ds.student_key,
    dsec.section_key,
    dc.course_key,
    di.instructor_key,
    dd.dept_key
FROM university_oltp.enrollment e
JOIN university_olap.dim_student ds
  ON e.student_id = ds.student_id
JOIN university_olap.dim_section dsec
  ON e.section_id = dsec.section_id
JOIN university_olap.dim_course dc
  ON dsec.course_key = dc.course_key
LEFT JOIN university_olap.dim_instructor di
  ON dsec.instructor_key = di.instructor_key
JOIN university_olap.dim_department dd
  ON di.dept_key = dd.dept_key;
