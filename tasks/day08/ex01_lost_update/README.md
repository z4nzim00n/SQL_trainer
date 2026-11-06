# Задание 01. Аномалия потерянного обновления (Lost Update)

**Язык:** SQL

Сначала убедись, что у тебя стандартный уровень изоляции:

```sql
SHOW TRANSACTION ISOLATION LEVEL;   -- должно быть: read committed
```

Если это не так, поставь его явно для сеанса: `SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL READ COMMITTED;`.

**Потерянное обновление**: две транзакции читают одно значение, каждая считает новое и записывает его, и итог содержит только последнюю запись, а первая «потерялась».

Проверь рейтинг `Pizza Hut` в обеих сессиях (в транзакциях), затем в Session #1 обнови его до `4`, а в Session #2 до `3.6`, в порядке, показанном ниже.

Выполни шаги строго в этом порядке:

| Шаг | Session #1 | Session #2 |
| --- | --- | --- |
| 1 | `BEGIN;` | `BEGIN;` |
| 2 | `SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';` | `SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';` |
| 3 | `UPDATE pizzeria SET rating = 4 WHERE name = 'Pizza Hut';` |  |
| 4 |  | `UPDATE pizzeria SET rating = 3.6 WHERE name = 'Pizza Hut';` |
| 5 | `COMMIT;` |  |
| 6 |  | `COMMIT;` |
| 7 | `SELECT rating FROM pizzeria WHERE name = 'Pizza Hut';` |  |

**Что должно получиться.**

- шаг 4 (Session #2): `UPDATE` **не завершается сразу**: он ждёт, пока Session #1 снимет блокировку строки;
- после шага 5 (`COMMIT` в Session #1) команда в Session #2 выполняется;
- шаг 7: итоговый рейтинг `3.6`. Значение `4` из Session #1 **потеряно**: Session #2 перезаписала его, ничего не заметив.

> **Подготовка.** Открой **два** терминала (или две консоли в DataGrip) и в каждом подключись к своей базе: `psql -d pizza_db`. Это Session #1 и Session #2. Перед заданием верни рейтинг в исходное состояние: `UPDATE pizzeria SET rating = 4.6 WHERE name = 'Pizza Hut';`.
> Тренажёр работает с одним подключением и не умеет две параллельные сессии, поэтому автопроверки здесь нет: ты делаешь задание в psql, сверяешься с ожидаемым результатом и нажимаешь «Отметить как выполненное».
