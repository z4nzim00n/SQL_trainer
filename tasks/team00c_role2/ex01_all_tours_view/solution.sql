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
