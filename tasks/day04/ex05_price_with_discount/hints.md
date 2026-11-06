## Идея

`CREATE VIEW` над запросом: заказы, имя клиента, пицца, цена и вычисляемый столбец со скидкой. Округление оберни вокруг формулы.

## Каркас

```sql
CREATE VIEW v_price_with_discount AS
SELECT person.name, menu.pizza_name, menu.price,
       ROUND(menu.price - menu.price * ______) AS ______
FROM person_order
JOIN person ON person.id = person_order.______
JOIN menu ON menu.id = person_order.______
ORDER BY ______, ______;
```

## Почти ответ

```sql
... ROUND(menu.price - menu.price * 0.1) AS discount_price
FROM person_order
JOIN person ON person.id = person_order.person_id
JOIN menu ON menu.id = person_order.menu_id
ORDER BY ______, ______;
```

Осталась сортировка: имя клиента, потом название пиццы.
