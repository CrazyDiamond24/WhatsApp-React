const INITIAL_STATE = {
  loggedInUser: {
    _id: '105',
    fullName: 'Sarah Adams',
    username: 'sarah.adams',
    img: 'https://randomuser.me/api/portraits/women/11.jpg',
    msgs: [
      {
        id: 'msg9',
        senderId: '105',
        recipientId: '102',
        content: 'Hey Jane, how have you been?',
        timestamp: '2023-07-20T10:15:45.678Z',
      },
      {
        id: 'msg10',
        senderId: '102',
        recipientId: '105',
        content: "Hi Sarah! I'm doing well, thanks!",
        timestamp: '2023-07-20T10:20:30.987Z',
      },
      {
        id: 'msg11',
        senderId: '105',
        recipientId: '101',
        content: 'Good morning John! What are your plans for today?',
        timestamp: '2023-07-20T11:05:15.345Z',
      },
      {
        id: 'msg12',
        senderId: '101',
        recipientId: '105',
        content:
          'Morning Sarah! I have a meeting in the morning and then some coding tasks in the afternoon.',
        timestamp: '2023-07-20T11:10:30.567Z',
      },
    ],
  },
}

export function userReducer(state = INITIAL_STATE, action = {}) {
  const { loggedInUser } = state
  switch (action.type) {
    // case 'SPEND_BALANCE':
    //     return {
    //         ...state,
    //         loggedInUser: { ...loggedInUser, balance: loggedInUser.balance - action.amount }
    //     }
    default:
      return state
  }
}
