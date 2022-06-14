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

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((image) => {
        // console.log(image.target.setAttribute);
        if(image.isIntersecting){
            const url = image.target.getAttribute('data-image');
            image.target.setAttribute('src', url);
        }
    })
});

const moviesForEach = (movies, container, {lazyLoad = false, clean = true} = {}) => {
    if(clean) {
        container.innerHTML = '';
    }
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked'); //si se presiona lo agrega, si se vuelve a presionar se quita, y asi cada vez que le den click
        });
        movieContainer.appendChild(movieBtn);


        if(lazyLoad){
            movieImg.setAttribute('data-image', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        } else {
            movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        }
        if(lazyLoad){
            lazyLoader.observe(movieImg);
        }
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', 'https://w7.pngwing.com/pngs/572/603/png-transparent-logo-brand-com-student-creative-slate-text-logo-film.png')
        })

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

    moviesForEach(movies, trendingPreviewList, true);
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
    maxPage = data.total_pages;
    moviesForEach(data.results, genericSection, true);
}

const getMoviesBySearch = async (query) => {
    const {data} = await api('search/movie', {
        params: {
            query, //como el parametro de la funcion lo llamamos igual que el query parameter que es requerido, entonces no hace falta poner que query: query, simplemente con ponerle query ya lo entiende  
        },
    });
    // const movies = data.results;
    
    maxPage = data.total_pages;
    console.log(maxPage);

    moviesForEach(data.results, genericSection);
}

const getPaginatedMoviesBySearch = (query) => {
    return async function() {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); //scrollTop es el scroll que hemos a la pagina, clientHeight es el tamaño total del height, y scrollHeight es la suma de ambos o el numero de scroll total que puede hacer el usuario
        
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const {data} = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
        
            moviesForEach(data.results, genericSection, {clean: false, lazyLoad: true});
        }
    };

    
}

const getPaginatedMoviesByCategory = (id) => {
    return async function() {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); //scrollTop es el scroll que hemos a la pagina, clientHeight es el tamaño total del height, y scrollHeight es la suma de ambos o el numero de scroll total que puede hacer el usuario
        
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const {data} = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
        
            moviesForEach(data.results, genericSection, {clean: false, lazyLoad: true});
        }
    };
}

let btnCount = 0;

const getTrendingMovies = async () => {
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;

    moviesForEach(movies, genericSection);

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar mas';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies );
    // genericSection.appendChild(btnLoadMore);
    // btnLoadMore.classList.add(`btn${btnCount}`);
}

const getPaginatedTrendingMovies = async () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); //scrollTop es el scroll que hemos a la pagina, clientHeight es el tamaño total del height, y scrollHeight es la suma de ambos o el numero de scroll total que puede hacer el usuario
    
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const {data} = await api('trending/movie/day', {
            params: {
                page,
            },
        });
    
        moviesForEach(data.results, genericSection, {clean: false, lazyLoad: true});
    }
    
    // deleteButton(btnCount);


    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar mas';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies );
    // genericSection.appendChild(btnLoadMore);
    // btnLoadMore.classList.add(`btn${btnCount}`);
}

const deleteButton = (count) => {
    const oldBtn = document.querySelector(`.btn${count}`);
    oldBtn.classList.add('inactive');
    console.log('que pedo?');
    btnCount++;
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