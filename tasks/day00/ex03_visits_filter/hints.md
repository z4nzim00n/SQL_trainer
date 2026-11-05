## Идея

Нужна таблица `person_visits`. Условие состоит из двух частей, соединённых `OR`: дата в диапазоне 6–9 января **или** `pizzeria_id = 2`. Чтобы убрать повторы, добавь `DISTINCT`, а сортировку по убыванию включает `DESC`.

## Каркас

```sql
SELECT ______ person_id
FROM person_visits
WHERE visit_date BETWEEN '______' AND '______' ______ pizzeria_id = 2
ORDER BY person_id ______;
```

Впиши слово для уникальных значений, две даты, слово «или» и направление сортировки.

## Почти ответ

```sql
SELECT DISTINCT person_id
FROM person_visits
WHERE visit_date BETWEEN '2022-01-06' AND '2022-01-09' OR ______
ORDER BY ______;
```

Осталось второе условие и сортировка по убыванию.
