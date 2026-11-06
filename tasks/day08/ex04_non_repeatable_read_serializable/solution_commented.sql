-- Non-Repeatable Read (SERIALIZABLE)
-- [1] Session #1
BEGIN ISOLATION LEVEL SERIALIZABLE;
-- [1] Session #2
BEGIN ISOLATION LEVEL SERIALIZABLE;
-- [2] Session #1
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';   -- первое чтение: фиксируется снимок
-- [3] Session #2
UPDATE pizzeria SET rating = 3.0 WHERE name = 'Pizza Hut';
-- [4] Session #2
COMMIT;   -- Session #2 фиксирует
-- [5] Session #1
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';   -- второе чтение: то же значение
-- [6] Session #1
COMMIT;
-- [7] Session #1
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';   -- после COMMIT: 3.0
