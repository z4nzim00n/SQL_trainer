## Идея

Нужно, чтобы у `person_order` и присоединяемой таблицы совпадало название только одного столбца: `person_id`. Поэтому присоединяй не саму `person`, а подзапрос, где её `id` переименован.

## Каркас

```sql
SELECT order_date,
       CONCAT(name, ' (age:', age, ')') AS person_information
FROM person_order
NATURAL JOIN (SELECT id AS ______, name, age FROM person) AS p
ORDER BY ______, ______;
```

Впиши новое имя `id` и столбцы сортировки.

## Почти ответ

```sql
SELECT order_date,
       CONCAT(name, ' (age:', age, ')') AS person_information
FROM person_order
NATURAL JOIN (SELECT id AS person_id, name, age FROM person) AS p
ORDER BY ______, ______;
```

Осталась сортировка, как в задании 07.
