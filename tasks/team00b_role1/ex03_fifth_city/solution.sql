INSERT INTO nodes (point1, point2, cost) VALUES
    ('a', 'e', 12), ('e', 'a', 12),
    ('b', 'e', 14), ('e', 'b', 14),
    ('c', 'e', 16), ('e', 'c', 16),
    ('d', 'e', 18), ('e', 'd', 18);

SELECT total_cost, tour
FROM v_all_tours
WHERE total_cost = (SELECT MIN(total_cost) FROM v_all_tours)
ORDER BY total_cost, tour;
