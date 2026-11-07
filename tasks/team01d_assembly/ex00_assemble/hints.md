## Идея

Склейте четыре куска по порядку: два `INSERT`, два `CREATE VIEW`, итоговый запрос.

## Каркас

```sql
INSERT ...;
CREATE VIEW v_total_volume AS ...;
CREATE VIEW v_balance_usd AS ...;
SELECT ... FROM (SELECT ... GROUP BY ...) v JOIN (SELECT ... GROUP BY ...) o ON ... ORDER BY ...;
```

## Почти ответ

Если скрипт падает: проверьте имена `v_total_volume` и `v_balance_usd`, а также слово `"user"` в кавычках.
