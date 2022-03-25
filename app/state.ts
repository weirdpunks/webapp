import { ethers } from 'ethers'

export enum Chain {
  mainnet = 'mainnet',
  polygon = 'polygon',
  goerli = 'goerli',
  rinkeby = 'rinkeby',
  mumbai = 'mumbai'
}

export interface AppState {
  provider?: ethers.providers.Web3Provider
  signer?: ethers.providers.JsonRpcSigner
  chain?: Chain
  testnet: boolean
  address: string
  loading: boolean
  ens: string
  weirdMainnet: number
  weirdLayer2: number
  unclaimed: number
  osMainnet: number[]
  osLayer2: number[]
  weirdPunksMainnet: number[]
  weirdPunksLayer2: number[]
}

export const initialAppState: AppState = {
  testnet: false,
  address: '',
  loading: false,
  ens: '',
  weirdMainnet: 0,
  weirdLayer2: 0,
  unclaimed: 0,
  osMainnet: [],
  osLayer2: [],
  weirdPunksMainnet: [],
  weirdPunksLayer2: []
}
