import WPHeading from '@/components/UI/Heading'
import WeirdTokens from '@/components/WeirdTokens'
import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'

const Tokens: NextPage = () => {
  return (
    <Box>
      <WPHeading>Tokens</WPHeading>
      <WeirdTokens />
    </Box>
  )
}

export default Tokens
