## Идея

Четыре команды `ADD CONSTRAINT ... CHECK (...)` и одна `ALTER COLUMN discount SET DEFAULT 0`.

## Каркас

```sql
ALTER TABLE person_discounts ADD CONSTRAINT ch_nn_person_id CHECK (person_id IS NOT NULL);
ALTER TABLE person_discounts ADD CONSTRAINT ______ CHECK (pizzeria_id IS NOT NULL);
ALTER TABLE person_discounts ADD CONSTRAINT ______ CHECK (______ IS NOT NULL);
ALTER TABLE person_discounts ALTER COLUMN discount SET DEFAULT ______;
ALTER TABLE person_discounts ADD CONSTRAINT ch_range_discount CHECK (discount BETWEEN ______ AND ______);
```

## Почти ответ

```sql
... (три NOT NULL как показано)
ALTER TABLE person_discounts ALTER COLUMN discount SET DEFAULT 0;
ALTER TABLE person_discounts ADD CONSTRAINT ch_range_discount CHECK (discount BETWEEN 0 AND ______);
```

Осталась верхняя граница диапазона.
