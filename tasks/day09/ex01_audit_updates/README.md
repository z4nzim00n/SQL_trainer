# Задание 01. Аудит обновлений

**Язык:** SQL, DDL, DML

Продолжи механизм аудита для таблицы `person`. Создай триггер `trg_person_update_audit` и триггерную функцию `fnc_trg_person_update_audit`, которые обрабатывают все операции `UPDATE` и сохраняют в `person_audit` **предыдущее состояние** строки (`OLD`) со всеми значениями атрибутов (тип события `U`).

После этого выполни:

```sql
UPDATE person SET name = 'Bulat' WHERE id = 10;
UPDATE person SET name = 'Damir' WHERE id = 10;
```

> Объекты из задания 00 к началу задания уже созданы, строка с `id = 10` вставлена.
