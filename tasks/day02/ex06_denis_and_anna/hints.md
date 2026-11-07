## Идея

Начни с `person_order`, присоедини `person`, `menu` и `pizzeria` по связям. В `WHERE` оставь заказы Дениса и Анны. Выведи название пиццы и название пиццерии.

## Каркас

```sql
SELECT DISTINCT menu.pizza_name, pizzeria.name AS ______
FROM person_order
JOIN person ON person_order.person_id = person.id
JOIN menu ON person_order.menu_id = ______
JOIN pizzeria ON menu.pizzeria_id = ______
WHERE person.name = '______' OR person.name = '______'
ORDER BY ______, ______;
```

## Почти ответ

```sql
SELECT DISTINCT menu.pizza_name, pizzeria.name AS pizzeria_name
FROM person_order
JOIN person ON person_order.person_id = person.id
JOIN menu ON person_order.menu_id = menu.id
JOIN pizzeria ON menu.pizzeria_id = pizzeria.id
WHERE person.name = 'Denis' OR ______
ORDER BY pizza_name, pizzeria_name;
```

Осталось второе имя.
