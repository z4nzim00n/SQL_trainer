-- Идея: UNION сам убирает повторы, поэтому склеиваем запрос с самим собой.
SELECT pizza_name
FROM menu
UNION                              -- каждое название встретится дважды, UNION оставит одно
SELECT pizza_name
FROM menu
ORDER BY pizza_name DESC;          -- DESC: по убыванию
