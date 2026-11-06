## Идея

Сначала убери старое: три `DROP TRIGGER ... ON person`, три `DROP FUNCTION`, `TRUNCATE person_audit`. Затем одна функция с ветвлением по `TG_OP` и один триггер на три события.

## Каркас

```sql
DROP TRIGGER ______ ON person;  -- три раза
DROP FUNCTION ______();          -- три раза
TRUNCATE person_audit;

CREATE FUNCTION fnc_trg_person_audit() RETURNS trigger AS $$
BEGIN
    IF (TG_OP = '______') THEN ... ('I', NEW...)
    ELSIF (TG_OP = 'UPDATE') THEN ... ('U', OLD...)
    ELSIF (TG_OP = 'DELETE') THEN ... ('D', OLD...)
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

## Почти ответ

```sql
CREATE TRIGGER trg_person_audit
AFTER INSERT ______ UPDATE ______ DELETE ON person
FOR EACH ROW EXECUTE FUNCTION fnc_trg_person_audit();
```

Осталось дописать слова между событиями, потом выполни четыре тестовых оператора.
