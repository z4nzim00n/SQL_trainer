# Задание 04. JOIN и отбор по нескольким значениям

Название пиццы и цена лежат в `menu`, название пиццерии в `pizzeria`. Соединяются они по `menu.pizzeria_id = pizzeria.id`.

Отобрать два названия пиццы можно через `OR`: `pizza_name = 'a' OR pizza_name = 'b'`, или через `IN ('a', 'b')`. Названия сравниваются точно, с учётом регистра букв.

Если оба столбца называются одинаково в разных таблицах (здесь `name` у `pizzeria`), задай новое имя через `AS`, а в `ORDER BY` можно использовать новые имена.

## Примеры на маленьких таблицах

```sql-run
SELECT products.title, products.price
FROM products
WHERE title = 'Pen' OR title = 'Mug'
ORDER BY title;
```

```sql-run
SELECT products.title, products.category
FROM products
WHERE category IN ('home', 'travel')
ORDER BY category, title;
```
