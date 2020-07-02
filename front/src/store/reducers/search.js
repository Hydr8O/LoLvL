const initialState = {
    searchTerm: ''
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case 'GET_INPUT':
            return {
                ...state,
                searchTerm: action.payload.searchTerm
            }

        default: return state
    };
};

export default reducer;