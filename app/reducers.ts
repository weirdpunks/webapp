import {
  AppActions,
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
    case ActionType.SetAddress:
      return {
        ...state,
        address: action.payload,
        ens: '',
        weirdMainnet: 0,
        weirdLayer2: 0,
        unclaimed: 0,
        osMainnet: [],
        osLayer2: [],
        weirdPunksMainnet: [],
        weirdPunksLayer2: [],
        isLoadingBalances: true
      }
    case ActionType.SetENS:
      return {
        ...state,
        ens: action.payload
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
    case ActionType.SetBalances:
      return {
        ...state,
        weirdMainnet: action.payload.weirdMainnet,
        weirdLayer2: action.payload.weirdLayer2,
        osMainnet: action.payload.osMainnet,
        osLayer2: action.payload.osLayer2,
        isLoadingBalances: false
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
  address
}: {
  instance: ethers.providers.Web3Provider
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
  chainId: number
  isTestnet: boolean
  address: string
}): SetConnection => ({
  type: ActionType.SetConnection,
  payload: {
    instance,
    provider,
    signer,
    chainId,
    isTestnet,
    address
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

export const setAddress = (address: string): SetAddress => ({
  type: ActionType.SetAddress,
  payload: address
})

export const setENS = (ens: string): SetENS => ({
  type: ActionType.SetENS,
  payload: ens
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

export const setBalances = ({
  weirdMainnet,
  weirdLayer2,
  osMainnet,
  osLayer2
}: {
  weirdMainnet: number
  weirdLayer2: number
  osMainnet: number[]
  osLayer2: number[]
}): SetBalances => ({
  type: ActionType.SetBalances,
  payload: {
    weirdMainnet,
    weirdLayer2,
    osMainnet,
    osLayer2
  }
})

export const reset = (): Reset => ({
  type: ActionType.Reset
})
