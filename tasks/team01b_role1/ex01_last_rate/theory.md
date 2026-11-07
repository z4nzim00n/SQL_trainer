# Теория: последняя строка в группе

В истории курсов нужна одна строка на валюту: с самым поздним `updated`.

```sql
SELECT DISTINCT ON (id) id, name, rate_to_usd
FROM currency
ORDER BY id, updated DESC;
```

`DISTINCT ON (id)` оставляет первую строку каждой группы `id` в порядке `ORDER BY`. Поэтому сортировка начинается с `id`, а затем идёт `updated DESC`: свежая строка будет первой.

Другие способы: `ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated DESC)` и подзапрос `MAX(updated)`.

Ошибка: взять `MAX(rate_to_usd)`. Это самый большой курс, а не самый свежий.

Ключевые слова для примеров: `DISTINCT`, `ROW_NUMBER`, `MAX`.
