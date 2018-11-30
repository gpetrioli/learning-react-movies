import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import MoviePreview from './MoviePreview'
import Paging from './Paging'
import * as Utils from '../Utils'

import {collect, moviesPlayingFetch, configurationSelector, moviesSelector, genresSelector} from "../Store"


class MoviePlaying extends Component{
    
    _fetch(region, page){
        moviesPlayingFetch(region, page);
    }
    
    componentDidMount(e){
        const {store} = this.props;
        const {selected:region = "GR"} = configurationSelector(store);
        
        this._fetch(region, this.props.match.params.page || 1);
    }
    
    componentWillReceiveProps(props){
        const {region:currentRegion} = this.props;
        const {region:newRegion} = props

        const newPage = +props.match.params.page || 1,
              currentPage = +this.props.match.params.page || 1;
        
        if (newPage !== currentPage || newRegion !== currentRegion){
            this._fetch(newRegion, newPage);
        }
    }

    getCountryName(){
        const {store} = this.props;
        const {selected:region, countries} = configurationSelector(store);    
        let countryName = '';
        
        if(region){
            const currentCountry = countries.find(country=>country.iso_3166_1 === region)
            countryName = currentCountry.english_name;
        }
        return countryName;
    }
    
    render(){
        const {store} = this.props;
        const {list:movies, total_pages, isFetching} = moviesSelector(store);
        const {isFetching:genresFetching, list:genres} = genresSelector(store);
        const {baseUrl, isFetching:configurationFetching} = configurationSelector(store);
        const {page=1} = this.props.match.params;

        if (isFetching !== false || /*genresFetching !== false ||*/ configurationFetching !== false) return null;

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
                            (<div className="alert alert-danger col-12">There were no movies found currently playing in <strong><em>{this.getCountryName()}</em></strong></div>)
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

export default withRouter(collect(MoviePlaying));