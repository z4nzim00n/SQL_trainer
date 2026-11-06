## Идея

Присоедини посещения к пиццериям через `LEFT JOIN`: пиццерии без посещений получат `NULL` в столбцах `person_visits`. Оставь только такие строки.

## Каркас

```sql
SELECT pizzeria.name, pizzeria.rating
FROM pizzeria
______ JOIN person_visits ON person_visits.pizzeria_id = ______
WHERE person_visits.______ IS ______;
```

## Почти ответ

```sql
SELECT pizzeria.name, pizzeria.rating
FROM pizzeria
LEFT JOIN person_visits ON person_visits.pizzeria_id = pizzeria.id
WHERE ______ IS NULL;
```

Осталось выбрать столбец правой таблицы для проверки (подойдёт её `id`).
