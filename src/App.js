import React, { Component } from 'react';
import {Route, withRouter } from 'react-router-dom';
import './App.css';
import NavBar from './Components/NavBar';
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
