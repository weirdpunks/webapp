import { ethers } from 'ethers'

export enum ActionType {
  StartConnecting,
  SetConnection,
  SetProvider,
  SetInstance,
  SetSigner,
  SetChain,
  SetAddress,
  SetENS,
  SetIds,
  SetBalance,
  SetBalances,
  SetTestnetBalances,
  Reset
}

export interface StartConnecting {
  type: ActionType.StartConnecting
}

export interface SetConnection {
  type: ActionType.SetConnection
  payload: {
    instance: ethers.providers.Web3Provider
    provider: ethers.providers.Web3Provider
    signer: ethers.providers.JsonRpcSigner
    chainId: number
    isTestnet: boolean
    address: string
  }
}

export interface SetProvider {
  type: ActionType.SetProvider
  payload: ethers.providers.Web3Provider
}

export interface SetSigner {
  type: ActionType.SetSigner
  payload: ethers.providers.JsonRpcSigner
}

export interface SetChain {
  type: ActionType.SetChain
  payload: {
    chainId: number
    isTestnet: boolean
  }
}

export interface SetAddress {
  type: ActionType.SetAddress
  payload: string
}

export interface SetENS {
  type: ActionType.SetENS
  payload: string
}

export interface SetIds {
  type: ActionType.SetIds
  payload: {
    ids: number[]
    isLayer2: boolean
    isOpenSea: boolean
  }
}

export interface SetBalance {
  type: ActionType.SetBalance
  payload: {
    balance: number
    isLayer2: boolean
  }
}

export interface SetBalances {
  type: ActionType.SetBalances
  payload: {
    weirdMainnet: number
    weirdLayer2: number
    osMainnet: number[]
    osLayer2: number[]
  }
}

export interface SetTestnetBalances {
  type: ActionType.SetTestnetBalances
  payload: {
    osTestnet: number[]
  }
}

export interface Reset {
  type: ActionType.Reset
}

export type AppActions =
  | StartConnecting
  | SetConnection
  | SetProvider
  | SetSigner
  | SetChain
  | SetAddress
  | SetENS
  | SetIds
  | SetBalance
  | SetBalances
  | SetTestnetBalances
  | Reset
