-- Идея: две женщины старше 25: оба условия через AND.
SELECT name
FROM person
WHERE gender = 'female'
  AND age > 25        -- строго больше 25 (25-летние не попадают)
ORDER BY name;
