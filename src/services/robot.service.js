import { storageService } from './storage.service.js'
import { makeId } from './util.service.js'

export const robotService = {
  query,
  save,
  remove,
  getById,
  getEmptyRobot,
  tryRobot,
}

const STORAGE_KEY = 'robots'

const gDefaultRobots = [
  {
    _id: '101',
    fullName: 'John Doe',
    username: 'john.doe',
    img: 'https://randomuser.me/api/portraits/men/1.jpg',
    msgs: [
      {
        id: 'msg1',
        senderId: '102',
        recipientId: '101',
        content: 'Hello, how are you?',
        timestamp: '2023-07-19T12:34:56.789Z',
      },
      {
        id: 'msg2',
        senderId: '101',
        recipientId: '102',
        content: "I'm doing well, thank you!",
        timestamp: '2023-07-19T12:36:00.123Z',
      },
    ],
  },
  {
    _id: '102',
    fullName: 'Jane Smith',
    username: 'jane.smith',
    img: 'https://randomuser.me/api/portraits/women/2.jpg',
    msgs: [
      {
        id: 'msg3',
        senderId: '102',
        recipientId: '101',
        content: 'Hey, how is it going?',
        timestamp: '2023-07-19T12:38:25.456Z',
      },
    ],
  },
  {
    _id: '103',
    fullName: 'Mike Johnson',
    username: 'mike.johnson',
    img: 'https://randomuser.me/api/portraits/men/3.jpg',
    msgs: [
      {
        id: 'msg4',
        senderId: '103',
        recipientId: '101',
        content: 'Morning! Are you free today?',
        timestamp: '2023-07-19T13:20:10.987Z',
      },
      {
        id: 'msg5',
        senderId: '101',
        recipientId: '103',
        content: "Hi Mike! Yes, I am. What's up?",
        timestamp: '2023-07-19T13:21:30.765Z',
      },
    ],
  },
  {
    _id: '104',
    fullName: 'Emily Brown',
    username: 'emily.brown',
    img: 'https://randomuser.me/api/portraits/women/4.jpg',
    msgs: [
      {
        id: 'msg6',
        senderId: '104',
        recipientId: '101',
        content: 'Good afternoon!',
        timestamp: '2023-07-19T15:45:00.234Z',
      },
      {
        id: 'msg7',
        senderId: '101',
        recipientId: '104',
        content: "Hi Emily! How's your day going?",
        timestamp: '2023-07-19T15:46:45.321Z',
      },
      {
        id: 'msg8',
        senderId: '104',
        recipientId: '101',
        content: "It's going well, thanks! How about you?",
        timestamp: '2023-07-19T15:47:50.876Z',
      },
    ],
  },
]

var gRobots = _loadRobots()

function query(filterBy) {
  let robotsToReturn = gRobots
  console.log(filterBy)
  if (filterBy) {
    const { fullName, username, img } = filterBy

    //   robotsToReturn = gRobots.filter(
    //     (robot) =>
    //       robot.fullName.toLowerCase().includes(fullName.toLowerCase()) &&
    //       robot.username.toLowerCase().includes(username.toLowerCase()) &&
    //       robot.img === img
    //   );
  }
  return Promise.resolve([...robotsToReturn])
}
function tryRobot(id) {
  const robot = gRobots.find((robot) => robot._id === id)
  robot.batteryStatus -= 10
  return Promise.resolve()
}
function getById(id) {
  const robot = gRobots.find((robot) => robot._id === id)
  return Promise.resolve({ ...robot })
}

function remove(id) {
  const idx = gRobots.findIndex((robot) => robot._id === id)
  gRobots.splice(idx, 1)
  if (!gRobots.length) gRobots = gDefaultRobots.slice()
  storageService.store(STORAGE_KEY, gRobots)
  return Promise.resolve()
}

function save(robotToSave) {
  if (robotToSave._id) {
    const idx = gRobots.findIndex((robot) => robot._id === robotToSave._id)
    gRobots.splice(idx, 1, robotToSave)
  } else {
    robotToSave._id = makeId()
    robotToSave.batteryStatus = 100
    gRobots.push(robotToSave)
  }
  storageService.store(STORAGE_KEY, gRobots)
  return Promise.resolve(robotToSave)
}

function getEmptyRobot() {
  return {
    model: '',
    type: '',
  }
}

function _loadRobots() {
  let robots = storageService.load(STORAGE_KEY)
  if (!robots || !robots.length) robots = gDefaultRobots
  storageService.store(STORAGE_KEY, robots)
  return robots
}
