## Идея

`CREATE TABLE nodes (...)` и один `INSERT` на 12 строк. Для каждой пары городов две строки: туда и обратно.

## Каркас

```sql
CREATE TABLE nodes (point1 varchar NOT NULL, point2 varchar NOT NULL, cost integer NOT NULL);

INSERT INTO nodes (point1, point2, cost) VALUES
    ('a', 'b', 10), ('b', 'a', 10),
    ('a', 'c', ______), ('c', 'a', ______),
    ...;
```

## Почти ответ

Пары городов: a–b, a–c, a–d, b–c, b–d, c–d (всего шесть). Значения стоимости смотри в таблице рёбер. Итого 6 × 2 = 12 строк.
