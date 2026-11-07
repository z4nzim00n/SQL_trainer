-- DISTINCT ON оставляет первую строку каждой группы id
SELECT DISTINCT ON (id) id, name, rate_to_usd AS last_rate_to_usd
FROM currency
ORDER BY id, updated DESC;   -- в группе первой окажется самая свежая строка
