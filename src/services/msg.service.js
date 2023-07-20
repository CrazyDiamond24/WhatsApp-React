export const msgService = {
    addMsgToContact
}

function addMsgToContact(fromUser,toUser,msgContent) {
    fromUser.msgs.push(msgContent)
    toUser.msgs.push(msgContent)

    return {fromUser, toUser}
}