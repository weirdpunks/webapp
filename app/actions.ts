import { ethers } from 'ethers'

export enum ActionType {
  StartConnecting,
  SetConnection,
  SetProvider,
  SetInstance,
  SetSigner,
  SetChain,
  SetAccount,
  SetIds,
  SetBalance,
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
    ens: string
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

export interface SetAccount {
  type: ActionType.SetAccount
  payload: {
    address: string
    ens: string
  }
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

export interface Reset {
  type: ActionType.Reset
}

export type AppActions =
  | StartConnecting
  | SetConnection
  | SetProvider
  | SetSigner
  | SetChain
  | SetAccount
  | SetIds
  | SetBalance
  | Reset
