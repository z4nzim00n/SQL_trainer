## Идея

Столбцы `id` и `name` просто берутся из таблицы, а `interval_info` считается выражением `CASE` с двумя `WHEN` и `ELSE`. Сортировать нужно по имени нового столбца.

## Каркас

```sql
SELECT id, name,
       CASE
           WHEN age >= 10 AND age <= 20 THEN '______'
           WHEN age > 20 AND age < 24 THEN '______'
           ELSE '______'
       END AS ______
FROM person
ORDER BY ______;
```

Впиши три текста интервалов и имя нового столбца.

## Почти ответ

```sql
SELECT id, name,
       CASE
           WHEN age >= 10 AND age <= 20 THEN 'interval #1'
           WHEN age > 20 AND age < 24 THEN 'interval #2'
           ELSE 'interval #3'
       END AS interval_info
FROM person
ORDER BY ______;
```

Осталась сортировка по новому столбцу.
