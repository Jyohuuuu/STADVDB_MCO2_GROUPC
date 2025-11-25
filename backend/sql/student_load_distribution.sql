SELECT 
    s.student_id,
    s.student_number,
    s.first_name || ' ' || s.last_name AS full_name,
    COALESCE(SUM(c.credits)::float,0) AS total_credits
FROM student s
LEFT JOIN enrollment e ON s.student_id = e.student_id
LEFT JOIN section sec ON e.section_id = sec.section_id
LEFT JOIN course c ON sec.course_id = c.course_id
GROUP BY s.student_id, s.student_number, s.first_name, s.last_name;
