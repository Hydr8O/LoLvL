const initialState = {
    server: 'ru'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_SERVER':
            return {
                ...state,
                server: action.payload
            }
        default:
            return state
    }
}

export default reducer;