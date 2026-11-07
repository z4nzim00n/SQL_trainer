## Идея

Подзапрос находит минимальную стоимость, внешний запрос оставляет все маршруты с такой стоимостью.

## Каркас

```sql
SELECT total_cost, tour
FROM v_all_tours
WHERE total_cost = (SELECT ______(total_cost) FROM v_all_tours)
ORDER BY ______, ______;
```

## Почти ответ

Нужна агрегатная функция `MIN`. Сортировка по двум столбцам: `total_cost`, затем `tour`.
