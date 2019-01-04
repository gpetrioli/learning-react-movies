import {store} from "react-recollect";

const API_KEY = 'c90b7e72cfb0ae1dab40f95effe976ab'
const API_URL = 'https://api.themoviedb.org/3/'

const fetchFactory =  (endpoint) => {
    return async (params, dynamicEndpointParams) => {
        const urlparams = Object
            .keys(params || {})
            .map(key => `&${key}=${params[key]}`)
            .join('')
        
        let url = `${API_URL}${endpoint}?api_key=${API_KEY}${urlparams}`

        if (typeof dynamicEndpointParams === 'object'){
            url = url.replace(/\{(.+)\}/gi, (match,key) => dynamicEndpointParams[key] || match)
        }

        return fetch(url).then(response=>response.json());
    }
}

const fetchBasicConfiguration = fetchFactory('configuration')
const fetchCountriesConfiguration = fetchFactory('configuration/countries')

const fetchConfiguration = async function(){
    return Promise.all([
        fetchBasicConfiguration(),
        fetchCountriesConfiguration()
    ])
}
const fetchGenres = fetchFactory('genre/movie/list')
const fetchMovies = fetchFactory('discover/movie')
const fetchMoviesPlaying = fetchFactory('movie/now_playing')
const fetchMovieDetails = fetchFactory('movie/{movieID}')

export const configurationFetch = async () => {
    store.configuration.isFetching = true
    const [basic, countries] = await fetchConfiguration()

    store.configuration.baseUrl = basic.images.secure_base_url
    store.configuration.countries = countries.sort((a,b)=>b.english_name < a.english_name)
    store.configuration.isFetching = false
    store.configuration.selected = "GR"
};

export const genreFetch = async () => {
    store.genres.isFetching = true
    const genres = await fetchGenres().then(json=>json.genres)
    store.genres.list = genres
    store.genres.isFetching = false
};

export const moviesFetch = async (genres,page) => {
    store.movies.isFetching = true
    const {results:list=[], page:currentPage , total_pages} = await fetchMovies({
        with_genres: genres,
        page
    })

    store.movies.list = list
    store.movies.page = Number(currentPage)
    store.movies.total_pages = Math.min(Number(total_pages), 1000)
    store.movies.fail = list.length === 0
    store.movies.isFetching = false
    store.genres.selected = genres
};

export const moviesPlayingFetch = async (region, page) => {
    store.movies.isFetching = true
    const {results:list=[], page:currentPage , total_pages} = await fetchMoviesPlaying({
        region,
        page
    })

    store.movies.list = list
    store.movies.page = Number(currentPage)
    store.movies.total_pages = Math.min(Number(total_pages), 1000)
    store.movies.fail = list.length === 0
    store.movies.isFetching = false
    //store.configuration.selected = region
}

export const movieDetailsFetch = async (id) => {
    store.moviedetails.isFetching = true
    const movie = await fetchMovieDetails({
        append_to_response:'videos,external_ids,credits'
    },{
        movieID:id
    })

    store.moviedetails.details = movie
    store.moviedetails.fail = movie.id ? false : true
    store.moviedetails.isFetching = false
};

export const updateRegion = (region) => store.configuration.selected = region;