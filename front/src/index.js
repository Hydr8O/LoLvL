import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import summonerReducer from './store/reducers/summoner';
import initReducer from './store/reducers/init';
import searchReducer from './store/reducers/search';
import appReducer from './store/reducers/app';
import * as serviceWorker from './serviceWorker';

const rootReducer = combineReducers(
    {
        summoner: summonerReducer,
        init: initReducer,
        search: searchReducer,
        app: appReducer
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
