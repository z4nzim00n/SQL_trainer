-- Идея: мужчины из двух городов, заказавшие одну из двух пицц; имена без повторов.
SELECT DISTINCT person.name                 -- DISTINCT: каждое имя один раз
FROM person_order
JOIN person ON person_order.person_id = person.id
JOIN menu ON person_order.menu_id = menu.id
WHERE person.gender = 'male'
  AND (person.address = 'Moscow' OR person.address = 'Samara')          -- скобки: группа «или»
  AND (menu.pizza_name = 'pepperoni pizza' OR menu.pizza_name = 'mushroom pizza')
ORDER BY name DESC;                         -- обратный алфавитный порядок
