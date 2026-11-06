## Идея

Список пиццерий берём из `pizzeria`, а из `person_visits` понадобятся только номера посещённых пиццерий. Оставь те пиццерии, чьего номера в этом списке нет.

## Каркас

```sql
SELECT name
FROM pizzeria
WHERE id ______ (SELECT ______ FROM person_visits);
```

Впиши отрицание списка и столбец из посещений.

## Почти ответ

```sql
SELECT name
FROM pizzeria
WHERE NOT EXISTS (
    SELECT 1 FROM person_visits
    WHERE person_visits.pizzeria_id = ______
);
```

Это второй способ: осталось сравнить с `id` внешней пиццерии.
