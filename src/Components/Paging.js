import React, { Component } from 'react';
import {Link} from 'react-router-dom'

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
        if (max_page === total_pages) min_page = Math.max(max_page-show_pages+1,1);
        if (!total_pages) return '';
        return (
            <nav>
                <ul className={`pagination ${this.props.className}`}>
                    <li className={`page-item ${page===1?'disabled':''}`}><Link to={this.props.route.replace('{page}',page-1)} className="page-link">Previous</Link></li>
                    {Array.from(new Array(max_page-min_page+1), (_,i)=>(
                        <li key={`${this.props.genre || ""}-${this.props.page}-${i}`} className={`page-item ${i+min_page === page ? 'active' : ''}`}><Link to={this.props.route.replace('{page}',i+min_page)} className="page-link" href="#">{i+min_page}</Link></li>
                    ))}
                    <li className={`page-item ${page===total_pages?'disabled':''}`}><Link to={this.props.route.replace('{page}',page+1)} className="page-link">Next</Link></li>
                </ul>
            </nav>
        )
    }
}

export default Paging;