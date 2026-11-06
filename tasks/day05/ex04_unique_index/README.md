# Задание 04. Уникальность данных

**Разрешено:** ANSI SQL

Создай **уникальный** B-Tree индекс с именем `idx_menu_unique` для таблицы `menu` по столбцам `pizzeria_id` и `pizza_name` (именно в таком порядке).

Напиши запрос с доказательством (`EXPLAIN ANALYZE`), что индекс `idx_menu_unique` используется.

> Тренажёр проверяет сам индекс (уникальность, столбцы, порядок) и план запроса `SELECT * FROM menu WHERE pizzeria_id = 1 AND pizza_name = 'cheese pizza'`.
