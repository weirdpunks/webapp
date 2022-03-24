import { Box, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'

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
