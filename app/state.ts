import { ethers } from 'ethers'

export interface AppState {
  instance?: ethers.providers.Web3Provider
  provider?: ethers.providers.Web3Provider
  signer?: ethers.providers.JsonRpcSigner
  chainId?: number
  isTestnet: boolean
  address: string
  ens: string
  weirdEthereum: number
  weirdPolygon: number
  weirdGoerli: number
  weirdMumbai: number
  unclaimed: number
  osEthereum: number[]
  osPolygon: number[]
  osRinkeby: number[]
  osMumbai: number[]
  weirdPunksEthereum: number[]
  weirdPunksPolygon: number[]
  weirdPunksMumbai: number[]
  weirdPunksGoerli: number[]
  weirdPunksRinkeby: number[]
  isConnecting: boolean
  isLoadingBalances: boolean
}

export const initialAppState: AppState = {
  chainId: 0,
  isTestnet: false,
  address: '',
  ens: '',
  weirdEthereum: 0,
  weirdPolygon: 0,
  weirdGoerli: 0,
  weirdMumbai: 0,
  unclaimed: 0,
  osEthereum: [],
  osPolygon: [],
  osRinkeby: [],
  osMumbai: [],
  weirdPunksEthereum: [],
  weirdPunksPolygon: [],
  weirdPunksMumbai: [],
  weirdPunksGoerli: [],
  weirdPunksRinkeby: [],
  isConnecting: false,
  isLoadingBalances: false
}
