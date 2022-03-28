export enum Chain {
  mainnet = 'mainnet',
  polygon = 'polygon',
  goerli = 'goerli',
  rinkeby = 'rinkeby',
  mumbai = 'mumbai'
}

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
  id: number
  hex: string
  key: Chain
  title: string
  icon: 'eth' | 'polygon'
  explorer: string
  isTestnet: boolean
  parameter?: ChainParameter
}

export const chains: ChainData[] = [
  {
    id: 1,
    key: Chain.mainnet,
    hex: '0x1',
    title: 'Ethereum',
    icon: 'eth',
    explorer: 'https://etherscan.io',
    isTestnet: false
  },
  {
    id: 137,
    key: Chain.polygon,
    hex: '0x89',
    title: 'Polygon',
    icon: 'polygon',
    explorer: 'https://polygonscan.com',
    isTestnet: false,
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
    id: 4,
    key: Chain.rinkeby,
    hex: '0x4',
    title: 'Rinkeby',
    icon: 'eth',
    explorer: 'https://rinkeby.etherscan.io',
    isTestnet: true
  },
  {
    id: 5,
    key: Chain.goerli,
    hex: '0x5',
    title: 'Goerli',
    icon: 'eth',
    explorer: 'https://goerli.etherscan.io',
    isTestnet: true
  },
  {
    id: 80001,
    key: Chain.mumbai,
    hex: '0x13881',
    title: 'Mumbai',
    icon: 'polygon',
    explorer: 'https://mumbai.polygonscan.com',
    isTestnet: true
  }
]
