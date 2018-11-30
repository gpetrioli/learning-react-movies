import React, { Component } from 'react';
import {Route, withRouter } from 'react-router-dom';
import './App.css';
import NavBar from './Components/NavBar';
import GenreList from './Components/GenreList';
import MovieList from './Components/MovieList';
import MoviePlaying from './Components/MoviePlaying';
import MovieDetails from './Components/MovieDetails';

import { collect, configurationSelector, configurationFetch, updateRegion } from "./Store";

class App extends Component {
    
    constructor(props){
        super(props);
        this.handleRegionSelection = this._handleRegionSelection.bind(this);
    }
    
    componentDidMount(){
        configurationFetch();
    }
    
    componentDidUpdate(){
        const {store} = this.props;
        const {selected:region, countries} = configurationSelector(store);
        
        if(region && countries.length){
            const countryName = countries.find(country=>country.iso_3166_1 === region).english_name
        
            document.querySelector("#navbarNav .dropdown-toggle").textContent = countryName;
        }
    }
    
    _handleRegionSelection(e){
        e.preventDefault()
        updateRegion(e.target.dataset.country);
    }

    render() {
        const {store} = this.props;
        const {countries,selected:region} = configurationSelector(store);
        const navigationRequirements={
            countries,
            region,
            regionHandler:this.handleRegionSelection
        }
        return (
            <div className="App">
                <NavBar {...navigationRequirements} />
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
                                    {region && <MoviePlaying region={region}/>}
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

export default withRouter(collect(App));
