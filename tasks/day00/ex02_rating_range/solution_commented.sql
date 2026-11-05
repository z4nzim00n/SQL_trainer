-- Способ 1: операторы сравнения.
SELECT name, rating
FROM pizzeria
WHERE rating >= 3.5 AND rating <= 5   -- >= и <= включают границы
ORDER BY rating;                      -- по возрастанию рейтинга

-- Способ 2 (то же самое): WHERE rating BETWEEN 3.5 AND 5
