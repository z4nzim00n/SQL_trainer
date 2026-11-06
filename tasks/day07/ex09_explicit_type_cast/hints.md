## Идея

Группировка по адресу. Формулу пиши с приведением `MIN(age)::numeric`, чтобы деление не обрезало дробь. Для `comparison` повтори формулу и сравни с `AVG(age)`.

## Каркас

```sql
SELECT address,
       ROUND(MAX(age) - MIN(age)::______ / MAX(age), 2) AS formula,
       ROUND(______(age), 2) AS average,
       (MAX(age) - MIN(age)::numeric / MAX(age)) ___ AVG(age) AS comparison
FROM person
GROUP BY ______
ORDER BY ______;
```

## Почти ответ

```sql
SELECT address,
       ROUND(MAX(age) - MIN(age)::numeric / MAX(age), 2) AS formula,
       ROUND(AVG(age), 2) AS average,
       (MAX(age) - MIN(age)::numeric / MAX(age)) > AVG(age) AS ______
FROM person
GROUP BY address
ORDER BY address;
```

Осталось имя последнего столбца.
