import { Chain, AppState, initialAppState } from './state'
import {
  ActionType,
  SetSigner,
  SetChain,
  SetAddress,
  SetIds,
  SetBalance,
  AppActions
} from './actions'
import {
  appReducer,
  setSigner,
  setChain,
  setAddress,
  setIds,
  setBalance,
  reset
} from './reducers'
import { AppContext } from './context'
import { useContext, useMemo, useReducer, ReactNode } from 'react'

export type {
  AppState,
  SetSigner,
  SetChain,
  SetAddress,
  SetIds,
  SetBalance,
  AppActions
}

export {
  AppContext,
  Chain,
  initialAppState,
  ActionType,
  appReducer,
  setSigner,
  setChain,
  setAddress,
  setIds,
  setBalance,
  reset
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider.')
  }
  return context
}
