import thunk from 'redux-thunk'
import {
  applyMiddleware,
  combineReducers,
  compose,
  legacy_createStore as createStore,
} from 'redux'
import { userReducer } from './reducers/user.reducer'
import { msgReducer } from './reducers/msg.reducer'
import { authReducer } from './reducers/auth.reducer'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({
  userModule: userReducer,
  msgModule: msgReducer,
  authModule: authReducer,
})

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
)

window.gStore = store
