## Идея

Это задание 00 с ещё одним условием: пол должен быть женский (`'female'`). Два условия в `WHERE` склеиваются через `AND`. В конце добавь сортировку по имени.

## Каркас

```sql
SELECT name, age
FROM person
WHERE address = 'Kazan' ______ gender = '______'
ORDER BY ______;
```

Впиши слово для «и», значение пола и столбец сортировки.

## Почти ответ

```sql
SELECT name, age
FROM person
WHERE address = 'Kazan' AND gender = 'female'
______ ______;
```

Осталась сортировка: два слова, первое из них `ORDER`.
