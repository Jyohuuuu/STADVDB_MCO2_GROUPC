UPDATE section
SET remaining_slots = remaining_slots - 1
WHERE section_id = %s
AND remaining_slots > 0;
