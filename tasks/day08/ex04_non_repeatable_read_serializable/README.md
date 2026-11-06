# Задание 04. Неповторяющееся чтение на SERIALIZABLE

**Язык:** SQL

Тот же сценарий, что в задании 03, но обе транзакции работают на уровне `SERIALIZABLE`. В Session #1 прочитай рейтинг `Pizza Hut`, в Session #2 обнови его до `3.0` и зафиксируй, затем снова прочитай в Session #1, потом закончи транзакцию и прочитай ещё раз.

Выполни шаги строго в этом порядке:

| Шаг | Session #1 | Session #2 |
| --- | --- | --- |
| 1 | `BEGIN ISOLATION LEVEL SERIALIZABLE;` | `BEGIN ISOLATION LEVEL SERIALIZABLE;` |
| 2 | `SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';` |  |
| 3 |  | `UPDATE pizzeria SET rating = 3.0 WHERE name = 'Pizza Hut';` |
| 4 |  | `COMMIT;` |
| 5 | `SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';` |  |
| 6 | `COMMIT;` |  |
| 7 | `SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';` |  |

**Что должно получиться.**

- шаг 2 (Session #1): старое значение (например `3.6` или `4.6`);
- шаг 5 (Session #1): **то же старое значение**, несмотря на `COMMIT` в Session #2: транзакция видит свой снимок;
- шаг 7 (после `COMMIT` в Session #1): уже `3.0`: новая транзакция видит свежие данные.

> **Подготовка.** Открой **два** терминала (или две консоли в DataGrip) и в каждом подключись к своей базе: `psql -d pizza_db`. Это Session #1 и Session #2. Перед заданием верни рейтинг в исходное состояние: `UPDATE pizzeria SET rating = 4.6 WHERE name = 'Pizza Hut';`.
> Тренажёр работает с одним подключением и не умеет две параллельные сессии, поэтому автопроверки здесь нет: ты делаешь задание в psql, сверяешься с ожидаемым результатом и нажимаешь «Отметить как выполненное».
