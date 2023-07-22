// import { authService } from '../../services/auth.service'

// import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
// import {
//   SIGNUP,
//   LOGIN,
//   LOGOUT,
//   SET_LOGGEDIN_USER,
// } from '../reducers/user.reducer'

// export function doSignup(userCred) {
//   return async (dispatch, getState) => {
//     try {
//       const user = await authService.signup(userCred)
//       const action = {
//         type: SIGNUP,
//         user,
//       }
//       dispatch(action)
//     } catch (error) {
//       console.log('error:', error)
//     }
//   }
// }

// export function doLogin(userCred) {
//   return async (dispatch, getState) => {
//     try {
//       const user = await authService.login(userCred)
//       const action = {
//         type: LOGIN,
//         user,
//       }
//       dispatch(action)
//       showSuccessMsg('like')
//     } catch (error) {
//       showErrorMsg('username or email not found please signup')
//     }
//   }
// }

// export function getUser() {
//   return async (dispatch, getState) => {
//     try {
//       const user = await authService.getLoggedinUser()

//       const action = {
//         type: SET_LOGGEDIN_USER,
//         user,
//       }
//       dispatch(action)
//       return user
//     } catch (error) {
//       console.log('error:', error)
//     }
//   }
// }

// export function doLogout() {
//   return async (dispatch, getState) => {
//     try {
//       await authService.logout()
//       const action = {
//         type: LOGOUT,
//       }
//       dispatch(action)
//     } catch (error) {
//       console.log('error:', error)
//     }
//   }
// }
