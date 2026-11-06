-- Идея: по группе на адрес; деление делаем нецелочисленным (::numeric).
SELECT address,
       ROUND(MAX(age) - MIN(age)::numeric / MAX(age), 2) AS formula,   -- без ::numeric дробь обрезалась бы
       ROUND(AVG(age), 2) AS average,
       (MAX(age) - MIN(age)::numeric / MAX(age)) > AVG(age) AS comparison   -- true / false
FROM person
GROUP BY address
ORDER BY address;
