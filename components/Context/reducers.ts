import {
  AppActions,
  ActionType,
  SetSigner,
  SetChain,
  SetAddress,
  SetIds,
  SetBalance,
  Reset
} from './actions'
import { initialAppState, AppState, Chain } from './state'
import { ethers } from 'ethers'

export const appReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case ActionType.SetSigner:
      return { ...state, signer: action.payload }
    case ActionType.SetChain:
      return { ...state, chain: action.payload }
    case ActionType.SetAddress:
      return { ...state, address: action.payload }
    case ActionType.SetIds:
      return {
        ...state,
        osMainnet:
          action.payload.isOpenSea && !action.payload.isLayer2
            ? action.payload.ids
            : state.osMainnet,
        osLayer2:
          action.payload.isOpenSea && action.payload.isLayer2
            ? action.payload.ids
            : state.osLayer2,
        weirdPunksMainnet:
          !action.payload.isOpenSea && !action.payload.isLayer2
            ? action.payload.ids
            : state.weirdPunksMainnet,
        weirdPunksLayer2:
          !action.payload.isOpenSea && action.payload.isLayer2
            ? action.payload.ids
            : state.weirdPunksLayer2
      }
    case ActionType.SetBalance:
      return {
        ...state,
        weirdMainnet: action.payload.isLayer2
          ? state.weirdMainnet
          : action.payload.balance,
        weirdLayer2: action.payload.isLayer2
          ? action.payload.balance
          : state.weirdLayer2
      }
    case ActionType.Reset:
      return initialAppState
    default:
      return state
  }
}

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

export const setIds = ({
  ids,
  isLayer2,
  isOpenSea
}: {
  ids: number[]
  isLayer2: boolean
  isOpenSea: boolean
}): SetIds => ({
  type: ActionType.SetIds,
  payload: {
    ids,
    isLayer2,
    isOpenSea
  }
})

export const setBalance = ({
  balance,
  isLayer2
}: {
  balance: number
  isLayer2: boolean
}): SetBalance => ({
  type: ActionType.SetBalance,
  payload: {
    balance,
    isLayer2
  }
})

export const reset = (): Reset => ({
  type: ActionType.Reset
})
