# Задание 04. CHECK, DEFAULT и ALTER TABLE

Правила на столбцы добавляются к уже существующей таблице командой `ALTER TABLE`.

**`CHECK`** хранит произвольное условие, которое должно быть истинно для каждой строки; именованное ограничение: `ALTER TABLE t ADD CONSTRAINT имя CHECK (условие);`.

- запрет `NULL` в форме именованного ограничения: `CHECK (person_id IS NOT NULL)`;
- диапазон: `CHECK (discount BETWEEN 0 AND 100)` (границы включаются).

Короткая форма `ALTER COLUMN person_id SET NOT NULL` тоже запрещает `NULL`, но имени у такого ограничения нет, а в задании имена обязательны, поэтому используем `CHECK`.

**`DEFAULT`** подставляет значение, если при `INSERT` столбец не указан: `ALTER TABLE t ALTER COLUMN discount SET DEFAULT 0;`.

Если в таблице уже есть строки, они должны удовлетворять новым правилам, иначе `ALTER TABLE ... ADD CONSTRAINT` завершится ошибкой.

Ключевые слова для примеров: `CHECK`, `NOT NULL`, `DEFAULT`, `BETWEEN`.
