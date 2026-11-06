-- Идея: из мультимножества заказов за день вычитаем мультимножество посещений за тот же день.
SELECT person_id FROM person_order WHERE order_date = '2022-01-07'    -- кто заказывал 7 января (с повторами)
EXCEPT ALL                                                            -- вычитаем с учётом количества
SELECT person_id FROM person_visits WHERE visit_date = '2022-01-07';  -- кто посещал 7 января
