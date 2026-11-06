## Идея

Нужны две выборки с одинаковой структурой: (дата, человек) из заказов и (дата, человек) из посещений. Склей их `INTERSECT`: останутся пары, которые есть и там, и там.

## Каркас

```sql
SELECT ______ AS action_date, person_id FROM person_order
INTERSECT
SELECT ______, person_id FROM person_visits
ORDER BY ______ ASC, ______ DESC;
```

Впиши столбцы с датами и столбцы сортировки (новое имя даты и `person_id`).

## Почти ответ

```sql
SELECT order_date AS action_date, person_id FROM person_order
INTERSECT
SELECT visit_date, person_id FROM person_visits
ORDER BY ______ ASC, ______ DESC;
```

Осталась сортировка: сначала по новому имени даты, потом по человеку.
