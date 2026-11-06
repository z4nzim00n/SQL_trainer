-- Идея: уникальность только для заказов за 1 января 2022.
CREATE UNIQUE INDEX idx_person_order_order_date
ON person_order (person_id, menu_id)
WHERE order_date = '2022-01-01';        -- в индекс попадают только такие строки

EXPLAIN ANALYZE
SELECT person_id, menu_id FROM person_order WHERE order_date = '2022-01-01';
-- В плане: Index Only Scan using idx_person_order_order_date
