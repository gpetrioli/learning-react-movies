import { combineReducers } from 'redux';

const updateObject = (oldObject, newValues) => {
    return {...oldObject, ...newValues};
    // could also be Object.assign( {}, oldObject, newValues);
}


const listAndSelectedReducerCreator = (prefix) => {
    return (state = {},action) => {
        switch (action.type){
            case `${prefix}_REQUEST` : return updateObject(state, action.payload)
            case `${prefix}_RECEIVE` : return updateObject(state, action.payload)
            case `${prefix}_SELECT` : return updateObject(state, action.payload)
            default : return state;
        }
    }
}

const genres = listAndSelectedReducerCreator("GENRE")
const movies = listAndSelectedReducerCreator("MOVIE")
const moviedetails = listAndSelectedReducerCreator("MOVIE_DETAILS")
const configuration = listAndSelectedReducerCreator("CONFIGURATION")

const movieApp = combineReducers({
    genres, 
    movies, 
    moviedetails,
    configuration
    });

export default movieApp;

//const store = createStore(movieApp);