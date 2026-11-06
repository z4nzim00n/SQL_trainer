## Идея

Календарь 1–10 января даёт `generate_series`. Присоедини к нему через `LEFT JOIN` даты посещений людей 1 и 2 (подзапросом). Оставь дни, к которым пара не нашлась.

## Каркас

```sql
SELECT day::date AS ______
FROM generate_series('2022-01-01'::date, '______'::date, '1 day'::interval) AS day
LEFT JOIN (SELECT visit_date FROM person_visits WHERE person_id = 1 OR person_id = 2) AS visits
       ON visits.visit_date = ______
WHERE ______ IS NULL
ORDER BY ______;
```

## Почти ответ

```sql
SELECT day::date AS missing_date
FROM generate_series('2022-01-01'::date, '2022-01-10'::date, '1 day'::interval) AS day
LEFT JOIN (SELECT visit_date FROM person_visits WHERE person_id = 1 OR person_id = 2) AS visits
       ON visits.visit_date = day::date
WHERE ______ IS NULL
ORDER BY missing_date;
```

Осталось столбец, который у «пропущенных» дней будет `NULL`.
