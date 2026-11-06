## Идея

Как в задании 05, но Session #1 стартует с `BEGIN ISOLATION LEVEL REPEATABLE READ`. Вторая сумма совпадёт с первой.

## Каркас

```sql
-- Session #1: BEGIN ISOLATION LEVEL ______ ______; SELECT SUM(rating) FROM pizzeria;
-- Session #2: INSERT INTO pizzeria VALUES (11, 'Kazan Pizza 2', 4);
-- Session #1: SELECT SUM(rating) FROM pizzeria;   -- без изменений
-- Session #1: COMMIT; SELECT SUM(rating) FROM pizzeria;   -- с учётом новой строки
```

## Почти ответ

`INSERT` в Session #2 в режиме без явной транзакции автоматически фиксируется. Если же открыт явный `BEGIN`, не забудь `COMMIT`, иначе Session #1 в любом случае ничего не увидит.
