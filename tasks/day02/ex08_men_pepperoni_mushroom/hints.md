## Идея

Заказы `person_order`, человек `person`, позиция `menu`. Три группы условий: пол, город (Москва или Самара), пицца (пепперони или грибы). Группы с `OR` бери в скобки. `DISTINCT` уберёт повторяющиеся имена.

## Каркас

```sql
SELECT ______ person.name
FROM person_order
JOIN person ON person_order.person_id = person.id
JOIN menu ON person_order.menu_id = menu.id
WHERE person.gender = '______'
  AND (person.address = 'Moscow' ______ person.address = 'Samara')
  AND (menu.pizza_name = '______' OR menu.pizza_name = '______')
ORDER BY name ______;
```

## Почти ответ

```sql
SELECT DISTINCT person.name
FROM person_order
JOIN person ON person_order.person_id = person.id
JOIN menu ON person_order.menu_id = menu.id
WHERE person.gender = 'male'
  AND (person.address = 'Moscow' OR person.address = 'Samara')
  AND (______)
ORDER BY name DESC;
```

Осталась группа условий про пиццу в скобках.
