-- Идея: пересечение двух наборов пар (дата, человек).
SELECT order_date AS action_date, person_id FROM person_order   -- когда человек заказывал; имя столбца берётся отсюда
INTERSECT                                                       -- оставляем только пары, которые есть в обоих запросах
SELECT visit_date, person_id FROM person_visits                 -- когда человек посещал
ORDER BY action_date ASC, person_id DESC;                       -- дата по возрастанию, при равенстве человек по убыванию
