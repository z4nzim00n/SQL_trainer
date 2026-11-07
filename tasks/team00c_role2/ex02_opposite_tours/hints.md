## Идея

Условие `WHERE`: стоимость равна минимальной или максимальной по представлению.

## Каркас

```sql
SELECT total_cost, tour
FROM v_all_tours
WHERE total_cost = (SELECT MIN(total_cost) FROM v_all_tours)
   ______ total_cost = (SELECT ______(total_cost) FROM v_all_tours)
ORDER BY ______, ______;
```

## Почти ответ

Между условиями нужно `OR` (а не `AND`), для второго подзапроса функция `MAX`.
