-- Идея: таблица аудита + функция-копировщик + триггер на INSERT.
CREATE TABLE person_audit (
    created timestamp with time zone DEFAULT current_timestamp NOT NULL,   -- когда случилось
    type_event char(1) DEFAULT 'I' NOT NULL,                              -- I / U / D
    row_id bigint NOT NULL,                                               -- id строки из person
    name varchar, age integer, gender varchar, address varchar,
    CONSTRAINT ch_type_event CHECK (type_event IN ('I', 'U', 'D'))
);

CREATE FUNCTION fnc_trg_person_insert_audit() RETURNS trigger AS $$
BEGIN
    INSERT INTO person_audit (type_event, row_id, name, age, gender, address)
    VALUES ('I', NEW.id, NEW.name, NEW.age, NEW.gender, NEW.address);   -- NEW: вставленная строка
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_person_insert_audit
AFTER INSERT ON person
FOR EACH ROW EXECUTE FUNCTION fnc_trg_person_insert_audit();

INSERT INTO person(id, name, age, gender, address) VALUES (10, 'Damir', 22, 'male', 'Irkutsk');
