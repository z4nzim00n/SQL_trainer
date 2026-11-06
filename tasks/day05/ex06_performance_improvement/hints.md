## Идея

Подумай, какие столбцы `pizzeria` нужны запросу целиком: ключ соединения и столбец, по которому работает окно. Положи их в один индекс на таблице `pizzeria`.

## Каркас

```sql
CREATE INDEX idx_1 ON pizzeria (______, ______);
EXPLAIN ANALYZE SELECT ... (запрос из задания);
```

## Почти ответ

```sql
CREATE INDEX idx_1 ON pizzeria (id, ______);
EXPLAIN ANALYZE ...;
```

Осталось второе поле: столбец из `max(...)`.
