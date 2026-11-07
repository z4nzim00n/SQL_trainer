SELECT b.user_id, b.currency_id, b.money, b.updated,
       (SELECT c.rate_to_usd
        FROM currency c
        WHERE c.id = b.currency_id AND c.updated <= b.updated
        ORDER BY c.updated DESC
        LIMIT 1) AS rate_t1
FROM balance b
WHERE EXISTS (SELECT 1 FROM currency c WHERE c.id = b.currency_id)
ORDER BY b.user_id, b.updated, b.currency_id, b.money;
