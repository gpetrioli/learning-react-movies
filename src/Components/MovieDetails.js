import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import styles from './MovieDetails.module.css';


export default class MovieDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            details:{},
            fail: false
        }
    }
    componentDidMount(){
        let endpoint = `https://api.themoviedb.org/3/movie/${this.props.params.movieId}?api_key=c90b7e72cfb0ae1dab40f95effe976ab&append_to_response=videos`;
        
        fetch(endpoint)
            .then(response=>response.json())
            .then(json=>{
                this.setState({
                    details: json,
                    fail: json.id?false:true
                })
        })
    }
    
    
    render(){
        const movie = this.state.details,
              backdrop = `${this.props.imagepath}w1280${movie.backdrop_path}`,
              poster = `${this.props.imagepath}w780${movie.poster_path}`;
        
        if (this.state.fail){
            return <Redirect to="/movies/genre" push={true} />
        }
        
        document.documentElement.style.setProperty('--backdrop',`url('${backdrop}')`);
        return (
            <div className="container-fluid">
                <h1 className="text-center">{movie.original_title}</h1>
                <div className="row">
                    <div className="col-3 offset-1"><img className={`img-fluid ${styles.poster}`} src={poster}></img></div>
                    <div className="col-7">
                        <div className={`${styles.text} ${styles['text-summary']}`}>{movie.overview}</div>
                        <div>{(movie.genres||[]).map(({name,id})=>(
                                <Link to={`/movies/genre/${id}`} className={styles.genre}>{name}</Link>
                            ))}</div>
                    </div>
                </div>
            </div>
        )
    }
}