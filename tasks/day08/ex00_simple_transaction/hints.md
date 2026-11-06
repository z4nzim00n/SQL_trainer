## Идея

Session #1 открывает транзакцию (`BEGIN`), меняет рейтинг, но не фиксирует. Session #2 читает ту же строку до и после `COMMIT` из Session #1.

## Каркас

```sql
-- Session #1
BEGIN;
UPDATE pizzeria SET rating = ______ WHERE name = 'Pizza Hut';
SELECT * FROM pizzeria WHERE name = 'Pizza Hut';
-- Session #2
SELECT * FROM pizzeria WHERE name = 'Pizza Hut';   -- старое значение
-- Session #1
______;
-- Session #2
SELECT * FROM pizzeria WHERE name = 'Pizza Hut';   -- новое значение
```

## Почти ответ

Всё как в каркасе: в Session #1 `rating = 5`, а завершает её команда `COMMIT`. Если в Session #2 после `COMMIT` всё ещё старое значение, проверь, что в Session #1 не осталась незавершённая команда.
