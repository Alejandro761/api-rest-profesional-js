const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key' : API_KEY,
    },
});

const getTrendingMoviesPreview = async () => {
    const {data} = await api('trending/movie/day');

    const movies = data.results;
    movies.forEach(movie => {
        const trendingPreviewList = document.querySelector('#trendingPreview .trendingPreview-movieList'); //primro debemos acceder al contenedor que tine el id trendingPreview y despues accedemos a la clase del articulo
        
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-container');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendingPreviewList.appendChild(movieContainer);
    });
}

const getCategoriesPreview = async () => {
    const {data} = await api('genre/movie/list');

    const categories = data.genres;

    categories.forEach(category => {
        const categoriesPreviewList = document.querySelector('#categoriesPreview .categoriesPreview-list');
        
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        
        categoryContainer.appendChild(categoryTitle);

        categoriesPreviewList.appendChild(categoryContainer);
    });
}