import React, { Component } from 'react';
import Moment from 'react-moment';
import {Link, Redirect} from 'react-router-dom'

export default class MovieList extends Component{
    constructor(props){
        super(props)
        
        this.state = {movies:[], fail:false, total_pages:0}
        this._handleMouseEnter = this._handleMouseEnter.bind(this);
        this._handleMouseLeave = this._handleMouseLeave.bind(this);
    }
    
    _fetch(page){
        let endpoint = `https://api.themoviedb.org/3/discover/movie?api_key=c90b7e72cfb0ae1dab40f95effe976ab&with_genres=${this.props.genre}&page=${page}`;
        console.log(endpoint);
        if (this.props.genre!==null){
            fetch(endpoint)
                .then(response=>response.json())
                .then(json=>this.setState({
                movies: json.results || [],
                fail: (json.results) ? false : true,
                page: +json.page,
                total_pages: Math.min(+json.total_pages,1000)
            }))
        }
    }
    
    componentDidMount(e){
        this._fetch(this.props.page);
    }
    componentWillReceiveProps(props){
        if ((+props.page) !== (+this.props.page)){
            this._fetch(props.page);
        }
    }
    
    _handleMouseEnter(e){
        const backdrop = e.target.closest('.card').dataset.backdrop;
        
        document.documentElement.style.setProperty('--backdrop',`url('${backdrop}')`);
    }
    _handleMouseLeave(){
        //document.documentElement.style.backgroundImage = 'none';
    }
    
    render(){
        const {page = 1} = this.props;
        if (this.state.fail){
            return <Redirect to="/movies/genre" push={true} />
        }
        return (
            <div id="movie-list" className="card w-75">
                <div className="card-header">Movies <div className="float-right"><Paging route={`/movies/genre/${this.props.genre}/{page}`} genre={this.props.genre} page={+page} total_pages={this.state.total_pages} show_pages={6} className="justify-content-end"></Paging></div></div>
               <div className="card-block">
                <ul className="d-flex flex-wrap" >
                    {this.state.movies.map(movie=>( movie.poster_path &&
                        <div className="col-md-6 col-lg-4 col-xl-3 pb-3" key={movie.id}>
                            <li className="card h-100" onMouseOver={this._handleMouseEnter} onMouseLeave={this._handleMouseLeave} data-backdrop={`${this.props.imagepath}w1280${movie.backdrop_path}`}>
                              <img className="card-img-top img-fluid" src={`${this.props.imagepath}w300${movie.poster_path}`} alt="Card image cap" />
                              <div className="card-block">
                                <h4 className="card-title">{movie.title}</h4>
                                <p className="card-text"><small className="text-muted">Released on <Moment format="DD-MM-YYYY">{movie.release_date}</Moment></small></p>
                                <p className="card-text overview">{movie.overview}</p>
                              </div>
                              <div className="card-footer">
                                <a href="#" className="card-link">more</a>
                              </div>
                            </li>
                        </div>
                    ))}
                </ul>
                </div>
                <div className="card-footer">
                    <Paging route={`/movies/genre/${this.props.genre}/{page}`} genre={this.props.genre} page={+page} total_pages={this.state.total_pages} show_pages={10} className="justify-content-center"></Paging>
                </div>
            </div>
        )
    }
}



class Paging extends Component{
    render(){
        const {
            page,
            total_pages,
            show_pages
        } = this.props;
        
        let min_page = (show_pages < total_pages) ? Math.max((page - Math.floor(show_pages/2)),1) : 1,
            max_page = (show_pages < total_pages) ? Math.min((page + Math.floor(show_pages/2)-1),total_pages) : total_pages;
        
        if (min_page === 1) max_page = Math.min(min_page+show_pages-1, total_pages)
        if (max_page == total_pages) min_page = Math.max(max_page-show_pages+1,1);
        return (
            <nav>
                <ul className={`pagination ${this.props.className}`}>
                    <li className={`page-item ${page==1?'disabled':''}`}><Link to={this.props.route.replace('{page}',page-1)} className="page-link">Previous</Link></li>
                    {Array.from(new Array(max_page-min_page+1), (_,i)=>(
                        <li key={`${this.props.genre}-${this.props.page}-${i}`} className={`page-item ${i+min_page === page ? 'active' : ''}`}><Link to={this.props.route.replace('{page}',i+min_page)} className="page-link" href="#">{i+min_page}</Link></li>
                    ))}
                    <li className={`page-item ${page==total_pages?'disabled':''}`}><Link to={this.props.route.replace('{page}',page+1)} className="page-link">Next</Link></li>
                </ul>
            </nav>
        )
                                                               
    }
}