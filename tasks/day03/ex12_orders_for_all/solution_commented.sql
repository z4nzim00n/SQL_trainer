-- Идея: по заказу на каждого человека (источник строк: person).
INSERT INTO person_order (id, person_id, menu_id, order_date)
SELECT (SELECT MAX(id) FROM person_order) + person.id,         -- новый уникальный id
       person.id,                                              -- каждый человек
       (SELECT id FROM menu WHERE pizza_name = 'greek pizza'), -- id меню по названию
       '2022-02-25'
FROM person;
