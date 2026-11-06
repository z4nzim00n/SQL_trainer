-- Phantom Read (REPEATABLE READ)
-- [1] Session #1
BEGIN ISOLATION LEVEL REPEATABLE READ;
-- [2] Session #1
SELECT SUM(rating) FROM pizzeria;
-- [3] Session #2
INSERT INTO pizzeria (id, name, rating) VALUES (11, 'Kazan Pizza 2', 4);
-- [4] Session #2
COMMIT;
-- [5] Session #1
SELECT SUM(rating) FROM pizzeria;
-- [6] Session #1
COMMIT;
-- [7] Session #1
SELECT SUM(rating) FROM pizzeria;
