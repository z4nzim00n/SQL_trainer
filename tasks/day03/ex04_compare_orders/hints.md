## Идея

Сначала напиши запрос «названия пиццерий, где заказывали женщины», потом такой же для мужчин. Затем `(W EXCEPT M) UNION (M EXCEPT W)`.

## Каркас

```sql
(SELECT <пиццерии женщин> EXCEPT SELECT <пиццерии мужчин>)
UNION
(SELECT <пиццерии мужчин> EXCEPT SELECT <пиццерии женщин>)
ORDER BY pizzeria_name;
```

Каждая выборка: `person_order JOIN person JOIN menu JOIN pizzeria WHERE gender = ...`.

## Почти ответ

```sql
(W EXCEPT M)
UNION
(______)
ORDER BY pizzeria_name;
```

Осталась вторая половина: пиццерии, в которых заказывали только мужчины (M EXCEPT W).
