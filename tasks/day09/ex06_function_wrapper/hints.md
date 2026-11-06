## Идея

Возьми запрос про Dmitriy из Day 02 и «параметризуй» его: имя, цена и дата становятся параметрами с `DEFAULT`. Оберни в `RETURN QUERY` внутри блока `BEGIN ... END`.

## Каркас

```sql
CREATE FUNCTION fnc_person_visits_and_eats_on_date(
    IN pperson varchar DEFAULT '______',
    IN pprice numeric DEFAULT ______,
    IN pdate date DEFAULT '______')
RETURNS TABLE (pizzeria_name varchar) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT pizzeria.name FROM ... WHERE person.name = pperson AND ... visit_date = pdate AND menu.price < pprice;
END;
$$ LANGUAGE ______;
```

## Почти ответ

Запрос внутри: соединение `person_visits`, `person`, `pizzeria`, `menu` (как в Day 02, задание 07). Условие `menu.price < pprice` (строго меньше), а `DISTINCT` нужен, чтобы пиццерия не повторялась, если в ней несколько дешёвых пицц.
