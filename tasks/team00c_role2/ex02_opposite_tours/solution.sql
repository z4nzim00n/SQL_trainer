SELECT total_cost, tour
FROM v_all_tours
WHERE total_cost = (SELECT MIN(total_cost) FROM v_all_tours)
   OR total_cost = (SELECT MAX(total_cost) FROM v_all_tours)
ORDER BY total_cost, tour;
