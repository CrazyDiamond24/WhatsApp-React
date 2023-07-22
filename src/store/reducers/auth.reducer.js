import { authService } from "../../services/auth.service"

export const SET_USERS = 'SET_USERS'
export const SET_USER = 'SET_USER'
export const ADD_USER = 'ADD_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const UPDATE_USER = 'UPDATE_USER'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER'

const INITIAL_STATE = {
  users: null,
  loggedInUser: authService.getLoggedinUser,
}

export function authReducer(state = INITIAL_STATE, action = {}) {
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

    default:
      return state
  }
}
