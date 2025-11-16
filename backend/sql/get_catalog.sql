SELECT
    d.dept_id,
    d.code AS dept_code,
    d.name AS dept_name,

    c.course_id,
    c.code AS course_code,
    c.title AS course_title,
    c.credits,

    s.section_id,
    s.section_code,
    s.capacity,
    s.instructor_id,
    i.first_name || ' ' || i.last_name AS instructor_name
FROM university.department d
LEFT JOIN university.course c ON c.dept_id = d.dept_id
LEFT JOIN university.section s ON s.course_id = c.course_id
LEFT JOIN university.instructor i ON s.instructor_id = i.instructor_id
ORDER BY d.dept_id, c.course_id, s.section_id;
