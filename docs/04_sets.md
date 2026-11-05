# 4. Операторы множеств: UNION, INTERSECT, EXCEPT

Эти операторы склеивают результаты **двух запросов** (строки друг под другом). Они работают со строками целиком, а не соединяют таблицы по ключу (это `JOIN`).

## Правила

- В обоих запросах **одинаковое число столбцов**.
- Типы на одних и тех же местах **совместимы** (число с числом, текст с текстом).
- Имена столбцов результата берутся из **первого** запроса.
- `ORDER BY` пишется один раз **в самом конце** и относится ко всему результату.
- Без `ALL` дубликаты убираются, с `ALL` сохраняются.

| Оператор | Что возвращает | Без `ALL` | С `ALL` |
| --- | --- | --- | --- |
| `UNION` | всё из обоих | дубли убраны | дубли оставлены |
| `INTERSECT` | только общее | дубли убраны | сколько раз встретилось в обоих (минимум) |
| `EXCEPT` | из первого, чего нет во втором | дубли убраны | вычитается по количеству повторов |

## UNION: объединение

{{venn:full}}

Все строки обоих запросов, повторы убраны.

```sql-pizza
SELECT id AS object_id, name AS object_name
FROM person
UNION
SELECT id, pizza_name
FROM menu
ORDER BY object_id, object_name;
```

`UNION ALL` не удаляет повторы и работает быстрее (не нужно искать дубли).

```sql-pizza
SELECT pizza_name FROM menu WHERE price < 800
UNION ALL
SELECT pizza_name FROM menu WHERE price < 900
ORDER BY pizza_name;
```

Если одну и ту же строку выдали оба запроса, `UNION` оставит одну, `UNION ALL` обе. Сравни числа строк в двух примерах.

## Сортировка отдельных частей

Общий `ORDER BY` в конце сортирует всё сразу. Если части нужно упорядочить по-разному, каждую берут в скобки со своим `ORDER BY`:

```sql-pizza
(SELECT name AS object_name FROM person ORDER BY name)
UNION ALL
(SELECT pizza_name FROM menu ORDER BY pizza_name);
```

Порядок частей в результате соответствует порядку запросов. Строгая гарантия порядка при `UNION ALL` не прописана в стандарте, но на практике PostgreSQL выдаёт части по очереди. Если порядок критичен, добавь служебный столбец и отсортируй по нему:

```sql-pizza
SELECT 1 AS part, name AS object_name FROM person
UNION ALL
SELECT 2, pizza_name FROM menu
ORDER BY part, object_name;
```

## INTERSECT: пересечение

{{venn:inner}}

Только строки, которые есть **в обоих** результатах.

```sql-pizza
SELECT person_id FROM person_visits WHERE visit_date = '2022-01-06'
INTERSECT
SELECT person_id FROM person_order WHERE order_date = '2022-01-06';
```

## EXCEPT: разность

{{venn:a_only}}

Строки первого результата, которых нет во втором. **Порядок запросов важен**: `A EXCEPT B` и `B EXCEPT A` дают разное. В Oracle то же называется `MINUS`.

```sql-pizza
SELECT id FROM person
EXCEPT
SELECT person_id FROM person_order;
```

Результат: люди, которые ничего не заказывали.

## ALL-варианты и кратность

`INTERSECT ALL` и `EXCEPT ALL` учитывают, сколько раз строка встречается. Если в первом запросе значение есть 3 раза, а во втором 1 раз, то `EXCEPT ALL` оставит его 2 раза, а обычный `EXCEPT` убрал бы совсем.

```sql-pizza
SELECT x FROM (VALUES (1), (1), (1), (2)) AS a(x)
EXCEPT ALL
SELECT x FROM (VALUES (1)) AS b(x);
```

```sql-pizza
SELECT x FROM (VALUES (1), (1), (1), (2)) AS a(x)
EXCEPT
SELECT x FROM (VALUES (1)) AS b(x);
```

## Приоритет и скобки

`INTERSECT` связывает сильнее, чем `UNION` и `EXCEPT`. Если смешиваешь операторы, расставляй скобки.

## Частые ошибки

- Разное число столбцов: `each UNION query must have the same number of columns`.
- Несовместимые типы: `UNION types integer and text cannot be matched`. Лечится `CAST`.
- `ORDER BY` по имени столбца из второго запроса: имена берутся только из первого.
- `UNION` вместо `UNION ALL` в задаче, где нужно сохранить повторы.
