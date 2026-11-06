## Идея

Один параметр-массив, помеченный `VARIADIC`. Разверни массив через `unnest` и возьми `MIN`.

## Каркас

```sql
CREATE FUNCTION func_minimum(______ arr numeric[]) RETURNS numeric AS $$
    SELECT ______(a) FROM ______(arr) AS a;
$$ LANGUAGE sql;
```

## Почти ответ

```sql
CREATE FUNCTION func_minimum(VARIADIC arr numeric[]) RETURNS numeric AS $$
    SELECT MIN(a) FROM ______(arr) AS a;
$$ LANGUAGE sql;
```

Осталась функция, разворачивающая массив в строки.
