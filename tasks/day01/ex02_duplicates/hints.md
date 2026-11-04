## Идея

Какой оператор множеств сам убирает повторы? Подумай, что получится, если склеить с его помощью запрос с самим собой. `ORDER BY` стоит один раз в самом конце.

## Каркас

```sql
SELECT pizza_name FROM menu
______
SELECT pizza_name FROM menu
ORDER BY pizza_name ______;
```

В первый пропуск идёт оператор множеств, во второй слово, которое включает сортировку по убыванию.

## Почти ответ

```sql
SELECT pizza_name FROM menu
UNION
SELECT pizza_name FROM menu
ORDER BY pizza_name ______;
```

Осталось слово для сортировки по убыванию.
