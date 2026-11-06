# Задание 08. Скобки в сложных условиях

В условии сочетаются несколько «или» и «и». У `AND` приоритет выше, чем у `OR`, поэтому группы вариантов обязательно берутся **в скобки**:

```sql
WHERE gender = 'male'
  AND (address = 'Moscow' OR address = 'Samara')
  AND (pizza_name = 'pepperoni pizza' OR pizza_name = 'mushroom pizza')
```

Без скобок `OR` «вытащит» условие из-под `AND`, и результат будет другим.

Один человек мог сделать несколько подходящих заказов, поэтому его имя повторится. Чтобы каждое имя было один раз, ставят `DISTINCT` после `SELECT`.

«Обратный алфавитный порядок» это сортировка по убыванию: `ORDER BY name DESC`.

## Примеры на маленьких таблицах

```sql-run
SELECT DISTINCT category
FROM products
WHERE price > 1 AND (category = 'office' OR category = 'home')
ORDER BY category DESC;
```

Без скобок смысл другой (`AND` сильнее `OR`):

```sql-run
SELECT title, category, price
FROM products
WHERE price > 5 AND category = 'office' OR category = 'travel'
ORDER BY title;
```
