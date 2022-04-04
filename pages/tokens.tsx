import Heading from '@/components/UI/Heading'
import WeirdTokens from '@/components/UI/WeirdTokens'
import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'

const Tokens: NextPage = () => {
  return (
    <Box>
      <Heading>Tokens</Heading>
      <WeirdTokens />
    </Box>
  )
}

export default Tokens
