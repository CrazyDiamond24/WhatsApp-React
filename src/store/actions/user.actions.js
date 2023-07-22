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
} from '../reducers/user.reducer'

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

export function setFilterBy(filterBy) {
  return (dispatch) => {
    dispatch({ type: SET_FILTER_BY, filterBy })
  }
}
