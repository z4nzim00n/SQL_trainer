## Идея

Возьми запрос из задания 05, назови столбец с именем `person_name` и добавь второй столбец: проверку, что имя равно `'Denis'`. Подзапрос с именем придётся написать ещё раз внутри проверки.

## Каркас

```sql
SELECT (SELECT name FROM person WHERE person.id = person_order.person_id) AS ______,
       CASE WHEN (SELECT name FROM person WHERE person.id = person_order.person_id) = '______'
            THEN ______ ELSE ______ END AS ______
FROM person_order
WHERE ...;  -- условия из задания 05
```

Впиши имена столбцов, имя `Denis` и значения `true` / `false`.

## Почти ответ

```sql
SELECT (SELECT name FROM person WHERE person.id = person_order.person_id) AS person_name,
       CASE WHEN (SELECT name FROM person WHERE person.id = person_order.person_id) = 'Denis'
            THEN true ELSE false END AS check_name
FROM person_order
WHERE ______;
```

Осталось условие `WHERE` из задания 05.
