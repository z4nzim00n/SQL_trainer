## Идея

Строки берём из `person_order`: там заказы, меню и дата. Имя человека достаём подзапросом в `SELECT`, который ищет в `person` строку с `id`, равным `person_id` заказа. Три варианта меню соединяются через `OR` в скобках, дата через `AND`.

## Каркас

```sql
SELECT (SELECT name FROM person WHERE person.id = ______) AS name
FROM person_order
WHERE (menu_id = 13 OR menu_id = ______ OR menu_id = ______)
  AND order_date = '______';
```

Впиши столбец `person_id` заказа, оставшиеся номера меню и дату.

## Почти ответ

```sql
SELECT (SELECT name FROM person WHERE person.id = person_order.person_id) AS name
FROM person_order
WHERE (menu_id = 13 OR menu_id = 14 OR menu_id = 18)
  AND ______ = '2022-01-07';
```

Осталось название столбца с датой заказа.
