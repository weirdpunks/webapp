import { ethers } from 'ethers'
import { Chain } from './state'

export enum ActionType {
  SetInstance,
  SetProvider,
  SetSigner,
  SetChain,
  SetAddress,
  Reset
}

export interface SetInstance {
  type: ActionType.SetInstance
  payload: ethers.providers.Web3Provider
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
  payload: Chain
}

export interface SetAddress {
  type: ActionType.SetAddress
  payload: string
}

export interface Reset {
  type: ActionType.Reset
}

export type AppActions =
  | SetInstance
  | SetProvider
  | SetSigner
  | SetChain
  | SetAddress
  | Reset
