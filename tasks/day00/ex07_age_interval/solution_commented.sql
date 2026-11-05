-- Идея: CASE раскладывает возраст по трём интервалам, потом сортируем по результату.
SELECT id, name,
       CASE
           WHEN age >= 10 AND age <= 20 THEN 'interval #1'   -- 10..20 включительно
           WHEN age > 20 AND age < 24 THEN 'interval #2'     -- 21..23
           ELSE 'interval #3'                                -- всё остальное
       END AS interval_info                                  -- имя нового столбца
FROM person
ORDER BY interval_info;                                      -- сортируем по новому столбцу
