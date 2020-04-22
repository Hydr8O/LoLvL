import React, { Component, Fragment } from 'react';
import SummonerStats from '../../components/SummonerStats/SummonerStats';
import RecentGames from '../../components/RecentGames/RecentGames';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import Backdrop from '../../components/Backdrop/Backdrop';
import Popup from '../../components/Popup/Popup';
import { idToName } from '../../utils/mapNames';
import Quests from '../../components/Quests/Quests';
import axios from 'axios';

const ITEMS = ["item0", "item1", "item2", "item3", "item4", "item5", "item6"];

class Summoner extends Component {

    state = {
        showBackdrop: false,
        disableBtn: false
    }

    showBackdropHandler = () => {
        this.setState({showBackdrop: true});
    };

    hideBackdropHandler = () => {
        console.log('hide');
        this.setState({showBackdrop: false});
    };

    onScrollLoadHandler = () => {
        if (window.innerHeight + window.pageYOffset > document.body.clientHeight - 50 &&
            this.props.matchHistory) {
            console.log('asdasd')
            this.matches(this.props.matchHistory.slice(0, this.props.numberOfMatches))
                .then(matchesFullInfo => {
                    console.log(matchesFullInfo)
                    console.log(this.props.recentGames);
                    this.props.onScrollLoad({ recentGames: matchesFullInfo, allLoaded: true });
                });
            window.removeEventListener('scroll', this.onScrollLoadHandler);

        }
    }

    analyzeSummonerHandler = () => {
        this.setState({disableBtn: true});
        axios.post(`http://localhost:1234/summoner/summonerInfo/${this.props.summonerInfo.name}`,
            {
                summonerInfo: this.props.summonerInfo
            })
            .then(res => {
                console.log(res);
            })

        if (this.props.recentGames) {
            axios.post(`http://localhost:1234/summoner/gameStats/${this.props.summonerInfo.name}`,
                {
                    gameStats: this.props.recentGames.map(game => {
                        return {
                            gameId: game.gameId,
                            win: game.participantData.stats.win,
                            kills: game.participantData.stats.kills,
                            deaths: game.participantData.stats.deaths,
                            assists: game.participantData.stats.assists,
                            longestTimeSpentLiving: game.participantData.stats.longestTimeSpentLiving,
                            totalDamageDealt: game.participantData.stats.totalDamageDealt,
                            wardsPlaced: game.participantData.stats.wardsPlaced,
                            gameDuration: game.gameDuration,
                            lane: game.lane,
                            queueId: game.queueId,
                            gameCreation: game.gameCreation,
                            minionsKilled: game.participantData.stats.totalMinionsKilled,
                            goldEarned: game.participantData.stats.goldEarned
                        }
                    }),
                    summonerId: this.props.summonerInfo.id
                })
                .then(res => {
                    console.log(res);
                    this.props.onInDb(true);
                });
        } else {
    
            this.matches(this.props.matchHistory.slice(0, this.props.numberOfMatches))
            .then(matchesFullInfo => {
            axios.post(`http://localhost:1234/summoner/gameStats/${this.props.summonerInfo.name}`,
                {
                    gameStats: matchesFullInfo.map(game => {
                        return {
                            gameId: game.gameId,
                            win: game.participantData.stats.win,
                            kills: game.participantData.stats.kills,
                            deaths: game.participantData.stats.deaths,
                            assists: game.participantData.stats.assists,
                            longestTimeSpentLiving: game.participantData.stats.longestTimeSpentLiving,
                            totalDamageDealt: game.participantData.stats.totalDamageDealt,
                            wardsPlaced: game.participantData.stats.wardsPlaced,
                            gameDuration: game.gameDuration,
                            lane: game.lane,
                            queueId: game.queueId,
                            gameCreation: game.gameCreation,
                            minionsKilled: game.participantData.stats.totalMinionsKilled,
                            goldEarned: game.participantData.stats.goldEarned
                        }
                    }),
                    summonerId: this.props.summonerInfo.id,
                })
                .then(res => {
                    console.log(res);
                    this.props.onInDb(true);
                    this.setState({disableBtn: false});
                });
            });
        };
    };

componentDidMount() {
    this.props.getFindSummoner(this.findSummonerHandler);
};

componentWillUnmount() {
    console.log("Unmounted");
    this.props.onReset();
}




componentDidUpdate() {
    console.log('updated');
}



findSummonerHandler = (event) => {
    this.props.onLoading({ allLoaded: false, setLoading: true, searchCompleted: false, recentGames: undefined });
    this.getAllInfo()
        .then(() => {
            this.props.history.push(`/summoner/${this.props.summonerInfo.name}`);
            
        })
        .then(() => {
            return axios.get(`http://localhost:1234/summoner/check/${this.props.summonerInfo.id}`)
        })
        .then(({ data }) => {
            this.props.onInDb(data.isInDb);
            console.log(this.props);
            
        })
        .catch(err => {
            console.log(err);
        });
    
    event.preventDefault();
}

async getAllInfo() {
    const data = await this.getSummonerData();
    const { id, name, puuid, accountId, summonerLevel, revisionDate, profileIconId } = data;
    this.props.onSummonerBaseInfo(
        {
            id: id,
            name: name,
            puuid: puuid,
            accountId: accountId,
            level: summonerLevel,
            revisionDate: revisionDate,
            profileIconId: profileIconId
        }
    );
    const rank = this.rankInfo();
    const mastery = this.championMasteryInfo();
    const matchesBase = this.matchesBaseInfo(100);
    const results = await Promise.all([mastery, rank, matchesBase]);
    this.props.onOtherInfo(
        {
            rankInfo: { 
                soloRank: results[1].find(entry => entry.queueType === 'RANKED_SOLO_5x5'), 
                flexRank: results[1].find(entry => entry.queueType === 'RANKED_FLEX_SR') 
            },
            masteryInfo: results[0],
            searchCompleted: true,
            setLoading: false,
            matchHistory: results[2]
        }
    );
    console.log(results)
}

async championMasteryInfo(numberOfEntries) {
    const { data } = await axios.get(`http://localhost:1234/summoner/masteryInfo/${this.props.summonerInfo.id}`);
    const resultData = numberOfEntries ? data.slice(0, numberOfEntries) : data;
    return idToName(resultData, "championId", this.props.mappedNames.mappedChampNames);
}

async rankInfo() {
    const { data } = await axios.get(`http://localhost:1234/summoner/rankInfo/${this.props.summonerInfo.id}`);
    return data;
}

async getSummonerData() {
    const { data } = await axios.get(`http://localhost:1234/summoner/summonerInfo/${this.props.searchTerm}`);
    return data;
}

async matchesBaseInfo(numberOfEntries) {
    const { data } = await axios.get(`http://localhost:1234/matches/${this.props.summonerInfo.accountId}?numberOfEntries=${numberOfEntries}`);
    return idToName(data.matches, 'champion', this.props.mappedNames.mappedChampNames);
}

async matches(matchesBase) {
    let matchFullInfo = matchesBase.map(match => {
        return this.matchInfo(match);
    })
    matchFullInfo = Promise.all(matchFullInfo);
    return matchFullInfo;
}


async matchInfo(match) {
    const { data } = await axios.get(`http://localhost:1234/match/${match.gameId}`);
    const participantId = data.participantIdentities
        .find(participant => participant.player.summonerId === this.props.summonerInfo.id).participantId;
    const summonerInfo = data.participants[participantId - 1];
    idToName(summonerInfo, ITEMS, this.props.mappedNames.mappedItemNames, true);
    idToName(summonerInfo, 'championId', this.props.mappedNames.mappedChampNames);
    console.log(data);
    return {
        queueId: data.queueId,
        gameId: match.gameId,
        gameCreation: data.gameCreation,
        participantData: data.participants[participantId - 1],
        lane: match.lane,
        gameDuration: Math.floor(data.gameDuration / 60),
        matchMembers: data.participants
    };
}


render() {
    const toRender = [
        this.props.searchCompleted ? <SummonerStats
                searchCompleted={this.props.searchCompleted}
                name={this.props.summonerInfo.name}
                level={this.props.summonerInfo.level}
                id={this.props.summonerInfo.id}
                rankStats={this.props.rankInfo}
                masteryInfo={this.props.masteryInfo}
                profileIcon={this.props.summonerInfo.profileIconId}
                recentGames={this.props.recentGames}
                matchesHistory={this.props.matchHistory}
                scroll={this.onScrollLoadHandler}
                analyzeSummoner={this.analyzeSummonerHandler}
                isInDb={this.props.isInDb}
                showBackdrop={this.showBackdropHandler}
                disableBtn={this.state.disableBtn} 
                key='SummonerStats'
        />: null,
        this.props.recentGames ? <RecentGames 
            recentGames={this.props.recentGames} 
            allLoaded = {this.props.allLoaded}
            key="RecentGames"
        />:
        null
    ]

    return (
        <Fragment>
            <Switch>
            <Route path='/summoner/:summonerId/quests' render={() => 
                <Quests 
                    id={this.props.summonerInfo.id} 
                    tier={this.props.rankInfo.soloRank.tier}
                    rank={this.props.rankInfo.soloRank.rank}
                />}
            />
            <Route path='/summoner/:summonerId' render={() => toRender}/>
            </Switch>
            
            {this.props.setLoading ? <Loading /> : null}
        </Fragment>
    );
}
}

const mapStateToProps = ({ summoner, search }) => {
    return {
        searchTerm: search.searchTerm,
        summonerInfo: summoner.summonerInfo,
        rankInfo: summoner.rankInfo,
        masteryInfo: summoner.masteryInfo,
        matchHistory: summoner.matchHistory,
        searchCompleted: summoner.searchCompleted,
        setLoading: summoner.setLoading,
        numberOfMatches: summoner.numberOfMatches,
        recentGames: summoner.recentGames,
        allLoaded: summoner.allLoaded,
        isInDb: summoner.isInDb
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getFindSummoner: (handler) => dispatch(
            {
                type: 'INIT_FIND_HAND',
                payload: { findSummonerHandler: handler }
            }
        ),
        onSummonerBaseInfo: (info) => dispatch(
            {
                type: 'SET_SUMMONER',
                payload: { summonerInfo: info }
            }
        ),
        onOtherInfo: (info) => dispatch(
            {
                type: 'SET_OTHER',
                payload: { ...info }
            }
        ),
        onLoading: (info) => dispatch(
            {
                type: 'SET_LOADING',
                payload: { ...info }
            }
        ),
        onScrollLoad: (info) => dispatch(
            {
                type: 'ON_SCROLL',
                payload: { ...info }
            }
        ),
        onReset: () => dispatch(
            {
                type: 'RESET'
            }
        ),
        onInDb: (isInDb) => dispatch(
            {
                type: 'SET_IN_DB',
                payload: isInDb 
            }
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Summoner));