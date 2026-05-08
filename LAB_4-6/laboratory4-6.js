"use strict";

// Посилання на API
const API_URL = "https://api.tvmaze.com/shows";

// Глобальний стан для збереження даних
let allMovies = [];

// Елементи DOM
const moviesContainer = document.getElementById('moviesContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const errorMessage = document.getElementById('errorMessage');

// Отримання даних з API 
async function fetchMovies() {
    try {
        const response = await fetch(API_URL);
        
        // Перевірка статусу відповіді
        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status}`);
        }
        
        const data = await response.json();
        allMovies = data;
        displayMovies(allMovies);
    } catch (error) {
        showError(`Не вдалося завантажити дані: ${error.message}`); // Обробка помилок
    }
}

// Відображення даних
function displayMovies(movies) {
    moviesContainer.innerHTML = "";
    
    movies.forEach(movie => {
        const { name, image, rating, genres } = movie;
        
        const movieHTML = `
            <div class="movie-card">
                <img src="${image ? image.medium : 'https://via.placeholder.com/210x295'}" alt="${name}">
                <h3>${name}</h3>
                <p>Рейтинг: ${rating.average || '—'}</p>
                <p><small>${genres.join(', ')}</small></p>
            </div>
        `;
        moviesContainer.insertAdjacentHTML('beforeend', movieHTML);
    });
}

// Фільтрація та сортування
function handleProcessData() {
    let filtered = allMovies.filter(movie => 
        movie.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    const sortType = sortSelect.value;
    if (sortType === 'alphabetical') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'rating') {
        filtered.sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0));
    }

    displayMovies(filtered);
}

// Функція для виводу повідомлень про помилки
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.className = "error-visible";
}

// Слухачі подій для взаємодій
searchInput.addEventListener('input', handleProcessData);
sortSelect.addEventListener('change', handleProcessData);

// Запуск програми
fetchMovies();