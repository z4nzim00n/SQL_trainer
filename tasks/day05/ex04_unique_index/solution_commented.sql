-- Идея: уникальная пара (пиццерия, пицца): одна пицца в пиццерии записывается один раз.
CREATE UNIQUE INDEX idx_menu_unique ON menu (pizzeria_id, pizza_name);

EXPLAIN ANALYZE
SELECT * FROM menu WHERE pizzeria_id = 1 AND pizza_name = 'cheese pizza';
-- В плане: Index Scan using idx_menu_unique
