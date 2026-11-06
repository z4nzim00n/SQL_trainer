# Задание 02. Потерянное обновление на REPEATABLE READ

**Язык:** SQL

Тот же сценарий, что в задании 01, но обе транзакции работают на уровне изоляции `REPEATABLE READ`. Проверь, как PostgreSQL ведёт себя теперь.

Прочитай рейтинг `Pizza Hut` в обеих сессиях, затем в Session #1 обнови его до `4`, а в Session #2 до `3.6` (последовательность на схеме ниже).

Выполни шаги строго в этом порядке:

| Шаг | Session #1 | Session #2 |
| --- | --- | --- |
| 1 | `BEGIN ISOLATION LEVEL REPEATABLE READ;` | `BEGIN ISOLATION LEVEL REPEATABLE READ;` |
| 2 | `SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';` | `SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';` |
| 3 | `UPDATE pizzeria SET rating = 4 WHERE name = 'Pizza Hut';` |  |
| 4 |  | `UPDATE pizzeria SET rating = 3.6 WHERE name = 'Pizza Hut';` |
| 5 | `COMMIT;` |  |
| 6 |  | `ROLLBACK;` |
| 7 | `SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';` |  |

**Что должно получиться.**

- шаг 4 (Session #2): `UPDATE` ждёт, пока Session #1 закончит;
- после шага 5 (`COMMIT` в Session #1) Session #2 получает ошибку:

```
ERROR:  could not serialize access due to concurrent update
```

- транзакцию Session #2 надо завершить `ROLLBACK` (она уже в состоянии ошибки);
- шаг 7: рейтинг `4`: обновление Session #1 **не потеряно**.

> **Подготовка.** Открой **два** терминала (или две консоли в DataGrip) и в каждом подключись к своей базе: `psql -d pizza_db`. Это Session #1 и Session #2. Перед заданием верни рейтинг в исходное состояние: `UPDATE pizzeria SET rating = 4.6 WHERE name = 'Pizza Hut';`.
> Тренажёр работает с одним подключением и не умеет две параллельные сессии, поэтому автопроверки здесь нет: ты делаешь задание в psql, сверяешься с ожидаемым результатом и нажимаешь «Отметить как выполненное».
