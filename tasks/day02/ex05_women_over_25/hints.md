## Идея

Таблица `person`. Условие из двух частей через `AND`: пол `'female'` и возраст строго больше 25. Сортировка по имени.

## Каркас

```sql
SELECT ______
FROM person
WHERE gender = '______' ______ age ______ 25
ORDER BY ______;
```

## Почти ответ

```sql
SELECT name
FROM person
WHERE gender = 'female' AND ______
ORDER BY name;
```

Осталось условие про возраст.
