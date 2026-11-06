# Задание 03. Один триггер на все события

Триггер можно повесить сразу на несколько событий: `AFTER INSERT OR UPDATE OR DELETE ON person`. А функция узнаёт, какое именно событие её вызвало, из переменной `TG_OP`: `'INSERT'`, `'UPDATE'` или `'DELETE'`.

```sql
IF (TG_OP = 'INSERT') THEN
    ... NEW ...
ELSIF (TG_OP = 'UPDATE') THEN
    ... OLD ...
ELSIF (TG_OP = 'DELETE') THEN
    ... OLD ...
END IF;
```

Обрати внимание: ветвление в plpgsql пишется `IF ... THEN ... ELSIF ... THEN ... END IF;` (именно `ELSIF`, без второй «e», и в конце `END IF;`).

Порядок наведения порядка важен: триггер зависит от функции. Нельзя удалить функцию, пока на неё ссылается триггер, поэтому сначала `DROP TRIGGER ... ON таблица`, затем `DROP FUNCTION имя()`.

Ключевые слова для примеров: `CREATE TRIGGER`, `DROP`, `CREATE FUNCTION`, `TRUNCATE`.
