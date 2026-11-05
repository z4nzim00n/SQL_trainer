-- Идея: к условию про Казань добавляем условие про пол и сортируем по имени.
SELECT name, age
FROM person
WHERE address = 'Kazan'    -- первое условие: город
  AND gender = 'female'    -- второе условие: пол (оба должны быть верны)
ORDER BY name;             -- по возрастанию имени, от A до Z
