## Идея

Три шага: создать последовательность, назначить её столбцу `id` значением по умолчанию через `NEXTVAL`, передвинуть последовательность функцией `SETVAL` на число строк плюс один (число считай подзапросом).

## Каркас

```sql
CREATE SEQUENCE seq_person_discounts START ______;
ALTER TABLE person_discounts ALTER COLUMN id SET DEFAULT ______('seq_person_discounts');
SELECT SETVAL('seq_person_discounts', (SELECT COUNT(*) FROM person_discounts) + ______, false);
```

## Почти ответ

```sql
CREATE SEQUENCE seq_person_discounts START 1;
ALTER TABLE person_discounts ALTER COLUMN id SET DEFAULT NEXTVAL('seq_person_discounts');
SELECT SETVAL('seq_person_discounts', (SELECT ______(*) FROM person_discounts) + 1, false);
```

Осталась агрегатная функция, считающая строки.
