# Задание 00. Аудит вставок

**Язык:** SQL, DDL, DML

Чтобы не терять события изменений данных, реализуй механизм **аудита** для операций `INSERT`.

1. Создай таблицу `person_audit` на основе структуры таблицы `person` с дополнительными столбцами:

| Столбец | Тип | Описание |
| --- | --- | --- |
| `created` | `timestamp with time zone` | время создания события; по умолчанию текущая метка времени; `NOT NULL` |
| `type_event` | `char(1)` | тип события: `I` (insert), `D` (delete), `U` (update); по умолчанию `'I'`; `NOT NULL`; проверочное ограничение `ch_type_event` со значениями `'I'`, `'U'`, `'D'` |
| `row_id` | `bigint` | копия `person.id`; `NOT NULL` |
| `name` | `varchar` | копия `person.name` (без ограничений) |
| `age` | `integer` | копия `person.age` (без ограничений) |
| `gender` | `varchar` | копия `person.gender` (без ограничений) |
| `address` | `varchar` | копия `person.address` (без ограничений) |

2. Создай триггерную функцию `fnc_trg_person_insert_audit`, которая при вставке копирует **новую** строку в `person_audit`.
3. Создай триггер `trg_person_insert_audit`: `FOR EACH ROW`, `AFTER INSERT`, вызывает функцию из пункта 2.
4. Выполни вставку:

```sql
INSERT INTO person(id, name, age, gender, address) VALUES (10, 'Damir', 22, 'male', 'Irkutsk');
```

> Для триггера в PostgreSQL нужно **два** объекта: триггерная функция и сам триггер. Тренажёр проверяет структуру таблицы, определение триггера и сам аудит: вставит свои тестовые строки и посмотрит, что попало в `person_audit`.
