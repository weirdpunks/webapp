import {
  AppActions,
  ActionType,
  StartConnecting,
  SetConnection,
  SetChain,
  SetAddress,
  SetENS,
  SetBalances,
  SetTestnetBalances,
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
        weirdEthereum: 0,
        weirdPolygon: 0,
        weirdGoerli: 0,
        weirdMumbai: 0,
        unclaimed: 0,
        osEthereum: [],
        osPolygon: [],
        osRinkeby: [],
        osMumbai: [],
        weirdPunksEthereum: [],
        weirdPunksPolygon: [],
        weirdPunksMumbai: [],
        weirdPunksGoerli: [],
        weirdPunksRinkeby: [],
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
        weirdEthereum: action.payload.weirdEthereum,
        weirdPolygon: action.payload.weirdPolygon,
        weirdGoerli: 0,
        weirdMumbai: 0,
        osEthereum: action.payload.osEthereum,
        osPolygon: action.payload.osPolygon,
        osRinkeby: [],
        osMumbai: [],
        isLoadingBalances: false
      }
    case ActionType.SetTestnetBalances:
      return {
        ...state,
        weirdEthereum: 0,
        weirdPolygon: 0,
        weirdGoerli: action.payload.weirdGoerli,
        weirdMumbai: action.payload.weirdMumbai,
        osEthereum: [],
        osPolygon: [],
        osRinkeby: action.payload.osRinkeby,
        osMumbai: action.payload.osMumbai,
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

export const setBalances = ({
  weirdEthereum,
  weirdPolygon,
  osEthereum,
  osPolygon
}: {
  weirdEthereum: number
  weirdPolygon: number
  osEthereum: number[]
  osPolygon: number[]
}): SetBalances => ({
  type: ActionType.SetBalances,
  payload: {
    weirdEthereum,
    weirdPolygon,
    osEthereum,
    osPolygon
  }
})

export const setTestnetBalances = ({
  weirdGoerli,
  weirdMumbai,
  osRinkeby,
  osMumbai
}: {
  weirdGoerli: number
  weirdMumbai: number
  osRinkeby: number[]
  osMumbai: number[]
}): SetTestnetBalances => ({
  type: ActionType.SetTestnetBalances,
  payload: {
    weirdGoerli,
    weirdMumbai,
    osRinkeby,
    osMumbai
  }
})

export const reset = (): Reset => ({
  type: ActionType.Reset
})
