SELECT ss.day_of_week, ss.start_time, ss.end_time
FROM enrollment e
JOIN section_schedule ss ON e.section_id = ss.section_id
WHERE e.student_id = %s;
