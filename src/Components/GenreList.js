import React, { Component } from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import {collect, genreFetch, genresSelector} from "../Store";


class GenreList extends Component{
    componentDidMount(){
        const {store} = this.props;
        const {list:genres} = genresSelector(store);
        if (!genres.length) {
            genreFetch();
        }
    }
    render(){
        const {store} = this.props
        const {selected:currentGenre, list:genres, isFetching} = genresSelector(store);
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

export default withRouter(collect(GenreList));