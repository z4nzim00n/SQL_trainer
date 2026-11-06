## Идея

Возьми `menu` дважды (`m1`, `m2`). Свяжи по одинаковым названию и цене и по условию на идентификаторы пиццерий (больше / меньше). Затем два раза присоедини `pizzeria` за названиями.

## Каркас

```sql
SELECT m1.pizza_name, pz1.name AS ______, pz2.name AS ______, m1.price
FROM menu AS m1
JOIN menu AS m2 ON m1.pizza_name = m2.pizza_name AND m1.price = m2.______ AND m1.pizzeria_id ___ m2.pizzeria_id
JOIN pizzeria AS pz1 ON pz1.id = m1.______
JOIN pizzeria AS pz2 ON pz2.id = m2.______
ORDER BY ______;
```

## Почти ответ

```sql
... ON m1.pizza_name = m2.pizza_name AND m1.price = m2.price AND m1.pizzeria_id > m2.pizzeria_id
...
ORDER BY ______;
```

Осталась сортировка по названию пиццы.
