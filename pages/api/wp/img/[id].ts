import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  uri: string
}

type ErrorData = {
  error: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  const { id } = req.query
  const numId = parseInt(id as string)
  if (numId > 0 && numId < 2001) {
    res.status(200).json({
      uri: `https://ipfs.io/ipfs/${
        parseInt(id as string) > 1000
          ? 'QmQef5KVQy4Chg7WngFxVN5kzGrwDpt7XjbycAVmRUH6H4'
          : 'QmP3GBeMvgPW6eJrYGxgckjZSMZWYjbkuJNdCNBCLJtFg8'
      }/${id}.gif`
    })
  } else {
    res.status(500).json({ error: 'Invalid ID' })
  }
}
