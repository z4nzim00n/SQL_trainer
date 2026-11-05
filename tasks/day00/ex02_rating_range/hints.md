## Идея

Название и рейтинг лежат в таблице `pizzeria`. Условие «от 3.5 до 5 включительно» это две границы: не меньше 3.5 и не больше 5. Не забудь сортировку по рейтингу.

## Каркас

```sql
SELECT name, rating
FROM pizzeria
WHERE rating ____ 3.5 AND rating ____ 5
ORDER BY ______;
```

В пропусках знаки сравнения, которые включают границы.

## Почти ответ

```sql
SELECT name, rating
FROM pizzeria
WHERE rating BETWEEN ______ AND ______
ORDER BY rating;
```

Это второй способ: впиши границы диапазона.
