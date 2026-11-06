## Идея

`UPDATE` для таблицы `menu`: новая цена считается из старой, строка выбирается по названию.

## Каркас

```sql
UPDATE menu
SET price = price * ______
WHERE ______ = '______';
```

## Почти ответ

```sql
UPDATE menu
SET price = price * ______
WHERE pizza_name = 'greek pizza';
```

Осталось число, на которое умножается цена (сто процентов минус десять).
