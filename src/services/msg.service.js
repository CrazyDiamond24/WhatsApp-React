export const msgService = {
    addMsgToContact
}

function addMsgToContact(fromUser,toUser,msgContent) {
    fromUser.msgs.map(m => m.push(msgContent))
    toUser.msgs.map(m => m.push(msgContent))

    return {fromUser, toUser}
}