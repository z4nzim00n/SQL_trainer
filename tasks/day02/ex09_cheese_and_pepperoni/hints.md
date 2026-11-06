## Идея

Нужны заказы женщин на две пиццы. Один способ: два запроса (заказавшие пепперони и заказавшие сырную) и между ними `INTERSECT`. Другой: сгруппируй по человеку и оставь тех, у кого разных названий пиццы две.

## Каркас

```sql
SELECT person.name
FROM person_order
JOIN person ON person_order.person_id = person.id
JOIN menu ON person_order.menu_id = menu.id
WHERE person.gender = '______' AND (menu.pizza_name = '______' OR menu.pizza_name = '______')
GROUP BY person.id, person.name
HAVING COUNT(______ menu.pizza_name) = ______
ORDER BY ______;
```

## Почти ответ

```sql
SELECT person.name
FROM person_order
JOIN person ON person_order.person_id = person.id
JOIN menu ON person_order.menu_id = menu.id
WHERE person.gender = 'female' AND (menu.pizza_name = 'pepperoni pizza' OR menu.pizza_name = 'cheese pizza')
GROUP BY person.id, person.name
HAVING COUNT(DISTINCT menu.pizza_name) = ______
ORDER BY person.name;
```

Осталось число: сколько разных пицц нужно.
