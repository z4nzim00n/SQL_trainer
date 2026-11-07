## Идея

Возьми тело из ex01, замени `'a'` на параметр `pstart` и обёрни в `CREATE FUNCTION ... LANGUAGE sql`.

## Каркас

```sql
CREATE FUNCTION fnc_tours(pstart varchar DEFAULT '______') RETURNS TABLE (total_cost integer, tour varchar[]) AS $$
    WITH RECURSIVE tours AS (... WHERE point1 = ______ ...)
    SELECT (tours.total_cost + nodes.cost)::integer, tours.path || nodes.point2
    FROM tours JOIN nodes ON nodes.point1 = tours.last_point AND nodes.point2 = ______
    WHERE CARDINALITY(tours.path) = (число городов);
$$ LANGUAGE sql;
```

## Почти ответ

Параметр `pstart` встречается дважды: в стартовой части рекурсии (`WHERE point1 = pstart`) и в замыкании (`nodes.point2 = pstart`).
