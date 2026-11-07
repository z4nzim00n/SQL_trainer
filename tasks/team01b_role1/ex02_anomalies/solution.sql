SELECT DISTINCT b.user_id, b.currency_id,
       CASE
           WHEN u.id IS NULL AND c.id IS NULL THEN 'no user, no currency'
           WHEN u.id IS NULL THEN 'no user'
           ELSE 'no currency'
       END AS problem
FROM balance b
LEFT JOIN "user" u ON u.id = b.user_id
LEFT JOIN (SELECT DISTINCT id FROM currency) c ON c.id = b.currency_id
WHERE u.id IS NULL OR c.id IS NULL
ORDER BY b.user_id, b.currency_id;
