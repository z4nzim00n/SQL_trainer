## Идея

Источник строк: `person`. На каждую строку: `id` = максимальный `id` + `person.id`, человек, `id` меню `greek pizza` из подзапроса, фиксированная дата.

## Каркас

```sql
INSERT INTO person_order (id, person_id, menu_id, order_date)
SELECT (SELECT MAX(id) FROM person_order) + person.id,
       ______,
       (SELECT id FROM menu WHERE pizza_name = '______'),
       '______'
FROM ______;
```

## Почти ответ

```sql
INSERT INTO person_order (id, person_id, menu_id, order_date)
SELECT (SELECT MAX(id) FROM person_order) + person.id, person.id,
       (SELECT id FROM menu WHERE pizza_name = 'greek pizza'), '2022-02-25'
FROM ______;
```

Осталась таблица-источник людей.
