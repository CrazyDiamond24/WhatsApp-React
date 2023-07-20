import { msgService } from "../../services/msg.service"

import { ADD_MSG } from "../reducers/msg.reducer"

export function addMsg(fromUser, toUser, msgContent) {

  return async (dispatch) => {
    try {
      const updatedUsers = await msgService.addMsgToContact(
        fromUser,
        toUser,
        msgContent
      )
      console.log('updatedUsers', updatedUsers)
    
      const action = {
        type: ADD_MSG,
        updatedUsers,
      }
      dispatch(action)
      console.log("success")
      // showSuccessMsg(`msg added `)
    } catch (error) {
      // showErrorMsg(`Cannot add msg`)
      console.log("error")
    }
  }
}
