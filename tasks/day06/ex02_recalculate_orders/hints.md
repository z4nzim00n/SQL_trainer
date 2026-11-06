## Идея

Возьми заказы, присоедини клиента, меню и пиццерию, а скидку присоедини по двум условиям: клиент и пиццерия. Цена со скидкой считается с делением на 100.

## Каркас

```sql
SELECT person.name, menu.pizza_name, menu.price,
       ROUND(menu.price - menu.price * person_discounts.discount / ______) AS ______,
       pizzeria.name AS pizzeria_name
FROM person_order
JOIN person ON person.id = person_order.person_id
JOIN menu ON menu.id = person_order.menu_id
JOIN pizzeria ON pizzeria.id = menu.pizzeria_id
JOIN person_discounts ON person_discounts.person_id = person.id AND person_discounts.______ = pizzeria.id
ORDER BY ______, ______;
```

## Почти ответ

```sql
... JOIN person_discounts ON person_discounts.person_id = person.id AND person_discounts.pizzeria_id = pizzeria.id
ORDER BY ______, ______;
```

Осталась сортировка: имя клиента, затем название пиццы.
