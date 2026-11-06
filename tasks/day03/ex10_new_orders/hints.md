## Идея

Повтори подход из задания 09, но в `person_order`: вместо пиццерии подставь `id` меню `sicilian pizza` из подзапроса.

## Каркас

```sql
INSERT INTO person_order (id, person_id, menu_id, order_date)
SELECT (SELECT MAX(id) FROM person_order) + person.id,
       person.id,
       (SELECT id FROM menu WHERE pizza_name = '______'),
       '______'
FROM person
WHERE person.name = '______' OR person.name = '______';
```

## Почти ответ

```sql
... (SELECT id FROM menu WHERE pizza_name = 'sicilian pizza'), '______'
FROM person WHERE person.name = 'Denis' OR person.name = 'Irina';
```

Осталась дата заказов.
