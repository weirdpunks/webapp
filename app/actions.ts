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
    address: string
  }
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

export interface SetBalances {
  type: ActionType.SetBalances
  payload: {
    weirdEthereum: number
    weirdPolygon: number
    osEthereum: number[]
    osPolygon: number[]
  }
}

export interface SetTestnetBalances {
  type: ActionType.SetTestnetBalances
  payload: {
    weirdGoerli: number
    weirdMumbai: number
    osRinkeby: number[]
    osMumbai: number[]
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
  | SetTestnetBalances
  | Reset
