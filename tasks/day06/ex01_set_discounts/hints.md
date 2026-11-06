## Идея

`INSERT INTO person_discounts (id, person_id, pizzeria_id, discount)` и `SELECT`, который группирует заказы (через `menu` узнаём пиццерию), считает `COUNT(*)`, выбирает скидку через `CASE` и нумерует строки.

## Каркас

```sql
INSERT INTO person_discounts (id, person_id, pizzeria_id, discount)
SELECT ROW_NUMBER() OVER () AS id,
       person_order.person_id,
       menu.______,
       CASE WHEN COUNT(*) = ______ THEN 10.5
            WHEN COUNT(*) = ______ THEN 22
            ELSE ______ END
FROM person_order
JOIN menu ON menu.id = person_order.______
GROUP BY ______, ______;
```

## Почти ответ

```sql
... CASE WHEN COUNT(*) = 1 THEN 10.5
         WHEN COUNT(*) = 2 THEN 22
         ELSE 30 END
FROM person_order
JOIN menu ON menu.id = person_order.menu_id
GROUP BY person_order.person_id, ______;
```

Осталось второе поле группировки: пиццерия из меню.
