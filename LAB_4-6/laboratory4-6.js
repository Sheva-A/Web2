"use strict";

// URL-ендпоінти TVMaze API
const API_URL = "https://api.tvmaze.com/shows";
const SEARCH_URL = "https://api.tvmaze.com/search/shows";

// Поточний стан застосунку
let allMovies = [];
let currentPage = 0;
let isSearchMode = false;
let searchDebounceTimer = null;

// Елементи DOM
const moviesContainer = document.getElementById('moviesContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const errorMessage = document.getElementById('errorMessage');
const pagination = document.getElementById('pagination');

// Завантажує одну сторінку шоу з API
async function fetchMovies(page = 0) {
    try {
        const response = await fetch(`${API_URL}?page=${page}`);
        if (!response.ok) throw new Error(`Помилка сервера: ${response.status}`);

        const data = await response.json();
        allMovies = data;
        applySortAndDisplay();
        renderPagination(page);
    } catch (error) {
        showError(`Не вдалося завантажити дані: ${error.message}`);
    }
}

// Шукає по всьому API за текстовим запитом
async function fetchSearch(query) {
    try {
        const response = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`Помилка сервера: ${response.status}`);

        const data = await response.json();
        allMovies = data.map(item => item.show); // API повертає { score, show }[]
        applySortAndDisplay();
        pagination.innerHTML = ""; // пагінація не потрібна при пошуку
    } catch (error) {
        showError(`Не вдалося виконати пошук: ${error.message}`);
    }
}

// Відображає масив карток фільмів
function displayMovies(movies) {
    moviesContainer.innerHTML = "";

    if (movies.length === 0) {
        moviesContainer.innerHTML = "<p class=\"no-results\">Нічого не знайдено.</p>";
        return;
    }

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

// Сортує allMovies за обраним критерієм і викликає displayMovies
function applySortAndDisplay() {
    let movies = [...allMovies];
    const sortType = sortSelect.value;
    if (sortType === 'alphabetical') {
        movies.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'rating') {
        movies.sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0));
    }
    displayMovies(movies);
}

// Рендерить кнопки пагінації для режиму перегляду сторінок
function renderPagination(page) {
    pagination.innerHTML = "";

    const btnPrev = document.createElement('button');
    btnPrev.textContent = "← Попередня";
    btnPrev.disabled = page === 0;
    btnPrev.addEventListener('click', () => fetchMovies(page - 1));

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Сторінка ${page + 1}`;

    const btnNext = document.createElement('button');
    btnNext.textContent = "Наступна →";
    btnNext.addEventListener('click', () => fetchMovies(page + 1));

    pagination.appendChild(btnPrev);
    pagination.appendChild(pageInfo);
    pagination.appendChild(btnNext);

    currentPage = page;
}

// Дебаунс 400 мс — не надсилає запит при кожному натисканні клавіші
searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounceTimer);
    const query = searchInput.value.trim();

    if (query === "") {
        isSearchMode = false;
        fetchMovies(0); // повернення до режиму сторінок
    } else {
        isSearchMode = true;
        searchDebounceTimer = setTimeout(() => fetchSearch(query), 400);
    }
});

sortSelect.addEventListener('change', applySortAndDisplay);

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.className = "error-visible";
}

fetchMovies(0);