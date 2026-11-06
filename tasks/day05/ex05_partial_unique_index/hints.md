## Идея

`CREATE UNIQUE INDEX` по `(person_id, menu_id)` с условием `WHERE order_date = '2022-01-01'`. В запросе для доказательства используй то же условие по дате.

## Каркас

```sql
CREATE ______ INDEX idx_person_order_order_date
ON person_order (______, ______)
WHERE ______ = '2022-01-01';
EXPLAIN ANALYZE SELECT person_id, menu_id FROM person_order WHERE order_date = '2022-01-01';
```

## Почти ответ

```sql
CREATE UNIQUE INDEX idx_person_order_order_date
ON person_order (person_id, menu_id)
WHERE ______ = '2022-01-01';
```

Осталось название столбца с датой.
