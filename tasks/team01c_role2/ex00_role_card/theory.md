# Теория Роли 2: курс на момент времени

## Ближайший курс в прошлом

Курс, действовавший на момент `b.updated`: самая свежая строка `currency` с `updated` **не позже** этого момента. Коррелированный подзапрос:

```sql
SELECT (SELECT c.rate_to_usd
        FROM currency c
        WHERE c.id = b.currency_id AND c.updated <= b.updated
        ORDER BY c.updated DESC
        LIMIT 1) AS rate_t1
FROM balance b;
```

Если подходящих строк нет, подзапрос вернёт `NULL`.

Важна граница: если курс изменился **в ту же секунду**, что и операция, он уже действует, поэтому нужно `<=`, а не `<`.

## Ближайший курс в будущем

Зеркально: `c.updated > b.updated` и `ORDER BY c.updated ASC LIMIT 1`.

## Выбор между t1 и t2

`COALESCE(t1, t2)` берёт t1, а если его нет, то t2. Это ровно правило задания: «если в прошлом курса нет, берём ближайший в будущем».

## Операции с неизвестной валютой

Для валюты, которой вообще нет в `currency`, ни t1, ни t2 не существует. По условию такие операции игнорируются: `WHERE EXISTS (SELECT 1 FROM currency c WHERE c.id = b.currency_id)` или обычный `JOIN`.

## Выбор строки целиком

Чтобы получить и `name`, и `rate_to_usd` одной строки, найдите подходящее время `updated` и присоедините строку по `id` и `updated`:

```sql
JOIN currency c ON c.id = b.currency_id
               AND c.updated = COALESCE(
                   (SELECT MAX(updated) FROM currency WHERE id = b.currency_id AND updated <= b.updated),
                   (SELECT MIN(updated) FROM currency WHERE id = b.currency_id AND updated >  b.updated))
```

Ключевые слова для примеров: `SUBQUERY`, `COALESCE`, `LIMIT`, `EXISTS`, `MAX`, `MIN`.
