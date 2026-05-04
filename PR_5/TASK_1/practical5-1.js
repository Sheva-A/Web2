"use strict";

const loadBtn = document.getElementById('loadUsers');
const output = document.getElementById('userOutput');

async function loadData() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status}`);
        }

        const data = await response.json();

        output.textContent = JSON.stringify(data, null, 2);

    } catch (error) {
        console.error("Error:", error);
        output.textContent = "Помилка завантаження: " + error.message;
    }
}

loadBtn.addEventListener('click', loadData);