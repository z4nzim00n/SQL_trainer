# 7. Агрегаты, GROUP BY, HAVING

Агрегатная функция сворачивает много строк в одно значение.

| Функция | Что считает |
| --- | --- |
| `COUNT(*)` | число строк |
| `COUNT(столбец)` | число строк, где столбец **не** `NULL` |
| `COUNT(DISTINCT столбец)` | число разных значений |
| `SUM(x)` | сумма |
| `AVG(x)` | среднее |
| `MIN(x)`, `MAX(x)` | минимум и максимум (работают и с текстом, и с датами) |

```sql-pizza
SELECT COUNT(*) AS rows_count, MIN(price) AS cheapest, MAX(price) AS most_expensive, ROUND(AVG(price), 2) AS average_price
FROM menu;
```

```sql-pizza
SELECT COUNT(*) AS all_rows, COUNT(DISTINCT pizza_name) AS different_pizzas
FROM menu;
```

Агрегаты игнорируют `NULL` (кроме `COUNT(*)`). Если все значения `NULL`, `SUM` и `AVG` вернут `NULL`, а `COUNT` вернёт 0.

## GROUP BY: по группам

`GROUP BY` разбивает строки на группы с одинаковым значением и считает агрегат **для каждой группы**.

```sql-pizza
SELECT pizzeria_id, COUNT(*) AS pizzas, MIN(price) AS cheapest
FROM menu
GROUP BY pizzeria_id
ORDER BY pizzeria_id;
```

Главное правило: в `SELECT` можно указать либо столбцы из `GROUP BY`, либо агрегаты. Любой другой столбец вызовет ошибку `column "..." must appear in the GROUP BY clause or be used in an aggregate function`.

Группировать можно по нескольким столбцам:

```sql-pizza
SELECT person_id, order_date, COUNT(*) AS orders_that_day
FROM person_order
GROUP BY person_id, order_date
ORDER BY person_id, order_date;
```

## HAVING: фильтр групп

`WHERE` фильтрует строки **до** группировки, `HAVING` фильтрует готовые группы **после**. В `WHERE` агрегаты писать нельзя.

```sql-pizza
SELECT pizzeria_id, COUNT(*) AS pizzas
FROM menu
GROUP BY pizzeria_id
HAVING COUNT(*) > 2
ORDER BY pizzeria_id;
```

Совмещение: сначала `WHERE` отбирает строки, потом группировка, потом `HAVING`.

```sql-pizza
SELECT pizzeria_id, ROUND(AVG(price), 2) AS avg_price
FROM menu
WHERE price > 700
GROUP BY pizzeria_id
HAVING AVG(price) > 800
ORDER BY avg_price DESC;
```

## Группировка с JOIN

Часто имя нужно из другой таблицы: сначала `JOIN`, потом `GROUP BY` по столбцам этой таблицы.

```sql-pizza
SELECT pizzeria.name, COUNT(*) AS visits
FROM person_visits
JOIN pizzeria ON person_visits.pizzeria_id = pizzeria.id
GROUP BY pizzeria.name
ORDER BY visits DESC, pizzeria.name;
```

Чтобы в результате остались и группы с нулём (пиццерии без визитов), нужен `LEFT JOIN`, а считать надо столбец правой таблицы:

```sql-pizza
SELECT pizzeria.name, COUNT(person_visits.id) AS visits
FROM pizzeria
LEFT JOIN person_visits ON person_visits.pizzeria_id = pizzeria.id
GROUP BY pizzeria.name
ORDER BY visits DESC, pizzeria.name;
```

`COUNT(*)` здесь дал бы 1 даже для пиццерии без визитов (строка с `NULL` тоже строка). `COUNT(person_visits.id)` считает только настоящие пары.

## Порядок выполнения

`FROM` / `JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.

## Агрегат с условием: FILTER и CASE

```sql-pizza
SELECT COUNT(*) AS everyone,
       COUNT(*) FILTER (WHERE gender = 'female') AS women,
       COUNT(*) FILTER (WHERE age >= 21) AS adults_21_plus
FROM person;
```

Универсальный вариант (работает везде) через `CASE`:

```sql-pizza
SELECT SUM(CASE WHEN gender = 'female' THEN 1 ELSE 0 END) AS women
FROM person;
```

## Объединение значений в строку

```sql-pizza
SELECT address, STRING_AGG(name, ', ' ORDER BY name) AS people
FROM person
GROUP BY address
ORDER BY address;
```

## Частые ошибки

- Столбец в `SELECT` не из `GROUP BY` и не в агрегате.
- Агрегат в `WHERE` вместо `HAVING`.
- Потеряли группы с нулём: взяли `JOIN` вместо `LEFT JOIN`.
- `COUNT(*)` вместо `COUNT(столбец_правой_таблицы)` после `LEFT JOIN`.
