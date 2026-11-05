## Идея

В `FROM` отбери из `person_visits` только посещения 7–9 января (оставь `person_id` и `pizzeria_id`) и назови результат `pv`. В `SELECT` достань имя человека и название пиццерии двумя подзапросами по номерам из `pv`.

## Каркас

```sql
SELECT (SELECT name FROM person WHERE person.id = pv.______) AS person_name,
       (SELECT name FROM pizzeria WHERE pizzeria.id = pv.______) AS pizzeria_name
FROM (SELECT person_id, pizzeria_id FROM person_visits
      WHERE visit_date BETWEEN '______' AND '______') AS pv
ORDER BY ______, ______ ______;
```

Впиши два номера, две даты и сортировку.

## Почти ответ

```sql
SELECT (SELECT name FROM person WHERE person.id = pv.person_id) AS person_name,
       (SELECT name FROM pizzeria WHERE pizzeria.id = pv.pizzeria_id) AS pizzeria_name
FROM (SELECT person_id, pizzeria_id FROM person_visits
      WHERE visit_date BETWEEN '2022-01-07' AND '2022-01-09') AS pv
ORDER BY person_name, ______;
```

Осталось название пиццерии по убыванию: к нему добавь `DESC`.
