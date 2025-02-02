import React, { Component, Fragment } from 'react';
import SummonerStats from '../../components/SummonerStats/SummonerStats';
import RecentGames from '../../components/RecentGames/RecentGames';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import Quests from '../Quests/Quests';
import { idToName } from '../../utils/mapNames';
import matchInfo from '../../utils/matchInfo';
import axios from 'axios';



class Summoner extends Component {

    state = {
        showBackdrop: false,
        disableBtn: false
    }

    showBackdropHandler = () => {
        this.setState({ showBackdrop: true });
    };



    hideBackdropHandler = () => {
        console.log('hide');
        this.setState({ showBackdrop: false });
    };


    analyzeSummonerHandler = () => {
        this.setState({ disableBtn: true });
        axios.post(this.props.endpoints.postSummoner.replace('summonerName', this.props.summonerInfo.name),
            {
                summonerInfo: this.props.summonerInfo
            })
            .then(res => {
                console.log(res);
            })

        if (this.props.recentGames) {
            axios.post(this.props.endpoints.postGameStats.replace('summonerName', this.props.summonerInfo.name),
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
            matchInfo.matches(
                this.props.matchHistory.slice(0, this.props.numberOfMatches),
                this.props.summonerInfo.id,
                this.props.mappedNames.mappedItemNames,
                this.props.mappedNames.mappedChampNames,
                this.props.server)
                .then(matchesFullInfo => {
                    axios.post(this.props.endpoints.postGameStats.replace('summonerName', this.props.summonerInfo.name),
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
                            this.setState({ disableBtn: false });
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
                console.log('Checking in db');
                return axios.get(this.props.endpoints.isInDb.replace('summonerId', this.props.summonerInfo.id));
            })
            .then(({ data }) => {
                this.props.onInDb(data.isInDb);
                console.log(this.props);
                console.log('Checked in db');
            })
            .then(() => {
                setTimeout(() => {
                    console.log('Getting matches')
                matchInfo.matches(
                    this.props.matchHistory.slice(0, this.props.numberOfMatches),
                    this.props.summonerInfo.id,
                    this.props.mappedNames.mappedItemNames,
                    this.props.mappedNames.mappedChampNames,
                    this.props.server)
                    .then(matchesFullInfo => {
                        console.log(matchesFullInfo)
                        console.log(this.props.recentGames);
                        this.props.onScrollLoad({ recentGames: matchesFullInfo, allLoaded: true });
                    });
                }, 1000);
                
            })
            .catch(err => {
                console.log(err);
            });
            
        event.preventDefault();
    }

    async getAllInfo() {
        try {
            const data = await this.getSummonerData();
            console.log(data);
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
            const matchesBase = matchInfo.matchesBaseInfo(
                100,
                this.props.summonerInfo.accountId,
                this.props.mappedNames.mappedChampNames,
                this.props.server
            );
            console.log('here');
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
        } catch (err) {
            console.log(err);
        }
    }

    async championMasteryInfo(numberOfEntries) {
        try {
            const { data } = await axios.get(this.props.endpoints.championMasteryPoint.replace('summonerId', this.props.summonerInfo.id));
            const resultData = numberOfEntries ? data.slice(0, numberOfEntries) : data;
            return idToName(resultData, "championId", this.props.mappedNames.mappedChampNames);
        } catch (err) {
            console.log(err);
        }
        
    }

    async rankInfo() {
        const { data } = await axios.get(this.props.endpoints.rankPoint.replace('summonerId', this.props.summonerInfo.id));
        return data;
    }

    async getSummonerData() {
        console.log(this.props.endpoints);
        const { data } = await axios.get(this.props.endpoints.summonerPoint.replace('summonerName', this.props.searchTerm));
        return data;
    }

    // componentWillReceiveProps(nextProps) {
    //     for (const index in nextProps) {
    //       if (nextProps[index] !== this.props[index]) {
    //         console.log(index, this.props[index], '-->', nextProps[index]);
    //       }
    //     }
    //   }

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
            /> : null,
            this.props.recentGames ? <RecentGames
                recentGames={this.props.recentGames}
                allLoaded={this.props.allLoaded}
                key="RecentGames"
            /> :
                null
        ]

        let tier;
        let rank;

        if (this.props.rankInfo.soloRank) {
            tier = this.props.rankInfo.soloRank.tier;
            rank = this.props.rankInfo.soloRank.rank;
        } else if (this.props.rankInfo.flexRank) {
            tier = this.props.rankInfo.flexRank.tier;
            rank = this.props.rankInfo.flexRank.rank;
        }

        return (
            <Fragment>
                <Switch>
                    <Route path='/summoner/:summonerId/quests' render={() =>
                        <Quests
                            id={this.props.summonerInfo.id}
                            tier={tier}
                            rank={rank}
                            mappedNames={this.props.mappedNames}
                            accountId={this.props.summonerInfo.accountId}
                            name={this.props.summonerInfo.name}
                            server={this.props.server}
                        />}
                    />
                    <Route path='/summoner/:summonerId' render={() => toRender} />
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