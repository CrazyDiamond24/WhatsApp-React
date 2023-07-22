import { userService } from '../../services/user.service'
import { authService } from '../../services/auth.service'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import {
  REMOVE_USER,
  SET_FILTER_BY,
  SET_USERS,
  SET_USER,
  SIGNUP,
  LOGIN,
  LOGOUT,
  SET_LOGGEDIN_USER,
  ADD_MSG,
} from '../reducers/user.reducer'

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
      const user = await authService.login(userCred)
      const action = {
        type: LOGIN,
        user,
      }
      dispatch(action)
      showSuccessMsg('like')
    } catch (error) {
      showErrorMsg('username or email not found please signup')
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
      const msg = await userService.createNewMsg(
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

export function setFilterBy(filterBy) {
  return (dispatch) => {
    dispatch({ type: SET_FILTER_BY, filterBy })
  }
}
