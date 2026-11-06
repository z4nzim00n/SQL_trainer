-- Идея: каждая строка person в паре с каждой строкой pizzeria.
SELECT *                  -- сначала столбцы person, затем pizzeria (в порядке FROM)
FROM person
CROSS JOIN pizzeria;      -- все комбинации, условие не нужно (то же: FROM person, pizzeria)
