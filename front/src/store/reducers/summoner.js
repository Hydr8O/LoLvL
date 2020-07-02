const initialState = {
    summonerInfo: {},
    rankInfo: {},
    masteryInfo: [],
    matchHistory: [],
    searchCompleted: false,
    setLoading: false,
    numberOfMatches: 10,
    recentGames: undefined,
    allLoaded: false,
    findSummonerHandler: undefined,
    isInDb: undefined
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT_FIND_HAND':
            return {
                ...state,
                findSummonerHandler: action.payload.findSummonerHandler
            }
        case 'SET_SUMMONER':
            return {
                ...state,
                summonerInfo: action.payload.summonerInfo
            }
        case 'SET_OTHER':
            return {
                ...state,
                rankInfo: action.payload.rankInfo,
                masteryInfo: action.payload.masteryInfo,
                searchCompleted: action.payload.searchCompleted,
                setLoading: action.payload.setLoading,
                matchHistory: action.payload.matchHistory
            }
        case 'SET_LOADING':
            return {
                ...state,
                ...action.payload
            }
        case 'ON_SCROLL':
            console.log("Recent games loaded");
            return {
                ...state,
                ...action.payload
            }
        case 'RESET':
            return {
                ...state,
                searchTerm: '',
                findSummonerHandler: undefined,
                summonerInfo: {},
                rankInfo: {},
                masteryInfo: [],
                matchHistory: [],
                searchCompleted: false,
                setLoading: false,
                numberOfMatches: 10,
                recentGames: undefined,
                allLoaded: false
            }
        case 'SET_IN_DB':
            console.log('set in db')
            return {
                ...state,
                isInDb: action.payload
            }
        default: return state
    }; 
};

export default reducer;