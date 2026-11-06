# Задание 03. Обобщённый аудит

**Язык:** SQL, DDL, DML

Сейчас на таблице `person` три триггера. Объедини всё в **один** триггер `trg_person_audit` с единой функцией `fnc_trg_person_audit`: весь DML-трафик (`INSERT`, `UPDATE`, `DELETE`) обрабатывает один функциональный блок. Для каждого события (`I`, `U`, `D`) **явно** напиши отдельную ветку `IF ... ELSIF ...`.

Дополнительные шаги:

1. удали три старых триггера с таблицы `person`;
2. удали три старые триггерные функции;
3. очисти таблицу `person_audit` (`TRUNCATE` или `DELETE`).

Когда всё готово, снова выполни набор операторов:

```sql
INSERT INTO person(id, name, age, gender, address) VALUES (10, 'Damir', 22, 'male', 'Irkutsk');
UPDATE person SET name = 'Bulat' WHERE id = 10;
UPDATE person SET name = 'Damir' WHERE id = 10;
DELETE FROM person WHERE id = 10;
```

> Объекты из заданий 00–02 к началу задания созданы.
