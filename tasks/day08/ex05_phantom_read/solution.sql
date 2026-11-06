-- Phantom Read (READ COMMITTED)
-- [1] Session #1
BEGIN;
-- [1] Session #2
BEGIN;
-- [2] Session #1
SELECT SUM(rating) FROM pizzeria;
-- [3] Session #2
INSERT INTO pizzeria (id, name, rating) VALUES (10, 'Kazan Pizza', 5);
-- [4] Session #2
COMMIT;
-- [5] Session #1
SELECT SUM(rating) FROM pizzeria;
-- [6] Session #1
COMMIT;
-- [7] Session #1
SELECT SUM(rating) FROM pizzeria;
