## Идея

Сначала подготовьте последний курс на валюту (одна строка), потом присоедините его и пользователя к `balance` через `LEFT JOIN`, потом сгруппируйте.

## Каркас

```sql
WITH last_rate AS (
    -- одна строка на валюту
)
SELECT COALESCE(u.name, 'not defined') AS name,
       ...,
       SUM(b.money) AS volume,
       ...
FROM balance b
LEFT JOIN "user" u ON ...
LEFT JOIN last_rate c ON ...
GROUP BY ...
ORDER BY ...;
```

## Почти ответ

Группируйте по `b.user_id, u.name, u.lastname, b.type, b.currency_id, c.name, c.rate_to_usd`. Для курса: `COALESCE(c.rate_to_usd, 1)`.
