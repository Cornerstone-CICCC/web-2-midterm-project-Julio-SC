const apiKey = 'api_key=ebffc018eb091f61937cee2bb8a681b3';
const baseUrl = 'https://api.themoviedb.org/3';
const movieList = document.querySelector('.movieList');
const form = document.querySelector('.searchForm');
const input = document.querySelector('#inputMovie');
const loadMoreBtn = document.getElementById('loadMore');
const themeSwitch = document.getElementById('themeSwitch');
const circle = document.querySelector('.switch .circle');
const swicth = document.querySelector('.switch');
const heading = document.querySelector('main h2');

// Variable para rastrear la página actual
let currentPage = 1;
let currentFetchFunction = fetchTrending;



// Validación para detectar si estamos en el Index o en el About Page
const isAboutPage = document.body.classList.contains('about-page');

// Toggle Light/Dark Mode
if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('dark-mode')) {
            circle.style.left = '55%';
            swicth.style.backgroundColor = "green"
        } else {
            circle.style.left = '5%';
            swicth.style.backgroundColor = "gray"

        }
    });
}

// Función para Fetch de Películas y Series (Trending)
async function fetchTrending(page = 1) {
    const url = `${baseUrl}/trending/all/day?${apiKey}&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateHeading('Trending Movies and TV Shows');
        displayMovies(data.results);
        console.log(data);

    } catch (error) {
        console.error('Error fetching trending movies and TV shows:', error);
    }
}

// Función para Fetch de Películas
async function fetchMovies(page = 1) {
    const url = `${baseUrl}/discover/movie?${apiKey}&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateHeading('Movies');
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Función para Fetch de Series
async function fetchTvShows(page = 1) {
    const url = `${baseUrl}/discover/tv?${apiKey}&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateHeading('TV Shows & Series');
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching TV shows:', error);
    }
}

// Función para Mostrar Películas/Series
function displayMovies(movies) {
    if (currentPage === 1) movieList.innerHTML = ''; // Limpiar contenido solo en la primera página
    if (!movies || movies.length === 0) {
        movieList.innerHTML = '<p>No results found. Please try again.</p>';
        return;
    }

    movies.forEach(movie => {
        if (!movie.poster_path || !(movie.title || movie.name)) return; // Ignorar elementos inválidos

        const movieItem = document.createElement('li');
        const poster = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        const title = movie.title || movie.name;

        movieItem.innerHTML = `
            <img src="${poster}" alt="${title}">
            <h3>${title}</h3>
            <p>Rating: ${movie.vote_average || 'N/A'}</p>
            <p>Release Date: ${movie.release_date || movie.first_air_date || 'Unknown'}</p>
        `;
        movieList.appendChild(movieItem);
    });
}

// Actualizar el Encabezado Principal
function updateHeading(sectionName) {
    if (heading) heading.textContent = sectionName;
}

// Event Listener para el Formulario de Búsqueda
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
            currentPage = 1;
            movieList.innerHTML = ''; // Limpiar contenido previo
            currentFetchFunction = () => fetchSearch(query, currentPage);
            currentFetchFunction();
        }
    });
}

// Fetch por Búsqueda de Películas/Series
async function fetchSearch(query, page = 1) {
    const url = `${baseUrl}/search/multi?${apiKey}&query=${query}&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateHeading(`Search Results for: "${query}"`);
        displayMovies(data.results);
        console.log(data)
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

// Event Listener para el Botón "Load More"
if (loadMoreBtn && !isAboutPage) {
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        currentFetchFunction(currentPage);
    });
}

// Lógica para los Links de Navegación
document.querySelector('nav').addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        const section = e.target.textContent;

        currentPage = 1;
        movieList.innerHTML = ''; // Limpiar contenido previo

        switch (section) {
            case 'Movies':
                e.preventDefault();
                currentFetchFunction = fetchMovies;
                break;
            case 'TV Shows':
                e.preventDefault();
                currentFetchFunction = fetchTvShows;
                break;
            case 'Home':
                e.preventDefault();
                currentFetchFunction = fetchTrending;
                break;
            default:
                return;
        }

        currentFetchFunction();
    }
});

// Ocultar el Botón "Load More" en la Página About
if (isAboutPage) {
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

// Inicializar la Página con Contenido de Tendencias si no es About Page
if (!isAboutPage) fetchTrending();
