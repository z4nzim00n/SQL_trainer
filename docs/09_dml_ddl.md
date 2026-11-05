# 9. Изменение данных и таблиц

В тренажёре любой запрос выполняется внутри транзакции, которая в конце откатывается, поэтому данные не портятся. Но на настоящей базе эти команды **меняют** данные навсегда.

## INSERT: добавить строки

```sql
INSERT INTO pizzeria (id, name, rating) VALUES (100, 'Test Pizza', 4.0);
```

Можно вставить несколько строк сразу и вернуть вставленное через `RETURNING`:

```sql-pizza
INSERT INTO pizzeria (id, name, rating)
VALUES (100, 'Test Pizza', 4.0), (101, 'Another Pizza', 3.5)
RETURNING *;
```

Вставка из результата другого запроса:

```sql
INSERT INTO menu (id, pizzeria_id, pizza_name, price)
SELECT 200 + id, pizzeria_id, pizza_name, price FROM menu WHERE price < 800;
```

## UPDATE: изменить строки

```sql-pizza
UPDATE menu
SET price = price * 1.1
WHERE pizza_name = 'cheese pizza'
RETURNING id, pizza_name, price;
```

**Всегда пиши `WHERE`.** Без него изменятся все строки таблицы.

## DELETE: удалить строки

```sql-pizza
DELETE FROM person_visits
WHERE visit_date < '2022-01-05'
RETURNING *;
```

Без `WHERE` удалятся все строки. `TRUNCATE таблица` очищает таблицу целиком и быстрее.

## Транзакции

Транзакция объединяет несколько команд: либо выполнятся все, либо ни одна.

```sql
BEGIN;
UPDATE menu SET price = price + 10 WHERE pizzeria_id = 1;
DELETE FROM menu WHERE price > 2000;
COMMIT;      -- сохранить; ROLLBACK отменил бы всё
```

## CREATE TABLE

```sql
CREATE TABLE review (
    id          bigint PRIMARY KEY,
    person_id   bigint NOT NULL REFERENCES person (id),
    pizzeria_id bigint NOT NULL REFERENCES pizzeria (id),
    rating      numeric(2, 1) NOT NULL CHECK (rating BETWEEN 0 AND 5),
    comment     text,
    created_at  date NOT NULL DEFAULT CURRENT_DATE
);
```

Ограничения:

| Ограничение | Смысл |
| --- | --- |
| `PRIMARY KEY` | уникальный идентификатор строки, не `NULL` |
| `FOREIGN KEY` / `REFERENCES` | значение должно существовать в другой таблице |
| `NOT NULL` | значение обязательно |
| `UNIQUE` | значения не повторяются |
| `CHECK (условие)` | значение должно удовлетворять условию |
| `DEFAULT` | значение, если при вставке ничего не указано |

## Типы данных

| Тип | Для чего |
| --- | --- |
| `integer`, `bigint` | целые |
| `numeric(p, s)` | точные десятичные (деньги) |
| `real`, `double precision` | числа с плавающей точкой (с погрешностью) |
| `text`, `varchar(n)` | текст |
| `boolean` | `true` / `false` |
| `date`, `timestamp` | дата, дата со временем |

## ALTER и DROP

```sql
ALTER TABLE person ADD COLUMN email varchar;
ALTER TABLE person DROP COLUMN email;
ALTER TABLE person ADD CONSTRAINT ch_age CHECK (age > 0);
DROP TABLE review;
```

## Индексы

Индекс ускоряет поиск и соединения по столбцу, но замедляет вставку.

```sql
CREATE INDEX idx_menu_pizzeria ON menu (pizzeria_id);
```

## Представления

`VIEW` это сохранённый запрос, который выглядит как таблица.

```sql
CREATE VIEW v_expensive AS
SELECT * FROM menu WHERE price > 800;
```
