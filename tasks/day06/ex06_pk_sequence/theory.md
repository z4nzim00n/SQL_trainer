# Задание 06. SEQUENCE и DEFAULT NEXTVAL

**Последовательность** (`SEQUENCE`) это объект базы, который выдаёт числа по порядку: 1, 2, 3, ... Функция `NEXTVAL('имя')` берёт следующее число.

```sql
CREATE SEQUENCE seq_person_discounts START 1;
ALTER TABLE person_discounts ALTER COLUMN id SET DEFAULT NEXTVAL('seq_person_discounts');
```

Теперь `INSERT` без указания `id` сам получит следующий номер.

**Подвох:** последовательность ничего не знает о строках, вставленных раньше с готовыми `id` (мы их создали через `ROW_NUMBER()`). Она начнёт с 1 и упрётся в уже занятый `id`, то есть в нарушение первичного ключа. Поэтому её «передвигают» вперёд функцией `SETVAL`:

```sql
SELECT SETVAL('seq_person_discounts', (SELECT COUNT(*) FROM person_discounts) + 1, false);
```

Третий аргумент `false` означает «это значение ещё **не выдавалось**», то есть следующим `NEXTVAL` вернёт ровно `COUNT(*) + 1`. Количество строк берём подзапросом, а не вписываем числом.

Эта формула верна, пока `id` занимают числа от 1 до числа строк подряд. У нас так и есть: их выдал `ROW_NUMBER()`.

Ключевые слова для примеров: `CREATE SEQUENCE`, `SEQUENCE`, `NEXTVAL`, `DEFAULT`.
