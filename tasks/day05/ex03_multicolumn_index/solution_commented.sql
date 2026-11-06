-- Идея: в индексе все столбцы запроса, поэтому таблица не нужна (Index Only Scan).
CREATE INDEX idx_person_order_multi
ON person_order (person_id, menu_id, order_date);   -- условия + столбец из SELECT

EXPLAIN ANALYZE
SELECT person_id, menu_id, order_date
FROM person_order
WHERE person_id = 8 AND menu_id = 14;
-- В плане: Index Only Scan using idx_person_order_multi
