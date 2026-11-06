-- Идея: пересечение из задания 03 становится временной таблицей pv, к ней присоединяем имена.
SELECT pv.action_date, person.name AS person_name
FROM (SELECT order_date AS action_date, person_id FROM person_order
      INTERSECT
      SELECT visit_date, person_id FROM person_visits) AS pv   -- результат задания 03
JOIN person ON person.id = pv.person_id                        -- по номеру находим человека
ORDER BY action_date ASC, person_name DESC;                    -- дата вверх, имя вниз
