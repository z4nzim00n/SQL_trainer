## Идея

Сначала запрети последовательное сканирование (`SET enable_seqscan = off`), затем выполни `EXPLAIN ANALYZE` с запросом на соединение `menu` и `pizzeria`.

## Каркас

```sql
SET ______ = off;
EXPLAIN ANALYZE
SELECT menu.pizza_name, pizzeria.name AS pizzeria_name
FROM menu
JOIN pizzeria ON pizzeria.id = menu.______;
```

## Почти ответ

```sql
SET enable_seqscan = off;
EXPLAIN ANALYZE
SELECT menu.pizza_name, pizzeria.name AS pizzeria_name
FROM menu
JOIN pizzeria ON pizzeria.id = menu.______;
```

Осталось имя столбца, по которому `menu` связана с `pizzeria`.
