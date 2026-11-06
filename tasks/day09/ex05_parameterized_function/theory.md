# Задание 05. Параметры и значения по умолчанию

Функции можно передавать параметры. В `CREATE FUNCTION` они перечисляются в скобках: `имя тип`, и внутри тела на них ссылаются по имени (в `LANGUAGE sql` по имени, как на столбец, поэтому не называй параметр так же, как столбец таблицы).

```sql
CREATE FUNCTION fnc_persons(pgender varchar DEFAULT 'female')
RETURNS SETOF person AS $$
    SELECT * FROM person WHERE gender = pgender;
$$ LANGUAGE sql;
```

`DEFAULT 'female'`: значение, если аргумент не передан. Вызвать можно по-разному:

- `fnc_persons()`: используется значение по умолчанию;
- `fnc_persons('male')`: позиционно;
- `fnc_persons(pgender := 'male')`: по имени параметра (удобно, когда параметров много).

Удаление функции требует указать её сигнатуру (имя и типы параметров): `DROP FUNCTION fnc_persons_female();`.

Ключевые слова для примеров: `CREATE FUNCTION`, `DROP`, `DEFAULT`, `WHERE`.
