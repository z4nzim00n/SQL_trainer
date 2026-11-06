## Идея

Повтори схему из задания 00, но в функции бери значения из `OLD`, в журнал пиши тип `U`, а триггер вешай на `AFTER UPDATE`.

## Каркас

```sql
CREATE FUNCTION fnc_trg_person_update_audit() RETURNS trigger AS $$
BEGIN
    INSERT INTO person_audit (type_event, row_id, name, age, gender, address)
    VALUES ('______', ______.id, ______.name, ______.age, ______.gender, ______.address);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

## Почти ответ

```sql
CREATE TRIGGER trg_person_update_audit
AFTER ______ ON person
FOR EACH ROW EXECUTE FUNCTION fnc_trg_person_update_audit();

UPDATE person SET name = 'Bulat' WHERE id = 10;
UPDATE person SET name = 'Damir' WHERE id = 10;
```
