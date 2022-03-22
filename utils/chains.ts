import { Chain } from '../components/Context/Index'

export interface ChainData {
  id: Chain
  key: string
  value: string
  icon: 'eth' | 'polygon'
  explorer: string
  testnet?: boolean
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
    explorer: 'https://polygonscan.com'
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
