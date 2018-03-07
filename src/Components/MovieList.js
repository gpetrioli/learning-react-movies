import React, { Component } from 'react';
import Moment from 'react-moment';
import {Link, Redirect, withRouter} from 'react-router-dom'
import styles from './MovieList.module.css'
import { moviesFetch } from '../Redux/actions.js'
import { connect } from 'react-redux'

class MovieList extends Component{
    
    _fetch(page){
        if (this.props.genre!==null){
            this.props.getMovies(this.props.genre,page)
        }
    }
    
    componentDidMount(e){
        this._fetch(this.props.page);
    }
    componentWillReceiveProps(props){
        if ((+props.page) !== (+this.props.page)){
            this._fetch(props.page);
        }
    }

    
    render(){
        const {page = 1, baseUrl} = this.props;
        const {list:movies = [], total_pages} = this.props.movies;
        return (
            <div id="movie-list" className="card w-75">
                <div className="card-header">Movies <div className="float-right"><Paging route={`/movies/genre/${this.props.genre}/{page}`} genre={this.props.genre} page={+page} total_pages={total_pages} show_pages={6} className="justify-content-end"></Paging></div></div>
               <div className="card-block">
                <ul className="d-flex flex-wrap" >
                    {movies.map(movie=>( movie.poster_path && <MoviePreview {...this.props} imagepath={baseUrl} movie={movie} key={movie.id}></MoviePreview>) )}
                </ul>
                </div>
                <div className="card-footer">
                    <Paging route={`/movies/genre/${this.props.genre}/{page}`} genre={this.props.genre} page={+page} total_pages={total_pages} show_pages={10} className="justify-content-center"></Paging>
                </div>
            </div>
        )
    }
}



class _MoviePreview extends Component{
    render(){
        const {movie} = this.props;
        
        return(
            <div className="col-md-6 col-lg-4 col-xl-3 pb-3" key={movie.id}>
                <li className="card h-100"  data-backdrop={`${this.props.imagepath}w1280${movie.backdrop_path}`}>
                  <img className="card-img-top img-fluid" src={`${this.props.imagepath}w300${movie.poster_path}`} alt="Card image cap" />
                  <div className="card-block">
                    <h4 className="card-title">{movie.title}</h4>
                    <p className="card-text"><small className="text-muted">Released on <Moment format="DD-MM-YYYY">{movie.release_date}</Moment></small></p>
                    <p className={`card-text ${styles['movie-genres']}`}>{movie.genre_ids.map(id=>(<small className="text-muted" key={id}>{id}</small>))}</p>
                    <p className="card-text overview">{movie.overview}</p>
                  </div>
                  <div className="card-footer">
                    <Link to={`/movie/${movie.id}`} className="card-link float-right">more</Link>
                  </div>
                </li>
            </div>
            )
    }
}
const MoviePreview = withRouter(_MoviePreview)

class _Paging extends Component{
    render(){
        const {
            page,
            total_pages,
            show_pages
        } = this.props;
        
        let min_page = (show_pages < total_pages) ? Math.max((page - Math.floor(show_pages/2)),1) : 1,
            max_page = (show_pages < total_pages) ? Math.min((page + Math.floor(show_pages/2)-1),total_pages) : total_pages;
        
        if (min_page === 1) max_page = Math.min(min_page+show_pages-1, total_pages)
        if (max_page == total_pages) min_page = Math.max(max_page-show_pages+1,1);
        if (!total_pages) return '';
        return (
            <nav>
                <ul className={`pagination ${this.props.className}`}>
                    <li className={`page-item ${page==1?'disabled':''}`}><Link to={this.props.route.replace('{page}',page-1)} className="page-link">Previous</Link></li>
                    {Array.from(new Array(max_page-min_page+1), (_,i)=>(
                        <li key={`${this.props.genre}-${this.props.page}-${i}`} className={`page-item ${i+min_page === page ? 'active' : ''}`}><Link to={this.props.route.replace('{page}',i+min_page)} className="page-link" href="#">{i+min_page}</Link></li>
                    ))}
                    <li className={`page-item ${page==total_pages?'disabled':''}`}><Link to={this.props.route.replace('{page}',page+1)} className="page-link">Next</Link></li>
                </ul>
            </nav>
        )
                                                               
    }
}
const Paging = withRouter(_Paging);



const mapStateToProps = (state) => {
    return {
        movies: state.movies,
        baseUrl: state.configuration.baseUrl
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