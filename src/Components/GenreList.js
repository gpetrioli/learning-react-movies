import React, { Component } from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import { genreFetch, genreSelect } from '../Redux/actions.js';
import { connect } from 'react-redux';

class GenreList extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.props.getGenres(+this.props.genre || 0);
    }
    
    getGenreNameById(genreId){
        return this.state.genres.find(genre=>genre.id === genreId).name
    }
    
    render(){
        const {currentGenre, genres, selectGenre, genre:routerGenre} = this.props;
        if(genres.length && !routerGenre) return <Redirect to={`/movies/genre/${genres[0].id}`} />;
        return (
            <div id="genre-list" className="card w-25">
               <div className="card-header">Genre List</div>
               <div className="card-block">
                <div className="list-group">
                    {genres.map((genre)=>(
                    <Link 
                        to={`/movies/genre/${genre.id}`} 
                        className={`list-group-item list-group-item-action ${genre.id==currentGenre?'active':null}`} 
                        key={genre.id} data-id={genre.id}
                        onClick={()=>selectGenre(genre.id)}
                        >{genre.name}</Link>
                    ))}
                </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        genres: state.genres.list || [],
        currentGenre: state.genres.selected
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