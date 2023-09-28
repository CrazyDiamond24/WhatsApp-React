export const SHOW_MSG = 'show-msg'

function createEventEmitter() {
  const listenersMap = {}
  return {
    on(evName, listener) {
      listenersMap[evName] = listenersMap[evName]
        ? [...listenersMap[evName], listener]
        : [listener]
      return () => {
        listenersMap[evName] = listenersMap[evName].filter(
          (func) => func !== listener
        )
      }
    },
    emit(evName, data) {
      if (!listenersMap[evName]) return
      listenersMap[evName].forEach((listener) => listener(data))
    },
  }
}

export const eventBus = createEventEmitter()
export const SELECT_SONG = 'select-song'
export function showUserMsg(msg) {
  eventBus.emit('show-msg', msg)
}

export const PAUSE_SONG = 'pause-song'
export const PLAY_SONG = 'play-song'
export function showSuccessMsg(txt) {
  showUserMsg({ txt, type: 'success' })
}
export function showErrorMsg(txt) {
  showUserMsg({ txt, type: 'error' })
}
