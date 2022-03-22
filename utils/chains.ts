import { Chain } from '../components/Context/Index'

export interface ChainParameter {
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string // 2-6 characters long
    decimals: 18
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}

export interface ChainData {
  id: Chain
  key: string
  value: string
  icon: 'eth' | 'polygon'
  explorer: string
  testnet?: boolean
  parameter?: ChainParameter
}

export const chains: ChainData[] = [
  {
    id: Chain.mainnet,
    key: '0x1',
    value: 'Ethereum',
    icon: 'eth',
    explorer: 'https://etherscan.io'
  },
  {
    id: Chain.polygon,
    key: '0x89',
    value: 'Polygon',
    icon: 'polygon',
    explorer: 'https://polygonscan.com',
    parameter: {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://polygon-rpc.com/'],
      blockExplorerUrls: ['https://polygonscan.com/']
    }
  },
  {
    id: Chain.rinkeby,
    key: '0x4',
    value: 'Rinkeby Testnet',
    icon: 'eth',
    explorer: 'https://rinkeby.etherscan.io',
    testnet: true
  },
  {
    id: Chain.goerli,
    key: '0x5',
    value: 'Goerli Testnet',
    icon: 'eth',
    explorer: 'https://goerli.etherscan.io',
    testnet: true
  },
  {
    id: Chain.mumbai,
    key: '0x13881',
    value: 'Mumbai',
    icon: 'polygon',
    explorer: 'https://mumbai.polygonscan.com',
    testnet: true
  }
]
