## Идея

Нужно пять команд `COMMENT ON`: одна для таблицы и по одной для каждого из четырёх столбцов.

## Каркас

```sql
COMMENT ON TABLE person_discounts IS '______';
COMMENT ON COLUMN person_discounts.id IS '______';
COMMENT ON COLUMN person_discounts.______ IS '______';
...
```

## Почти ответ

```sql
COMMENT ON TABLE person_discounts IS 'Personal discounts of clients in pizzerias';
COMMENT ON COLUMN person_discounts.id IS 'Primary key';
COMMENT ON COLUMN person_discounts.person_id IS 'Client';
COMMENT ON COLUMN person_discounts.pizzeria_id IS 'Pizzeria';
COMMENT ON COLUMN person_discounts.______ IS '______';
```

Осталось описать последний столбец.
