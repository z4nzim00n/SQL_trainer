WITH r AS (
    SELECT b.user_id, b.currency_id, b.updated,
           (SELECT c.rate_to_usd FROM currency c
            WHERE c.id = b.currency_id AND c.updated <= b.updated
            ORDER BY c.updated DESC LIMIT 1) AS rate_t1,
           (SELECT c.rate_to_usd FROM currency c
            WHERE c.id = b.currency_id AND c.updated > b.updated
            ORDER BY c.updated ASC LIMIT 1) AS rate_t2
    FROM balance b
    WHERE EXISTS (SELECT 1 FROM currency c WHERE c.id = b.currency_id)
)
SELECT user_id, currency_id, updated, rate_t1, rate_t2, COALESCE(rate_t1, rate_t2) AS rate_used
FROM r
ORDER BY user_id, updated, currency_id;
