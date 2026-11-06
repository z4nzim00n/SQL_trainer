-- Non-Repeatable Read (READ COMMITTED)
-- [1] Session #1
BEGIN;
-- [1] Session #2
BEGIN;
-- [2] Session #1
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';   -- первое чтение
-- [3] Session #2
UPDATE pizzeria SET rating = 3.6 WHERE name = 'Pizza Hut';   -- меняем и фиксируем в другой сессии
-- [4] Session #2
COMMIT;
-- [5] Session #1
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';   -- второе чтение: значение изменилось
-- [6] Session #1
COMMIT;
-- [7] Session #1
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';
