## Идея

Возьми имена из каждого представления и объедини. `ORDER BY` пишется один раз, в самом конце.

## Каркас

```sql
SELECT name FROM ______
UNION
SELECT name FROM ______
ORDER BY ______;
```

## Почти ответ

```sql
SELECT name FROM v_persons_female
______
SELECT name FROM v_persons_male
ORDER BY name;
```

Осталось слово, объединяющее два запроса.
