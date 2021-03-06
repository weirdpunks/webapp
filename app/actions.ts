import { ethers } from 'ethers'

export enum ActionType {
  StartConnecting,
  SetConnection,
  SetChain,
  SetAddress,
  SetENS,
  SetBalances,
  Claimed,
  UpdateOpenSeaBalance,
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
    unclaimed: number
    weirdPunksMainnet: number[]
    weirdPunksLayer2: number[]
    expansionsMainnet: number[]
    expansionsLayer2: number[]
    osMainnet: number[]
    osLayer2: number[]
  }
}

export interface Claimed {
  type: ActionType.Claimed
}

export interface UpdateOpenSeaBalance {
  type: ActionType.UpdateOpenSeaBalance
  payload: number[]
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
  | Claimed
  | UpdateOpenSeaBalance
  | Reset
