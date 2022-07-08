import { ethers } from 'ethers'

export interface AppState {
  instance?: ethers.providers.Web3Provider
  provider?: ethers.providers.Web3Provider
  signer?: ethers.providers.JsonRpcSigner
  chainId?: number
  isTestnet: boolean
  isLayer2: boolean
  address: string
  ens: string
  weirdMainnet: number
  weirdLayer2: number
  unclaimed: number
  osMainnet: number[]
  osLayer2: number[]
  weirdPunksMainnet: number[]
  weirdPunksLayer2: number[]
  expansionsMainnet: number[]
  expansionsLayer2: number[]
  isConnecting: boolean
  isLoadingBalances: boolean
}

export const initialAppState: AppState = {
  chainId: 0,
  isTestnet: false,
  isLayer2: false,
  address: '',
  ens: '',
  weirdMainnet: 0,
  weirdLayer2: 0,
  unclaimed: 0,
  osMainnet: [],
  osLayer2: [],
  weirdPunksMainnet: [],
  weirdPunksLayer2: [],
  expansionsMainnet: [],
  expansionsLayer2: [],
  isConnecting: false,
  isLoadingBalances: false
}
