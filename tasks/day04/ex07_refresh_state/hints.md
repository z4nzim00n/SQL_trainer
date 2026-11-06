## Идея

Два оператора подряд: `INSERT INTO person_visits ...` (с подзапросами для `id`, человека и пиццерии), затем `REFRESH MATERIALIZED VIEW ...`.

## Каркас

```sql
INSERT INTO person_visits (id, person_id, pizzeria_id, visit_date)
VALUES ((SELECT MAX(id) FROM person_visits) + 1,
        (SELECT id FROM person WHERE name = '______'),
        (SELECT id FROM pizzeria WHERE name = '______'),
        '______');

REFRESH MATERIALIZED VIEW ______;
```

## Почти ответ

```sql
INSERT INTO person_visits (id, person_id, pizzeria_id, visit_date)
VALUES ((SELECT MAX(id) FROM person_visits) + 1,
        (SELECT id FROM person WHERE name = 'Dmitriy'),
        (SELECT id FROM pizzeria WHERE name = 'DoDo Pizza'),
        '2022-01-08');

REFRESH MATERIALIZED VIEW ______;
```

Осталось имя представления.
