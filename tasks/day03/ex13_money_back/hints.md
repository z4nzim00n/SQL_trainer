## Идея

Два оператора `DELETE`, один за другим. Сначала заказы по дате, потом позиция меню по названию.

## Каркас

```sql
DELETE FROM ______ WHERE order_date = '______';
DELETE FROM ______ WHERE pizza_name = '______';
```

## Почти ответ

```sql
DELETE FROM person_order WHERE order_date = '2022-02-25';
DELETE FROM menu WHERE ______ = 'greek pizza';
```

Осталось название столбца с названием пиццы.
