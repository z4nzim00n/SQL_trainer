# Задание 02. Уникальные значения без DISTINCT

Обычно уникальные значения получают через `DISTINCT`, но здесь он запрещён, как и `GROUP BY` с `JOIN`. Выручают операторы множеств: `UNION` и `INTERSECT` сами убирают повторяющиеся строки в результате.

Если склеить через `UNION` два одинаковых запроса, то каждая строка встретится в склейке дважды, а `UNION` оставит из них одну. Значит, достаточно взять названия пицц из `menu` и склеить с тем же самым запросом. Работает и `INTERSECT`: пересечение набора с самим собой тоже содержит каждое значение один раз.

Сортировка пишется один раз в конце: `ORDER BY pizza_name DESC`. Слово `DESC` означает «по убыванию», без него сортировка идёт по возрастанию.

Запрет проверяется по тексту запроса, поэтому слова `DISTINCT`, `GROUP BY`, `HAVING` и `JOIN` не должны встречаться в коде вообще, даже в виде `NATURAL JOIN` или `LEFT JOIN`.

## Примеры

`DISTINCT` убирает повторы (в этом задании он запрещён, но полезно видеть, что он делает):

```sql-run
SELECT address FROM person;
```

```sql-run
SELECT DISTINCT address FROM person;
```

`UNION` тоже убирает повторы. Склейка запроса с самим собой оставляет каждое значение один раз:

```sql-run
SELECT address FROM person
UNION
SELECT address FROM person
ORDER BY address DESC;
```

`INTERSECT` берёт пересечение, и повторов в нём тоже нет:

```sql-run
SELECT address FROM person
INTERSECT
SELECT address FROM person
ORDER BY address DESC;
```
