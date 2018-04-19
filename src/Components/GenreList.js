import React, { Component } from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import { genreSelect } from '../Redux/actions';
import { connect } from 'react-redux';

class GenreList extends Component{
    
    getGenreNameById(genreId){
        return this.state.genres.find(genre=>genre.id === genreId).name
    }
    
    render(){
        const {currentGenre, genres, isFetching} = this.props;
        const {genreId:routerGenre} = this.props.match.params;
        
        if (isFetching !== false) return null;
        if(genres.length && !routerGenre) return <Redirect to={`/movies/genre/${genres[0].id}`} />;
        return (
            <div id="genre-list" className="card bg-light mt-3">
                <div className="card-header">Genre List</div>
                <div className="card-body">
                    <div className="list-group m-3">
                        {genres.map((genre)=>{
                            const active = (genre.id===+currentGenre),
                                  key = `${genre.id}-${active?'active':''}`
                            return (<Link 
                                        key={key}
                                        to={`/movies/genre/${genre.id}`} 
                                        className={`list-group-item list-group-item-action ${active?'active':''}`} 
                                        >{genre.name}</Link>
                                    )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        genres: state.genres.list,
        currentGenre: state.genres.selected,
        isFetching: state.genres.isFetching
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        selectGenre: (id) => {
            dispatch(genreSelect({selected:id}))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GenreList));