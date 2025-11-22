SELECT 
    s.section_id,
    s.section_code,
    c.course_id,
    c.code AS course_code,
    c.title AS course_title,
    ss.day_of_week,
    ss.start_time,
    ss.end_time,
    i.first_name || ' ' || i.last_name AS instructor_name
FROM enrollment e
JOIN section s ON e.section_id = s.section_id
JOIN course c ON s.course_id = c.course_id
LEFT JOIN instructor i ON s.instructor_id = i.instructor_id
JOIN section_schedule ss ON s.section_id = ss.section_id
WHERE e.student_id = %s
ORDER BY c.code, s.section_code, ss.day_of_week, ss.start_time;
