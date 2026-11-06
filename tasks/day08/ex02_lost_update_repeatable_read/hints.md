## Идея

Те же шаги, что в прошлом задании, но транзакции открываются с `ISOLATION LEVEL REPEATABLE READ`. Session #2 после `COMMIT` из Session #1 получит ошибку сериализации.

## Каркас

```sql
-- обе сессии
BEGIN ISOLATION LEVEL ______ ______;
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';
-- Session #1: UPDATE ... SET rating = 4;
-- Session #2: UPDATE ... SET rating = 3.6;   (ждёт)
-- Session #1: COMMIT;
-- Session #2: ERROR: could not serialize access... -> ______;
```

## Почти ответ

Уровень задаётся прямо в `BEGIN`: `BEGIN ISOLATION LEVEL REPEATABLE READ;`. После ошибки в Session #2 выполни `ROLLBACK;`, и тогда рейтинг в базе будет `4`.
