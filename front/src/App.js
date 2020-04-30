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
import Server from './components/Layout/Navbar/Server/Server';


class App extends Component {

  async initialize() {
    const { data } = await axios.get("https://ddragon.leagueoflegends.com/api/versions.json")
    const apiKey = "RGAPI-aa41e0d7-916c-4096-81ad-d6b6086d51c3";
    const language = "en_US";
    const server = "ru";
    const newestVersion = data[0];
    const endpoints = {
      summonerPoint: `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/summonerName?api_key=${apiKey}`,
      rankPoint: `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/summonerId?api_key=${apiKey}`,
      currentGamePoint: `https://${server}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/summonerId?api_key=${apiKey}`,
      championMasteryPoint: `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/summonerId?api_key=${apiKey}`,
      championsPoint: `http://ddragon.leagueoflegends.com/cdn/${newestVersion}/data/${language}/champion.json`,
      spellPoint: `http://ddragon.leagueoflegends.com/cdn/${newestVersion}/data/${language}/summoner.json`,
      itemPoint: `http://ddragon.leagueoflegends.com/cdn/${newestVersion}/data/${language}/item.json`,
      matchPoint: `https://${server}.api.riotgames.com/lol/match/v4/matchlists/by-account/accountId?api_key=${apiKey}&endIndex=numberOfEntries`,
      matchInfoPoint: `https://${server}.api.riotgames.com/lol/match/v4/matches/matchId?api_key=${apiKey}`
    }

    const mappedChampNames = await getNames(endpoints.championsPoint);
    const mappedItemNames = await getNames(endpoints.itemPoint, true);
    const mappedNames = { mappedChampNames, mappedItemNames }
    this.props.initialize({ endpoints, mappedNames })
  };

  componentDidMount() {
    this.initialize();
  };


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
            <Server />
          </Navbar>
          <MainContent>
            <Route path='/' exact render={Home} />
            <Route path='/summoner' render={() =>
              <Summoner
                endpoints={this.props.endpoints}
                mappedNames={this.props.mappedNames}
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

const mapStateToProps = ({init}) => {
  return {
    endpoints: init.endpoints,
    mappedNames: init.mappedNames,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    initialize: ({ endpoints, mappedNames }) => dispatch(
      {
        type: 'INITIALIZE',
        payload: { endpoints: endpoints, mappedNames: mappedNames }
      }
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

