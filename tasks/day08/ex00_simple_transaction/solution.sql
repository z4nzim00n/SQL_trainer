-- Простая транзакция
-- [1] Session #1
BEGIN;
-- [2] Session #1
UPDATE pizzeria SET rating = 5 WHERE name = 'Pizza Hut';
-- [3] Session #1
SELECT * FROM pizzeria WHERE name = 'Pizza Hut';
-- [4] Session #2
SELECT * FROM pizzeria WHERE name = 'Pizza Hut';
-- [5] Session #1
COMMIT;
-- [6] Session #2
SELECT * FROM pizzeria WHERE name = 'Pizza Hut';
