-- Идея: уникальная пара (клиент, пиццерия) защищает от дублей и ускоряет поиск.
CREATE UNIQUE INDEX idx_person_discounts_unique
ON person_discounts (person_id, pizzeria_id);

EXPLAIN ANALYZE
SELECT * FROM person_discounts WHERE person_id = 1 AND pizzeria_id = 1;
-- В плане: Index Scan using idx_person_discounts_unique
