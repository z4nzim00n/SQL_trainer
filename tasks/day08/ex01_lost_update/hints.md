## Идея

Обе сессии открывают транзакцию и читают рейтинг. Затем Session #1 обновляет, Session #2 тоже обновляет (и зависает, пока Session #1 не закончит). Потом `COMMIT` в обеих.

## Каркас

```sql
-- обе сессии
BEGIN;
SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';
-- Session #1
UPDATE pizzeria SET rating = ______ WHERE name = 'Pizza Hut';
-- Session #2 (ждёт)
UPDATE pizzeria SET rating = ______ WHERE name = 'Pizza Hut';
-- Session #1
COMMIT;
-- Session #2
COMMIT;
```

## Почти ответ

Если Session #2 не «зависает» на своём `UPDATE`, проверь, что Session #1 действительно в открытой транзакции (до её `COMMIT`). Финальное значение читай в любой сессии после обоих `COMMIT`: оно равно `3.6`.
