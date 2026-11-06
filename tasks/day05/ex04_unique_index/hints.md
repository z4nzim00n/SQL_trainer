## Идея

`CREATE UNIQUE INDEX` на `menu` по паре `(pizzeria_id, pizza_name)`. Для доказательства запроси строку по обоим столбцам.

## Каркас

```sql
CREATE ______ INDEX idx_menu_unique ON menu (______, ______);
EXPLAIN ANALYZE SELECT * FROM menu WHERE pizzeria_id = 1 AND pizza_name = 'cheese pizza';
```

## Почти ответ

```sql
CREATE UNIQUE INDEX idx_menu_unique ON menu (pizzeria_id, ______);
EXPLAIN ANALYZE ...;
```

Осталось второе поле пары.
