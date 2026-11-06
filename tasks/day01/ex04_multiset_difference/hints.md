## Идея

Нужны два запроса по одному столбцу `person_id`: из заказов за 7 января и из посещений за 7 января. Соедини их оператором разности, который сохраняет дубликаты.

## Каркас

```sql
SELECT person_id FROM person_order WHERE order_date = '______'
______ ______
SELECT person_id FROM person_visits WHERE visit_date = '______';
```

Впиши дату (дважды) и оператор разности с модификатором, сохраняющим повторы.

## Почти ответ

```sql
SELECT person_id FROM person_order WHERE order_date = '2022-01-07'
EXCEPT ______
SELECT person_id FROM person_visits WHERE visit_date = '2022-01-07';
```

Осталось слово, которое включает учёт повторов.
