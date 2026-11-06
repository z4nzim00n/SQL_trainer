## Идея

Это `CREATE VIEW` над `SELECT generate_series(...)`. Не забудь привести тип к дате и назвать столбец.

## Каркас

```sql
CREATE VIEW v_generated_dates AS
SELECT generate_series('2022-01-01'::date, '______'::date, '1 day'::interval)::______ AS ______
ORDER BY ______;
```

## Почти ответ

```sql
CREATE VIEW v_generated_dates AS
SELECT generate_series('2022-01-01'::date, '2022-01-31'::date, '1 day'::interval)::date AS ______
ORDER BY generated_date;
```

Осталось имя столбца.
