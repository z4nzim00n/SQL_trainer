## Идея

Для каждой строки `balance` нужен свой курс: подзапрос в `SELECT`, который смотрит на текущую операцию.

## Каркас

```sql
SELECT b.user_id, ..., (SELECT ... ORDER BY ... LIMIT 1) AS rate_t1
FROM balance b
WHERE EXISTS (...)
ORDER BY ...;
```

## Почти ответ

В подзапросе: `WHERE c.id = b.currency_id AND c.updated <= b.updated ORDER BY c.updated DESC LIMIT 1`.
