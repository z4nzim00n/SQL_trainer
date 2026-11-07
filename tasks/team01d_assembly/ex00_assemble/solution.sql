insert into currency values (100, 'EUR', 0.85, '2022-01-01 13:29');
insert into currency values (100, 'EUR', 0.79, '2022-01-08 13:29');

CREATE VIEW v_total_volume AS
WITH last_rate AS (
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
LEFT JOIN "user" u ON u.id = b.user_id
LEFT JOIN last_rate c ON c.id = b.currency_id
GROUP BY b.user_id, u.name, u.lastname, b.type, b.currency_id, c.name, c.rate_to_usd;

CREATE VIEW v_balance_usd AS
SELECT COALESCE(u.name, 'not defined') AS name,
       COALESCE(u.lastname, 'not defined') AS lastname,
       c.name AS currency_name,
       b.money * c.rate_to_usd AS currency_in_usd
FROM balance b
LEFT JOIN "user" u ON u.id = b.user_id
JOIN currency c ON c.id = b.currency_id
       AND c.updated = COALESCE(
       (SELECT MAX(c2.updated) FROM currency c2 WHERE c2.id = b.currency_id AND c2.updated <= b.updated),
       (SELECT MIN(c3.updated) FROM currency c3 WHERE c3.id = b.currency_id AND c3.updated > b.updated));

SELECT v.name, v.lastname, v.currency_name,
       v.usd_last_rate, o.usd_op_rate,
       v.usd_last_rate - o.usd_op_rate AS diff
FROM (SELECT name, lastname, currency_name, SUM(total_volume_in_usd) AS usd_last_rate
      FROM v_total_volume GROUP BY name, lastname, currency_name) v
JOIN (SELECT name, lastname, currency_name, SUM(currency_in_usd) AS usd_op_rate
      FROM v_balance_usd GROUP BY name, lastname, currency_name) o
  ON o.name = v.name AND o.lastname = v.lastname AND o.currency_name = v.currency_name
ORDER BY v.name DESC, v.lastname, v.currency_name;
