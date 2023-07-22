import { authService } from '../../services/auth.service'

export const SET_USERS = 'SET_USERS'
export const SET_USER = 'SET_USER'
export const ADD_USER = 'ADD_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const UPDATE_USER = 'UPDATE_USER'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SIGNUP = 'SIGNUP'
export const ADD_MSG = 'ADD_MSG'
export const ADD_CONTACT = 'ADD_CONTACT'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER'
export const ADD_AUTO_MSG = 'ADD_AUTO_MSG'

const INITIAL_STATE = {
  filterBy: {},
  selectedUser: null,
  users: null,
  loggedInUser: authService.getLoggedinUser,
}

export function userReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.users,
      }
    case SIGNUP:
      return {
        ...state,
        loggedInUser: action.user,
        users: [...state.users, action.user],
      }
    case LOGIN:
      return {
        ...state,
        loggedInUser: action.user,
      }
    case SET_LOGGEDIN_USER:
      return {
        ...state,
        loggedInUser: action.user,
      }

    case ADD_MSG:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.msg.senderId ||
          user._id === action.msg.recipientId
            ? { ...user, msgs: [...user.msgs, action.msg] }
            : user
        ),
        loggedInUser:
          state.loggedInUser._id === action.msg.senderId
            ? {
                ...state.loggedInUser,
                msgs: [...state.loggedInUser.msgs, action.msg],
              }
            : state.loggedInUser,
        selectedUser:
          state.selectedUser &&
          state.selectedUser._id === action.msg.recipientId
            ? {
                ...state.selectedUser,
                msgs: [...state.selectedUser.msgs, action.msg],
              }
            : state.selectedUser,
      }

    case ADD_AUTO_MSG:
      const { msg } = action
      const { loggedInUser } = state

      return {
        ...state,
        users: state.users.map((user) =>
          user._id === msg.senderId
            ? { ...user, msgs: [...user.msgs, msg] }
            : user
        ),
        loggedInUser: {
          ...loggedInUser,
          msgs: [...loggedInUser.msgs, msg],
        },
        selectedUser:
          state.selectedUser && state.selectedUser._id === msg.senderId
            ? {
                ...state.selectedUser,
                msgs: [...state.selectedUser.msgs, msg],
              }
            : state.selectedUser,
      }

    case ADD_CONTACT:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          contacts: [...state.loggedInUser.contacts, action.contact],
        },
      }
    case LOGOUT:
      return {
        ...state,
        loggedInUser: null,
      }

    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.user._id ? action.user : user
        ),
      }
    case SET_USER:
      return {
        ...state,
        selectedUser: action.user,
      }
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.user],
      }
    case REMOVE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.userId),
      }
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.user._id ? action.user : user
        ),
      }
    case SET_FILTER_BY:
      return {
        ...state,
        filterBy: { ...action.filterBy },
      }

    default:
      return state
  }
}
