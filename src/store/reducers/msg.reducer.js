export const ADD_MSG = 'ADD_MSG'

const INITIAL_STATE = {
    userMsgList: null   
}

export function msgReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case ADD_MSG:
      return {
        ...state,
        userMsgList : action.updatedUserList,
      }

    default:
      return state
  }
}
