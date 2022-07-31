import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
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
        chainId: 137,
        address: '0xcB8BCDb991B45bF5D78000a0b5C0A6686cE43790',
        symbol: 'WEIRD',
        name: 'Weird Token',
        decimals: 18,
        logoURI:
          'https://www.weirdpunkscollection.com/icons/weirdTokenPolygonMetaMask.png',
        tags: ['weird']
      }
    ]
  })
}
