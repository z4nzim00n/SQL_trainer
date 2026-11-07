## Идея

Сначала `INSERT` восьми строк (4 новых ребра в обе стороны), затем тот же запрос выбора минимума, что в задании 02.

## Каркас

```sql
INSERT INTO nodes (point1, point2, cost) VALUES
    ('a', 'e', 12), ('e', 'a', 12),
    ('b', 'e', ______), ('e', 'b', ______),
    ...;

SELECT total_cost, tour FROM v_all_tours
WHERE total_cost = (SELECT MIN(total_cost) FROM v_all_tours)
ORDER BY total_cost, tour;
```

## Почти ответ

Недостающие стоимости: b–e = 14, c–e = 16, d–e = 18 (по две строки на пару).
