import { AppState, initialAppState } from '@/app/state'
import { AppActions } from '@/app/actions'
import { createContext, Dispatch } from 'react'

export const AppContext = createContext<{
  state: AppState
  dispatch: Dispatch<AppActions>
}>({ state: initialAppState, dispatch: () => undefined })
