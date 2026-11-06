-- Идея: LEFT JOIN сохраняет все пиццерии; у тех, кого никто не посещал, справа будет NULL.
SELECT pizzeria.name, pizzeria.rating
FROM pizzeria
LEFT JOIN person_visits ON person_visits.pizzeria_id = pizzeria.id   -- присоединяем посещения
WHERE person_visits.id IS NULL;        -- оставляем только тех, у кого пары не нашлось
