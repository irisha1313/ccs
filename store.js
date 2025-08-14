// Imports: Dependencies
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import {
  createReduxContainer,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';

import AppNavigator from '../navigation/AppNavigation';

const navReducer = createNavigationReducer(AppNavigator);

const App = createReduxContainer(AppNavigator);

// Imports: Redux
import rootReducer from '../reducers/index';

const appReducer = combineReducers({
  ...rootReducer,
  nav: navReducer,
});

// Middleware: Redux Thunk (Async/Await)
const middleware = [thunk];

// Redux Helper
const reduxHelper = createReactNavigationReduxMiddleware((state) => state.nav);
middleware.push(reduxHelper);

// Middleware: Redux Persist Config
const persistConfig = {
  key: 'root',
  // Storage Method (React Native)
  storage: ExpoFileSystemStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['auth', 'safeClear', 'offline'],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, appReducer);

// Redux: Store
const store = createStore(persistedReducer, applyMiddleware(...middleware));

// Middleware: Redux Persist Persister
let persistor = persistStore(store);

// Exports
export { App, store, persistor };
