## Идея

Начни с заказов, присоедини меню (цена) и пиццерии (название), сгруппируй по названию пиццерии и посчитай четыре агрегата.

## Каркас

```sql
SELECT pizzeria.name, COUNT(*) AS count_of_orders,
       ROUND(______(menu.price), 2) AS average_price,
       ______(menu.price) AS max_price,
       ______(menu.price) AS min_price
FROM person_order
JOIN menu ON menu.id = person_order.______
JOIN pizzeria ON pizzeria.id = menu.______
GROUP BY pizzeria.name
ORDER BY pizzeria.name;
```

## Почти ответ

```sql
SELECT pizzeria.name, COUNT(*) AS count_of_orders,
       ROUND(AVG(menu.price), 2) AS average_price,
       MAX(menu.price) AS max_price,
       ______(menu.price) AS min_price
FROM person_order ...
```

Осталась функция для минимальной цены.
