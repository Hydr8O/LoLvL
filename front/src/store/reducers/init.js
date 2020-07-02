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
        case 'SET_ENDPOINTS':
            console.log('set');
            console.log(action.payload);
            return {
                ...state,
                endpoints: {
                    ...state.endpoints,
                    ...action.payload

                }
            }
        default:
            return state
    };
};

export default reducer;