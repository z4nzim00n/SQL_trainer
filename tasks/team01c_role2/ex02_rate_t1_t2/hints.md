## Идея

Два подзапроса: один смотрит назад, другой вперёд. Итог: `COALESCE(t1, t2)`.

## Каркас

```sql
WITH r AS (
    SELECT ..., (подзапрос t1) AS rate_t1, (подзапрос t2) AS rate_t2
    FROM balance b WHERE EXISTS (...)
)
SELECT ..., COALESCE(rate_t1, rate_t2) AS rate_used FROM r ORDER BY ...;
```

## Почти ответ

Для t2: `c.updated > b.updated ORDER BY c.updated ASC LIMIT 1`.
