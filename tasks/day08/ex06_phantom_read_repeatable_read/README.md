# Задание 06. Фантомное чтение на REPEATABLE READ

**Язык:** SQL

Тот же сценарий, что в задании 05, но Session #1 работает на уровне `REPEATABLE READ`. В Session #1 просумми рейтинги всех пиццерий, в Session #2 добавь `'Kazan Pizza 2'` с рейтингом `4` и `id = 11`, зафиксируй и снова просумми в Session #1. Потом закончи транзакцию и просумми ещё раз.

Выполни шаги строго в этом порядке:

| Шаг | Session #1 | Session #2 |
| --- | --- | --- |
| 1 | `BEGIN ISOLATION LEVEL REPEATABLE READ;` |  |
| 2 | `SELECT SUM(rating) FROM pizzeria;` |  |
| 3 |  | `INSERT INTO pizzeria (id, name, rating) VALUES (11, 'Kazan Pizza 2', 4);` |
| 4 |  | `COMMIT;` |
| 5 | `SELECT SUM(rating) FROM pizzeria;` |  |
| 6 | `COMMIT;` |  |
| 7 | `SELECT SUM(rating) FROM pizzeria;` |  |

**Что должно получиться.**

- шаг 2 и шаг 5 (Session #1): **одна и та же сумма**: новая пиццерия не видна;
- шаг 7 (после `COMMIT` в Session #1): сумма уже включает рейтинг `4`.

> **Подготовка.** Открой **два** терминала (или две консоли в DataGrip) и в каждом подключись к своей базе: `psql -d pizza_db`. Это Session #1 и Session #2. Перед заданием верни рейтинг в исходное состояние: `UPDATE pizzeria SET rating = 4.6 WHERE name = 'Pizza Hut';`.
> Тренажёр работает с одним подключением и не умеет две параллельные сессии, поэтому автопроверки здесь нет: ты делаешь задание в psql, сверяешься с ожидаемым результатом и нажимаешь «Отметить как выполненное».
