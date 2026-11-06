## Идея

Календарь вынеси в блок `WITH days AS (SELECT generate_series(...)::date AS missing_date)`. Ниже тот же `LEFT JOIN` с посещениями людей 1 и 2 и отбор строк без пары.

## Каркас

```sql
WITH ______ AS (
    SELECT generate_series('2022-01-01'::date, '2022-01-10'::date, '1 day'::interval)::date AS missing_date
)
SELECT days.missing_date
FROM days
LEFT JOIN (SELECT visit_date FROM person_visits WHERE person_id = 1 OR person_id = 2) AS visits
       ON visits.visit_date = days.______
WHERE visits.visit_date IS ______
ORDER BY missing_date;
```

## Почти ответ

```sql
WITH days AS (
    SELECT generate_series('2022-01-01'::date, '2022-01-10'::date, '1 day'::interval)::date AS missing_date
)
SELECT days.missing_date
FROM days
LEFT JOIN (SELECT visit_date FROM person_visits WHERE person_id = 1 OR person_id = 2) AS visits
       ON visits.visit_date = ______
WHERE visits.visit_date IS NULL
ORDER BY missing_date;
```

Осталось выражение для условия связи: столбец с датой из `days`.
