import { ethers } from 'ethers'

export enum Chain {
  mainnet = 'mainnet',
  polygon = 'polygon',
  goerli = 'goerli',
  rinkeby = 'rinkeby',
  mumbai = 'mumbai',
  unknown = 'unknown'
}

export interface AppState {
  instance?: ethers.providers.Web3Provider
  provider?: ethers.providers.Web3Provider
  signer?: ethers.providers.JsonRpcSigner
  chain: Chain
  address: string
}

export const initialAppState: AppState = {
  chain: Chain.unknown,
  address: ''
}
