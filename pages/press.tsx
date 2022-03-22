import type { NextPage } from 'next'
import { Box, Heading } from '@chakra-ui/react'

const Press: NextPage = () => {
  return (
    <Box>
      <Heading
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}>
        Press
      </Heading>
    </Box>
  )
}

export default Press
