SELECT total_cost, tour
FROM v_all_tours
WHERE total_cost = (SELECT MIN(total_cost) FROM v_all_tours)
ORDER BY total_cost, tour;
