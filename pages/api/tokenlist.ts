import Cors from 'cors'
import type { NextApiRequest, NextApiResponse } from 'next'

const cors = Cors({
  methods: ['GET', 'HEAD']
})

const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors)
  res.status(200).json({
    name: 'Weird Punks Token List',
    timestamp: '2022-07-31T00:00:00.000Z',
    version: {
      major: 0,
      minor: 0,
      patch: 1
    },
    tags: {},
    logoURI:
      'https://www.weirdpunkscollection.com/icons/weirdTokenPolygonMetaMask.png',
    keywords: ['weird'],
    tokens: [
      {
        name: 'Dai Stablecoin',
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        symbol: 'DAI',
        decimals: 18,
        chainId: 137,
        logoURI:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
      },
      {
        name: 'Ether',
        address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        symbol: 'ETH',
        decimals: 18,
        chainId: 137,
        logoURI:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
      },
      {
        name: 'ChainLink Token',
        address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
        symbol: 'LINK',
        decimals: 18,
        chainId: 137,
        logoURI:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png'
      },
      {
        name: 'USD Coin',
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        symbol: 'USDC',
        decimals: 6,
        chainId: 137,
        logoURI:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
      },
      {
        name: 'Tether USD',
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        symbol: 'USDT',
        decimals: 6,
        chainId: 137,
        logoURI:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
      },
      {
        name: 'Wrapped BTC',
        address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
        symbol: 'WBTC',
        decimals: 8,
        chainId: 137,
        logoURI:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
      },
      {
        name: 'Weird Token',
        address: '0xcB8BCDb991B45bF5D78000a0b5C0A6686cE43790',
        symbol: 'WEIRD',
        decimals: 18,
        chainId: 137,
        logoURI:
          'https://www.weirdpunkscollection.com/icons/weirdTokenPolygonMetaMask.png',
        tags: ['weird']
      },
      {
        name: 'Wrapped Matic',
        address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        symbol: 'WMATIC',
        decimals: 18,
        chainId: 137,
        logoURI:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png'
      }
    ]
  })
}
