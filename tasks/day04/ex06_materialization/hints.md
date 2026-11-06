## Идея

Возьми запрос из Day 02 (посещения Dmitriy 8 января + цена ниже 800) и оберни его в `CREATE MATERIALIZED VIEW ... AS ... WITH DATA`.

## Каркас

```sql
CREATE MATERIALIZED VIEW mv_dmitriy_visits_and_eats AS
SELECT pizzeria.name AS pizzeria_name
FROM person_visits
JOIN person ON person.id = person_visits.person_id
JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id
JOIN menu ON menu.pizzeria_id = pizzeria.id
WHERE person.name = '______' AND person_visits.visit_date = '______' AND menu.price < ______
WITH ______;
```

## Почти ответ

```sql
CREATE MATERIALIZED VIEW mv_dmitriy_visits_and_eats AS
SELECT ... WHERE person.name = 'Dmitriy' AND person_visits.visit_date = '2022-01-08' AND menu.price < 800
WITH ______;
```

Осталось, что сохранить: данные сразу.
