import { ethers } from 'ethers'

export enum Chain {
  mainnet = 'mainnet',
  polygon = 'polygon',
  goerli = 'goerli',
  rinkeby = 'rinkeby',
  mumbai = 'mumbai'
}

export interface AppState {
  instance?: ethers.providers.Web3Provider
  provider?: ethers.providers.Web3Provider
  signer?: ethers.providers.JsonRpcSigner
  chainId?: number
  isTestnet: boolean
  address: string
  ens: string
  weirdMainnet: number
  weirdLayer2: number
  unclaimed: number
  osMainnet: number[]
  osLayer2: number[]
  weirdPunksMainnet: number[]
  weirdPunksLayer2: number[]
  isConnecting: boolean
  isLoadingBalances: boolean
}

export const initialAppState: AppState = {
  chainId: 0,
  isTestnet: false,
  address: '',
  ens: '',
  weirdMainnet: 0,
  weirdLayer2: 0,
  unclaimed: 0,
  osMainnet: [],
  osLayer2: [],
  weirdPunksMainnet: [],
  weirdPunksLayer2: [],
  isConnecting: false,
  isLoadingBalances: true
}
