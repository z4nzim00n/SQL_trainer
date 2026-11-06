## Идея

Откройте обе транзакции с `ISOLATION LEVEL SERIALIZABLE`. Session #1 читает, Session #2 меняет и коммитит, Session #1 читает повторно и видит старое значение.

## Каркас

```sql
BEGIN ISOLATION LEVEL ______;   -- в обеих сессиях
-- Session #1: SELECT rating ...;
-- Session #2: UPDATE ... SET rating = 3.0; COMMIT;
-- Session #1: SELECT rating ...;   -- как и раньше
-- Session #1: COMMIT; SELECT rating ...;   -- теперь 3.0
```

## Почти ответ

Если в Session #1 после `COMMIT` из Session #2 видно новое значение, проверь, что `BEGIN` выполнен именно с `ISOLATION LEVEL SERIALIZABLE`: без этого транзакция работает на `READ COMMITTED`.
