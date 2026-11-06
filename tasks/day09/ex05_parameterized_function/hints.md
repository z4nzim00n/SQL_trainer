## Идея

Удали две старые функции, создай одну с параметром `pgender` и значением по умолчанию `'female'`. Фильтр в теле: `gender = pgender`.

## Каркас

```sql
DROP FUNCTION ______();
DROP FUNCTION ______();

CREATE FUNCTION fnc_persons(pgender varchar DEFAULT '______') RETURNS SETOF person AS $$
    SELECT * FROM person WHERE gender = ______;
$$ LANGUAGE sql;
```

## Почти ответ

Имена удаляемых функций: `fnc_persons_female` и `fnc_persons_male`. Язык функции: `sql`.
