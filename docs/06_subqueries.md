# 6. Подзапросы, IN, EXISTS, WITH

Подзапрос это `SELECT` внутри другого запроса, в скобках. Результат подзапроса используется как значение, как список или как временная таблица.

## Подзапрос, возвращающий одно значение

Если подзапрос возвращает ровно **одну строку и один столбец**, его можно использовать как обычное число или текст.

```sql-run
SELECT pizza_name, price
FROM menu
WHERE price > (SELECT AVG(price) FROM menu)
ORDER BY price;
```

Если подзапрос вернёт больше одной строки, будет ошибка `more than one row returned by a subquery`.

## IN: значение из списка подзапроса

Подзапрос возвращает **один столбец**, внешний запрос проверяет, входит ли значение в этот список.

```sql-run
SELECT name
FROM person
WHERE id IN (SELECT person_id FROM person_order);
```

```sql-run
SELECT pizza_name, price
FROM menu
WHERE pizzeria_id IN (SELECT id FROM pizzeria WHERE rating >= 4.5);
```

### NOT IN и NULL

`NOT IN` вернёт пустой результат, если в списке встретится хотя бы один `NULL`. Это самая частая скрытая ошибка. Если столбец может содержать `NULL`, используй `NOT EXISTS` или добавь `WHERE столбец IS NOT NULL` внутрь подзапроса.

## EXISTS: есть ли хоть одна строка

`EXISTS` отвечает «да/нет»: вернул ли подзапрос хотя бы одну строку. Обычно подзапрос связывают с внешней строкой через условие. Такой подзапрос называется **коррелированным**: он зависит от строки внешнего запроса и вычисляется для каждой.

```sql-run
SELECT person.name
FROM person
WHERE EXISTS (
    SELECT 1
    FROM person_order
    WHERE person_order.person_id = person.id
);
```

Что стоит после `SELECT` внутри `EXISTS`, неважно (`1`, `*`, что угодно): считается только факт наличия строк.

`NOT EXISTS` даёт обратное: строк нет.

```sql-run
SELECT pizzeria.name
FROM pizzeria
WHERE NOT EXISTS (
    SELECT 1
    FROM person_visits
    WHERE person_visits.pizzeria_id = pizzeria.id
);
```

Это пиццерии, где никто не был. Тот же результат даёт `NOT IN`:

```sql-run
SELECT name
FROM pizzeria
WHERE id NOT IN (SELECT pizzeria_id FROM person_visits);
```

Когда что: `IN` удобен для сравнения с готовым списком значений, `EXISTS` для вопроса «есть ли связанные строки», `NOT EXISTS` надёжнее `NOT IN`, когда возможен `NULL`.

## ANY и ALL

`> ANY (подзапрос)` значит «больше хотя бы одного из списка», `> ALL (подзапрос)` «больше каждого из списка».

```sql-run
SELECT pizza_name, price
FROM menu
WHERE price > ALL (SELECT price FROM menu WHERE pizza_name = 'cheese pizza');
```

`= ANY (...)` то же самое, что `IN (...)`.

## Подзапрос в FROM

Подзапрос в `FROM` работает как временная таблица. **Псевдоним обязателен.**

```sql-run
SELECT m.pizza_name, m.price
FROM (SELECT pizza_name, price FROM menu WHERE price > 800) AS m
ORDER BY m.price;
```

Так же переименовывают столбцы перед `NATURAL JOIN`.

## Подзапрос в SELECT

Скалярный подзапрос можно поставить прямо в список столбцов. Он вычисляется для каждой строки.

```sql-run
SELECT name,
       (SELECT COUNT(*) FROM person_order WHERE person_order.person_id = person.id) AS orders_count
FROM person
ORDER BY orders_count DESC, name;
```

Чаще то же делают через `LEFT JOIN` + `GROUP BY`, но подзапрос читается проще.

## WITH (CTE): именованные подзапросы

`WITH` даёт подзапросу имя, и дальше его можно использовать как таблицу. Это делает длинные запросы читаемыми.

```sql-run
WITH expensive AS (
    SELECT pizzeria_id, pizza_name, price
    FROM menu
    WHERE price > 800
)
SELECT pizzeria.name, expensive.pizza_name, expensive.price
FROM expensive
JOIN pizzeria ON expensive.pizzeria_id = pizzeria.id
ORDER BY expensive.price, pizzeria.name;
```

Можно объявить несколько через запятую, и следующие видят предыдущие. С `WITH RECURSIVE` строят обходы иерархий, но в учебных заданиях это редкость.

```sql-run
WITH RECURSIVE counter(n) AS (
    SELECT 1
    UNION ALL
    SELECT n + 1 FROM counter WHERE n < 5
)
SELECT n FROM counter;
```

## Что выбрать

| Задача | Инструмент |
| --- | --- |
| сравнить с одним числом | скалярный подзапрос |
| значение входит в список | `IN` |
| есть ли связанные строки | `EXISTS` |
| нет связанных строк | `NOT EXISTS` (надёжнее `NOT IN`) |
| сделать временную таблицу | подзапрос в `FROM` или `WITH` |

## Частые ошибки

- Подзапрос в `IN` возвращает два столбца: `subquery has too many columns`.
- Скалярный подзапрос вернул несколько строк.
- Подзапрос в `FROM` без псевдонима: `subquery in FROM must have an alias`.
- `NOT IN` и `NULL` в списке.
