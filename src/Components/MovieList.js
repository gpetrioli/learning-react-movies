import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { moviesFetch } from '../Redux/actions'
import { connect } from 'react-redux'
import MoviePreview from './MoviePreview'
import Paging from './Paging'
import * as Utils from '../Utils'

class MovieList extends Component{
    
    _fetch(page){
        if (this.props.genre!==null){
            this.props.getMovies(this.props.match.params.genreId,page)
        }
    }
    
    componentDidMount(e){
        console.log("MOUNT")
        this._fetch(this.props.match.params.page || 1);
    }
    
    componentWillReceiveProps(props){
        const newPage = +props.match.params.page || 1,
              currentPage = +this.props.match.params.page || 1;
        
        if (newPage !== currentPage){
            this._fetch(newPage);
        }
    }

    
    render(){
        const {baseUrl, isFetching, genresFetching, genres} = this.props;
        const {list:movies, total_pages} = this.props.movies;
        const {genreId:genre, page=1} = this.props.match.params;
        if (isFetching !== false || genresFetching !== false) return null;

        return (
            <div id="movie-list" className="card bg-light mt-3">
                <div className="card-header d-flex">Movies <div className="ml-auto align-self-center"><Paging route={`/movies/genre/${genre}/{page}`} genre={genre} page={+page} total_pages={total_pages} show_pages={6} className="pagination-sm"></Paging></div></div>
                <div className="card-body">
                    <ul className="d-flex flex-wrap mt-3">
                        {movies.map(movie=>( movie.poster_path && <MoviePreview moviegenres={Utils.genresByIds(genres, movie.genre_ids)} imagepath={baseUrl} movie={movie} key={movie.id}></MoviePreview>) )}
                    </ul>
                </div>
                <div className="card-footer">
                    <Paging route={`/movies/genre/${genre}/{page}`} genre={genre} page={+page} total_pages={total_pages} show_pages={10} className="justify-content-center"></Paging>
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
        genres: state.genres.list
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getMovies: (genre,page) => {
            dispatch(moviesFetch(genre,page))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MovieList));