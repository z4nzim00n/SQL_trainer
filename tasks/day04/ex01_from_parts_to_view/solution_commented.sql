-- Идея: представления используем как обычные таблицы.
SELECT name FROM v_persons_female
UNION                              -- склеиваем два списка
SELECT name FROM v_persons_male
ORDER BY name;                     -- одна сортировка на весь результат
