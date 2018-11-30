const selectorFactory = (section) => (store, property) => 
    property ? 
    store[section][property] :
    store[section];


export const configurationSelector = selectorFactory('configuration')
export const genresSelector = selectorFactory('genres')
export const moviesSelector = selectorFactory('movies')
export const moviedetailsSelector = selectorFactory('moviedetails')