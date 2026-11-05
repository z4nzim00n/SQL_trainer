-- Идея: склеиваем текст из частей и значений столбцов.
SELECT CONCAT(
         name,                  -- Anna
         ' (age:', age,         -- (age:16
         ',gender:''', gender,  -- ,gender:'female   ('''' внутри текста даёт одну кавычку ')
         ''',address:''', address,  -- ',address:'Moscow
         ''')'                  -- ')
       ) AS person_information      -- название столбца результата
FROM person
ORDER BY person_information;    -- сортируем по этому столбцу, по возрастанию
