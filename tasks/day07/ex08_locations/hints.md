## Идея

Заказы + люди + меню + пиццерии. Группа это пара (адрес, название пиццерии), в ней считаем заказы.

## Каркас

```sql
SELECT person.address, pizzeria.name, COUNT(*) AS count_of_orders
FROM person_order
JOIN person ON person.id = person_order.______
JOIN menu ON menu.id = person_order.______
JOIN pizzeria ON pizzeria.id = menu.______
GROUP BY ______, ______
ORDER BY ______, ______;
```

## Почти ответ

```sql
... GROUP BY person.address, pizzeria.name
ORDER BY person.address, ______;
```

Осталось второе поле сортировки.
