## Идея

Три шага: таблица `person_audit`, функция с `INSERT ... VALUES ('I', NEW.id, ...)`, триггер `AFTER INSERT ... FOR EACH ROW`. Потом тестовая вставка.

## Каркас

```sql
CREATE TABLE person_audit (
    created timestamp with time zone DEFAULT ______ NOT NULL,
    type_event char(1) DEFAULT '______' NOT NULL,
    row_id bigint NOT NULL,
    name varchar, age integer, gender varchar, address varchar,
    CONSTRAINT ch_type_event CHECK (type_event IN ('I', 'U', 'D'))
);

CREATE FUNCTION fnc_trg_person_insert_audit() RETURNS ______ AS $$
BEGIN
    INSERT INTO person_audit (type_event, row_id, name, age, gender, address)
    VALUES ('I', ______.id, ______.name, ______.age, ______.gender, ______.address);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

## Почти ответ

```sql
CREATE TRIGGER trg_person_insert_audit
AFTER ______ ON person
FOR EACH ______ EXECUTE FUNCTION fnc_trg_person_insert_audit();

INSERT INTO person(id, name, age, gender, address) VALUES (10, 'Damir', 22, 'male', 'Irkutsk');
```

Осталось событие и уровень срабатывания.
