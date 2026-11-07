## Идея

Нужны посещения Дмитрия 8 января (`person_visits` + `person`), пиццерия этого посещения и её меню (`menu`) с ценой меньше 800. Выведи название пиццерии.

## Каркас

```sql
SELECT DISTINCT pizzeria.name AS ______
FROM person_visits
JOIN person ON person_visits.person_id = ______
JOIN pizzeria ON person_visits.pizzeria_id = ______
JOIN menu ON menu.pizzeria_id = ______
WHERE person.name = '______' AND person_visits.visit_date = '______' AND menu.price ____ 800;
```

## Почти ответ

```sql
SELECT DISTINCT pizzeria.name AS pizzeria_name
FROM person_visits
JOIN person ON person_visits.person_id = person.id
JOIN pizzeria ON person_visits.pizzeria_id = pizzeria.id
JOIN menu ON menu.pizzeria_id = pizzeria.id
WHERE person.name = 'Dmitriy' AND person_visits.visit_date = '2022-01-08' AND ______;
```

Осталось условие на цену.
