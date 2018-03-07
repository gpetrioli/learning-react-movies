// ACTION TYPES
export const MOVIE_REQUEST  = "MOVIE_REQUEST"
export const MOVIE_RECEIVE  = "MOVIE_RECEIVE"
export const MOVIE_SELECT   = "MOVIE_SELECT"

export const GENRE_REQUEST  = "GENRE_REQUEST"
export const GENRE_RECEIVE  = "GENRE_RECEIVE"
export const GENRE_SELECT   = "GENRE_SELECT"

export const CONFIGURATION_REQUEST = "CONFIGURATION_REQUEST"
export const CONFIGURATION_RECEIVE = "CONFIGURATION_RECEIVE"


// UTILITIES / GENERATORS
const actionFactory = (type) => {
    return (payload) => {
        return {
            type,
            payload
        }
    }
}

const API_KEY = 'c90b7e72cfb0ae1dab40f95effe976ab'
const API_URL = 'https://api.themoviedb.org/3/'
const fetchFactory = (endpoint) => {
    return (params, dynamicEndpointParams) => {
        const urlparams = Object.keys(params||{}).map(key=>`&${key}=${params[key]}`)
        let url = `${API_URL}${endpoint}?api_key=${API_KEY}${urlparams}`
        if (typeof dynamicEndpointParams === 'object'){
            url = url.replace(/\{.+\}/gi, key=>dynamicEndpointParams[key])
        }
        return fetch(url).then(response=>response.json());
    }
}


// INTERNAL FETCH METHODS (through the generator)
const fetchConfiguration = fetchFactory('configuration')
const fetchGenres = fetchFactory('genre/movie/list')
const fetchMovies = fetchFactory('discover/movie')
const fetchMovie = fetchFactory('movie/{movieID}')


// ACTIONS (through the generator)
export const movieRequest = actionFactory(MOVIE_REQUEST)
export const movieReceive = actionFactory(MOVIE_RECEIVE)
export const movieSelect = actionFactory(MOVIE_SELECT)

export const genreRequest = actionFactory(GENRE_REQUEST)
export const genreReceive = actionFactory(GENRE_RECEIVE)
export const genreSelect = actionFactory(GENRE_SELECT)

export const configurationRequest = actionFactory(CONFIGURATION_REQUEST)
export const configurationReceive = actionFactory(CONFIGURATION_RECEIVE)



// THUNKS (async actions)
export const moviesFetch = (genres,page) => {
    return (dispatch) => {
        dispatch(movieRequest({isFetching:true}))
        return fetchMovies({
            with_genres: genres,
            page
        }).then(json=>{
            dispatch(movieReceive({
                list: json.results || [],
                fail: (json.results) ? false : true,
                page: +json.page,
                total_pages: Math.min(+json.total_pages,1000),
                isFetching: false
            }))
        })
    }
};

export const genreFetch = (currentGenre) => {
    return (dispatch) => {
        dispatch(genreRequest({isFetching:true}))
        return fetchGenres().then(json=>{
            dispatch(genreReceive({
                list: json.genres,
                isFetching: false,
            }));
            console.log('genre dispatch', currentGenre)
            dispatch(genreSelect({selected: currentGenre || json.genres[0].id}))
        })
    }
};


export const configurationFetch = () => {
    return (dispatch) => {
        dispatch(configurationRequest({isFetching:true}))
        return fetchConfiguration().then(json=>{
            dispatch(configurationReceive({
                baseUrl: json.images.base_url,
                isFetching: false,
            }));
        })        
    }
};



