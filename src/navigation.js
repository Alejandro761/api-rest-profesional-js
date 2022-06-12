searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
});

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends=';
});

arrowBtn.addEventListener('click', () => {
    window.history.back();
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
    console.log({location});

    if(location.hash.startsWith('#trends')){
        trendsPage();
    } else if(location.hash.startsWith(`#search=`)) {
        searchPage();
    } else if(location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if(location.hash.startsWith(`#category=`)) {
        categoriesPage();
    } else {
        homePage();
    }

    document.body.scrollTop = 0; //para que el scroll se mantenga arriba cada que entre a una página
    document.documentElement.scrollTop = 0; //lo mismo que arriba pero para otros navegadores
}

function homePage() {
    console.log('Home!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    
    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function categoriesPage() {
    console.log('Categories');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [category, categoryData] = location.hash.split('='); // en los corchetes [], vas a poner el nombre de la variable en donde se van a guardar los elementos del array. Osea, al dividirse el hash en un array, podemos guardar cada elemento del array en una variable y estas son las que están dentro de los '[]'
    console.log(category);
    console.log(categoryData); //este guarda el nombre de la categoria y su id
    let [categoryId,categoryName] = categoryData.split('-'); //si no ponemos un nombre al otro elemento (ej: [,elemento2] ) no mostrara error, simplemente dara por hecho que no asignamos ese elemento a una varibale
    console.log(categoryId);
    categoryName = decodeURI(categoryName); //una categoría que contiene un espacio en su título nos aparecera '%20', esto es porque un string fue codificado para ser parte de un url, y para reemplazarlo podemos usar decodeURI. mas info en: https://platzi.com/comentario/3600092/

    headerCategoryTitle.innerHTML = categoryName; 
    getMoviesByCategory(categoryId);
}
function searchPage() {
    console.log('Search');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [, query] = location.hash.split('='); //si no ponemos un nombre al otro elemento (ej: [,elemento2] ) no mostrara error, simplemente dara por hecho que no asignamos ese elemento a una varibale
    console.log(query);
    getMoviesBySearch(query)
}
function movieDetailsPage() {
    console.log('Movie');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
}
function trendsPage() {
    console.log('Trends');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';
    getTrendingMovies();
}