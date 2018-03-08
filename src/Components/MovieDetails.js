import React, { Component } from 'react';
import {Redirect, Link, withRouter} from 'react-router-dom';
import styles from './MovieDetails.module.css';
import { movieDetailsFetch } from '../Redux/actions.js'
import { connect } from 'react-redux'

 class MovieDetails extends Component{

    componentDidMount(){
        this.props.getMovie(this.props.params.movieId);
    }
    
    
    render(){
        const {details:movie, fail, isFetching} = this.props;
        
        if (isFetching !== false) return null;
        if (fail){
            return <Redirect to="/movies/genre" push={true} />
        }
        
        const backdrop = `${this.props.imagepath}w1280${movie.backdrop_path}`,
              poster = `${this.props.imagepath}w780${movie.poster_path}`;
        document.documentElement.style.setProperty('--backdrop',`url('${backdrop}')`);
        return (
            <div className="container-fluid">
                <h1 className="text-center">{movie.original_title}</h1>
                <div className="row">
                    <div className="col-3 offset-1"><img 
                                                        className={`img-fluid ${styles.poster}`} 
                                                        src={poster}
                                                        alt={movie.original_title}></img></div>
                    <div className="col-7">
                        <div className={`${styles.text} ${styles['text-summary']} mb-2`}>{movie.overview}</div>
                        <div className="mb-2">{(movie.genres).map(({name,id})=>(
                                <Link 
                                    to={`/movies/genre/${id}`}
                                    className={styles.genre}
                                    key={id}>{name}</Link>
                            ))}</div>
                        <div className="container-fluid">
                           <div className="row">
                            <div className="list-group col-6">
                             {movie.videos.results.filter(video=>video.site==="YouTube").map(video=>(
                                <a 
                                    className="list-group-item list-group-item-action" 
                                    href={`https://youtu.be/${video.key}`}
                                    target="_blank"
                                    rel="noreferer noopener"
                                    key={video.key}
                                    >{video.name}</a>
                            ))}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        details: state.moviedetails.details,
        fail: state.moviedetails.fail,
        isFetching: state.moviedetails.isFetching,
        imagepath: state.configuration.baseUrl
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getMovie: (id) => {
            dispatch(movieDetailsFetch(id))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MovieDetails));