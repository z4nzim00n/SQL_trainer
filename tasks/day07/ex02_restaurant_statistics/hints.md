## Идея

Две выборки с `GROUP BY` названию пиццерии: первая по заказам (через меню), вторая по посещениям. В каждой `ORDER BY count DESC, name` и `LIMIT 3`, в каждой свой константный `action_type`. Склей через `UNION ALL`.

## Каркас

```sql
(SELECT pizzeria.name, COUNT(*) AS count, 'order' AS action_type
 FROM person_order JOIN menu ON ... JOIN pizzeria ON ...
 GROUP BY pizzeria.name ORDER BY count DESC, pizzeria.name LIMIT ______)
UNION ALL
(SELECT pizzeria.name, COUNT(*) AS count, '______' AS action_type
 FROM person_visits JOIN pizzeria ON ...
 GROUP BY pizzeria.name ORDER BY count DESC, pizzeria.name LIMIT 3)
ORDER BY ______, ______ DESC;
```

## Почти ответ

```sql
(... заказы ...)
UNION ALL
(... посещения ...)
ORDER BY action_type ASC, ______ DESC;
```

Осталось имя столбца с количеством.
