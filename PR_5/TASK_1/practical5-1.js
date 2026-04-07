"use strict";

const loadBtn = document.getElementById('loadUsers');
const output = document.getElementById('userOutput');

// Асинхронна функція
async function loadData() {
    try {
        // Запит до API 
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        // Перевірка статусу відповіді
        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status}`);
        }

        // Очікування перетворення даних у json
        const data = await response.json();

        // Відображення даних у відформатованому вигляді
        output.textContent = JSON.stringify(data, null, 2);

    } catch (error) {
        // Обробка помилок
        console.error("Error:", error);
        output.textContent = "Помилка завантаження: " + error.message;
    }
}

loadBtn.addEventListener('click', loadData);