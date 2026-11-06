# Задание 03. Многоколоночный индекс под запрос

**Разрешено:** ANSI SQL

Создай улучшенный многоколоночный B-Tree индекс с именем `idx_person_order_multi` для запроса:

```sql
SELECT person_id, menu_id, order_date
FROM person_order
WHERE person_id = 8 AND menu_id = 14;
```

План `EXPLAIN ANALYZE` этого запроса должен соответствовать шаблону (обрати особое внимание на **Index Only Scan**):

```
Index Only Scan using idx_person_order_multi on person_order ...
```

Напиши запрос с доказательством работы индекса (`EXPLAIN ANALYZE`).

> Тренажёр проверяет, что в плане именно `Index Only Scan` по твоему индексу и что условия на `person_id` и `menu_id` используются как условия индекса.
