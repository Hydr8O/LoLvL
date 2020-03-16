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
    };

    return state;
};

export default reducer;