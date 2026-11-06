-- Идея: одна функция вместо двух; пол передаётся параметром.
DROP FUNCTION fnc_persons_female();
DROP FUNCTION fnc_persons_male();

CREATE FUNCTION fnc_persons(pgender varchar DEFAULT 'female')   -- по умолчанию женщины
RETURNS SETOF person AS $$
    SELECT * FROM person WHERE gender = pgender;
$$ LANGUAGE sql;
