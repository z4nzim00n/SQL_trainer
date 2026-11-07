# Задание 03. Classical DWH

**Разрешено:** SQL

Это задание 00 проекта. Напиши запрос, который возвращает **общий объём средств** по балансам, сгруппированный по пользователям и типам балансов.

Нужно учесть **все** данные, включая аномалии.

| Поле | Формула |
| --- | --- |
| `name` | `user.name`; если `NULL` (или пользователя нет), то `'not defined'` |
| `lastname` | `user.lastname`; если `NULL` (или пользователя нет), то `'not defined'` |
| `type` | `balance.type` |
| `volume` | сумма `balance.money` по группе |
| `currency_name` | `currency.name`; если валюты нет, то `'not defined'` |
| `last_rate_to_usd` | **последний** `rate_to_usd` этой валюты; если валюты нет, то `1` (пиши именно `1`) |
| `total_volume_in_usd` | `volume` умножить на `last_rate_to_usd` |

Одна строка соответствует одному сочетанию «пользователь + тип баланса + валюта».

Отсортируй по `name` **по убыванию**, затем по `lastname`, `type` и `currency_name` **по возрастанию**.

Образец:

| name | lastname | type | volume | currency_name | last_rate_to_usd | total_volume_in_usd |
| --- | --- | --- | --- | --- | --- | --- |
| Петр | not defined | 2 | 203.00 | not defined | 1 | 203.00 |
| Иван | Иванов | 1 | 410.00 | EUR | 0.9000 | 369.000000 |
| … | … | … | … | … | … | … |
