## Идея

Возьми запрос из задания 02 без `LIMIT` и ORDER BY, оберни в подзапрос, а снаружи сгруппируй по названию и сложи количества.

## Каркас

```sql
SELECT name, SUM(count) AS ______
FROM (<заказы по пиццериям>
      ______ ALL
      <посещения по пиццериям>) AS stats
GROUP BY ______
ORDER BY total_count DESC, name ASC;
```

## Почти ответ

```sql
SELECT name, SUM(count) AS total_count
FROM (... UNION ALL ...) AS stats
GROUP BY name
ORDER BY ______ DESC, name ASC;
```

Осталось имя столбца, по которому сортируем по убыванию.
