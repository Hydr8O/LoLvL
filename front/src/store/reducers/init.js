const initialState = {
    endpoints: {},
    mappedNames: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                ...state,
                ...action.payload
            }
    };
    
    return state
};

export default reducer;