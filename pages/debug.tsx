import WPHeading from '../components/Heading'
import Debug from '../components/Debug'
import type { NextPage } from 'next'
import { Box } from '@chakra-ui/react'

const DebugPage: NextPage = () => {
  return (
    <Box>
      <WPHeading>Debug</WPHeading>
      <Debug />
    </Box>
  )
}

export default DebugPage
