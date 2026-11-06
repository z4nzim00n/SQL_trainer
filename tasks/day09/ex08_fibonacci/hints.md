## Идея

Самый короткий способ: рекурсивный `WITH RECURSIVE` внутри `LANGUAGE sql` функции. Состояние пара `(a, b)`: `(0, 1)`, дальше `(b, a + b)`.

## Каркас

```sql
CREATE FUNCTION fnc_fibonacci(pstop integer DEFAULT ______) RETURNS TABLE (fibonacci integer) AS $$
    WITH RECURSIVE fib(a, b) AS (
        SELECT 0, 1
        UNION ALL
        SELECT b, a + b FROM fib WHERE a < ______
    )
    SELECT a FROM fib WHERE a ___ pstop;
$$ LANGUAGE sql;
```

## Почти ответ

В последней строке нужно `a < pstop` (строго меньше), по умолчанию `pstop` равен 10. Проверь `fnc_fibonacci(8)`: числа 8 в результате быть не должно.
