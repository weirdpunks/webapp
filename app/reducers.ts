import {
  AppActions,
  ActionType,
  SetProvider,
  SetSigner,
  SetChain,
  SetAddress,
  SetIds,
  SetBalance,
  SetStatus,
  Reset
} from '@/app/actions'
import { initialAppState, AppState, Chain } from '@/app/state'
import { ethers } from 'ethers'

export const appReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case ActionType.SetProvider:
      return { ...state, provider: action.payload }
    case ActionType.SetSigner:
      return { ...state, signer: action.payload }
    case ActionType.SetChain:
      return {
        ...state,
        chain: action.payload.chain,
        testnet: action.payload.isTestnet
      }
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
    case ActionType.SetStatus:
      return { ...state, loading: action.payload }
    case ActionType.Reset:
      return initialAppState
    default:
      return state
  }
}

export const setProvider = (
  provider: ethers.providers.Web3Provider
): SetProvider => ({ type: ActionType.SetProvider, payload: provider })

export const setSigner = (
  signer: ethers.providers.JsonRpcSigner
): SetSigner => ({
  type: ActionType.SetSigner,
  payload: signer
})

export const setChain = ({
  chain,
  isTestnet
}: {
  chain: Chain
  isTestnet: boolean
}): SetChain => ({
  type: ActionType.SetChain,
  payload: { chain, isTestnet }
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

export const setStatus = (loading: boolean): SetStatus => ({
  type: ActionType.SetStatus,
  payload: loading
})

export const reset = (): Reset => ({
  type: ActionType.Reset
})
