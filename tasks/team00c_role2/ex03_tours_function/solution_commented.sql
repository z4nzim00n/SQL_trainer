-- Идея: тот же рекурсивный запрос, но стартовый город приходит параметром.
CREATE FUNCTION fnc_tours(pstart varchar DEFAULT 'a') RETURNS TABLE (total_cost integer, tour varchar[]) AS $$
    WITH RECURSIVE tours AS (
        SELECT point2 AS last_point, ARRAY[point1, point2] AS path, cost AS total_cost
        FROM nodes
        WHERE point1 = pstart          -- старт из заданного города
        UNION ALL
        SELECT nodes.point2, tours.path || nodes.point2, tours.total_cost + nodes.cost
        FROM tours
        JOIN nodes ON nodes.point1 = tours.last_point
        WHERE NOT nodes.point2 = ANY (tours.path)
    )
    SELECT (tours.total_cost + nodes.cost)::integer, tours.path || nodes.point2
    FROM tours
    JOIN nodes ON nodes.point1 = tours.last_point AND nodes.point2 = pstart   -- возврат в него же
    WHERE CARDINALITY(tours.path) = (SELECT COUNT(*) FROM (SELECT point1 FROM nodes UNION SELECT point2 FROM nodes) AS cities);
$$ LANGUAGE sql;
