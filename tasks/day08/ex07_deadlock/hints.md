## Идея

Session #1 меняет строку с `id = 1`, Session #2 меняет строку с `id = 2`. Потом каждая пытается изменить строку другой.

## Каркас

```sql
-- Session #1: BEGIN; UPDATE pizzeria SET rating = 5 WHERE id = 1;
-- Session #2: BEGIN; UPDATE pizzeria SET rating = 5 WHERE id = ______;
-- Session #1: UPDATE pizzeria SET rating = 5 WHERE id = ______;   -- ждёт
-- Session #2: UPDATE pizzeria SET rating = 5 WHERE id = ______;   -- deadlock detected
```

## Почти ответ

Порядок: сессия 1 берёт строки 1 затем 2, сессия 2 берёт 2 затем 1. Как только последний `UPDATE` выполнен, PostgreSQL через секунду вернёт `ERROR: deadlock detected` в одной из сессий.
