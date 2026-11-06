-- Deadlock
-- [1] Session #1
BEGIN;
-- [1] Session #2
BEGIN;
-- [2] Session #1
UPDATE pizzeria SET rating = 5 WHERE id = 1;   -- держим строку 1
-- [3] Session #2
UPDATE pizzeria SET rating = 5 WHERE id = 2;   -- держим строку 2
-- [4] Session #1
UPDATE pizzeria SET rating = 5 WHERE id = 2;   -- ждём строку 2 (её держит Session #2)
-- [5] Session #2
UPDATE pizzeria SET rating = 5 WHERE id = 1;   -- ждём строку 1: цикл; ERROR: deadlock detected
-- [6] Session #1
ROLLBACK;   -- завершаем обе транзакции
-- [6] Session #2
ROLLBACK;   -- завершаем обе транзакции
