## Идея

`CREATE UNIQUE INDEX` на `person_discounts` по паре столбцов, а для доказательства `EXPLAIN ANALYZE` простого `SELECT` с условием по обоим столбцам.

## Каркас

```sql
CREATE ______ INDEX idx_person_discounts_unique ON person_discounts (______, ______);
EXPLAIN ANALYZE SELECT * FROM person_discounts WHERE person_id = 1 AND pizzeria_id = 1;
```

## Почти ответ

```sql
CREATE UNIQUE INDEX idx_person_discounts_unique ON person_discounts (person_id, ______);
EXPLAIN ANALYZE ...;
```

Осталось второе поле пары.
