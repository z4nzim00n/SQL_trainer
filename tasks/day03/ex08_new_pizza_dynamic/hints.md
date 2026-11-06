## Идея

Это `INSERT` с двумя подзапросами в `VALUES`: один считает новый `id`, другой ищет `id` пиццерии по названию.

## Каркас

```sql
INSERT INTO menu (id, pizzeria_id, pizza_name, price)
VALUES ((SELECT ______(id) FROM menu) + 1,
        (SELECT id FROM pizzeria WHERE name = '______'),
        '______', ______);
```

## Почти ответ

```sql
INSERT INTO menu (id, pizzeria_id, pizza_name, price)
VALUES ((SELECT MAX(id) FROM menu) + 1,
        (SELECT id FROM pizzeria WHERE name = 'Dominos'),
        'sicilian pizza', ______);
```

Осталась цена.
