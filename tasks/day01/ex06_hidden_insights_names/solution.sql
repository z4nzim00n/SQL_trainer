SELECT pv.action_date, person.name AS person_name
FROM (
    SELECT order_date AS action_date, person_id FROM person_order
    INTERSECT
    SELECT visit_date, person_id FROM person_visits
) AS pv
JOIN person ON person.id = pv.person_id
ORDER BY action_date ASC, person_name DESC;
