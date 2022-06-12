const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key' : API_KEY,
    },
});

// funciones
const moviesForEach = (movies, container) => {
    container.innerHTML = '';
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-container');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

const createCategories = (categories, container) => {
    container.innerHTML = '';
    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = '#category=' + category.id + '-' + category.name;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        
        categoryContainer.appendChild(categoryTitle);

        container.appendChild(categoryContainer);
    });
}

//llamadas a la API
const getTrendingMoviesPreview = async () => {
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    moviesForEach(movies, trendingPreviewList);
}

const getCategoriesPreview = async () => {
    const {data} = await api('genre/movie/list');
    // const categories = data.genres;
    createCategories(data.genres, categoriesPreviewList);
}

const getMoviesByCategory = async (id) => {
    const {data} = await api('discover/movie', {
        params: {
            with_genres: id,
        }
    });
    // const movies = data.results;
    moviesForEach(data.results, genericSection);
}

const getMoviesBySearch = async (query) => {
    const {data} = await api('search/movie', {
        params: {
            query, //como el parametro de la funcion lo llamamos igual que el query parameter que es requerido, entonces no hace falta poner que query: query, simplemente con ponerle query ya lo entiende  
        },
    });
    // const movies = data.results;
    moviesForEach(data.results, genericSection);
}

const getTrendingMovies = async () => {
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    moviesForEach(movies, genericSection);
}

const getMovieById = async (id) => {
    const {data: movie} = await api(`movie/${id}`); //si queremos cambiarle el nombre a la variable entonces le ponemos 'data:' porque ese es el nombre que tiene el objeto por defecto

    const movieImgURL = 'https://image.tmdb.org/t/p/w500' +  movie.poster_path;
    console.log(movieImgURL);
    headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${movieImgURL})`; 
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailList);
    getRelatedMoviesId(id);
}

const getRelatedMoviesId = async (id) => {
    const {data} = await api(`movie/${id}/similar`);

    const relatedMovies = data.results;
    moviesForEach(relatedMovies, relatedMoviesContainer);
}