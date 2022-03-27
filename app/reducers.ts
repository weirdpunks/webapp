import {
  AppActions,
  ActionType,
  StartConnecting,
  SetConnection,
  SetProvider,
  SetSigner,
  SetChain,
  SetAccount,
  SetIds,
  SetBalance,
  Reset
} from '@/app/actions'
import { initialAppState, AppState } from '@/app/state'
import { ethers } from 'ethers'

export const appReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case ActionType.StartConnecting:
      return { ...state, isConnecting: true }
    case ActionType.SetConnection:
      return {
        ...state,
        instance: action.payload.instance,
        provider: action.payload.provider,
        signer: action.payload.signer,
        chainId: action.payload.chainId,
        isTestnet: action.payload.isTestnet,
        address: action.payload.address,
        ens: action.payload.ens,
        isConnecting: false
      }
    case ActionType.SetProvider:
      return { ...state, provider: action.payload }
    case ActionType.SetSigner:
      return { ...state, signer: action.payload }
    case ActionType.SetChain:
      return {
        ...state,
        chainId: action.payload.chainId,
        isTestnet: action.payload.isTestnet
      }
    case ActionType.SetAccount:
      return {
        ...state,
        address: action.payload.address,
        ens: action.payload.ens
      }
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

export const startConnecting = (): StartConnecting => ({
  type: ActionType.StartConnecting
})

export const setConnection = ({
  instance,
  provider,
  signer,
  chainId,
  isTestnet,
  address,
  ens
}: {
  instance: ethers.providers.Web3Provider
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
  chainId: number
  isTestnet: boolean
  address: string
  ens: string
}): SetConnection => ({
  type: ActionType.SetConnection,
  payload: {
    instance,
    provider,
    signer,
    chainId,
    isTestnet,
    address,
    ens
  }
})

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
  chainId,
  isTestnet
}: {
  chainId: number
  isTestnet: boolean
}): SetChain => ({
  type: ActionType.SetChain,
  payload: { chainId, isTestnet }
})

export const setAccount = (address: string, ens: string): SetAccount => ({
  type: ActionType.SetAccount,
  payload: { address, ens }
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
