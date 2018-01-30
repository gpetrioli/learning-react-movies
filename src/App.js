import React, { Component } from 'react';
import {Route,Link} from 'react-router-dom';
import './App.css';
import GenreList from './Components/GenreList';
import MovieList from './Components/MovieList';


class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            baseUrl:null
        }
    }
    
    componentDidMount(){
        let endpoint = 'https://api.themoviedb.org/3/configuration?api_key=c90b7e72cfb0ae1dab40f95effe976ab';
        
        fetch(endpoint)
            .then(response=>response.json())
            .then(json=>this.setState({baseUrl: json.images.base_url}))
    }
    
    
    render() {
    const genreName = this.state.genreName;
    return (
        <div className="App">
            <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
              <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
                <Link to="/" className="navbar-brand">
                <img src="/assets/brand/bootstrap-solid.svg" width="30" height="30" className="d-inline-block align-top" alt="" />
                React Movies <small><small>(<em>learning</em>)</small></small>
                </Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                <div className="navbar-nav" id="navbarNav">
                    <Link to="/movies/genre" className="nav-item nav-link">By genre</Link>
                    <Link to="/movies/year" className="nav-item nav-link">By year</Link>
                </div>
                </div>
            </nav>
            <Route path="/movies/genre/:genreId?/:page?" render={({match})=>(
                <div className="card-deck p-3" >
                    <GenreList genre={match.params.genreId} />
                    {match.params.genreId && <MovieList key={match.params.genreId} genre={match.params.genreId} imagepath={this.state.baseUrl} page={match.params.page || 1}/>}
                </div>
            )} />
        </div>
    );
    }
}

export default App;
