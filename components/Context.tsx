import { Chain, AppState, initialAppState } from '@/app/state'
import {
  ActionType,
  SetSigner,
  SetChain,
  SetAddress,
  SetIds,
  SetBalance,
  SetStatus,
  AppActions
} from '@/app/actions'
import {
  appReducer,
  setSigner,
  setChain,
  setAddress,
  setIds,
  setBalance,
  setStatus,
  reset
} from '@/app/reducers'
import { AppContext } from '@/app/context'
import { useContext, useMemo, useReducer, ReactNode } from 'react'

export type {
  AppState,
  SetSigner,
  SetChain,
  SetAddress,
  SetIds,
  SetBalance,
  SetStatus,
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
  setStatus,
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
