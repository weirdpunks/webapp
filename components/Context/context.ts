import { AppState, initialAppState } from './state'
import { AppActions } from './actions'
import { createContext, Dispatch } from 'react'

export const AppContext = createContext<{
  state: AppState
  dispatch: Dispatch<AppActions>
}>({ state: initialAppState, dispatch: () => undefined })
