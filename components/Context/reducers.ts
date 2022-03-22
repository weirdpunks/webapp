import {
  AppActions,
  ActionType,
  SetInstance,
  SetProvider,
  SetSigner,
  SetChain,
  SetAddress,
  Reset
} from './actions'
import { initialAppState, AppState, Chain } from './state'
import { ethers } from 'ethers'

export const appReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case ActionType.SetInstance:
      return { ...state, instance: action.payload }
    case ActionType.SetProvider:
      return { ...state, provider: action.payload }
    case ActionType.SetSigner:
      return { ...state, signer: action.payload }
    case ActionType.SetChain:
      return { ...state, chain: action.payload }
    case ActionType.SetAddress:
      return { ...state, address: action.payload }
    case ActionType.Reset:
      return initialAppState
    default:
      return state
  }
}

export const setInstance = (
  instance: ethers.providers.Web3Provider
): SetInstance => ({
  type: ActionType.SetInstance,
  payload: instance
})

export const setProvider = (
  provider: ethers.providers.Web3Provider
): SetProvider => ({
  type: ActionType.SetProvider,
  payload: provider
})

export const setSigner = (
  signer: ethers.providers.JsonRpcSigner
): SetSigner => ({
  type: ActionType.SetSigner,
  payload: signer
})

export const setChain = (chain: Chain): SetChain => ({
  type: ActionType.SetChain,
  payload: chain
})

export const setAddress = (address: string): SetAddress => ({
  type: ActionType.SetAddress,
  payload: address
})

export const reset = (): Reset => ({
  type: ActionType.Reset
})
