## Идея

Возьми `menu` и присоедини `pizzeria` по `menu.pizzeria_id = pizzeria.id`. Оставь строки, где `pizza_name` равно одному из двух названий. Сортировка по названию пиццы и пиццерии.

## Каркас

```sql
SELECT menu.pizza_name, pizzeria.name AS ______, menu.price
FROM menu
JOIN pizzeria ON menu.pizzeria_id = ______
WHERE menu.pizza_name = '______' OR menu.pizza_name = '______'
ORDER BY ______, ______;
```

## Почти ответ

```sql
SELECT menu.pizza_name, pizzeria.name AS pizzeria_name, menu.price
FROM menu
JOIN pizzeria ON menu.pizzeria_id = pizzeria.id
WHERE menu.pizza_name = 'mushroom pizza' OR menu.pizza_name = 'pepperoni pizza'
ORDER BY ______;
```

Осталась сортировка по двум столбцам.
