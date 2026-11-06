-- Идея: по группе на человека, в группе считаем посещения.
SELECT person_id, COUNT(*) AS count_of_visits
FROM person_visits
GROUP BY person_id                                   -- одна строка на человека
ORDER BY count_of_visits DESC, person_id ASC;        -- больше посещений выше, при равенстве меньший номер
