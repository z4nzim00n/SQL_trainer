# Схема базы (пиццерии)

Посещения пиццерий и заказы это разные сущности: человек мог зайти в одну пиццерию, а заказ сделать в другой или по телефону.

**person** (клиенты)

| Столбец | Что это |
| --- | --- |
| `id` | первичный ключ |
| `name` | имя |
| `age` | возраст |
| `gender` | пол (`female` или `male`) |
| `address` | адрес |

**pizzeria** (пиццерии)

| Столбец | Что это |
| --- | --- |
| `id` | первичный ключ |
| `name` | название пиццерии |
| `rating` | средний рейтинг (от 0 до 5) |

**menu** (меню и цены)

| Столбец | Что это |
| --- | --- |
| `id` | первичный ключ |
| `pizzeria_id` | внешний ключ на `pizzeria.id` |
| `pizza_name` | название пиццы |
| `price` | цена |

**person_visits** (журнал посещений)

| Столбец | Что это |
| --- | --- |
| `id` | первичный ключ |
| `person_id` | внешний ключ на `person.id` |
| `pizzeria_id` | внешний ключ на `pizzeria.id` |
| `visit_date` | дата посещения, например `2022-01-01` |

**person_order** (журнал заказов)

| Столбец | Что это |
| --- | --- |
| `id` | первичный ключ |
| `person_id` | внешний ключ на `person.id` |
| `menu_id` | внешний ключ на `menu.id` |
| `order_date` | дата заказа, например `2022-01-01` |

**Связи:** `person_order.person_id` → `person.id`, `person_order.menu_id` → `menu.id`, `menu.pizzeria_id` → `pizzeria.id`, `person_visits.person_id` → `person.id`, `person_visits.pizzeria_id` → `pizzeria.id`.
