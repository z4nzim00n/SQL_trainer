-- Идея: сначала отбираем топ-4 по числу визитов, потом сортируем отобранных по имени.
SELECT name, count_of_visits
FROM (SELECT person.name, COUNT(*) AS count_of_visits
      FROM person_visits
      JOIN person ON person.id = person_visits.person_id
      GROUP BY person.id, person.name                       -- группа на человека
      ORDER BY count_of_visits DESC, person.name ASC        -- лучшие вверху; при равенстве по алфавиту
      LIMIT 4) AS top                                       -- оставляем четверых
ORDER BY name;                                              -- вывод по имени
