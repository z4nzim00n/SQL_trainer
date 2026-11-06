## Идея

Заказы лежат в `person_order`, имя и возраст в `person`. Соедини таблицы по `person_id` = `id`, затем склей имя и возраст функцией `CONCAT`. Сортировка по двум столбцам.

## Каркас

```sql
SELECT person_order.order_date,
       CONCAT(person.name, ' (age:', ______, ')') AS ______
FROM person_order
JOIN person ON person_order.______ = person.id
ORDER BY ______, ______;
```

Впиши возраст, имя нового столбца, столбец связи и два столбца сортировки.

## Почти ответ

```sql
SELECT person_order.order_date,
       CONCAT(person.name, ' (age:', person.age, ')') AS person_information
FROM person_order
JOIN person ON person_order.person_id = person.id
ORDER BY ______, ______;
```

Осталась сортировка по двум столбцам из результата.
