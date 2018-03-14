import React, { Component } from 'react';
import {Route,Link, withRouter } from 'react-router-dom';
import './App.css';
import GenreList from './Components/GenreList';
import MovieList from './Components/MovieList';
import MovieDetails from './Components/MovieDetails';

import { connect } from 'react-redux';
import {configurationFetch} from './Redux/actions';


class App extends Component {
    componentDidMount(){
        this.props.getConfig();
    }
    
    
    render() {
        return (
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                  </button>
                    <Link to="/" className="navbar-brand">
                        <img src="/assets/brand/bootstrap-solid.svg" width="30" height="30" className="d-inline-block align-top" alt="" />
                        React Movies <small><small>(<em>learning</em>)</small></small>
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav" id="navbarNav">
                        <Link to="/movies/genre" className="nav-item nav-link">By genre</Link>
                        <Link to="#" className="nav-item nav-link disabled">By year</Link>
                    </div>
                    </div>
                </nav>
                <div className="container-fluid">
                        <Route path="/movies/genre/:genreId?/:page?" render={({match})=>(
                            <div className="row">
                                <div className="col-lg-3">
                                    <GenreList />
                                </div>
                                <div className="col-lg-9">
                                    {match.params.genreId && <MovieList key={`movies-${match.params.genreId}`}/>}
                                </div>
                            </div>
                        )} />
                        <Route path="/movie/:movieId" render={({match})=>(
                            <div>
                                <MovieDetails {...match} />
                            </div>
                        )}></Route>
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        getConfig: () => {
            dispatch(configurationFetch())
        }
    }
}


export default withRouter(connect(null, mapDispatchToProps)(App));
