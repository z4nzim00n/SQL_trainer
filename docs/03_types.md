# 3. Текст, числа, даты, CASE

## Текст

Конкатенация (склейка) делается оператором `||` или функцией `CONCAT`.

```sql-pizza
SELECT name || ' lives in ' || address AS description
FROM person;
```

Отличие: `||` с `NULL` даёт `NULL`, а `CONCAT` считает `NULL` пустой строкой и сам превращает числа в текст.

```sql-pizza
SELECT CONCAT(name, ' (age:', age, ')') AS person_information
FROM person;
```

Частые функции:

| Функция | Что делает |
| --- | --- |
| `UPPER(s)`, `LOWER(s)` | регистр |
| `LENGTH(s)` | длина |
| `TRIM(s)` | убрать пробелы по краям |
| `SUBSTRING(s FROM 1 FOR 3)` | кусок строки (позиции с 1) |
| `REPLACE(s, 'a', 'b')` | замена |
| `POSITION('x' IN s)` | где находится подстрока |

```sql-pizza
SELECT name, UPPER(name) AS upper_name, LENGTH(name) AS name_length, SUBSTRING(name FROM 1 FOR 2) AS first_two
FROM person;
```

## Числа

```sql-pizza
SELECT price, ROUND(price / 3, 2) AS third, CEIL(price / 3) AS up, FLOOR(price / 3) AS down
FROM menu;
```

Деление двух целых даёт целое (`5 / 2 = 2`). Чтобы получить дробь, сделай одно из чисел дробным: `5 / 2.0` или `5::numeric / 2`.

## CAST: приведение типов

Тип значения меняется двумя равнозначными способами: `CAST(x AS type)` или `x::type`.

```sql-pizza
SELECT CAST(age AS text) AS age_text, age::numeric / 4 AS quarter
FROM person;
```

Типичная ошибка: склеивать текст с числом оператором `||` без приведения. `'age:' || age` в PostgreSQL сработает, но надёжнее `CONCAT` или `age::text`.

## Даты

Даты пишутся в одинарных кавычках в формате `ГГГГ-ММ-ДД`. Их можно сравнивать, вычитать, добавлять интервалы.

```sql-pizza
SELECT visit_date, visit_date + 7 AS plus_week, visit_date - DATE '2022-01-01' AS days_from_new_year
FROM person_visits;
```

```sql-pizza
SELECT visit_date,
       EXTRACT(YEAR FROM visit_date) AS year,
       EXTRACT(MONTH FROM visit_date) AS month,
       EXTRACT(DOW FROM visit_date) AS day_of_week
FROM person_visits;
```

`DOW`: 0 это воскресенье, 6 суббота. Для красивого текста есть `TO_CHAR(visit_date, 'DD.MM.YYYY')`.

```sql-pizza
SELECT TO_CHAR(visit_date, 'DD.MM.YYYY') AS visit_date_text, TO_CHAR(visit_date, 'Day') AS weekday
FROM person_visits;
```

Диапазон дат лучше задавать как `>= начало AND < следующий_день_после_конца`, чтобы не терять строки с временем (для типа `date` это не критично, для `timestamp` критично).

Последовательность дат даёт `generate_series`:

```sql-pizza
SELECT generate_series('2022-01-01'::date, '2022-01-05'::date, '1 day'::interval)::date AS day;
```

## CASE: условие внутри запроса

`CASE` работает как `if / else` и возвращает значение.

```sql-pizza
SELECT name, age,
       CASE
           WHEN age < 18 THEN 'minor'
           WHEN age < 40 THEN 'adult'
           ELSE 'senior'
       END AS age_group
FROM person;
```

Ветки проверяются сверху вниз, срабатывает первая подходящая. Без `ELSE` в остальных случаях будет `NULL`.

Короткая форма сравнивает одно значение:

```sql-pizza
SELECT name, CASE gender WHEN 'female' THEN 'F' WHEN 'male' THEN 'M' END AS gender_short
FROM person;
```

## COALESCE и NULLIF

`COALESCE(a, b, c)` возвращает первое значение, которое не `NULL`. Так подставляют значение по умолчанию.

```sql-pizza
SELECT name, COALESCE(address, 'unknown') AS address_or_default
FROM person;
```

`NULLIF(a, b)` возвращает `NULL`, если `a = b`, иначе `a`. Классическое применение: защита от деления на ноль, `x / NULLIF(y, 0)`.

```sql-pizza
SELECT 10 / NULLIF(0, 0) AS safe_division;
```
