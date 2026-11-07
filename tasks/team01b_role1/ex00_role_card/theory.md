# Теория Роли 1: последние значения и аномалии

## Последняя строка в группе

В `currency` у валюты несколько строк. Нужна последняя по `updated`. Три способа.

**1. `DISTINCT ON`** (особенность PostgreSQL): оставляет первую строку каждой группы в заданной сортировке.

```sql
SELECT DISTINCT ON (id) id, name, rate_to_usd
FROM currency
ORDER BY id, updated DESC;
```

**2. Оконная функция:**

```sql
SELECT id, name, rate_to_usd
FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated DESC) AS rn
      FROM currency) t
WHERE rn = 1;
```

**3. Подзапрос с `MAX`:**

```sql
SELECT c.*
FROM currency c
WHERE c.updated = (SELECT MAX(updated) FROM currency WHERE id = c.id);
```

## Аномалии: LEFT JOIN

Чтобы найти строки без пары, соединяют `LEFT JOIN` и отбирают те, у кого справа `NULL`:

```sql
SELECT b.user_id
FROM balance b
LEFT JOIN "user" u ON u.id = b.user_id
WHERE u.id IS NULL;
```

Если справа несколько строк на ключ (как в `currency`), сначала сверните справа до одной строки на ключ, иначе левые строки размножатся.

## Группировка по нескольким столбцам

`GROUP BY user_id, type, currency_id`: одна строка на каждое сочетание. Суммы считаются внутри группы: `SUM(money)`.

Столбец в `SELECT` должен быть либо в `GROUP BY`, либо внутри агрегата. Если вы берёте `u.name`, добавьте его в `GROUP BY`.

## Значения по умолчанию

`COALESCE(x, 'not defined')` возвращает первое не-`NULL`. Для курса значение по умолчанию: **1** (пишите именно `1`).

Ключевые слова для примеров: `DISTINCT`, `ROW_NUMBER`, `PARTITION BY`, `MAX`, `SUM`, `LEFT JOIN`.
