## Идея

Две функции без параметров, каждая возвращает строки `person` с нужным полом. Язык `sql`.

## Каркас

```sql
CREATE FUNCTION fnc_persons_female() RETURNS ______ person AS $$
    SELECT * FROM person WHERE gender = '______';
$$ LANGUAGE ______;
```

## Почти ответ

Вторая функция идентична первой: поменяй имя на `fnc_persons_male` и пол на `'male'`.
