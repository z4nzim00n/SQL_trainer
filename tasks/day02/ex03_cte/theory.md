# Задание 03. WITH (CTE)

`WITH имя AS (запрос)` создаёт **именованный подзапрос**: временную «таблицу», которой можно пользоваться ниже в основном запросе как обычной. Пишется он в самом начале запроса:

```sql
WITH days AS (
    SELECT generate_series(...)::date AS missing_date
)
SELECT ... FROM days ...
```

Зачем: запрос читается сверху вниз («сначала посчитали календарь, потом использовали»), и один и тот же блок можно упомянуть несколько раз. Несколько блоков перечисляются через запятую, и поздние видят ранние.

`generate_series` можно ставить прямо в `SELECT`: тогда она раскладывает ряд в строки. Результат приводится к `date` через `::date`.

## Примеры на маленьких таблицах

```sql-run
WITH adults AS (
    SELECT name, age FROM students WHERE age >= 21
)
SELECT name FROM adults
ORDER BY name;
```

CTE как генератор дат:

```sql-run
WITH days AS (
    SELECT generate_series('2024-05-01'::date, '2024-05-04'::date, '1 day'::interval)::date AS d
)
SELECT days.d
FROM days
LEFT JOIN sales ON sales.sale_date = days.d
WHERE sales.id IS NULL;
```
