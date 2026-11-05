# 2. WHERE: фильтрация строк

`WHERE` оставляет только те строки, для которых условие истинно. Он выполняется **до** `SELECT`, поэтому видит только столбцы таблицы, а не новые имена из `AS`.

```sql-pizza
SELECT name, age
FROM person
WHERE age > 20;
```

## Операторы сравнения

| Оператор | Значение |
| --- | --- |
| `=` | равно (одно «равно», не два) |
| `<>` или `!=` | не равно |
| `>` `<` `>=` `<=` | больше, меньше, больше или равно, меньше или равно |

Текст и даты пишутся в **одинарных** кавычках.

```sql-pizza
SELECT name, address
FROM person
WHERE address = 'Kazan';
```

```sql-pizza
SELECT *
FROM person_visits
WHERE visit_date >= '2022-01-07' AND visit_date <= '2022-01-09';
```

## AND, OR, NOT

- `AND`: должны выполниться оба условия.
- `OR`: достаточно одного.
- `NOT`: отрицание.

У `AND` приоритет выше, чем у `OR`. Поэтому в сложных условиях **ставь скобки**, иначе результат будет не тем, что задумал.

```sql-pizza
SELECT name, age, gender
FROM person
WHERE gender = 'female' AND (age < 20 OR age > 40);
```

Без скобок `gender = 'female' AND age < 20 OR age > 40` читается как «(женщина младше 20) **или** (любой старше 40)» и захватит мужчин.

## IN: значение из списка

```sql-pizza
SELECT name, address
FROM person
WHERE address IN ('Moscow', 'Samara');
```

`IN` короче цепочки `OR`. `NOT IN` берёт всё, что в списке нет. С подзапросом `IN` описан в статье про подзапросы.

## BETWEEN: диапазон

`BETWEEN a AND b` включает **обе** границы: это то же, что `>= a AND <= b`.

```sql-pizza
SELECT name, age
FROM person
WHERE age BETWEEN 18 AND 30;
```

## LIKE: шаблоны текста

| Символ | Значение |
| --- | --- |
| `%` | любое количество любых символов (в том числе ноль) |
| `_` | ровно один любой символ |

```sql-pizza
SELECT pizza_name
FROM menu
WHERE pizza_name LIKE '%cheese%';
```

```sql-pizza
SELECT name
FROM person
WHERE name LIKE 'A%';
```

`LIKE` учитывает регистр. Для поиска без учёта регистра в PostgreSQL есть `ILIKE`. Чтобы найти сам символ `%`, его экранируют: `LIKE '50\%'`.

## NULL: «значение неизвестно»

`NULL` это не ноль и не пустая строка, а «нет значения». Сравнивать его через `=` нельзя: `NULL = NULL` даёт не истину, а `NULL`, и строка не проходит `WHERE`. Для проверки есть отдельные операторы:

```sql-pizza
SELECT name, address
FROM person
WHERE address IS NULL;
```

```sql-pizza
SELECT name, address
FROM person
WHERE address IS NOT NULL;
```

Любое сравнение с `NULL` (`>`, `<`, `=`, `<>`) тоже даёт `NULL`, то есть «не истина». Поэтому `WHERE address <> 'Kazan'` **не вернёт** людей с пустым адресом. Если они нужны, пиши `address <> 'Kazan' OR address IS NULL`.

### Трёхзначная логика

В SQL три результата: `TRUE`, `FALSE`, `NULL` (неизвестно). `WHERE` пропускает только `TRUE`.

| Выражение | Результат |
| --- | --- |
| `TRUE AND NULL` | `NULL` |
| `FALSE AND NULL` | `FALSE` |
| `TRUE OR NULL` | `TRUE` |
| `FALSE OR NULL` | `NULL` |
| `NOT NULL` | `NULL` |

```sql-pizza
SELECT TRUE AND NULL AS and_true_null, FALSE AND NULL AS and_false_null, TRUE OR NULL AS or_true_null;
```

Особенно коварен `NOT IN`: если в списке встретится хоть один `NULL`, он не вернёт ни одной строки.

```sql-pizza
SELECT 1 AS found WHERE 1 NOT IN (2, 3);
```

```sql-pizza
SELECT 1 AS found WHERE 1 NOT IN (2, 3, NULL);
```

Второй запрос пуст. Безопаснее `NOT EXISTS` (см. статью про подзапросы).

## IS DISTINCT FROM

Сравнение, которое умеет работать с `NULL`: считает два `NULL` равными.

```sql-pizza
SELECT NULL = NULL AS plain_equal, NULL IS NOT DISTINCT FROM NULL AS null_safe_equal;
```
