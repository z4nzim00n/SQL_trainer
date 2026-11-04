## Идея

Нужны две выборки, которые идут друг под другом: `id` и `pizza_name` из `menu`, затем `id` и `name` из `person`. Склей их оператором `UNION`. Названия столбцов задаёт первый запрос, а `ORDER BY` стоит один раз в самом конце.

## Каркас

```sql
SELECT ______ AS object_id, ______ AS object_name FROM menu
UNION
SELECT ______, ______ FROM person
ORDER BY ______, ______;
```

Впиши пропуски: столбцы из таблиц и новые имена для сортировки.

## Почти ответ

```sql
SELECT id AS object_id, pizza_name AS object_name FROM menu
UNION
SELECT id, name FROM person
ORDER BY ______;
```

Осталась сортировка: сначала по номеру, потом по названию, через новые имена столбцов.
