import Auction from '@/components/UI/Auction'
import Heading from '@/components/UI/Heading'
import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'

const AuctionPage: NextPage = () => {
  return (
    <Box>
      <Heading>Auction</Heading>
      <Auction />
    </Box>
  )
}

export default AuctionPage
