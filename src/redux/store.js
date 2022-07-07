import { legacy_createStore as createStore,combineReducers,applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import {CollapsedReducer} from "./reducer/CollapsedReducer";
import { LoadingReducer } from "./reducer/LoadingReducer";
// 持久化store config
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const allReceducer = combineReducers({
  CollapsedReducer,
  LoadingReducer
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist:['CollapsedReducer']
}
const persistedReducer = persistReducer(persistConfig, allReceducer)

let store = createStore(persistedReducer,applyMiddleware(thunk))
let persistor = persistStore(store)
// export default createStore(allReceducer,applyMiddleware(thunk))
export {store, persistor}