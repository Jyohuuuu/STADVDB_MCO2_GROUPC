SELECT 
    i.instructor_id,
    i.first_name || ' ' || i.last_name AS instructor_name,
    COUNT(DISTINCT sec.section_id) AS total_sections,
    COALESCE(SUM(c.credits)::float,0) AS total_credits,
    COALESCE(SUM(e.enrolled_count)::float,0) AS total_students,
    d.name AS department_name
FROM instructor i
LEFT JOIN department d ON i.dept_id = d.dept_id
LEFT JOIN section sec ON i.instructor_id = sec.instructor_id
LEFT JOIN course c ON sec.course_id = c.course_id
LEFT JOIN (
    SELECT section_id, COUNT(*) AS enrolled_count
    FROM enrollment
    GROUP BY section_id
) e ON sec.section_id = e.section_id
GROUP BY i.instructor_id, i.first_name, i.last_name, d.name;
