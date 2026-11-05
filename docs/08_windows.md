# 8. Оконные функции

Оконная функция считает значение для каждой строки, **не схлопывая** строки, как это делает `GROUP BY`. К строке «приклеивается» результат, посчитанный по связанным строкам (окну).

Форма: `функция() OVER (PARTITION BY ... ORDER BY ...)`.

- `PARTITION BY` делит строки на независимые группы (необязательно);
- `ORDER BY` задаёт порядок внутри группы.

## Нумерация и ранги

```sql-run
SELECT pizzeria_id, pizza_name, price,
       ROW_NUMBER() OVER (PARTITION BY pizzeria_id ORDER BY price DESC) AS row_number
FROM menu
ORDER BY pizzeria_id, row_number;
```

| Функция | Поведение при равных значениях |
| --- | --- |
| `ROW_NUMBER()` | всегда уникальный номер 1, 2, 3, 4 |
| `RANK()` | одинаковый ранг, затем пропуск: 1, 1, 3 |
| `DENSE_RANK()` | одинаковый ранг без пропусков: 1, 1, 2 |

```sql-run
SELECT name, age,
       RANK() OVER (ORDER BY age DESC) AS rank,
       DENSE_RANK() OVER (ORDER BY age DESC) AS dense_rank
FROM person
ORDER BY age DESC, name;
```

## Агрегаты в окне

Обычный агрегат с `OVER` добавляется к каждой строке.

```sql-run
SELECT pizzeria_id, pizza_name, price,
       ROUND(AVG(price) OVER (PARTITION BY pizzeria_id), 2) AS avg_in_pizzeria,
       price - ROUND(AVG(price) OVER (PARTITION BY pizzeria_id), 2) AS diff_from_avg
FROM menu
ORDER BY pizzeria_id, price;
```

Нарастающий итог получается, если добавить `ORDER BY` внутрь `OVER`:

```sql-run
SELECT order_date, id,
       COUNT(*) OVER (ORDER BY order_date, id) AS running_orders
FROM person_order
ORDER BY order_date, id;
```

## LAG и LEAD: соседние строки

`LAG` берёт значение из предыдущей строки, `LEAD` из следующей.

```sql-run
SELECT visit_date, person_id,
       LAG(visit_date) OVER (PARTITION BY person_id ORDER BY visit_date) AS previous_visit
FROM person_visits
ORDER BY person_id, visit_date;
```

## Топ-N в группе

Оконную функцию нельзя поставить прямо в `WHERE`. Её оборачивают в подзапрос:

```sql-run
SELECT *
FROM (
    SELECT pizzeria_id, pizza_name, price,
           ROW_NUMBER() OVER (PARTITION BY pizzeria_id ORDER BY price DESC) AS rn
    FROM menu
) AS ranked
WHERE rn = 1
ORDER BY pizzeria_id;
```

Это самая дорогая пицца в каждой пиццерии.
