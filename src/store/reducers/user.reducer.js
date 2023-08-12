import { authService } from '../../services/auth.service'

export const SET_USERS = 'SET_USERS'
export const SET_USER = 'SET_USER'
export const ADD_USER = 'ADD_USER'
export const REMOVE_USER = 'REMOVE_USER'

// export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SIGNUP = 'SIGNUP'
export const ADD_MSG = 'ADD_MSG'
export const ADD_CONTACT = 'ADD_CONTACT'
export const ADD_STORY = 'ADD_STORY'
export const REMOVE_CONTACT = 'REMOVE_CONTACT'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER'
export const ADD_AUTO_MSG = 'ADD_AUTO_MSG'
export const UPDATE_MSG_CONTENT = 'UPDATE_MSG_CONTENT'
export const UNBLOCK_USER = 'UNBLOCK_USER'
export const BLOCK_USER = 'BLOCK_USER'
export const EDIT_USER = 'EDIT_USER'

const INITIAL_STATE = {
  loginError: '',
  // filterBy: {},
  selectedUser: null,
  users: null,
  // blockedUsers: [],
  loggedInUser: authService.getLoggedinUser(),
}

export function userReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.users,
      }
    case REMOVE_CONTACT:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          contacts: state.loggedInUser.contacts.filter(
            (contact) => contact._id !== action.contactId
          ),
        },
      }
    case EDIT_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.user._id ? action.user : user
        ),
      }
    case LOGIN_ERROR:
      return {
        ...state,
        loginError: action.errorMsg,
      }
    case SIGNUP:
      return {
        ...state,
        loggedInUser: action.user,
        users: [...state.users, action.user],
        loginError: '',
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
      const newState = {
        ...state,
        users: state.users.map((user) => {
          if (
            user._id === action.msg.senderId ||
            user._id === action.msg.recipientId
          ) {
            return { ...user, msgs: [...user.msgs, action.msg] }
          }
          return user
        }),
      }

      newState.loggedInUser = newState.users.find(
        (user) => user._id === state.loggedInUser._id
      )
      newState.selectedUser = newState.users.find(
        (user) => user._id === state.selectedUser?._id
      )

      return newState

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

    case UPDATE_MSG_CONTENT:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          msgs: state.loggedInUser.msgs.map((m) =>
            m.id === action.msg.id ? { ...m, content: action.msg.content } : m
          ),
        },
        selectedUser: {
          ...state.selectedUser,
          msgs: state.selectedUser.msgs.map((m) =>
            m.id === action.msg.id ? { ...m, content: action.msg.content } : m
          ),
        },
      }

    case ADD_CONTACT:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          contacts: [...state.loggedInUser.contacts, action.contact],
        },
      }
    case ADD_STORY:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          story: [...state.loggedInUser.story, action.url],
        },
      }
    case LOGOUT:
      return {
        ...state,
        loggedInUser: null,
      }
    case BLOCK_USER:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          blockedContcats: [
            ...state.loggedInUser.blockedContcats,
            action.contactId,
          ],
        },
      }
    case UNBLOCK_USER:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          blockedContcats: state.loggedInUser.blockedContcats.filter(
            (contactId) => contactId !== action.contactId
          ),
        },
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

    // case SET_FILTER_BY:
    //   return {
    //     ...state,
    //     filterBy: { ...action.filterBy },
    //   }

    default:
      return state
  }
}
