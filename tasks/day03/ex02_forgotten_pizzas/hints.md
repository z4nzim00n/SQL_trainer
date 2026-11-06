## Идея

Возьми `menu`, присоедини `pizzeria` для названия, а в `WHERE` оставь только позиции, чьего `id` нет среди заказанных (подзапрос из задания 01).

## Каркас

```sql
SELECT menu.pizza_name, menu.price, pizzeria.name AS ______
FROM menu
JOIN pizzeria ON pizzeria.id = menu.______
WHERE menu.id ______ (SELECT menu_id FROM person_order)
ORDER BY ______, ______;
```

## Почти ответ

```sql
SELECT menu.pizza_name, menu.price, pizzeria.name AS pizzeria_name
FROM menu
JOIN pizzeria ON pizzeria.id = menu.pizzeria_id
WHERE menu.id NOT IN (SELECT menu_id FROM person_order)
ORDER BY ______;
```

Осталась сортировка по названию пиццы и цене.
