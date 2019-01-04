import React from 'react';
import {Link, withRouter} from 'react-router-dom';

const NavBar = ({countries, regionHandler, region}) =>{
    return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
        </button>
        <Link to="/" className="navbar-brand">
            <img src={`${process.env.PUBLIC_URL}/media/Film-icon.png`} width="32" height="32" className="d-inline-block align-top" alt="" />&nbsp;
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
                                href=""
                                rel="noreferer noopener"
                                key={country.iso_3166_1}
                                data-country={`${country.iso_3166_1}`}
                                onClick={regionHandler}
                                >{country.english_name}</a>
                        ))}
                    </div> 
                </div>)
            }
        </div>
    </nav>
    );
}

export default withRouter(NavBar);