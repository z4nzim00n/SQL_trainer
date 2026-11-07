-- Итоговый объём по пользователям и типам, с учётом аномалий
WITH last_rate AS (   -- по одной строке на валюту: последний курс
    SELECT DISTINCT ON (id) id, name, rate_to_usd
    FROM currency
    ORDER BY id, updated DESC
)
SELECT COALESCE(u.name, 'not defined') AS name,
       COALESCE(u.lastname, 'not defined') AS lastname,
       b.type,
       SUM(b.money) AS volume,
       COALESCE(c.name, 'not defined') AS currency_name,
       COALESCE(c.rate_to_usd, 1) AS last_rate_to_usd,
       SUM(b.money) * COALESCE(c.rate_to_usd, 1) AS total_volume_in_usd
FROM balance b
LEFT JOIN "user" u ON u.id = b.user_id   -- LEFT: операции без пользователя не теряем
LEFT JOIN last_rate c ON c.id = b.currency_id   -- LEFT: операции с неизвестной валютой не теряем
GROUP BY b.user_id, u.name, u.lastname, b.type, b.currency_id, c.name, c.rate_to_usd
ORDER BY name DESC, lastname, type, currency_name;
