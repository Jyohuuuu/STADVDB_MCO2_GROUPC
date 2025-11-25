SELECT day_of_week, start_time, end_time
FROM university_oltp.section_schedule
WHERE section_id = %s