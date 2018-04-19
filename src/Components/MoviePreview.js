import React, { Component } from 'react';
import Moment from 'react-moment';
import {Link} from 'react-router-dom'
import styles from './MoviePreview.module.css'

class MoviePreview extends Component{
    render(){
        const {movie, moviegenres, imagepath, sizes = ['col-lg-6','col-xl-4']} = this.props;

        return(
            <div className={`${sizes.join(' ')} pb-3`} key={movie.id}>
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

export default MoviePreview;