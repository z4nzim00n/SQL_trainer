-- Идея: id меню, которых нет среди заказанных.
SELECT id AS menu_id
FROM menu
WHERE id NOT IN (SELECT menu_id FROM person_order)   -- не входит в список заказанных
ORDER BY menu_id;
