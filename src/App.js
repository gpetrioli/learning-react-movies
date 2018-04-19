import React, { Component } from 'react';
import {Route,Link, withRouter } from 'react-router-dom';
import './App.css';
import GenreList from './Components/GenreList';
import MovieList from './Components/MovieList';
import MoviePlaying from './Components/MoviePlaying';
import MovieDetails from './Components/MovieDetails';

import { connect } from 'react-redux';
import {configurationFetch, genreFetch, configurationSelect} from './Redux/actions';


class App extends Component {
    
    constructor(){
        super();
        this.handleRegionSelection = this._handleRegionSelection.bind(this);
    }
    
    componentDidMount(){
        this.props.getConfig();
    }
    
    componentDidUpdate(){

        const {region} = this.props;
        
        if(region){
            const countryName = this.props.countries.find(country=>country.iso_3166_1 === region).english_name
        
            document.querySelector("#navbarNav .dropdown-toggle").textContent = countryName;
        }
    }
    
    _handleRegionSelection(e){
        e.preventDefault()
        this.props.changeRegion(e.target.dataset.country)
    }

    render() {
        const {countries,region} = this.props;
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
                        <div className="navbar-nav mr-3 mb-2 mb-lg-0" id="navbarNav">
                            <Link to="/movies/genre" className="nav-item nav-link">By genre</Link>
                            <Link to="/movies/now-playing" className="nav-item nav-link">Now playing</Link>
                        </div>
                        {countries && 
                            (<div className="dropdown">
                                <button className="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownregion" data-toggle="dropdown">Region</button>
                                <div className="dropdown-scroll dropdown-menu dropdown-menu-right">
                                    {countries.map(country=>(
                                        <a 
                                            className={`dropdown-item ${country.iso_3166_1 === region?"active":""}`}
                                            target="_blank"
                                            href=""
                                            rel="noreferer noopener"
                                            key={country.iso_3166_1}
                                            data-country={`${country.iso_3166_1}`}
                                            onClick={this.handleRegionSelection}
                                            >{country.english_name}</a>
                                    ))}
                                </div> 
                            </div>)
                        }
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
                        <Route path="/movies/now-playing/:page?" render={({match})=>(
                            <div className="row">
                                <div className="col-lg-12">
                                    {region && <MoviePlaying/>}
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

const mapStateToProps = (state) => {
    return {
        region: state.configuration.selected,
        countries: state.configuration.countries
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getConfig: () => {
            dispatch(configurationFetch())
            dispatch(genreFetch())
        },
        changeRegion: (region) => {
            dispatch(configurationSelect({
                selected: region
            }))
        }
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
