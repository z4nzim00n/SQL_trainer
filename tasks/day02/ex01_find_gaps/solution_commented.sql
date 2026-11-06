-- Идея: полный календарь минус дни, в которые кто-то из людей 1 и 2 заходил.
SELECT day::date AS missing_date
FROM generate_series('2022-01-01'::date, '2022-01-10'::date, '1 day'::interval) AS day            -- все дни с 1 по 10 января
LEFT JOIN (SELECT visit_date
           FROM person_visits
           WHERE person_id = 1 OR person_id = 2) AS visits   -- дни посещений этих двух людей
       ON visits.visit_date = day::date
WHERE visits.visit_date IS NULL      -- у дня нет посещений: он пропущен обоими
ORDER BY missing_date;
