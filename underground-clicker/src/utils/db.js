import { get, set } from 'idb-keyval';

// Ключ збереження в локальній базі даних браузера
const DB_KEY = 'underground_clicker_save';

// Зберігає стан гри
export const saveGame = async (state) => {
  try {
    await set(DB_KEY, state);
  } catch (err) {
    console.error('Помилка збереження:', err);
  }
};

// Завантажує збережений стан гри, або повертає null
export const loadGame = async () => {
  try {
    return await get(DB_KEY);
  } catch (err) {
    console.error('Помилка завантаження:', err);
    return null;
  }
};