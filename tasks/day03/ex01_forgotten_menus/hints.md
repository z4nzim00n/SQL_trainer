## Идея

Источник идентификаторов: таблица `menu`. Оставь те `id`, которых нет среди `menu_id` в заказах. Столбец назови `menu_id`.

## Каркас

```sql
SELECT id AS ______
FROM menu
WHERE id ______ (SELECT ______ FROM person_order)
ORDER BY ______;
```

## Почти ответ

```sql
SELECT id AS menu_id
FROM menu
WHERE id NOT IN (SELECT menu_id FROM ______)
ORDER BY menu_id;
```

Осталось название таблицы с заказами.
