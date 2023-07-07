const INITIAL_STATE = {
    loggedInUser: {
        name: 'Jorji',
        balance: 100
    }
}

export function userReducer(state = INITIAL_STATE, action = {}) {
    const { loggedInUser } = state;
    switch (action.type) {
        // case 'SPEND_BALANCE':
        //     return {
        //         ...state,
        //         loggedInUser: { ...loggedInUser, balance: loggedInUser.balance - action.amount }
        //     }
        default:
            return state;
    }
}
