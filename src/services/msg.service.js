export const msgService = {
    addMsgToContact
}

function addMsgToContact(fromUser,toUser,msgContent) {
    fromUser.msgs.push(msgContent)
    toUser.msgs.push(msgContent)

    return [fromUser, toUser]
}

function createNewMsg(fromUser , toUser ,content) {
    return {
        senderId: fromUser._id,
        recipientId: toUser._id,
        content,
        timestamp: Date.now(),
    }
}