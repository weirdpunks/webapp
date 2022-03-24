import type { NextPage } from 'next'
import { Box, Heading } from '@chakra-ui/react'

const Bridge: NextPage = () => {
  return (
    <Box>
      <Heading
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}>
        Bridge
      </Heading>
    </Box>
  )
}

export default Bridge
