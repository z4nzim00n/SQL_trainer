## Идея

Session #1 открывает транзакцию и считает `SUM(rating)`. Session #2 вставляет новую пиццерию и коммитит. Session #1 считает сумму ещё раз.

## Каркас

```sql
-- Session #1: BEGIN; SELECT SUM(rating) FROM pizzeria;
-- Session #2: BEGIN; INSERT INTO pizzeria (id, name, rating) VALUES (______, '______', ______); COMMIT;
-- Session #1: SELECT SUM(rating) FROM pizzeria;   -- сумма выросла
-- Session #1: COMMIT;
```

## Почти ответ

Значения для вставки: `(10, 'Kazan Pizza', 5)`. Если вставка падает с ошибкой дублирования, значит строка с `id = 10` уже есть (например, ты уже выполнял задание): удали её командой `DELETE FROM pizzeria WHERE id = 10;`.
