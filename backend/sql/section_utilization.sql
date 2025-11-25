SELECT 
    sec.section_id,
    sec.section_code,
    sec.capacity,
    COALESCE(enrolled_count, 0) AS enrolled_count,
    c.code AS course_code,
    c.title AS course_title,
    d.code AS dept_code,
    d.name AS department_name,
    ROUND(COALESCE(enrolled_count::decimal / sec.capacity, 0) * 100, 2) AS utilization_percent
FROM section sec
JOIN course c ON sec.course_id = c.course_id
JOIN department d ON c.dept_id = d.dept_id
LEFT JOIN (
    SELECT section_id, COUNT(*) AS enrolled_count
    FROM enrollment
    GROUP BY section_id
) e ON sec.section_id = e.section_id;
