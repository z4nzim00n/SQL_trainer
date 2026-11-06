-- Идея: среднее по всем строкам pizzeria, округлённое до 4 знаков.
SELECT ROUND(AVG(rating), 4) AS global_rating
FROM pizzeria;
