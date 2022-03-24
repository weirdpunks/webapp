import { ethers } from 'ethers'
import { Chain } from './state'

export enum ActionType {
  SetInstance,
  SetSigner,
  SetChain,
  SetAddress,
  SetIds,
  SetBalance,
  Reset
}

export interface SetSigner {
  type: ActionType.SetSigner
  payload: ethers.providers.JsonRpcSigner
}

export interface SetChain {
  type: ActionType.SetChain
  payload: Chain
}

export interface SetAddress {
  type: ActionType.SetAddress
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

export interface Reset {
  type: ActionType.Reset
}

export type AppActions =
  | SetSigner
  | SetChain
  | SetAddress
  | SetIds
  | SetBalance
  | Reset
