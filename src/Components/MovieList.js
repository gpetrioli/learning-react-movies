import React, { Component } from 'react';
import Moment from 'react-moment';
import {Link, withRouter} from 'react-router-dom'
import styles from './MovieList.module.css'
import { moviesFetch } from '../Redux/actions'
import { connect } from 'react-redux'


const genresByIds = (genres, ids) => genres.filter(genre=>ids.includes(genre.id))

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
                        {movies.map(movie=>( movie.poster_path && <MoviePreview moviegenres={genresByIds(genres, movie.genre_ids)} imagepath={baseUrl} movie={movie} key={movie.id}></MoviePreview>) )}
                    </ul>
                </div>
                <div className="card-footer">
                    <Paging route={`/movies/genre/${genre}/{page}`} genre={genre} page={+page} total_pages={total_pages} show_pages={10} className="justify-content-center"></Paging>
                </div>
            </div>
        )
    }
}



class MoviePreview extends Component{
    render(){
        const {movie, moviegenres, imagepath} = this.props;
        
        return(
            <div className="col-md-12 col-lg-6 col-xl-4 pb-3" key={movie.id}>
                <li className="card h-100"  data-backdrop={`${imagepath}w1280${movie.backdrop_path}`}>
                  <img className="card-img-top img-fluid" src={`${imagepath}w300${movie.poster_path}`} alt={movie.title} />
                  <div className="card-body">
                    <h4 className="card-title">{movie.title}</h4>
                    <p className="card-text"><small className="text-muted">Released on <Moment format="DD-MM-YYYY">{movie.release_date}</Moment></small></p>
                    <p className={`card-text ${styles['movie-genres']}`}>{moviegenres.map(genre=>(<small className="badge badge-info" key={genre.id}>{genre.name}</small>))}</p>
                    <p className="card-text overview">{movie.overview}</p>
                  </div>
                  <div className="card-footer">
                    <Link to={`/movie/${movie.id}`} className="btn btn-primary btn-sm float-right">more</Link>
                  </div>
                </li>
            </div>
            )
    }
}

class Paging extends Component{
    render(){
        const {
            page,
            total_pages,
            show_pages
        } = this.props;
        
        let min_page = (show_pages < total_pages) ? Math.max((page - Math.floor(show_pages/2)),1) : 1,
            max_page = (show_pages < total_pages) ? Math.min((page + Math.floor(show_pages/2)-1),total_pages) : total_pages;
        
        if (min_page === 1) max_page = Math.min(min_page+show_pages-1, total_pages)
        if (max_page === total_pages) min_page = Math.max(max_page-show_pages+1,1);
        if (!total_pages) return '';
        return (
            <nav>
                <ul className={`pagination ${this.props.className}`}>
                    <li className={`page-item ${page===1?'disabled':''}`}><Link to={this.props.route.replace('{page}',page-1)} className="page-link">Previous</Link></li>
                    {Array.from(new Array(max_page-min_page+1), (_,i)=>(
                        <li key={`${this.props.genre}-${this.props.page}-${i}`} className={`page-item ${i+min_page === page ? 'active' : ''}`}><Link to={this.props.route.replace('{page}',i+min_page)} className="page-link" href="#">{i+min_page}</Link></li>
                    ))}
                    <li className={`page-item ${page===total_pages?'disabled':''}`}><Link to={this.props.route.replace('{page}',page+1)} className="page-link">Next</Link></li>
                </ul>
            </nav>
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