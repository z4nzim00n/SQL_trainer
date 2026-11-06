## Идея

Один агрегат без группировки по таблице `pizzeria`: среднее значение `rating`, обёрнутое в округление.

## Каркас

```sql
SELECT ROUND(______(rating), ______) AS global_rating
FROM ______;
```

## Почти ответ

```sql
SELECT ROUND(AVG(rating), ______) AS global_rating
FROM pizzeria;
```

Осталось число знаков после запятой.
