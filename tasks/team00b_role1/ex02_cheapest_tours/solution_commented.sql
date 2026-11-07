-- Идея: все маршруты, чья стоимость равна минимальной.
SELECT total_cost, tour
FROM v_all_tours
WHERE total_cost = (SELECT MIN(total_cost) FROM v_all_tours)   -- минимальная стоимость среди всех
ORDER BY total_cost, tour;
