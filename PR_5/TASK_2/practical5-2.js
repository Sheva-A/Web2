"use strict";

const pokemonBtn = document.getElementById('loadPokemon');
const pokemonOutput = document.getElementById('pokemonOutput');

// Функція для отримання даних про покемона 
async function getPokemonData() {
    const pokemonNameOrId = prompt("Введіть ім'я або ID покемона (наприклад, 'pikachu' або '1'):");

    if (!pokemonNameOrId) return;

    try {
        pokemonOutput.textContent = "Завантаження покемона...";

        // Виконання запиту до PokeAPI
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId.toLowerCase()}`);

        // Перевірка статусу
        if (!response.ok) {
            throw new Error("Покемона не знайдено. Перевірте правильність імені або ID.");
        }

        // Очікування перетворення даних у json
        const pokemon = await response.json();

        const info = {
            Name: pokemon.name,
            Id: pokemon.id,
            Type: pokemon.types.map(t => t.type.name)
        };

        // Відображення даних у відформатованому вигляді
        pokemonOutput.textContent = JSON.stringify(info, null, 2);

    } catch (error) {
        // Обробка помилок
        console.error("Помилка:", error);
        pokemonOutput.textContent = "Помилка: " + error.message;
    }
}

pokemonBtn.addEventListener('click', getPokemonData);