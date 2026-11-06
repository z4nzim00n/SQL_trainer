## Идея

Сначала подзапросом отбери посещения за 1–3 января (человек, пиццерия, дата). Потом `person FULL JOIN этот_подзапрос` по `person.id`, затем `FULL JOIN pizzeria`. `NULL` в именах замени через `COALESCE`.

## Каркас

```sql
SELECT COALESCE(person.name, '-') AS person_name, pv.visit_date, COALESCE(pizzeria.name, '-') AS ______
FROM person
______ JOIN (SELECT person_id, pizzeria_id, visit_date FROM person_visits
            WHERE visit_date BETWEEN '______' AND '______') AS pv ON person.id = pv.______
______ JOIN pizzeria ON pv.pizzeria_id = pizzeria.id
ORDER BY ______, ______, ______;
```

## Почти ответ

```sql
SELECT COALESCE(person.name, '-') AS person_name, pv.visit_date, COALESCE(pizzeria.name, '-') AS pizzeria_name
FROM person
FULL JOIN (SELECT person_id, pizzeria_id, visit_date FROM person_visits
           WHERE visit_date BETWEEN '2022-01-01' AND '2022-01-03') AS pv ON person.id = pv.person_id
FULL JOIN pizzeria ON pv.pizzeria_id = pizzeria.id
ORDER BY ______;
```

Осталась сортировка по всем трём столбцам.
