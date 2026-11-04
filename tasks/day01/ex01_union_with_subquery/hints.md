## Идея

Нужны два отдельных списка: сначала имена людей, потом названия пицц, и у каждого своя сортировка. Склей их через `UNION ALL`, а каждую часть заключи в скобки, чтобы у неё был свой `ORDER BY`.

## Каркас

```sql
(SELECT ______ AS object_name FROM ______ ORDER BY ______)
UNION ALL
(SELECT ______ FROM ______ ORDER BY ______);
```

В первой части столбец называется `object_name`, а во второй `pizza_name`: сортируй по тому имени, которое есть в этой самой части.

## Почти ответ

```sql
(SELECT name AS object_name FROM person ORDER BY object_name)
UNION ALL
(SELECT pizza_name FROM menu ORDER BY ______);
```

Во второй части сортировка идёт по настоящему имени столбца, а не по новому.
