import Claim from '@/components/UI/Claim'
import Heading from '@/components/UI/Heading'
import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'

const Tokens: NextPage = () => {
  return (
    <Box>
      <Heading>Tokens</Heading>
      <Claim />
    </Box>
  )
}

export default Tokens
