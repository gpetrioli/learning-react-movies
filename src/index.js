import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import movieApp from './Redux/reducers.js'

const loggerMiddleware = createLogger()
const store = createStore( 
    movieApp,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
)


ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>), document.getElementById('root'));
registerServiceWorker();
