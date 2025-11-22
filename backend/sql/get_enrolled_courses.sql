SELECT
    s.student_id,
    c.course_id,
    c.code AS course_code,
    c.title AS course_title,
    c.credits,
    sec.section_id,
    sec.section_code,
    sec.capacity,
    i.instructor_id,
    i.first_name || ' ' || i.last_name AS instructor_name
FROM enrollment e
JOIN section sec ON e.section_id = sec.section_id
JOIN course c ON sec.course_id = c.course_id
LEFT JOIN instructor i ON sec.instructor_id = i.instructor_id
JOIN student s ON e.student_id = s.student_id
WHERE s.student_id = %s;
