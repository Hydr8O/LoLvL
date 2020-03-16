import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import summonerReducer from './store/reducers/summoner';
import initReducer from './store/reducers/init';
import searchReducer from './store/reducers/search';
import * as serviceWorker from './serviceWorker';

const rootReducer = combineReducers(
    {
        summoner: summonerReducer,
        init: initReducer,
        search: searchReducer
    }
);

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));
if (module.hot) {
    module.hot.accept();
}
serviceWorker.unregister();
