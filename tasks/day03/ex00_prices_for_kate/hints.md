## Идея

Начни с `person_visits`, присоедини `person` (отфильтруй `Kate`), `pizzeria` и `menu`. Условие на цену ставь в `WHERE`.

## Каркас

```sql
SELECT menu.pizza_name, menu.price, pizzeria.name AS ______, person_visits.visit_date
FROM person_visits
JOIN person ON person.id = person_visits.______
JOIN pizzeria ON pizzeria.id = person_visits.______
JOIN menu ON menu.______ = pizzeria.id
WHERE person.name = 'Kate' AND menu.price BETWEEN ______ AND ______
ORDER BY ______, ______, ______;
```

## Почти ответ

```sql
... WHERE person.name = 'Kate' AND menu.price BETWEEN 800 AND 1000
ORDER BY ______;
```

Осталась сортировка по названию пиццы, цене и названию пиццерии (используй имена столбцов результата).
