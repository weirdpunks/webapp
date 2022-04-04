import { ethers } from 'ethers'

export enum ActionType {
  StartConnecting,
  SetConnection,
  SetChain,
  SetAddress,
  SetENS,
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
    isLayer2: boolean
    address: string
  }
}

export interface SetChain {
  type: ActionType.SetChain
  payload: {
    chainId: number
    isTestnet: boolean
    isLayer2: boolean
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

export interface SetBalances {
  type: ActionType.SetBalances
  payload: {
    weirdMainnet: number
    weirdLayer2: number
    osMainnet: number[]
    osLayer2: number[]
  }
}

export interface Reset {
  type: ActionType.Reset
}

export type AppActions =
  | StartConnecting
  | SetConnection
  | SetChain
  | SetAddress
  | SetENS
  | SetBalances
  | Reset
