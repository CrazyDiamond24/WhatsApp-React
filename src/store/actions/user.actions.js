import { userService } from "../../services/user.service"
import { REMOVE_USER, SET_FILTER_BY, SET_USERS } from "../reducers/user.reducer"

export function loadUsers() {
    return async (dispatch, getState) => {
        try {
            const users = await userService.query(getState().userModule.filterBy)
            const action = {
                type: SET_USERS,
                users
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