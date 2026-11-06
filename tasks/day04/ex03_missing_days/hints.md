## Идея

Из календаря оставь только те даты, которых нет среди `visit_date`.

## Каркас

```sql
SELECT generated_date AS ______
FROM v_generated_dates
WHERE generated_date ______ (SELECT ______ FROM person_visits)
ORDER BY ______;
```

## Почти ответ

```sql
SELECT generated_date AS missing_date
FROM v_generated_dates
WHERE generated_date NOT IN (SELECT ______ FROM person_visits)
ORDER BY missing_date;
```

Осталось название столбца с датой посещения.
