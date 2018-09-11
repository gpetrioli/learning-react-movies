import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose  } from 'redux';
import { Provider } from 'react-redux';
import movieApp from './Redux/reducers'

const loggerMiddleware = createLogger()
// debugging tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(movieApp, /* preloadedState, */ composeEnhancers(
    applyMiddleware(
        thunkMiddleware
        ,loggerMiddleware
    )
  )
)



ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter basename="/learning-react-movies">
            <App/>
        </BrowserRouter>
    </Provider>), document.getElementById('root'));
registerServiceWorker();