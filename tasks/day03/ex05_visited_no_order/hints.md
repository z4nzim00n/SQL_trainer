## Идея

Составь два запроса «названия пиццерий для Andrey»: по посещениям и по заказам (через меню). Вычти второй из первого.

## Каркас

```sql
SELECT pizzeria.name AS pizzeria_name
FROM person_visits
JOIN person ON person.id = person_visits.______
JOIN pizzeria ON pizzeria.id = person_visits.______
WHERE person.name = 'Andrey'
EXCEPT
SELECT pizzeria.name
FROM person_order ... (person, menu, pizzeria) ... WHERE person.name = 'Andrey'
ORDER BY pizzeria_name;
```

## Почти ответ

```sql
SELECT ... (посещения Andrey)
EXCEPT
SELECT pizzeria.name
FROM person_order
JOIN person ON person.id = person_order.person_id
JOIN menu ON menu.id = person_order.menu_id
JOIN pizzeria ON pizzeria.id = menu.______
WHERE person.name = 'Andrey'
ORDER BY pizzeria_name;
```
