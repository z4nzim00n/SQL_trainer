-- Сборка: данные (Роль 1) -> представление (Роль 2) -> итоговый запрос.
CREATE TABLE nodes (
    point1 varchar NOT NULL,
    point2 varchar NOT NULL,
    cost integer NOT NULL
);

INSERT INTO nodes (point1, point2, cost) VALUES
    ('a', 'b', 10),
    ('b', 'a', 10),
    ('a', 'c', 15),
    ('c', 'a', 15),
    ('a', 'd', 20),
    ('d', 'a', 20),
    ('b', 'c', 35),
    ('c', 'b', 35),
    ('b', 'd', 25),
    ('d', 'b', 25),
    ('c', 'd', 30),
    ('d', 'c', 30);

CREATE VIEW v_all_tours AS
WITH RECURSIVE tours AS (
    SELECT point2 AS last_point, ARRAY[point1, point2] AS path, cost AS total_cost
    FROM nodes
    WHERE point1 = 'a'
    UNION ALL
    SELECT nodes.point2, tours.path || nodes.point2, tours.total_cost + nodes.cost
    FROM tours
    JOIN nodes ON nodes.point1 = tours.last_point
    WHERE NOT nodes.point2 = ANY (tours.path)
)
SELECT tours.total_cost + nodes.cost AS total_cost, tours.path || nodes.point2 AS tour
FROM tours
JOIN nodes ON nodes.point1 = tours.last_point AND nodes.point2 = 'a'
WHERE CARDINALITY(tours.path) = (SELECT COUNT(*) FROM (SELECT point1 FROM nodes UNION SELECT point2 FROM nodes) AS cities);

SELECT total_cost, tour
FROM v_all_tours
WHERE total_cost = (SELECT MIN(total_cost) FROM v_all_tours)
   OR total_cost = (SELECT MAX(total_cost) FROM v_all_tours)
ORDER BY total_cost, tour;
