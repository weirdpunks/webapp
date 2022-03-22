import type { NextPage } from 'next'
import { Box, Heading } from '@chakra-ui/react'

const Bio: NextPage = () => {
  return (
    <Box>
      <Heading
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}>
        Bio
      </Heading>
    </Box>
  )
}

export default Bio
