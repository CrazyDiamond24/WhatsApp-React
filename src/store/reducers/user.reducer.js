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
  filterBy: {},
  selectedUser: null,
  users: null,
  loggedInUser: {
    _id: '64b8f461ae4055140221c3e3',
    fullName: 'Sarah Adams',
    username: 'sarah.adams',
    img: 'https://randomuser.me/api/portraits/women/11.jpg',
    contacts: [],
    story: [],
    groups: [],
    status: '',
    msgs: [
      {
        id: 'msg9',
        senderId: '64b8f461ae4055140221c3e3',
        recipientId: '64b8f461ae4055140221c3e0',
        content: 'Hey Jane, how have you been?',
        timestamp: '2023-07-20T10:15:45.678Z',
      },
      {
        id: 'msg10',
        senderId: '64b8f461ae4055140221c3e0',
        recipientId: '64b8f461ae4055140221c3e3',
        content: "Hi Sarah! I'm doing well, thanks!",
        timestamp: '2023-07-20T10:20:30.987Z',
      },
      {
        id: 'msg11',
        senderId: '64b8f461ae4055140221c3e3',
        recipientId: '64b8f461ae4055140221c3df',
        content: 'Good morning John! What are your plans for today?',
        timestamp: '2023-07-20T11:05:15.345Z',
      },
      {
        id: 'msg12',
        senderId: '64b8f461ae4055140221c3df',
        recipientId: '64b8f461ae4055140221c3e3',
        content:
          'Morning Sarah! I have a meeting in the morning and then some coding tasks in the afternoon.',
        timestamp: '2023-07-20T11:10:30.567Z',
      },
    ],
  },
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
