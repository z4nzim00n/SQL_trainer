# Задание 09. «И то, и другое»

Условие «заказал и A, и B» нельзя записать как `pizza = 'A' AND pizza = 'B'`: в одной строке пицца только одна, и такая проверка никогда не сработает.

Есть два рабочих подхода.

**1. Пересечение множеств.** Взять людей, заказавших A, и людей, заказавших B, и оставить общих: `INTERSECT` (в этом задании он разрешён).

**2. Группировка.** Отобрать заказы пицц A и B, сгруппировать по человеку (`GROUP BY`) и оставить тех, у кого **разных** названий пиццы два: `HAVING COUNT(DISTINCT pizza_name) = 2`. Нужен именно `DISTINCT`: иначе человек, дважды заказавший одну и ту же пиццу, тоже получит 2.

`HAVING` фильтрует группы после группировки, `WHERE` фильтрует строки до неё.

## Примеры на маленьких таблицах

Пересечение: товары, проданные и в `North`, и в `South`:

```sql-run
SELECT item FROM sales WHERE shop = 'North'
INTERSECT
SELECT item FROM sales WHERE shop = 'South'
ORDER BY item;
```

Группировка: то же через `HAVING`:

```sql-run
SELECT item
FROM sales
WHERE shop = 'North' OR shop = 'South'
GROUP BY item
HAVING COUNT(DISTINCT shop) = 2
ORDER BY item;
```
