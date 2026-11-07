## Идея

Нужны операции, у которых нет пары в `"user"` или в `currency`. Для каждой определите, чего именно не хватает.

## Каркас

```sql
SELECT DISTINCT b.user_id, b.currency_id, CASE ... END AS problem
FROM balance b
LEFT JOIN "user" u ON ...
LEFT JOIN (SELECT DISTINCT id FROM currency) c ON ...
WHERE u.id IS NULL OR c.id IS NULL
ORDER BY ...;
```

## Почти ответ

В `CASE` сначала проверьте случай «нет обоих», потом по одному.
