-- Идея: массив разворачиваем в строки (unnest) и берём MIN.
CREATE FUNCTION func_minimum(VARIADIC arr numeric[]) RETURNS numeric AS $$
    SELECT MIN(a) FROM unnest(arr) AS a;
$$ LANGUAGE sql;
