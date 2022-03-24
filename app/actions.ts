import { Chain } from '@/app/state'
import { ethers } from 'ethers'

export enum ActionType {
  SetInstance,
  SetSigner,
  SetChain,
  SetAddress,
  SetIds,
  SetBalance,
  SetStatus,
  Reset
}

export interface SetSigner {
  type: ActionType.SetSigner
  payload: ethers.providers.JsonRpcSigner
}

export interface SetChain {
  type: ActionType.SetChain
  payload: {
    chain: Chain
    isTestnet: boolean
  }
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

export interface SetStatus {
  type: ActionType.SetStatus
  payload: boolean
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
  | SetStatus
  | Reset
