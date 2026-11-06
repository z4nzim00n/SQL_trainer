-- Идея: JOIN размножает имена; DISTINCT оставляет каждое один раз.
SELECT DISTINCT person.name
FROM person
JOIN person_order ON person_order.person_id = person.id   -- только те, у кого есть заказы
ORDER BY person.name;
