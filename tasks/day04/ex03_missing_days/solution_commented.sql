-- Идея: даты календаря, которых нет среди дат посещений.
SELECT generated_date AS missing_date
FROM v_generated_dates
WHERE generated_date NOT IN (SELECT visit_date FROM person_visits)   -- никто не ходил в этот день
ORDER BY missing_date;
