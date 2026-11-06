## Идея

Соедини людей с заказами и убери повторы имён через `DISTINCT`. Сортировка по имени в конце.

## Каркас

```sql
SELECT ______ person.name
FROM person
JOIN person_order ON person_order.person_id = person.______
ORDER BY ______;
```

## Почти ответ

```sql
SELECT ______ person.name
FROM person
JOIN person_order ON person_order.person_id = person.id
ORDER BY person.name;
```

Осталось слово, убирающее повторы.
