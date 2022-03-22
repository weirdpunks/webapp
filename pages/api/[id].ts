import type { NextApiRequest, NextApiResponse } from 'next'
import { setHeaders } from '../../utils/headers'
import { ethereum } from '../../utils/mappings'
import axios from 'axios'

interface Trait {
  trait_type: string
  value: string
  trait_count: number
  [key: string]: any
}

interface Asset {
  token_id: string
  image_url: string
  permalink: string
  traits: Trait[]
  transaction: {
    block_number: string
    from_account: {
      user: {
        username: string
      }
      address: string
    }
    timestamp: string
  }
  [key: string]: any
}

interface OpenSeaProps {
  data: Asset
  [key: string]: any
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const end = setHeaders(req, res)
  if (end) {
    return
  }
  const {
    query: { id }
  } = req

  try {
    if (typeof id === 'string') {
      const num = parseInt(id)
      const chain =
        (num >= 230 && num <= 330) || (num >= 426 && num <= 530)
          ? 'ethereum'
          : 'polygon'
      if (chain === 'polygon') {
        res
          .status(400)
          .json(JSON.stringify({ error: 'Polygon data currently unavailable' }))
      }
    }
    const token = ethereum.find((item) => item.id === id)
    const response: OpenSeaProps = await axios.get(
      `https://api.opensea.io/api/v1/asset/0x495f947276749ce646f68ac8c248420045cb7b5e/${token?.token}`
    )
    const raw = response.data
    const asset = {
      id,
      token: raw.token_id,
      image: raw.image_url,
      url: raw.permalink,
      traits: raw.traits.map((trait) => ({
        type: trait.trait_type,
        value: trait.value,
        count: trait.trait_count
      })),
      owner: raw.last_sale.transaction.from_account.address,
      username: raw.last_sale.transaction.from_account.user.username,
      timestamp: raw.last_sale.transaction.timestamp
    }
    res.status(200).json(JSON.stringify(asset))
  } catch (e) {
    console.log(e)
    res.status(400).json(JSON.stringify(e))
  }
}

export default handler
