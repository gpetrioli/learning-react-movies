import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { moviesPlaying } from '../Redux/actions'
import { connect } from 'react-redux'
import MoviePreview from './MoviePreview'
import Paging from './Paging'
import * as Utils from '../Utils'


class MoviePlaying extends Component{
    
    _fetch(region, page){
        console.log('fetching', region);
        this.props.getMoviesPlaying(region, page);
    }
    
    componentDidMount(e){
        console.log("MOUNT")
        const {region = "GR"} = this.props;
        this._fetch(region, this.props.match.params.page || 1);
    }
    
    componentWillReceiveProps(props){
        const newPage = +props.match.params.page || 1,
              currentPage = +this.props.match.params.page || 1,
              newRegion = props.region,
              currentRegion = this.props.region;
        
        if (newPage !== currentPage || newRegion !== currentRegion){
            this._fetch(newRegion, newPage);
        }
    }

    getCountryName(){
        const {region} = this.props;
        let countryName = '';
        
        if(region){
            const currentCountry = this.props.countries.find(country=>country.iso_3166_1 === region)
        
            countryName = currentCountry.english_name;
        }
        return countryName;
    }
    
    render(){
        const {baseUrl, isFetching, genresFetching, genres, configurationFetching} = this.props;
        const {list:movies, total_pages} = this.props.movies;
        const {page=1} = this.props.match.params;
        if (isFetching !== false || genresFetching !== false || configurationFetching !== false) return null;

        return (
            <div id="movie-list" className="card bg-light mt-3">
                <div className="card-header d-flex">Movies 
                {(total_pages > 1)  && <div className="ml-auto align-self-center"><Paging route={`/movies/now-playing/{page}`} page={+page} total_pages={total_pages} show_pages={6} className="pagination-sm"></Paging></div>}
                </div>
                <div className="card-body">
                    <ul className="d-flex flex-wrap mt-3">
                        {
                            movies.length ? 
                                movies.map(movie=>( movie.poster_path && <MoviePreview moviegenres={Utils.genresByIds(genres, movie.genre_ids)} sizes={['col-md-6','col-lg-4','col-xl-3']} imagepath={baseUrl} movie={movie} key={movie.id}></MoviePreview>) )
                                :
                            (<div class="alert alert-danger col-12">There were no movies found currently playing in <strong><em>{this.getCountryName()}</em></strong></div>)
                        }
                    </ul>
                </div>
                <div className="card-footer">
                    {(total_pages>1) && <Paging route={`/movies/now-playing/{page}`} page={+page} total_pages={total_pages} show_pages={10} className="justify-content-center"></Paging>}
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        movies: state.movies,
        baseUrl: state.configuration.baseUrl,
        isFetching: state.movies.isFetching,
        genresFetching: state.genres.isFetching,
        genres: state.genres.list,
        configurationFetching: state.configuration.isFetching,
        countries: state.configuration.countries,
        region: state.configuration.selected
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getMoviesPlaying: (region,page) => {
            dispatch(moviesPlaying(region, page))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MoviePlaying));