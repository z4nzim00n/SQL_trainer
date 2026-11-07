## Идея

Нужна одна строка на `id`: с самым поздним `updated`.

## Каркас

```sql
SELECT DISTINCT ON (id) id, name, ... AS last_rate_to_usd
FROM currency
ORDER BY id, ...;
```

## Почти ответ

После `ORDER BY id` добавьте `updated DESC`.
