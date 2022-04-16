import Heading from '@/components/UI/Heading'
import Bridge from '@/components/Bridge'
import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'

const BridgePage: NextPage = () => {
  return (
    <Box>
      <Heading>Bridge</Heading>
      <Bridge />
    </Box>
  )
}

export default BridgePage
