import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';
import Summoner from './containers/Summoner/Summoner';
import Navbar from './components/Layout/Navbar/Navbar';
import Logo from './components/Layout/Navbar/Logo/Logo';
import Search from './components/Layout/Navbar/Search/Search';
import Home from './components/Home/Home';
import MainContent from './components/Layout/MainContent/MainContent';
import { Route } from 'react-router-dom';
import { getNames } from './utils/mapNames';
import axios from 'axios';
import Layout from './components/Layout/Layout';
import Server from './containers/Server/Server';


class App extends Component {

  async initialize() {
    const { data } = await axios.get("https://ddragon.leagueoflegends.com/api/versions.json")
    const language = "en_US";
    const newestVersion = data[0];
    const endpoints = {
      summonerPoint: `http://localhost:1234/summoner/summonerInfo/summonerName?server=${this.props.server}`,
      postSummoner: `http://localhost:1234/summoner/summonerInfo/summonerName`,
      rankPoint: `http://localhost:1234/summoner/rankInfo/summonerId?server=${this.props.server}`,
      championMasteryPoint: `http://localhost:1234/summoner/masteryInfo/summonerId?server=${this.props.server}`,
      championsPoint: `http://ddragon.leagueoflegends.com/cdn/${newestVersion}/data/${language}/champion.json`,
      spellPoint: `http://ddragon.leagueoflegends.com/cdn/${newestVersion}/data/${language}/summoner.json`,
      itemPoint: `http://ddragon.leagueoflegends.com/cdn/${newestVersion}/data/${language}/item.json`,
      postGameStats: `http://localhost:1234/summoner/gameStats/summonerName`,
      isInDb: `http://localhost:1234/summoner/check/summonerId`
    }

    const mappedChampNames = await getNames(endpoints.championsPoint);
    const mappedItemNames = await getNames(endpoints.itemPoint, true);
    const mappedNames = { mappedChampNames, mappedItemNames }
    this.props.initialize({ endpoints, mappedNames })
  };

  componentDidMount() {
    this.initialize();
  };

  componentDidUpdate(prevProps) {
    if (prevProps.server !== this.props.server) {
      const endpoints = {
        summonerPoint: `http://localhost:1234/summoner/summonerInfo/summonerName?server=${this.props.server}`,
        postSummoner: `http://localhost:1234/summoner/summonerInfo/summonerName`,
        rankPoint: `http://localhost:1234/summoner/rankInfo/summonerId?server=${this.props.server}`,
        championMasteryPoint: `http://localhost:1234/summoner/masteryInfo/summonerId?server=${this.props.server}`,
      }
      this.props.setEndpoints(endpoints);
    }
  }

  render() {
    let layout = null;

    if (this.props.endpoints) {
      layout =
        <Layout>
          <Navbar>
            <Logo />
            <Route
              path='/summoner'
              render={() =>
                <Search
                  getInput={this.getInputHandler}
                  findSummoner={this.findSummonerHandler}
                  searchTerm={this.props.searchTerm}
                />}
            />
            <Server 
            changeServer={this.props.changeServer} 
            server={this.props.server}/>
          </Navbar>
          <MainContent>
            <Route path='/' exact render={Home} />
            <Route path='/summoner' render={() =>
              <Summoner
                endpoints={this.props.endpoints}
                mappedNames={this.props.mappedNames}
                server={this.props.server}
              />
            }
            />
            
          </MainContent>
        </Layout>
    }
    return (
      <BrowserRouter>
        <div className="App">
          {layout}
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = ({init, app, summoner, search}) => {
  return {
    endpoints: init.endpoints,
    mappedNames: init.mappedNames,
    server: app.server,
    summonerName: summoner.summonerInfo.name,
    summonerId: summoner.summonerInfo.id,
    searchTerm: search.searchTerm
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    initialize: ({ endpoints, mappedNames }) => dispatch(
      {
        type: 'INITIALIZE',
        payload: { endpoints: endpoints, mappedNames: mappedNames }
      }
    ),
    changeServer: (server) => dispatch(
      {
        type: 'CHANGE_SERVER',
        payload: server
      }
    ),
    setEndpoints: (endpoints) => dispatch(
      {
        type: 'SET_ENDPOINTS',
        payload: endpoints
      }
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

