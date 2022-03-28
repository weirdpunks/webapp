import { AppState, initialAppState } from '@/app/state'
import {
  ActionType,
  StartConnecting,
  SetConnection,
  SetChain,
  SetAddress,
  SetENS,
  SetBalances,
  SetTestnetBalances,
  AppActions
} from '@/app/actions'
import {
  appReducer,
  startConnecting,
  setConnection,
  setChain,
  setAddress,
  setENS,
  setBalances,
  setTestnetBalances,
  reset
} from '@/app/reducers'
import { AppContext } from '@/app/context'
import { useContext, useMemo, useReducer, ReactNode } from 'react'

export type {
  AppState,
  StartConnecting,
  SetConnection,
  SetChain,
  SetAddress,
  SetENS,
  SetBalances,
  SetTestnetBalances,
  AppActions
}

export {
  AppContext,
  initialAppState,
  ActionType,
  appReducer,
  startConnecting,
  setConnection,
  setChain,
  setAddress,
  setENS,
  setBalances,
  setTestnetBalances,
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
