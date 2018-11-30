import * as selectors from "./selectors"
import * as updaters from "./updaters"

export {store, collect} from "react-recollect";

export {selectors}
export {updaters}

export *  from "./selectors"
export *  from "./updaters"

export const initialStore = {
    configuration: {
        isFetching:true,
        baseUrl: '',
        countries:[],
        selected:'GR'
    },
    movies: {
        isFetching:true,
        list:[],
        fail:false,
        page:1,
        total_pages:1,
    },
    genres: {
        isFetching:true,
        list:[],
    },
    moviedetails: {
        isFetching:true,
        fail:false,
        details: {},
    }
}