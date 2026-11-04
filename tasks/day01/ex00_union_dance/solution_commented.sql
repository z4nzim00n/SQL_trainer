-- Идея: два списка «номер + название» склеиваем друг под другом через UNION.
SELECT id AS object_id,            -- имена столбцов результата берутся из первого запроса
       pizza_name AS object_name
FROM menu
UNION                              -- UNION заодно убрал бы полные дубли строк
SELECT id, name                    -- те же типы на тех же местах: число и текст
FROM person
ORDER BY object_id, object_name;   -- одна сортировка на весь результат, по новым именам
