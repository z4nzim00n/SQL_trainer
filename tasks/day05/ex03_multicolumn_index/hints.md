## Идея

Индекс на `person_order` по трём столбцам: два из условия (`person_id`, `menu_id`) и третий, который нужен только для `SELECT` (`order_date`). Тогда таблица не понадобится.

## Каркас

```sql
CREATE INDEX idx_person_order_multi ON person_order (______, ______, ______);
EXPLAIN ANALYZE
SELECT person_id, menu_id, order_date FROM person_order
WHERE person_id = 8 AND menu_id = 14;
```

## Почти ответ

```sql
CREATE INDEX idx_person_order_multi ON person_order (person_id, menu_id, ______);
EXPLAIN ANALYZE ...;
```

Осталось название столбца с датой, который выбирает запрос.
