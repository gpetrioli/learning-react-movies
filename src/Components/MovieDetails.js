import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';


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
              backdrop = `${this.props.imagepath}w1280${movie.backdrop_path}`;
        if (this.state.fail){
            return <Redirect to="/movies/genre" push={true} />
        }
        document.documentElement.style.setProperty('--backdrop',`url('${backdrop}')`);
        return (
            <div>
                <h1>{movie.original_title}</h1>
            </div>
        )
    }
}