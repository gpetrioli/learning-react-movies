import React, { Component } from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import { genreFetch, genreSelect } from '../Redux/actions';
import { connect } from 'react-redux';

class GenreList extends Component{
    componentDidMount(){
        this.props.getGenres(+this.props.match.params.genreId || 0);
    }
    
    getGenreNameById(genreId){
        return this.state.genres.find(genre=>genre.id === genreId).name
    }
    
    render(){
        const {currentGenre, genres, selectGenre, isFetching} = this.props;
        const {genreId:routerGenre} = this.props.match.params;
        
        if (isFetching !== false) return null;
        if(genres.length && !routerGenre) return <Redirect to={`/movies/genre/${genres[0].id}`} />;
        return (
            <div id="genre-list" className="card w-25">
               <div className="card-header">Genre List</div>
               <div className="card-block">
                <div className="list-group">
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
        getGenres: (genre) => {
            dispatch(genreFetch(genre))
        },
        selectGenre: (id) => {
            dispatch(genreSelect({selected:id}))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GenreList));