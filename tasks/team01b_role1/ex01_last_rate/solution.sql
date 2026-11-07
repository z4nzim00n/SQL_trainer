SELECT DISTINCT ON (id) id, name, rate_to_usd AS last_rate_to_usd
FROM currency
ORDER BY id, updated DESC;
