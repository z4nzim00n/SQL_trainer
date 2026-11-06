# Задание 01. generate_series и LEFT JOIN

`generate_series(начало, конец, шаг)` создаёт ряд значений. Для дат: `generate_series('2022-01-01'::date, '2022-01-10'::date, '1 day'::interval)` даёт все дни с 1 по 10 января. Использовать её можно в `FROM`, как таблицу, и дать столбцу имя через `AS`.

Задача «какие дни пропущены» решается так: взять **полный календарь** и присоединить к нему посещения через `LEFT JOIN`. Дни без посещений получат `NULL` справа, их и оставляем (`WHERE ... IS NULL`), так же как в задании 00.

Посещения нужны только людей 1 и 2: их можно отобрать подзапросом (`WHERE person_id = 1 OR person_id = 2`) и присоединять уже его. Тогда «пропущено обоими» получается само: день остаётся, если ни один из двоих в этот день не заходил.

`::date` приводит значение к типу даты (у `generate_series` результат это дата со временем).

## Примеры на маленьких таблицах

Календарь из пяти дней:

```sql-run
SELECT day::date AS d
FROM generate_series('2024-05-01'::date, '2024-05-05'::date, '1 day'::interval) AS day;
```

Дни календаря, в которые не было ни одной продажи в таблице `sales`:

```sql-run
SELECT day::date AS no_sales_day
FROM generate_series('2024-05-01'::date, '2024-05-05'::date, '1 day'::interval) AS day
LEFT JOIN sales ON sales.sale_date = day::date
WHERE sales.id IS NULL
ORDER BY no_sales_day;
```
