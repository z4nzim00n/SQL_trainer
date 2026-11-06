-- Идея: рекурсивный запрос хранит пару соседних чисел и порождает следующую.
CREATE FUNCTION fnc_fibonacci(pstop integer DEFAULT 10) RETURNS TABLE (fibonacci integer) AS $$
    WITH RECURSIVE fib(a, b) AS (
        SELECT 0, 1                          -- старт: 0 и 1
        UNION ALL
        SELECT b, a + b FROM fib WHERE a < pstop   -- следующая пара: (b, a+b)
    )
    SELECT a FROM fib WHERE a < pstop;       -- берём только числа меньше границы
$$ LANGUAGE sql;
