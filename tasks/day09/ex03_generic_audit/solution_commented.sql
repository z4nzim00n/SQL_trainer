-- Идея: убираем старое, делаем одну функцию с ветвлением по TG_OP и один триггер на все события.
DROP TRIGGER trg_person_insert_audit ON person;
DROP TRIGGER trg_person_update_audit ON person;
DROP TRIGGER trg_person_delete_audit ON person;
DROP FUNCTION fnc_trg_person_insert_audit();
DROP FUNCTION fnc_trg_person_update_audit();
DROP FUNCTION fnc_trg_person_delete_audit();
TRUNCATE person_audit;

CREATE FUNCTION fnc_trg_person_audit() RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN                       -- вставка: сохраняем новую строку
        INSERT INTO person_audit (type_event, row_id, name, age, gender, address)
        VALUES ('I', NEW.id, NEW.name, NEW.age, NEW.gender, NEW.address);
    ELSIF (TG_OP = 'UPDATE') THEN                    -- обновление: сохраняем старую
        INSERT INTO person_audit (type_event, row_id, name, age, gender, address)
        VALUES ('U', OLD.id, OLD.name, OLD.age, OLD.gender, OLD.address);
    ELSIF (TG_OP = 'DELETE') THEN                    -- удаление: сохраняем старую
        INSERT INTO person_audit (type_event, row_id, name, age, gender, address)
        VALUES ('D', OLD.id, OLD.name, OLD.age, OLD.gender, OLD.address);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_person_audit
AFTER INSERT OR UPDATE OR DELETE ON person
FOR EACH ROW EXECUTE FUNCTION fnc_trg_person_audit();

INSERT INTO person(id, name, age, gender, address) VALUES (10, 'Damir', 22, 'male', 'Irkutsk');
UPDATE person SET name = 'Bulat' WHERE id = 10;
UPDATE person SET name = 'Damir' WHERE id = 10;
DELETE FROM person WHERE id = 10;
