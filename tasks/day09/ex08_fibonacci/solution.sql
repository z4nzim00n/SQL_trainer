CREATE FUNCTION fnc_fibonacci(pstop integer DEFAULT 10) RETURNS TABLE (fibonacci integer) AS $$
    WITH RECURSIVE fib(a, b) AS (
        SELECT 0, 1
        UNION ALL
        SELECT b, a + b FROM fib WHERE a < pstop
    )
    SELECT a FROM fib WHERE a < pstop;
$$ LANGUAGE sql;
