import { Chain, AppState, initialAppState } from '@/app/state'
import {
  ActionType,
  StartConnecting,
  SetConnection,
  SetProvider,
  SetSigner,
  SetChain,
  SetAddress,
  SetENS,
  SetIds,
  SetBalance,
  SetBalances,
  SetTestnetBalances,
  AppActions
} from '@/app/actions'
import {
  appReducer,
  startConnecting,
  setConnection,
  setProvider,
  setSigner,
  setChain,
  setAddress,
  setENS,
  setIds,
  setBalance,
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
  SetProvider,
  SetSigner,
  SetChain,
  SetAddress,
  SetENS,
  SetIds,
  SetBalance,
  SetBalances,
  SetTestnetBalances,
  AppActions
}

export {
  AppContext,
  Chain,
  initialAppState,
  ActionType,
  appReducer,
  startConnecting,
  setConnection,
  setProvider,
  setSigner,
  setChain,
  setAddress,
  setENS,
  setIds,
  setBalance,
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
