## Идея

Для каждой операции найдите время нужного курса (прошлое, иначе будущее), потом присоедините строку `currency` по `id` и этому времени.

## Каркас

```sql
SELECT COALESCE(u.name, 'not defined') AS name, ..., c.name AS currency_name, b.money * c.rate_to_usd AS currency_in_usd
FROM balance b
LEFT JOIN "user" u ON ...
JOIN currency c ON c.id = b.currency_id AND c.updated = COALESCE(<t1>, <t2>)
ORDER BY ...;
```

## Почти ответ

t1: `SELECT MAX(updated) ... updated <= b.updated`. t2: `SELECT MIN(updated) ... updated > b.updated`.
