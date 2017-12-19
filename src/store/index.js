import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise'
import rootReducer from './reducers'

export default function configStore () {
  return createStore(rootReducer, applyMiddleware(promiseMiddleware))
}
