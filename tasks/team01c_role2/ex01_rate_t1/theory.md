# Теория: ближайший курс в прошлом

```sql
SELECT b.user_id, b.money, b.updated,
       (SELECT c.rate_to_usd
        FROM currency c
        WHERE c.id = b.currency_id AND c.updated <= b.updated
        ORDER BY c.updated DESC
        LIMIT 1) AS rate_t1
FROM balance b;
```

Подзапрос коррелированный: он смотрит на текущую строку `b` и для каждой операции ищет свой курс. `ORDER BY c.updated DESC LIMIT 1` даёт самый свежий из подходящих.

Операции с неизвестной валютой убираются условием `WHERE EXISTS (SELECT 1 FROM currency c WHERE c.id = b.currency_id)`.

Граница `<=`: курс, обновлённый ровно в момент операции, считается действующим.

Ключевые слова для примеров: `SUBQUERY`, `LIMIT`, `EXISTS`.
