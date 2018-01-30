import React, { Component } from 'react';
import {Link} from 'react-router-dom';

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
    
    
    render(){
        const currentGenre = this.props.genre;
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