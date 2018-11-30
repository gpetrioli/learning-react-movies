import React, { Component } from 'react';
import {Redirect, Link, withRouter} from 'react-router-dom';
import styles from './MovieDetails.module.css';

import {collect, movieDetailsFetch, moviedetailsSelector, configurationSelector} from "../Store";

const Conditional = ({check, children}) => {
    if (!check) return null;
    return children;
}


const VideoPopup = ({video, closeHandler}) =>{
    return (
        <div className={styles['video-popup']} onClick={closeHandler}>
            <iframe id="ytplayer" type="text/html" width="640" height="360" title={`Embed youtube video with id ${video}`}
              src={`https://www.youtube.com/embed/${video}?autoplay=1&showinfo=0&rel=0&modestbranding=1`}
              frameborder="0"></iframe>
        </div>
    )
}

 class MovieDetails extends Component{

     constructor(props){
         super(props);
         this.state = {
             video: 0
         }
         
         this.selectVideo = this.selectVideo.bind(this);
     }
     
    componentDidMount(){
        movieDetailsFetch(this.props.params.movieId);
    }
    
    componentWillUnmount(){
        document.documentElement.style.removeProperty('--backdrop','');
    }
     
    selectVideo(id){
        this.setState({
            video: id
        })
    }
    
    render(){
        const {store} = this.props;
        const {details:movie, fail, isFetching} = moviedetailsSelector(store);
        const {baseUrl:imagepath} = configurationSelector(store);
        
        document.documentElement.style.removeProperty('--backdrop');
        
        if (isFetching !== false) return null;

        if (fail){
            return <Redirect to="/movies/genre" push={true} />
        }
        
        const backdrop = `${imagepath}w1280${movie.backdrop_path}`,
              poster = `${imagepath}w780${movie.poster_path}`;
        
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
                        <div className="dropdown float-right">
                         <Conditional check={movie.videos.results && movie.videos.results.length}>
                            <button className="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown">Available videos</button>
                            <div className={`${styles['dropdown-scroll']} dropdown-menu dropdown-menu-right`}>
                                {movie.videos.results.filter(video=>video.site==="YouTube").map(video=>(
                                    <a 
                                        className="dropdown-item" 
                                        href={`https://youtu.be/${video.key}`}
                                        target="_blank"
                                        rel="noreferer noopener"
                                        key={video.key}
                                        onClick={(e)=>{e.preventDefault();this.selectVideo(video.key)}}
                                        >{video.name}</a>
                                ))}
                            </div> 
                        </Conditional>  
                        </div>                     
                        <div className="mb-2">{(movie.genres).map(({name,id})=>(
                                <Link 
                                    to={`/movies/genre/${id}`}
                                    className={styles.genre}
                                    key={id}>{name}</Link>
                            ))}</div>
                    </div>
                </div>
                <Conditional check={this.state.video !== 0}>
                    <VideoPopup video={this.state.video} closeHandler={()=>this.selectVideo(0)}></VideoPopup>
                </Conditional>
            </div>
        )
    }
}

export default withRouter(collect(MovieDetails));