-- Идея: берём id людей из посещений, у которых дата в диапазоне ИЛИ пиццерия номер 2.
SELECT DISTINCT person_id            -- DISTINCT: каждый человек один раз
FROM person_visits
WHERE visit_date BETWEEN '2022-01-06' AND '2022-01-09'   -- даты включительно
   OR pizzeria_id = 2                                    -- ИЛИ вторая пиццерия
ORDER BY person_id DESC;             -- по убыванию
