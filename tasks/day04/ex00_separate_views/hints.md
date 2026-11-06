## Идея

Нужны два `CREATE VIEW`. Каждое определяется запросом `SELECT * FROM person WHERE gender = ...`.

## Каркас

```sql
CREATE VIEW v_persons_female AS
SELECT * FROM ______ WHERE gender = '______';

CREATE VIEW v_persons_male AS
SELECT * FROM ______ WHERE gender = '______';
```

## Почти ответ

```sql
CREATE VIEW v_persons_female AS SELECT * FROM person WHERE gender = 'female';
CREATE VIEW v_persons_male AS ______;
```

Осталось второе представление: то же самое для `male`.
