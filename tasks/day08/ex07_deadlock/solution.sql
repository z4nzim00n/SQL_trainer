-- Deadlock
-- [1] Session #1
BEGIN;
-- [1] Session #2
BEGIN;
-- [2] Session #1
UPDATE pizzeria SET rating = 5 WHERE id = 1;
-- [3] Session #2
UPDATE pizzeria SET rating = 5 WHERE id = 2;
-- [4] Session #1
UPDATE pizzeria SET rating = 5 WHERE id = 2;
-- [5] Session #2
UPDATE pizzeria SET rating = 5 WHERE id = 1;
-- [6] Session #1
ROLLBACK;
-- [6] Session #2
ROLLBACK;
