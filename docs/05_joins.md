# 5. JOIN: соединение таблиц

`JOIN` приклеивает к строке одной таблицы подходящие строки другой. «Подходящие» определяет условие после `ON`, обычно равенство внешнего ключа и первичного ключа.

В нашей базе связи такие:

- `person_order.person_id` → `person.id`
- `person_order.menu_id` → `menu.id`
- `menu.pizzeria_id` → `pizzeria.id`
- `person_visits.person_id` → `person.id`
- `person_visits.pizzeria_id` → `pizzeria.id`

Общая форма:

```sql
SELECT ...
FROM таблица_A
JOIN таблица_B ON условие_связи;
```

На диаграммах ниже кружок A это левая таблица (стоящая после `FROM`), кружок B правая (после `JOIN`), закрашена та часть, которая попадёт в результат.

## INNER JOIN

{{venn:inner}}

Только строки, у которых **нашлась пара** с обеих сторон. Слово `INNER` можно не писать: просто `JOIN`.

```sql-pizza
SELECT person.name, person_order.order_date
FROM person_order
JOIN person ON person_order.person_id = person.id
ORDER BY person_order.order_date, person.name;
```

Люди без заказов и заказы без людей сюда не попадут.

### Как читать `ON`

Для каждой строки левой таблицы база ищет в правой все строки, где условие истинно, и выдаёт по одной итоговой строке на **каждую найденную пару**. Если у человека три заказа, он в результате встретится три раза. Если пары нет, строка пропадает (в `INNER JOIN`).

### Откуда столбцы с одинаковыми именами

И в `person`, и в `menu` есть столбец `id`. Если написать просто `id`, PostgreSQL ответит `column reference "id" is ambiguous` (неоднозначно). Пиши `person.id`, либо задай псевдоним: `FROM person AS p ... p.id`.

## LEFT JOIN

{{venn:left}}

**Все** строки левой таблицы, и к ним пара из правой, если она есть. Если пары нет, столбцы правой будут `NULL`.

```sql-pizza
SELECT person.name, person_order.order_date
FROM person
LEFT JOIN person_order ON person_order.person_id = person.id
ORDER BY person.name;
```

Те, у кого в `order_date` стоит `NULL`, ничего не заказывали.

### LEFT JOIN с проверкой на NULL (антиджойн)

{{venn:left_only}}

Оставляем только те строки левой таблицы, у которых **нет пары**:

```sql-pizza
SELECT person.name
FROM person
LEFT JOIN person_order ON person_order.person_id = person.id
WHERE person_order.id IS NULL;
```

Проверять надо столбец правой таблицы, который в реальной паре никогда не `NULL` (обычно её `id`).

## RIGHT JOIN

{{venn:right}}

Зеркало `LEFT JOIN`: сохраняются все строки правой таблицы. На практике почти всегда переписывают через `LEFT JOIN`, поменяв таблицы местами: так читается проще.

```sql-pizza
SELECT pizzeria.name, person_visits.visit_date
FROM person_visits
RIGHT JOIN pizzeria ON person_visits.pizzeria_id = pizzeria.id
ORDER BY pizzeria.name;
```

С проверкой на `NULL` получаются строки правой таблицы без пары в левой:

{{venn:right_only}}

```sql-pizza
SELECT pizzeria.name
FROM person_visits
RIGHT JOIN pizzeria ON person_visits.pizzeria_id = pizzeria.id
WHERE person_visits.id IS NULL;
```

## FULL JOIN

{{venn:full}}

Сохраняются все строки **обеих** таблиц. Где пары нет, подставляется `NULL` со стороны, где её не нашлось.

```sql-pizza
SELECT person.name, person_order.order_date
FROM person
FULL JOIN person_order ON person_order.person_id = person.id
ORDER BY person.name;
```

### FULL JOIN только с несовпадающими

{{venn:full_only}}

```sql-pizza
SELECT person.name, person_order.id AS order_id
FROM person
FULL JOIN person_order ON person_order.person_id = person.id
WHERE person.id IS NULL OR person_order.id IS NULL;
```

## CROSS JOIN

Все возможные пары «строка из A × строка из B» (декартово произведение). Условие не нужно. Если в A 9 строк, а в B 5, получится 45.

```sql-pizza
SELECT person.name, pizzeria.name AS pizzeria_name
FROM person
CROSS JOIN pizzeria
ORDER BY person.name, pizzeria_name;
```

То же самое можно записать через запятую: `FROM person, pizzeria`. Без `WHERE` это тоже декартово произведение.

Полезно, когда нужно перебрать все комбинации (например, «человек × пиццерия» и потом отфильтровать).

## NATURAL JOIN

Соединяет по **всем столбцам с одинаковыми именами**, условие `ON` не пишется. Опасно: в нашей базе в каждой таблице есть `id`, поэтому «естественное» соединение будет искать равенство `id` и вернёт странный или пустой результат. Лечится переименованием столбцов в подзапросе:

```sql-pizza
SELECT *
FROM person_order
NATURAL JOIN (SELECT id AS menu_id, pizza_name, price FROM menu) AS m;
```

Здесь у подзапроса столбец называется `menu_id`, как в `person_order`, и соединение идёт именно по нему. В реальных проектах `NATURAL JOIN` обычно избегают: добавится столбец с таким же именем, и запрос тихо изменит смысл.

## USING

Сокращение для `ON`, когда столбцы называются одинаково. В результате такой столбец выводится один раз.

```sql-pizza
SELECT *
FROM person_order
JOIN (SELECT id AS menu_id, pizza_name FROM menu) AS m USING (menu_id);
```

## Цепочка из нескольких таблиц

`JOIN` можно добавлять друг за другом. Каждое следующее соединение привязывается к уже собранному результату.

```sql-pizza
SELECT person.name, menu.pizza_name, pizzeria.name AS pizzeria_name
FROM person_order
JOIN person ON person_order.person_id = person.id
JOIN menu ON person_order.menu_id = menu.id
JOIN pizzeria ON menu.pizzeria_id = pizzeria.id
ORDER BY person.name, menu.pizza_name, pizzeria.name;
```

## Соединение таблицы с самой собой (self join)

Одну таблицу берут дважды под разными псевдонимами. Например, пары людей из одного города:

```sql-pizza
SELECT a.name AS person_1, b.name AS person_2, a.address
FROM person AS a
JOIN person AS b ON a.address = b.address AND a.id < b.id
ORDER BY a.address, a.name;
```

Условие `a.id < b.id` убирает пары «человек с самим собой» и зеркальные дубли («Anna и Andrey» и «Andrey и Anna»).

## Условие в ON и в WHERE

Для `INNER JOIN` это одно и то же. Для `LEFT JOIN` разница принципиальная:

- условие в `ON` решает, **какие пары** считаются подходящими, но все строки левой таблицы всё равно останутся;
- условие в `WHERE` удаляет **готовые строки** результата, и вместе с ними пропадут левые строки без пары.

```sql-pizza
SELECT person.name, person_order.order_date
FROM person
LEFT JOIN person_order ON person_order.person_id = person.id AND person_order.order_date = '2022-01-01'
ORDER BY person.name;
```

```sql-pizza
SELECT person.name, person_order.order_date
FROM person
LEFT JOIN person_order ON person_order.person_id = person.id
WHERE person_order.order_date = '2022-01-01'
ORDER BY person.name;
```

Первый запрос вернёт всех людей (у большинства дата `NULL`), второй только тех, кто что-то заказал в этот день.

## Шпаргалка: какой JOIN выбрать

| Что нужно | Решение |
| --- | --- |
| только совпадения | `JOIN` |
| всё из левой + совпадения | `LEFT JOIN` |
| только строки левой без пары | `LEFT JOIN ... WHERE правая.id IS NULL` (или `NOT EXISTS`) |
| всё из обеих | `FULL JOIN` |
| все комбинации | `CROSS JOIN` |
| из одной таблицы, фильтр по другой | `JOIN` или `EXISTS` / `IN` |

## Частые ошибки

- Забыли условие `ON`: получили лишние строки (или ошибку синтаксиса, а при `CROSS JOIN` и запятой декартово произведение).
- Размножились строки: соединили по неуникальному столбцу, один человек стал встречаться по числу заказов. Решение: нужное `DISTINCT`, агрегат или другой подход.
- `WHERE` по столбцу правой таблицы сломал `LEFT JOIN`: он превратился в `INNER JOIN`.
- `column reference "id" is ambiguous`: добавь префикс таблицы.
