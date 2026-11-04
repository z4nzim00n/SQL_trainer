-- Идея: UNION ALL склеивает два отдельно отсортированных списка и сохраняет дубли.
(SELECT name AS object_name        -- имя столбца результата задаёт первая часть
 FROM person
 ORDER BY object_name)             -- скобки нужны, чтобы у части была своя сортировка
UNION ALL                          -- ALL: без него повторы cheese pizza пропали бы
(SELECT pizza_name
 FROM menu
 ORDER BY pizza_name);             -- здесь object_name неизвестен, сортируем по настоящему имени
