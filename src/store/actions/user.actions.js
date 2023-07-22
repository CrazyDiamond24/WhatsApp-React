import { userService } from '../../services/user.service'
import { authService } from '../../services/auth.service'
import { msgService } from '../../services/msg.service'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { useNavigate } from 'react-router-dom'
import {
  REMOVE_USER,
  // SET_FILTER_BY,
  SET_USERS,
  SET_USER,
  SIGNUP,
  LOGIN,
  LOGOUT,
  SET_LOGGEDIN_USER,
  ADD_MSG,
  LOGIN_ERROR,
  ADD_CONTACT,
} from '../reducers/user.reducer'

export function addContactToUser(name) {
  return async (dispatch, getState) => {
    try {
      const loggedInUser = getState().userModule.loggedInUser
      const contact = await userService.addContact(loggedInUser._id, name)
      const action = {
        type: ADD_CONTACT,
        contact,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function doSignup(userCred) {
  return async (dispatch, getState) => {
    try {
      const user = await authService.signup(userCred)
      console.log('user in actions after back', user)
      const action = {
        type: SIGNUP,
        user,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function doLogin(userCred) {
  return async (dispatch, getState) => {
    try {
      // const navigate = useNavigate()
      const user = await authService.login(userCred)
      const action = {
        type: LOGIN,
        user,
      }
      console.log('hi')
      dispatch(action)
      console.log('hi')
      // navigate('/')
      showSuccessMsg('like')
    } catch (error) {
      // const errorMsg = 'username not found please signup'
      // const ErrorAction = {
      //   type: LOGIN_ERROR,
      //   errorMsg,
      // }
      // dispatch(ErrorAction)
    }
  }
}

export function getUser() {
  return async (dispatch, getState) => {
    try {
      const user = await authService.getLoggedinUser()

      const action = {
        type: SET_LOGGEDIN_USER,
        user,
      }
      dispatch(action)
      return user
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function doLogout() {
  return async (dispatch, getState) => {
    try {
      await authService.logout()
      const action = {
        type: LOGOUT,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}
export function loadUsers() {
  return async (dispatch, getState) => {
    try {
      // const loggedInUser = getState().userModule.loggedInUser
      const users = await userService.query()
      const action = {
        type: SET_USERS,
        users,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}
export function setCurrUser(UserId) {
  console.log('UserId', UserId)
  return async (dispatch, getState) => {
    try {
      const user = await userService.getById(UserId)
      const action = {
        type: SET_USER,
        user,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function removeUser(userId) {
  return async (dispatch) => {
    try {
      await userService.remove(userId)
      const action = { type: REMOVE_USER, userId }
      dispatch(action)
      return 'Removed!'
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function addMsg(msgContent, userId) {
  return async (dispatch, getState) => {
    try {
      const loggedInUser = getState().userModule.loggedInUser
      const msg = await msgService.createNewMsg(
        msgContent,
        loggedInUser._id,
        userId
      )
      const action = { type: ADD_MSG, msg }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

// export function setFilterBy(filterBy) {
//   return (dispatch) => {
//     dispatch({ type: SET_FILTER_BY, filterBy })
//   }
// }
