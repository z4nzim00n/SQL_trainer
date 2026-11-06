-- Lost Update (READ COMMITTED)
-- [1] Session #1
BEGIN;
-- [1] Session #2
BEGIN;
-- [2] Session #1
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';
-- [2] Session #2
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';
-- [3] Session #1
UPDATE pizzeria SET rating = 4 WHERE name = 'Pizza Hut';
-- [4] Session #2
UPDATE pizzeria SET rating = 3.6 WHERE name = 'Pizza Hut';
-- [5] Session #1
COMMIT;
-- [6] Session #2
COMMIT;
-- [7] Session #1
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';
