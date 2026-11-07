-- Пересчёт операций в доллары по курсу на момент операции
SELECT COALESCE(u.name, 'not defined') AS name,
       COALESCE(u.lastname, 'not defined') AS lastname,
       c.name AS currency_name,
       b.money * c.rate_to_usd AS currency_in_usd
FROM balance b
LEFT JOIN "user" u ON u.id = b.user_id
JOIN currency c ON c.id = b.currency_id
       AND c.updated = COALESCE(   -- время подходящего курса: сначала t1, иначе t2
       (SELECT MAX(c2.updated) FROM currency c2 WHERE c2.id = b.currency_id AND c2.updated <= b.updated),
       (SELECT MIN(c3.updated) FROM currency c3 WHERE c3.id = b.currency_id AND c3.updated > b.updated))
ORDER BY name DESC, lastname, currency_name, currency_in_usd;
