# Задание 00. Индекс для каждого внешнего ключа

**Разрешено:** ANSI SQL

Создай простой B-Tree индекс для **каждого внешнего ключа** в нашей базе данных.

Имя индекса строится по шаблону `idx_{имя_таблицы}_{имя_столбца}`. Например, для столбца `pizzeria_id` в таблице `menu` индекс называется `idx_menu_pizzeria_id`.

> Внешние ключи в базе: `menu.pizzeria_id`, `person_order.person_id`, `person_order.menu_id`, `person_visits.person_id`, `person_visits.pizzeria_id`. Свою схему базы можно открыть на вкладке «Схема».
