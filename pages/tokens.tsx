import type { NextPage } from 'next'
import { Box } from '@chakra-ui/react'
import WPHeading from '../components/Heading'
import WeirdTokens from '../components/WeirdTokens'

const Tokens: NextPage = () => {
  return (
    <Box>
      <WPHeading>Tokens</WPHeading>
      <WeirdTokens />
    </Box>
  )
}

export default Tokens
