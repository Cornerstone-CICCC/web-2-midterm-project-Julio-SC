const apiKey = 'api_key=ebffc018eb091f61937cee2bb8a681b3';
const baseUrl = 'https://api.themoviedb.org/3';
const movieList = document.querySelector('.movieList');
const form = document.querySelector('.searchForm');
const input = document.querySelector('#inputMovie');
const themeToggle = document.getElementById('themeToggle');
const loadMoreBtn = document.getElementById('loadMore');
let currentPage = 1;
let currentFetchFunction = fetchTrending;

// Toggle Dark/Light Mode
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
});

// Fetch Trending Movies and TV Shows
async function fetchTrending(page = 1) {
    const url = `${baseUrl}/trending/all/day?${apiKey}&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
}

// Fetch Movies/TV Shows by Search
async function fetchMovies(query, page = 1) {
    const url = `${baseUrl}/search/multi?${apiKey}&query=${query}&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

// Display Movies/TV Shows
function displayMovies(movies) {
    movies.forEach(movie => {
        const movieItem = document.createElement('li');
        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : 'placeholder.jpg';

        movieItem.innerHTML = `
            <img src="${poster}" alt="${movie.title || movie.name}">
            <h3>${movie.title || movie.name}</h3>
            <p>Rating: ${movie.vote_average || 'N/A'}</p>
            <p>Release Date: ${movie.release_date || movie.first_air_date || 'Unknown'}</p>
        `;
        movieList.appendChild(movieItem);
    });
}

// Event Listener for Search Form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    movieList.innerHTML = '';
    currentPage = 1;
    currentFetchFunction = () => fetchMovies(input.value, currentPage);
    currentFetchFunction();
});

// Event Listener for Load More Button
loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    currentFetchFunction(currentPage);
});

// Initial Fetch for Trending Movies
fetchTrending();
