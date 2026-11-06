## Идея

Начни с `person_order` и по очереди присоединяй: `person` (имя), `menu` (пицца и пиццерия), `pizzeria` (название). У каждого соединения свое условие связи по номерам.

## Каркас

```sql
SELECT person.name AS person_name,
       menu.pizza_name AS pizza_name,
       pizzeria.name AS ______
FROM person_order
JOIN person ON person.id = person_order.______
JOIN menu ON menu.id = person_order.______
JOIN pizzeria ON pizzeria.id = menu.______
ORDER BY ______, ______, ______;
```

Впиши имя столбца пиццерии, три столбца связи и три столбца сортировки.

## Почти ответ

```sql
SELECT person.name AS person_name, menu.pizza_name AS pizza_name, pizzeria.name AS pizzeria_name
FROM person_order
JOIN person ON person.id = person_order.person_id
JOIN menu ON menu.id = person_order.menu_id
JOIN pizzeria ON pizzeria.id = menu.pizzeria_id
ORDER BY ______;
```

Осталась сортировка по трём столбцам через запятую.
