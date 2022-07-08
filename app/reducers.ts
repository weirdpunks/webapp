import {
  ActionType,
  AppActions,
  Claimed,
  Reset,
  SetAddress,
  SetBalances,
  SetChain,
  SetConnection,
  SetENS,
  StartConnecting,
  UpdateOpenSeaBalance
} from '@/app/actions'
import { AppState, initialAppState } from '@/app/state'
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
        isLayer2: action.payload.isLayer2,
        address: action.payload.address,
        isConnecting: false
      }
    case ActionType.SetChain:
      return {
        ...state,
        chainId: action.payload.chainId,
        isTestnet: action.payload.isTestnet,
        isLayer2: action.payload.isLayer2
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
        expansionsMainnet: [],
        expansionsLayer2: [],
        isLoadingBalances: true
      }
    case ActionType.SetENS:
      return {
        ...state,
        ens: action.payload
      }
    case ActionType.SetBalances:
      return {
        ...state,
        weirdMainnet: action.payload.weirdMainnet,
        weirdLayer2: action.payload.weirdLayer2,
        unclaimed: action.payload.unclaimed,
        weirdPunksMainnet: action.payload.weirdPunksMainnet,
        weirdPunksLayer2: action.payload.weirdPunksLayer2,
        expansionsMainnet: action.payload.expansionsMainnet,
        expansionsLayer2: action.payload.expansionsLayer2,
        osMainnet: action.payload.osMainnet,
        osLayer2: action.payload.osLayer2,
        isLoadingBalances: false
      }
    case ActionType.Claimed:
      return {
        ...state,
        weirdLayer2: state.weirdLayer2 + state.unclaimed,
        unclaimed: 0
      }
    case ActionType.UpdateOpenSeaBalance:
      return {
        ...state,
        osMainnet: state.isLayer2 ? state.osMainnet : action.payload,
        osLayer2: state.isLayer2 ? action.payload : state.osLayer2
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
  isLayer2,
  address
}: {
  instance: ethers.providers.Web3Provider
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
  chainId: number
  isTestnet: boolean
  isLayer2: boolean
  address: string
}): SetConnection => ({
  type: ActionType.SetConnection,
  payload: {
    instance,
    provider,
    signer,
    chainId,
    isTestnet,
    isLayer2,
    address
  }
})

export const setChain = ({
  chainId,
  isTestnet,
  isLayer2
}: {
  chainId: number
  isTestnet: boolean
  isLayer2: boolean
}): SetChain => ({
  type: ActionType.SetChain,
  payload: { chainId, isTestnet, isLayer2 }
})

export const setAddress = (address: string): SetAddress => ({
  type: ActionType.SetAddress,
  payload: address
})

export const setENS = (ens: string): SetENS => ({
  type: ActionType.SetENS,
  payload: ens
})

export const setBalances = ({
  weirdMainnet,
  weirdLayer2,
  unclaimed,
  weirdPunksMainnet,
  weirdPunksLayer2,
  expansionsMainnet,
  expansionsLayer2,
  osMainnet,
  osLayer2
}: {
  weirdMainnet: number
  weirdLayer2: number
  unclaimed: number
  weirdPunksMainnet: number[]
  weirdPunksLayer2: number[]
  expansionsMainnet: number[]
  expansionsLayer2: number[]
  osMainnet: number[]
  osLayer2: number[]
}): SetBalances => ({
  type: ActionType.SetBalances,
  payload: {
    weirdMainnet,
    weirdLayer2,
    unclaimed,
    weirdPunksMainnet,
    weirdPunksLayer2,
    expansionsMainnet,
    expansionsLayer2,
    osMainnet,
    osLayer2
  }
})

export const claimed = (): Claimed => ({
  type: ActionType.Claimed
})

export const updateOpenSeaBalance = (ids: number[]): UpdateOpenSeaBalance => ({
  type: ActionType.UpdateOpenSeaBalance,
  payload: ids
})

export const reset = (): Reset => ({
  type: ActionType.Reset
})
