-- Идея: на маленьких таблицах планировщик не любит индексы, поэтому запрещаем Seq Scan.
SET enable_seqscan = off;
EXPLAIN ANALYZE                                  -- показать план и выполнить запрос
SELECT menu.pizza_name, pizzeria.name AS pizzeria_name
FROM menu
JOIN pizzeria ON pizzeria.id = menu.pizzeria_id;
-- В плане должно быть: Index Scan using idx_menu_pizzeria_id on menu
