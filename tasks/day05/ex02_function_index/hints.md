## Идея

`CREATE INDEX` с выражением вместо простого столбца: в скобках `UPPER(name)`. Потом `EXPLAIN ANALYZE` запроса, где условие записано через ту же функцию.

## Каркас

```sql
CREATE INDEX idx_person_name ON person (______(name));
EXPLAIN ANALYZE SELECT * FROM person WHERE ______(name) = 'ANNA';
```

## Почти ответ

```sql
CREATE INDEX idx_person_name ON person (UPPER(name));
EXPLAIN ANALYZE SELECT * FROM person WHERE UPPER(name) = '______';
```

Осталось любое имя заглавными буквами.
