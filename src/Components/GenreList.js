import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';

export default class GenreList extends Component{
    constructor(props){
        super(props);
        this.state = {
            genres:[]
        }
    }
    componentDidMount(){
        let endpoint = 'https://api.themoviedb.org/3/genre/movie/list?api_key=c90b7e72cfb0ae1dab40f95effe976ab';
        
        fetch(endpoint)
            .then(response=>response.json())
            .then(json=>this.setState({genres: json.genres}))
    }
    
    getGenreNameById(genreId){
        return this.state.genres.find(genre=>genre.id === genreId).name
    }
    
    render(){
        const currentGenre = this.props.genre;
        if(this.state.genres.length && !currentGenre) return <Redirect to={`/movies/genre/${this.state.genres[0].id}`} />;
        return (
            <div id="genre-list" className="card w-25">
               <div className="card-header">Genre List</div>
               <div className="card-block">
                <div className="list-group">
                    {this.state.genres.map((genre)=>(
                    <Link 
                        to={`/movies/genre/${genre.id}`} 
                        className={`list-group-item list-group-item-action ${genre.id==currentGenre?'active':null}`} 
                        key={genre.id} data-id={genre.id}>{genre.name}</Link>
                    ))}
                </div>
                </div>
            </div>
        )
    }
}