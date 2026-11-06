-- Идея: тот же запрос, но генератор дат вынесен в именованный блок WITH.
WITH days AS (                               -- блок CTE: временная «таблица» days
    SELECT generate_series('2022-01-01'::date, '2022-01-10'::date, '1 day'::interval)::date AS missing_date
)
SELECT days.missing_date
FROM days
LEFT JOIN (SELECT visit_date
           FROM person_visits
           WHERE person_id = 1 OR person_id = 2) AS visits
       ON visits.visit_date = days.missing_date
WHERE visits.visit_date IS NULL              -- дни без посещений
ORDER BY missing_date;
