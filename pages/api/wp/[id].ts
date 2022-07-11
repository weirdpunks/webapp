import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Trait = {
  trait_type: string
  value: string
}

type Data = {
  name: string
  description: string
  image: string
  traits: Trait[]
}

type ErrorData = {
  error: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  try {
    ;(async () => {
      const { id } = req.query
      const url = `https://ipfs.io/ipfs/${
        parseInt(id as string) > 1000
          ? 'QmcNARPkJiKHViysRQtsVQLEnZGnps1oVka8Jqmi9qdibf'
          : 'QmP3GBeMvgPW6eJrYGxgckjZSMZWYjbkuJNdCNBCLJtFg8'
      }/${id}.json`
      const response = await axios.get(url)
      if (response.data) {
        const metadata = response.data as Data
        res.status(200).json({
          name: metadata.name,
          description: metadata.description,
          image: `https://ipfs.io/ipfs/${metadata.image.replace(
            'ipfs://',
            ''
          )}`,
          traits: metadata.traits
        })
      }
    })()
  } catch (e) {
    res.status(500).json({ error: 'Unable to get data' })
  }
}
